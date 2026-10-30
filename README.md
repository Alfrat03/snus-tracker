# Snus Tracker

Web app per iPhone (PWA) che tiene il conto di bustine, nicotina e spesa, con timer «In uso» / «Attesa» e notifiche.
I dati restano sull'iPhone. La copia di sicurezza si salva in iCloud Drive con **Impostazioni → Esporta → Salva su File**.

## Struttura

| Percorso | Cosa contiene |
|---|---|
| `index.html`, `app.js`, `sw.js`, `manifest.webmanifest`, `icons/` | L'app pubblicata su GitHub Pages (file generati) |
| `config.js` | Indirizzo del server delle notifiche (`push`) |
| `tools/app/` | Sorgenti dell'app: stile, logica, viste, illustrazioni |
| `tools/build.py` | Rigenera i file pubblicati: `python3 tools/build.py` |
| `worker/` | Server delle notifiche (Cloudflare Worker + Durable Object) |

## 1. Pubblicare l'app (GitHub Pages)

1. Nel repository: **Settings → Pages → Build and deployment**.
2. Source: **Deploy from a branch**, branch `main`, cartella `/ (root)`. Salva.
3. Dopo un minuto l'app è su `https://<utente>.github.io/<repo>/`.

## 2. Installarla sull'iPhone

1. Apri l'indirizzo in **Safari**.
2. Tocca **Condividi → Aggiungi alla schermata Home**.
3. Apri Snus Tracker dall'icona (le notifiche funzionano solo così, da iOS 16.4 in poi).

## 3. Attivare le notifiche ad app chiusa (Cloudflare, gratis)

Il server riceve solo l'orario e il testo della prossima notifica, nessun dato d'uso.

1. Su [dash.cloudflare.com](https://dash.cloudflare.com): **Workers & Pages → Create → Import a repository**.
2. Collega GitHub e scegli questo repository.
3. In **Root directory** (impostazioni avanzate) scrivi `worker`. Lascia il resto com'è e fai **Deploy**.
4. Copia l'indirizzo del Worker, ad esempio `https://snus-push.<nome>.workers.dev`.
5. In `config.js` metti l'indirizzo in `push:"..."` (oppure chiedi a Claude di farlo).
6. Sull'iPhone: apri l'app → **Impostazioni → Notifiche** → consenti → **Prova**.

Facoltativo: nel Worker, **Settings → Variables**, aggiungi `ALLOWED_ORIGINS` = `https://<utente>.github.io` per accettare richieste solo dalla tua app.

## Aggiornare l'app

Modifica i file in `tools/app/`, poi esegui `python3 tools/build.py` e fai commit. Alza il numero in `tools/app/VERSION`, così l'iPhone scarica la versione nuova.
