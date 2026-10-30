/* Snus Tracker — server delle notifiche.
   Riceve solo l'orario e il testo della prossima notifica di ogni iPhone (nessun dato d'uso)
   e la invia all'ora giusta con un "alarm" del Durable Object. */
import { newVapidKeys, sendPush } from "./webpush.js";

const cors = (origin) => ({
  "Access-Control-Allow-Origin": origin || "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Max-Age": "86400",
});
const json = (o, status = 200, h = {}) => new Response(JSON.stringify(o), { status, headers: { "content-type": "application/json", ...h } });

export default {
  async fetch(req, env) {
    const origin = req.headers.get("Origin");
    const allowed = (env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);
    if (origin && allowed.length && !allowed.includes(origin)) return new Response("forbidden", { status: 403 });
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(origin) });
    const url = new URL(req.url);
    if (url.pathname === "/") return new Response("Snus Tracker push: ok", { headers: cors(origin) });
    const stub = env.PUSH.get(env.PUSH.idFromName("main"));
    const res = await stub.fetch(req);
    const out = new Response(res.body, res);
    for (const [k, v] of Object.entries(cors(origin))) out.headers.set(k, v);
    return out;
  },
};

const okSub = (s) => s && typeof s.endpoint === "string" && /^https:\/\//.test(s.endpoint) && s.keys && typeof s.keys.p256dh === "string" && typeof s.keys.auth === "string";
const clean = (t, n) => String(t || "").slice(0, n);
async function devId(endpoint) {
  const h = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(endpoint));
  return [...new Uint8Array(h)].slice(0, 12).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export class PushQueue {
  constructor(ctx, env) { this.ctx = ctx; this.env = env; }
  async keys() {
    let k = await this.ctx.storage.get("vapid");
    if (!k) { k = await newVapidKeys(); await this.ctx.storage.put("vapid", k); }
    return k;
  }
  subject(origin) { return this.env.VAPID_SUBJECT || (/^https:\/\//.test(origin || "") ? origin : "https://github.com"); }
  async fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === "/key" && req.method === "GET") return json({ key: (await this.keys()).pub });
    if (req.method !== "POST") return json({ error: "not found" }, 404);
    let b; try { b = await req.json(); } catch { return json({ error: "bad json" }, 400); }
    if (!okSub(b.sub)) return json({ error: "bad subscription" }, 400);
    const origin = clean(b.origin, 200);
    if (url.pathname === "/schedule") {
      const q = (await this.ctx.storage.get("q")) || {};
      const id = await devId(b.sub.endpoint);
      const items = (Array.isArray(b.items) ? b.items : []).slice(0, 4)
        .filter((i) => Number.isFinite(i.at) && i.at < Date.now() + 2 * 86400e3)
        .map((i) => ({ at: Math.floor(i.at), tag: clean(i.tag, 20), title: clean(i.title, 80), body: clean(i.body, 200) }));
      if (items.length) {
        if (!q[id] && Object.keys(q).length >= 20) return json({ error: "full" }, 429);
        q[id] = { sub: b.sub, origin, items };
      } else delete q[id];
      await this.ctx.storage.put("q", q);
      await this.arm(q);
      return json({ ok: true, pending: items.length });
    }
    if (url.pathname === "/test") {
      const r = await sendPush(b.sub, { title: "Notifiche attive", body: "Riceverai qui gli avvisi su togli e via libera.", tag: "test" }, await this.keys(), this.subject(origin));
      return json({ ok: r.ok, status: r.status }, r.ok ? 200 : 502);
    }
    return json({ error: "not found" }, 404);
  }
  async arm(q) {
    let min = Infinity;
    for (const d of Object.values(q)) for (const i of d.items) min = Math.min(min, i.at);
    if (min < Infinity) await this.ctx.storage.setAlarm(Math.max(min, Date.now() + 100));
    else await this.ctx.storage.deleteAlarm();
  }
  async alarm() {
    const q = (await this.ctx.storage.get("q")) || {}, keys = await this.keys(), now = Date.now() + 1500;
    for (const [id, d] of Object.entries(q)) {
      const due = d.items.filter((i) => i.at <= now);
      d.items = d.items.filter((i) => i.at > now);
      for (const i of due) {
        try {
          const r = await sendPush(d.sub, { title: i.title, body: i.body, tag: i.tag }, keys, this.subject(d.origin));
          if (r.status === 404 || r.status === 410) { d.items = []; break; }
        } catch (e) { console.log("push failed", i.tag, String(e)); }
      }
      if (!d.items.length) delete q[id];
    }
    await this.ctx.storage.put("q", q);
    await this.arm(q);
  }
}
