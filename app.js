/* Snus Tracker - file generato da tools/build.py: modifica i sorgenti in tools/app */
(function(){
"use strict";
var $=function(s){return document.querySelector(s)};
var $=function(s){return document.querySelector(s)};
var ICON={
 pouch:'<svg class="ds-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="7" width="18" height="10" rx="5"/></svg>',
 can:'<svg class="ds-icon" viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="7" rx="8" ry="3"/><path d="M4 7v10c0 1.7 3.6 3 8 3s8-1.3 8-3V7"/></svg>',
 bars:'<svg class="ds-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 20v-8M12 20V5M19 20v-5"/></svg>',
 sliders:'<svg class="ds-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h10M18 8h2M4 16h2M10 16h10"/><circle cx="16" cy="8" r="2"/><circle cx="8" cy="16" r="2"/></svg>',
 check:'<svg class="ds-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
 chevron:'<svg class="ds-icon" viewBox="0 0 24 24" aria-hidden="true" style="width:20px;height:20px"><path d="M6 9l6 6 6-6"/></svg>',
 alert:'<svg class="ds-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17.5v.01"/></svg>',
 minus:'<svg class="ds-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12h12"/></svg>',
 more:'<svg class="ds-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="5.5" cy="12" r="1.6" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/><circle cx="18.5" cy="12" r="1.6" fill="currentColor" stroke="none"/></svg>',
 chevronR:'<svg class="ds-icon" viewBox="0 0 24 24" aria-hidden="true" style="width:16px;height:16px"><path d="M9 6l6 6-6 6"/></svg>',
 plus:'<svg class="ds-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 6v12M6 12h12"/></svg>'
};
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function grp(s){return s.replace(/\B(?=(\d{3})+(?!\d))/g,".")}
function fmtN(n){return grp(String(Math.round(n)))}
function eur(n){var a=n.toFixed(2).split(".");return grp(a[0])+","+a[1]+" €"}
function lab(p){return p.brand+" "+p.flavor}
function mmss(s){s=Math.max(0,Math.ceil(s));var m=Math.floor(s/60),r=s%60;return String(m).padStart(2,"0")+":"+String(r).padStart(2,"0")}
function clone(o){return JSON.parse(JSON.stringify(o))}
function num(s){return parseFloat(String(s).trim().replace(",","."))}
/* ---------- archivio locale ---------- */
var CFG=window.SNUS_CONFIG||{},PUSH=(CFG.push||"").replace(/\/+$/,""),VERSION=CFG.version||"1.0";
var KEY="snus-tracker-v1",DAY=864e5,MIN=6e4;
var PERSIST=["v","createdAt","packs","nextId","use","uses","ceded","purchases","archived","phase","ps","pd","notified","goal","goalSet","hold","wait","shrink","adaptive","calibrated","dayEnd","notif","askedPerm","theme","lastExport","sub","subKey"];
function blank(){var n=Date.now();return {v:1,createdAt:n,packs:[],nextId:1,use:null,uses:[],ceded:[],purchases:[],archived:[],
  phase:"ready",ps:0,pd:0,notified:false,goal:8,goalSet:n,hold:30,wait:45,shrink:false,adaptive:true,calibrated:false,dayEnd:23*60,
  notif:false,askedPerm:false,theme:"auto",lastExport:null,sub:null,subKey:null}}
function uiDefaults(){return {tab:"oggi",sheet:null,form:null,editId:null,mid:null,range:"mese",metric:"pouches",sel:null,hintSeen:false,shownPack:null}}
function pick(o,keys){var r={};keys.forEach(function(k){if(o[k]!==undefined)r[k]=o[k]});return r}
function load(){
  var d=null;try{d=JSON.parse(localStorage.getItem(KEY)||"null")}catch(e){}
  return Object.assign(blank(),d&&typeof d==="object"?pick(d,PERSIST):{},uiDefaults());
}
var saveErr=false;
function save(){
  try{localStorage.setItem(KEY,JSON.stringify(pick(S,PERSIST)));saveErr=false}
  catch(e){if(!saveErr){saveErr=true;toast("Non riesco a salvare i dati")}}
}
var S=load();
try{if(navigator.storage&&navigator.storage.persist)navigator.storage.persist()}catch(e){}

/* ---------- utilità di tempo ---------- */
function now(){return Date.now()}
function dayStart(t){var d=new Date(t);d.setHours(0,0,0,0);return d.getTime()}
function hhmm(t){var d=new Date(t);return String(d.getHours()).padStart(2,"0")+":"+String(d.getMinutes()).padStart(2,"0")}
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function median(a){if(!a.length)return null;var b=a.slice().sort(function(x,y){return x-y}),m=b.length>>1;return b.length%2?b[m]:(b[m-1]+b[m])/2}
function quant(a,q){if(!a.length)return null;var b=a.slice().sort(function(x,y){return x-y});return b[Math.min(b.length-1,Math.floor(q*b.length))]}

function pack(id){for(var i=0;i<S.packs.length;i++)if(S.packs[i].id===id)return S.packs[i];return null}
function avail(){return S.packs.filter(function(p){return p.left>0})}
function usesToday(){var d=dayStart(now());return S.uses.filter(function(u){return u.t>=d})}
function usedToday(){return usesToday().length}
function curPack(){
  var p=pack(S.use);
  if(!p||p.left<=0){var a=avail(),o=a.filter(function(x){return x.left<x.size});p=o[0]||a[0]||null;S.use=p?p.id:null}
  return p;
}
/* obiettivo: con «Riduci ogni settimana» scende di 1 ogni 7 giorni dall'ultima modifica */
function goalNow(){
  if(!S.shrink)return S.goal;
  return Math.max(1,S.goal-Math.floor((now()-S.goalSet)/(7*DAY)));
}
function setGoal(v){S.goal=clamp(v,1,30);S.goalSet=now()}
function obsDay(){return Math.floor((dayStart(now())-dayStart(S.createdAt))/DAY)+1}

/* calibrazione: dopo 7 giorni di osservazione imposta obiettivo, attesa e ora dell'ultima bustina */
function calibrate(){
  if(S.calibrated||obsDay()<=7)return;
  var a=dayStart(S.createdAt),b=a+7*DAY,u=S.uses.filter(function(x){return x.t>=a&&x.t<b}).sort(function(x,y){return x.t-y.t});
  if(u.length<7){S.calibrated=true;save();return}
  var gaps=[],ends={},i;
  for(i=1;i<u.length;i++){
    if(dayStart(u[i].t)!==dayStart(u[i-1].t))continue;
    var g=u[i].t-(u[i-1].end||u[i-1].t+S.hold*MIN);
    if(g>=5*MIN&&g<=6*60*MIN)gaps.push(g);
  }
  u.forEach(function(x){var d=new Date(x.t),k=dayStart(x.t);ends[k]=Math.max(ends[k]||0,d.getHours()*60+d.getMinutes())});
  setGoal(Math.max(1,Math.round(u.length/7)));
  var mg=median(gaps);if(mg!=null)S.wait=clamp(Math.round(mg/MIN/5)*5,15,90);
  var de=quant(Object.keys(ends).map(function(k){return ends[k]}),.8);if(de!=null)S.dayEnd=clamp(de,18*60,24*60-1);
  S.calibrated=true;save();
  toast("Obiettivo e attesa calibrati sui tuoi primi 7 giorni");
}
/* attesa adattiva: se mancano molte ore e poche bustine all'obiettivo, l'attesa si allunga */
function waitMs(){
  var base=S.wait*MIN;if(!S.adaptive)return base;
  var g=goalNow(),used=usedToday();if(used>=g)return base;
  var t=now(),end=dayStart(t)+S.dayEnd*MIN,left=end-t;if(left<=0)return base;
  var per=left/(g-used)-S.hold*MIN;
  return Math.round(clamp(per,base,base*2.5)/MIN)*MIN;
}

/* ---------- orologio ---------- */
var bannerT=null,toastT=null;
function tick(){step();updatePouch();updateClock()}
function step(){
  var t=now(),due=S.ps+S.pd;
  if(S.phase==="active"&&!S.notified&&t>=due){
    S.notified=true;save();
    if(t-due<15000)notify("Togli la bustina","Sono passati "+Math.round(S.pd/MIN)+" minuti.");
  }
  if(S.phase==="wait"&&t>=due){
    S.phase="ready";S.notified=false;save();
    if(t-due<15000)notify("Via libera","Oggi ne hai usate "+usedToday()+" su "+goalNow()+".");
    render();
  }
}
function updateClock(){
  var c=$("#clock"),s=hhmm(now());if(c&&c.textContent!==s)c.textContent=s;
}

/* ---------- avvisi nell'app e toast ---------- */
function notify(title,body){
  if(!S.notif)return;
  if(pushOn()&&document.visibilityState!=="visible")return;
  var b=$("#banner");
  b.innerHTML='<article class="ds-notif" data-act="banner-close"><span class="ds-notif__icon">'+ICON.pouch+'</span><div><h3 class="text-body-strong">'+esc(title)+'</h3><p class="ds-notif__body text-detail">'+esc(body)+'</p></div><span class="text-label muted">ora</span></article>';
  clearTimeout(bannerT);bannerT=setTimeout(function(){b.innerHTML=""},6000);
}
function toast(msg){
  var t=$("#toast");if(!t)return;t.textContent=msg;t.hidden=false;
  clearTimeout(toastT);toastT=setTimeout(function(){t.hidden=true},2200);
}

/* ---------- notifiche push (server Cloudflare) ---------- */
function isStandalone(){return window.navigator.standalone===true||(window.matchMedia&&matchMedia("(display-mode: standalone)").matches)}
function isIOS(){return /iP(hone|ad|od)/.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1)}
function pushOn(){return !!(PUSH&&S.notif&&S.sub)}
function b64u(u8){var s="";for(var i=0;i<u8.length;i++)s+=String.fromCharCode(u8[i]);return btoa(s).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}
function unb64u(s){s=s.replace(/-/g,"+").replace(/_/g,"/");while(s.length%4)s+="=";var b=atob(s),u=new Uint8Array(b.length);for(var i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u}
function subscribePush(){
  if(!PUSH||!("serviceWorker" in navigator)||!("PushManager" in window))return Promise.resolve(null);
  var reg;
  return navigator.serviceWorker.ready.then(function(r){reg=r;return fetch(PUSH+"/key").then(function(x){return x.json()})}).then(function(k){
    return reg.pushManager.getSubscription().then(function(old){
      if(old&&S.subKey===k.key)return old;
      return (old?old.unsubscribe():Promise.resolve()).then(function(){
        return reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:unb64u(k.key)});
      });
    }).then(function(sub){S.sub=sub.toJSON();S.subKey=k.key;save();return sub});
  });
}
function pendingItems(){
  var it=[];
  if(S.phase==="active"&&!S.notified)it.push({tag:"togli",at:S.ps+S.pd,title:"Togli la bustina",body:"Sono passati "+Math.round(S.pd/MIN)+" minuti."});
  if(S.phase==="wait")it.push({tag:"via",at:S.ps+S.pd,title:"Via libera",body:"Oggi ne hai usate "+usedToday()+" su "+goalNow()+"."});
  return it;
}
function schedulePush(){
  if(!PUSH||!S.sub)return;
  var items=S.notif?pendingItems():[];
  fetch(PUSH+"/schedule",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({sub:S.sub,items:items,origin:location.origin})}).catch(function(){});
}
function enableNotif(){
  if(!("Notification" in window)||!("serviceWorker" in navigator)){
    S.notif=false;S.sheet=isIOS()&&!isStandalone()?"install":null;
    if(!S.sheet)toast("Questo browser non supporta le notifiche");
    render();return;
  }
  Notification.requestPermission().then(function(r){
    if(r!=="granted"){S.notif=false;save();render();toast("Notifiche non consentite. Puoi attivarle da Impostazioni di iOS.");return}
    S.notif=true;save();render();
    subscribePush().then(function(){schedulePush();render()}).catch(function(){toast("Server delle notifiche non raggiungibile")});
  });
}
function disableNotif(){
  S.notif=false;save();schedulePush();render();
}
function testPush(){
  if(!pushOn()){toast("Notifiche non attive");return}
  fetch(PUSH+"/test",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({sub:S.sub,origin:location.origin})})
    .then(function(r){toast(r.ok?"Notifica di prova inviata":"Il server non ha inviato la notifica")}).catch(function(){toast("Server delle notifiche non raggiungibile")});
}

/* ---------- azioni ---------- */
function useRec(p,t){return {t:t,end:null,pid:p.id,name:lab(p),brand:p.brand,flavor:p.flavor,type:p.type,mg:p.mg,ppu:Math.round(p.price/p.size*1000)/1000}}
function doStart(){
  var p=curPack();if(!p)return;
  var t=now();
  p.left--;if(!p.openedAt)p.openedAt=t;if(p.left<=0)p.finishedAt=t;
  S.uses.push(useRec(p,t));
  S.phase="active";S.ps=t;S.pd=S.hold*MIN;S.notified=false;S.sheet=null;
  save();schedulePush();render();
}
function lastOpenUse(){var u=S.uses[S.uses.length-1];return u&&u.end==null?u:null}
function doRemove(){
  var t=now(),u=lastOpenUse();if(u)u.end=t;
  S.phase="wait";S.ps=t;S.pd=waitMs();S.notified=false;
  if(!S.askedPerm&&!S.notif){S.askedPerm=true;S.sheet="perm"}
  save();schedulePush();render();
}
function doAdj(id,d){
  var p=pack(id);if(!p)return;var t=now(),i;
  if(d<0){
    if(p.left<=0)return;
    p.left--;if(!p.openedAt)p.openedAt=t;if(p.left<=0)p.finishedAt=t;
    S.ceded.push({t:t,pid:p.id});toast("Una in meno nella confezione");
  }else{
    if(p.left>=p.size)return;
    p.left++;p.finishedAt=null;
    for(i=S.ceded.length-1;i>=0;i--)if(S.ceded[i].pid===p.id){S.ceded.splice(i,1);break}
    toast("Una in più nella confezione");
  }
  save();render();
}
function delEntry(i){
  var e=S.uses[i];if(!e)return;
  var p=pack(e.pid);
  if(p){p.left=Math.min(p.size,p.left+1);p.finishedAt=null}
  if(i===S.uses.length-1&&S.phase==="active"){S.phase="ready";S.notified=false}
  S.uses.splice(i,1);save();schedulePush();render();
}
function finishPack(id){var p=pack(id);if(!p)return;var t=now();if(!p.openedAt)p.openedAt=t;p.left=0;p.finishedAt=t;save()}
function deletePack(id){
  var p=pack(id);if(!p)return;
  if(p.finishedAt&&p.openedAt)S.archived.push({name:lab(p),openedAt:p.openedAt,finishedAt:p.finishedAt});
  S.packs=S.packs.filter(function(x){return x.id!==id});
  if(S.use===id)S.use=null;save();
}
function setTheme(v){
  S.theme=v;
  var r=document.documentElement;
  if(v==="auto")r.removeAttribute("data-theme");else r.setAttribute("data-theme",v);
  var dark=v==="dark"||(v==="auto"&&window.matchMedia&&matchMedia("(prefers-color-scheme: dark)").matches);
  var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",dark?"#000000":"#f2f2f7");
}
function wipe(){
  var keep={theme:S.theme,notif:S.notif,sub:S.sub,subKey:S.subKey,askedPerm:S.askedPerm};
  S=Object.assign(blank(),keep,uiDefaults());save();schedulePush();
}

/* ---------- copia di sicurezza (iCloud Drive tramite «Salva su File») ---------- */
function ymd(t){var d=new Date(t);return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function exportData(){
  var data=pick(S,PERSIST);delete data.sub;delete data.subKey;
  var json=JSON.stringify({app:"snus-tracker",format:1,exportedAt:new Date().toISOString(),data:data});
  var name="snus-tracker-"+ymd(now())+".json",done=function(){S.lastExport=now();save();render();toast("Copia salvata")};
  var file=null;try{file=new File([json],name,{type:"application/json"})}catch(e){}
  if(file&&navigator.canShare&&navigator.canShare({files:[file]})){
    navigator.share({files:[file],title:name}).then(done).catch(function(e){if(e&&e.name!=="AbortError")download(json,name,done)});
  }else download(json,name,done);
}
function download(json,name,done){
  var url=URL.createObjectURL(new Blob([json],{type:"application/json"})),a=document.createElement("a");
  a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();
  setTimeout(function(){URL.revokeObjectURL(url)},4000);done();
}
function importFile(f){
  var r=new FileReader();
  r.onload=function(){
    var o=null;try{o=JSON.parse(r.result)}catch(e){}
    if(!o||o.app!=="snus-tracker"||!o.data||!Array.isArray(o.data.packs)){toast("Questo file non è una copia di Snus Tracker");return}
    var keep={notif:S.notif,sub:S.sub,subKey:S.subKey,askedPerm:true};
    S=Object.assign(blank(),pick(o.data,PERSIST),keep,uiDefaults());
    S.tab="altro";setTheme(S.theme);save();schedulePush();render();toast("Copia importata");
  };
  r.onerror=function(){toast("Non riesco a leggere il file")};
  r.readAsText(f);
}
function backupDays(){return S.lastExport?Math.floor((dayStart(now())-dayStart(S.lastExport))/DAY):null}
function backupDue(){
  if(!S.uses.length&&!S.packs.length)return false;
  var n=backupDays();
  return n==null?(now()-S.createdAt>=14*DAY):n>=14;
}
/* ---------- sfondo a tema (marca e gusto) ---------- */
function hashStr(t){var n=0,i;for(i=0;i<t.length;i++)n=(n*31+t.charCodeAt(i))%100003;return n}
var SCENE_ILLUSTRATED=true;   /* true: illustrazioni per gusto (menta, agrumi...); false: bolle del colore del pacchetto */
function hexHue(c){var m=/^#([0-9a-f]{6})$/i.exec(c||"");if(!m)return null;var v=parseInt(m[1],16),r=(v>>16&255)/255,g=(v>>8&255)/255,b=(v&255)/255,mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn,h;if(d<.08)return null;h=mx===r?((g-b)/d)%6:mx===g?(b-r)/d+2:(r-g)/d+4;return (Math.round(h*60)+360)%360}
function packHue(p){var b=(p.brand||"").trim().toLowerCase(),c=null;
  if(b==="zyn")c=zynLook(p.flavor).lid;
  else if(b==="velo"){var l=veloLook(p.flavor,Number(p.mg));c=l.ac||l.A}
  else if(b==="lost mary"||b==="airplane mode")c=lmLook(p.flavor).a;
  else if(b==="niu")c=niuLook(p.flavor).a;
  return hexHue(c)}
function sceneTheme(p){
  var t=(p.brand+" "+p.flavor).toLowerCase(),h,k=1,deep=false,kind="bubble";
  if(/spear|menta verde/.test(t)){h=135;kind="leaf"}
  else if(/ment|mint|ghiacc|freddo|\bice\b|freez|polar|glaci|artic/.test(t)){h=168;kind="ice"}
  else if(/agrum|limon|aranc|citr|lime/.test(t)){h=36;kind="citrus"}
  else if(/peach|pesc/.test(t)){h=12;kind="peach"}
  else if(/mango|papaya|tropical|ananas|pineapple/.test(t)){h=44;kind="mango"}
  else if(/water|angur|cocomer|melon/.test(t)){h=352;kind="melon"}
  else if(/grape|\buva\b|\buva /.test(t)){h=276;k=.85;kind="grape"}
  else if(/cherry|ciliegi|amarena/.test(t)){h=348;k=.7;kind="cherry"}
  else if(/liquir/.test(t)){h=322;k=.55;deep=true;kind="licorice"}
  else if(/bosco|frutt|mirtill|fragol|berry|straw/.test(t)){h=340;kind="berry"}
  else if(/cola|caff|coffee|cafe|cioccol|chocolate/.test(t)){h=24;k=.7;kind="coffee"}
  else if(/vanigl|vanill/.test(t)){h=44;k=.6;kind="vanilla"}
  else h=hashStr(t)%360;
  var ph=packHue(p);if(ph!=null&&kind==="bubble")h=ph;
  if(!SCENE_ILLUSTRATED){kind="bubble";deep=false;k=1}
  var h2=(h+35)%360,c=function(hh,sat,l){return "hsl("+hh+","+Math.round(sat*k)+"%,"+l+"%)"},d=function(l){return "hsl("+h+","+(deep?20:36)+"%,"+l+"%)"};
  var L,D,wl={wall:"#f1f1ee",wallhi:"#ffffff",edge:"#c4c5c1"},wd={wall:"#cfd0cc",wallhi:"#e8e9e5",edge:"#8d8e8a"},m;
  L={bg:c(h,75,90),bg2:c(h2,80,92),lid:deep?d(24):c(h,64,42),lidhi:deep?d(34):c(h,66,54),ink:"#fff"};
  D={bg:deep?c(h,100,11):c(h,36,11),bg2:deep?c(h2,100,15):c(h2,32,15),lid:deep?d(26):c(h,46,40),lidhi:deep?d(36):c(h,48,52),ink:"#fff"};
  if(deep){L.bg=c(h,60,90);L.bg2=c(h2,60,92)}
  for(m in wl){L[m]=wl[m];D[m]=wd[m]}
  L.pouch="#f9f8f4";L.pouchlo="hsl("+h+",8%,76%)";L.shadow="hsla("+h+",50%,26%,.26)";if(kind==="berry"||kind==="licorice"||kind==="cherry"||kind==="grape")L.shadow="hsla("+h+",55%,22%,.4)";if(kind==="vanilla"){L.bg="hsl(34,40%,82%)";L.bg2="hsl(28,42%,74%)"}
  D.pouch="hsl(40,14%,72%)";D.pouchlo="hsl(40,12%,52%)";D.shadow="rgba(0,0,0,.5)";
  var T={ice:[70,62,44,88,46,30,72,0],citrus:[88,58,40,86,50,34,76,0],berry:[62,40,26,72,40,26,62,0],coffee:[50,30,17,56,34,22,58,0],licorice:[14,17,9,40,30,18,50,0],vanilla:[60,50,34,80,40,26,66,0],peach:[88,58,40,86,50,34,76,0],mango:[90,56,40,86,50,34,76,0],melon:[70,56,40,86,46,32,70,0],grape:[50,44,30,80,40,28,66,0],cherry:[62,40,26,72,40,26,62,0],leaf:[60,46,34,80,40,28,66,0],bubble:[65,66,50,90,46,30,72,0]}[kind],hh=kind==="citrus"?h:h;
  L.fx1="hsl("+hh+","+T[0]+"%,"+T[1]+"%)";L.fx2="hsl("+hh+","+T[0]+"%,"+T[2]+"%)";L.fx3="hsl("+hh+","+Math.min(95,T[0]+8)+"%,"+T[3]+"%)";
  D.fx1="hsl("+hh+","+T[0]+"%,"+T[4]+"%)";D.fx2="hsl("+hh+","+T[0]+"%,"+T[5]+"%)";D.fx3="hsl("+hh+","+Math.min(95,T[0]+8)+"%,"+T[6]+"%)";
  var F4={ice:["hsl(135,46%,40%)","hsl(135,38%,30%)"],citrus:["hsl(105,52%,42%)","hsl(105,40%,32%)"],berry:["hsl(232,52%,40%)","hsl(232,42%,36%)"],coffee:["hsl(28,78%,46%)","hsl(28,62%,38%)"],licorice:["hsl(285,16%,26%)","hsl(285,16%,36%)"],vanilla:["hsl(44,40%,40%)","hsl(44,30%,32%)"],peach:["hsl(100,45%,40%)","hsl(100,35%,30%)"],mango:["hsl(100,45%,40%)","hsl(100,35%,30%)"],melon:["hsl(130,45%,36%)","hsl(130,38%,30%)"],grape:["hsl(95,45%,40%)","hsl(95,35%,30%)"],cherry:["hsl(100,40%,38%)","hsl(100,32%,30%)"],leaf:["hsl(150,50%,36%)","hsl(150,40%,30%)"],bubble:["hsl("+((h+40)%360)+",70%,60%)","hsl("+((h+40)%360)+",50%,44%)"]}[kind];
  L.fx4=F4[0];D.fx4=F4[1];
  return {sl:L,sd:D,kind:kind};
}
function rnd(i){var v=Math.sin(i*127.1+311.7)*43758.5453;return v-Math.floor(v)}
function nn(v){return +v.toFixed(1)}
var FONT="-apple-system,'SF Pro Rounded',system-ui,sans-serif";
/* lattina vista dall'alto: marca, gusto e nicotina sull'etichetta */
function canFaceBase(p,R){
  var n=nn,bn=p.brand,fl=p.flavor,f1=Math.min(R*.37,R*1.55/(bn.length*.62)),f2=Math.min(R*.15,R*1.5/(fl.length*.56)),f3=R*.095;
  return '<circle cy="'+n(R*.1)+'" r="'+n(R*.97)+'" fill="var(--s-shadow)" filter="url(#pc-sh)"/>'+
    '<circle cy="'+n(R*.035)+'" r="'+n(R)+'" fill="var(--s-edge)"/>'+
    '<circle r="'+n(R)+'" fill="url(#pc-rim)"/>'+
    '<circle r="'+n(R*.955)+'" fill="none" stroke="var(--s-edge)" stroke-width="1" opacity=".4"/>'+
    '<circle r="'+n(R*.885)+'" fill="var(--s-edge)" opacity=".35"/>'+
    '<circle r="'+n(R*.875)+'" fill="url(#pc-lid)"/>'+
    '<circle r="'+n(R*.835)+'" fill="none" stroke="#fff" stroke-width="1" opacity=".28"/>'+
    '<g text-anchor="middle" font-family="'+FONT+'" fill="#fff"><text y="'+n(-R*.5)+'" font-size="'+n(R*.15)+'" font-weight="800" letter-spacing="'+n(R*.01)+'">'+esc(String(p.mg))+' MG</text>'+
    '<text y="'+n(-R*.31)+'" font-size="'+n(f2)+'" font-weight="600">'+esc(fl)+'</text>'+
    '<text y="'+n(R*.1)+'" font-size="'+n(f1)+'" font-weight="900">'+esc(bn.toUpperCase())+'</text>'+
    '<rect x="'+n(-R*.19)+'" y="'+n(R*.28)+'" width="'+n(R*.38)+'" height="'+n(R*.125)+'" rx="'+n(R*.0625)+'" fill="#fff"/>'+
    '<text y="'+n(R*.372)+'" font-size="'+n(f3)+'" font-weight="700" fill="var(--s-lid)">'+esc(p.format)+'</text></g>'+
    '<path d="M'+n(-R*.74)+' '+n(-R*.3)+'A'+n(R*.8)+' '+n(R*.8)+' 0 0 1 '+n(-R*.2)+' '+n(-R*.78)+'" fill="none" stroke="#fff" stroke-width="'+n(R*.03)+'" stroke-linecap="round" opacity=".35"/>';
}
/* confezione nello stile della marca: ogni marca ha il suo disegno del coperchio */
function mgTxt(v){return String(v).replace(".",",")}
function zynLook(fl){
  var t=fl.toLowerCase();
  if(/spear|menta verde/.test(t))return {lid:"#4fb34a",ink:"#0b5a2c"};
  if(/cool|ment|mint|fresh|ghiacc/.test(t))return {lid:"#2cb7c8",ink:"#0a5a74"};
  if(/citrus|agrum|limon|lime|aranc/.test(t))return {lid:"#bdd400",ink:"#007a33"};
  if(/peach|pesc/.test(t))return {lid:"#f59a56",ink:"#8f2f12"};
  if(/cherry|ciliegi|amarena/.test(t))return {lid:"#6d1b40",ink:"#ffc1d6"};
  if(/coff|caff|espresso/.test(t))return {lid:"#7a4a2c",ink:"#f6dcbc"};
  return {lid:"var(--s-lid)",ink:"#ffffff"};
}
function zynFace(p,R){
  var n=nn,k=zynLook(p.flavor),mg=Number(p.mg),dots=mg<=1.5?0:mg<=3?1:mg<=6?2:mg<=9?3:4,
    fl=p.flavor,f2=Math.min(R*.17,R*1.25/(fl.length*.55)),bn=p.brand.toUpperCase(),f1=Math.min(R*.66,R*1.5/(bn.length*.72)),
    lab=mgTxt(p.mg)+" mg",fs=R*.12,dr=R*.047,dg=R*.14,dw=3*dg+2*dr,
    rt=R*.66,rd=rt+fs*.36,a0=-dw/(2*rt),aT=-.7,aE=.7,o="",j,ra=R*.77,ax=ra*Math.sin(.72),ay=ra*Math.cos(.72);
  o='<circle cy="'+n(R*.1)+'" r="'+n(R*.97)+'" fill="var(--s-shadow)" filter="url(#pc-sh)"/>'+
    '<circle cy="'+n(R*.035)+'" r="'+n(R)+'" fill="var(--s-edge)"/>'+
    '<circle r="'+n(R)+'" fill="url(#pc-rim)"/>'+
    '<circle r="'+n(R*.955)+'" fill="none" stroke="var(--s-edge)" stroke-width="1" opacity=".4"/>'+
    '<path d="M'+n(-R*.93)+' '+n(-R*.16)+'L'+n(-R*.93)+' '+n(R*.16)+'M'+n(R*.93)+' '+n(-R*.16)+'L'+n(R*.93)+' '+n(R*.16)+'" stroke="var(--s-edge)" stroke-width="'+n(R*.05)+'" stroke-linecap="round" opacity=".28"/>'+
    '<circle r="'+n(R*.885)+'" fill="var(--s-edge)" opacity=".35"/>'+
    '<circle r="'+n(R*.875)+'" fill="'+k.lid+'"/><circle r="'+n(R*.875)+'" fill="url(#pc-sheen)"/>';
  for(j=0;j<(dots?4:0);j++){var ang=a0+(dr+j*dg)/rt,cx=rd*Math.sin(ang),cy=-rd*Math.cos(ang);
    o+=j<dots?'<circle cx="'+n(cx)+'" cy="'+n(cy)+'" r="'+n(dr)+'" fill="'+k.ink+'"/>':'<circle cx="'+n(cx)+'" cy="'+n(cy)+'" r="'+n(dr*.8)+'" fill="none" stroke="'+k.ink+'" stroke-width="'+n(R*.016)+'"/>'}
  o+='<g font-family="'+FONT+'" text-anchor="middle">'+
    (dots?'':'<text font-size="'+n(fs)+'" font-weight="700" fill="'+k.ink+'" letter-spacing="'+n(R*.01)+'"><textPath href="#pc-arc2" startOffset="50%" text-anchor="middle">X-Low</textPath></text>')+
    '<text y="'+n(-R*.52)+'" font-size="'+n(R*.11)+'" font-weight="700" fill="'+k.ink+'">'+esc(lab)+'</text>'+
    '<text y="'+n(-R*.26)+'" font-size="'+n(f2)+'" font-weight="600" fill="#fff">'+esc(fl)+'</text>'+
    '<text y="'+n(R*.27)+'" font-size="'+n(f1)+'" font-weight="900" letter-spacing="'+n(-R*.01)+'" fill="'+k.ink+'">'+esc(bn)+'</text>'+
    '<rect x="'+n(-R*.2)+'" y="'+n(R*.36)+'" width="'+n(R*.4)+'" height="'+n(R*.15)+'" rx="'+n(R*.075)+'" fill="#fff"/>'+
    '<text y="'+n(R*.36+R*.108)+'" font-size="'+n(R*.105)+'" font-weight="600" fill="#111">'+esc(p.format)+'</text>'+
    '<text font-size="'+n(R*.075)+'" font-weight="600" fill="'+k.ink+'" letter-spacing="'+n(R*.004)+'"><textPath href="#pc-arc" startOffset="50%" text-anchor="middle">Nicotine Pouches</textPath></text></g>'+
    '<path id="pc-arc" d="M'+n(-ax)+' '+n(ay)+'A'+n(ra)+' '+n(ra)+' 0 0 0 '+n(ax)+' '+n(ay)+'" fill="none"/>'+
    '<path id="pc-arc2" d="M'+n(rt*Math.sin(aT))+' '+n(-rt*Math.cos(aT))+'A'+n(rt)+' '+n(rt)+' 0 0 1 '+n(rt*Math.sin(aE))+' '+n(-rt*Math.cos(aE))+'" fill="none"/>';
  return o;
}
function veloLook(fl,mg){
  var t=fl.toLowerCase(),A,B,ac=null;
  if(/storm/.test(t)){if(/spear|verde/.test(t)){A="#58d19a";B="#2fae78"}else{A="#93d4f0";B="#4aa6e0"}}
  else if(/crispy/.test(t)){A="#1c63e0";B="#0a2f9c"}
  else if(/spear|menta verde/.test(t)){A="#33b343";B="#117a24"}
  else if(/peppermint|ment|mint|ghiacc/.test(t)){A="#1aa8e2";B="#0877b5"}
  else if(/grape|uva/.test(t)){A="#9255bb";B="#5d2a86"}
  else if(/papaya/.test(t)){A="#1c1c1f";B="#0e0e10";ac="#ee8a1e"}
  else if(/mango|tropical|ananas/.test(t)){A="#f9ae28";B="#ee8300"}
  else if(/peach|pesc/.test(t)){A="#f47c68";B="#d9473b"}
  else if(/berr|bosco/.test(t)){A="#3b52c4";B="#1ea8b6"}
  else if(/water|angur|cocomer/.test(t)){A="#f088d2";B="#9a44b4"}
  else{A="var(--s-lidhi)";B="var(--s-lid)"}
  return {A:A,B:B,ac:ac,dk:mg>=14};
}
function veloFace(p,R){
  var n=nn,mg=Number(p.mg),k=veloLook(p.flavor,mg),dots=mg<=4.5?1:mg<=7?2:mg<=9?3:mg<=12?4:mg<=15?5:6,
    fl=p.flavor.toUpperCase(),bn=p.brand.toUpperCase(),f1=Math.min(R*.56,R*1.5/(bn.length*.7)),f2=Math.min(R*.115,R*1.5/(fl.length*.64)),
    dg=R*.115,dr=R*.036,j,o,ra=R*.76,ax=ra*Math.sin(.95),ay=-ra*Math.cos(.95),fw=R*.075,fy=R*.325,tx=k.dk?"#0b0c0e":"#fff";
  o='<defs><linearGradient id="pc-vlid" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:'+k.A+'"/><stop offset="1" style="stop-color:'+k.B+'"/></linearGradient>'+
    '<radialGradient id="pc-brim" cx=".42" cy=".38" r=".8"><stop offset="0" stop-color="#3a3d43"/><stop offset=".8" stop-color="#17191c"/><stop offset="1" stop-color="#0b0c0e"/></radialGradient><radialGradient id="pc-vacc" cx=".5" cy="1" r=".95"><stop offset="0" stop-color="'+(k.ac||"#000")+'" stop-opacity=".5"/><stop offset="1" stop-color="'+(k.ac||"#000")+'" stop-opacity="0"/></radialGradient></defs>'+
    '<circle cy="'+n(R*.1)+'" r="'+n(R*.97)+'" fill="var(--s-shadow)" filter="url(#pc-sh)"/>'+
    '<circle cy="'+n(R*.035)+'" r="'+n(R)+'" fill="var(--s-edge)"/>'+
    '<circle r="'+n(R)+'" fill="url(#'+(k.dk?'pc-brim':'pc-rim')+')"/>'+
    '<circle r="'+n(R*.955)+'" fill="none" stroke="var(--s-edge)" stroke-width="1" opacity=".4"/>'+
    '<path d="M'+n(-R*.93)+' '+n(-R*.16)+'L'+n(-R*.93)+' '+n(R*.16)+'M'+n(R*.93)+' '+n(-R*.16)+'L'+n(R*.93)+' '+n(R*.16)+'" stroke="var(--s-edge)" stroke-width="'+n(R*.05)+'" stroke-linecap="round" opacity=".28"/>'+
    '<circle r="'+n(R*.885)+'" fill="var(--s-edge)" opacity=".35"/>'+
    '<circle r="'+n(R*.875)+'" fill="url(#pc-vlid)"/>'+(k.ac?'<circle r="'+n(R*.875)+'" fill="url(#pc-vacc)"/>':'')+'<circle r="'+n(R*.875)+'" fill="url(#pc-sheen)"/>';
  for(j=0;j<6;j++){var cx=(j-2.5)*dg;
    o+=j<dots?'<circle cx="'+n(cx)+'" cy="'+n(-R*.585)+'" r="'+n(dr)+'" fill="'+tx+'"/>':'<circle cx="'+n(cx)+'" cy="'+n(-R*.585)+'" r="'+n(dr*.85)+'" fill="none" stroke="'+tx+'" stroke-width="'+n(R*.013)+'"/>'}
  o+='<g font-family="'+FONT+'" text-anchor="middle" fill="'+tx+'">'+
    '<text font-size="'+n(R*.062)+'" font-weight="700" letter-spacing="'+n(R*.012)+'" opacity=".9"><textPath href="#pc-varc" startOffset="50%" text-anchor="middle">NICOTINE POUCHES</textPath></text>'+
    '<text y="'+n(-R*.4)+'" font-size="'+n(R*.105)+'" font-weight="700">'+esc(mgTxt(p.mg))+' mg</text>'+
    '<text y="'+n(R*.12)+'" font-size="'+n(f1)+'" font-weight="900" letter-spacing="'+n(R*.01)+'">'+esc(bn)+'</text>'+
    '<text y="'+n(R*.27)+'" font-size="'+n(f2)+'" font-weight="800" letter-spacing="'+n(R*.012)+'">'+esc(fl)+'</text>'+
    '<rect x="'+n(-fw*1.5)+'" y="'+n(fy)+'" width="'+n(fw)+'" height="'+n(R*.034)+'" fill="#1fa24a"/><rect x="'+n(-fw*.5)+'" y="'+n(fy)+'" width="'+n(fw)+'" height="'+n(R*.034)+'" fill="#fff"/><rect x="'+n(fw*.5)+'" y="'+n(fy)+'" width="'+n(fw)+'" height="'+n(R*.034)+'" fill="#e5383b"/>'+
    '<text y="'+n(R*.42)+'" font-size="'+n(R*.046)+'" font-weight="700" letter-spacing="'+n(R*.004)+'">MADE IN ITALY</text>'+
    '<rect x="'+n(-R*.2)+'" y="'+n(R*.5)+'" width="'+n(R*.4)+'" height="'+n(R*.15)+'" rx="'+n(R*.075)+'" fill="#fff"/>'+
    '<text y="'+n(R*.5+R*.108)+'" font-size="'+n(R*.105)+'" font-weight="600" fill="#111">'+esc(p.format)+'</text></g>'+
    '<path id="pc-varc" d="M'+n(-ax)+' '+n(ay)+'A'+n(ra)+' '+n(ra)+' 0 0 1 '+n(ax)+' '+n(ay)+'" fill="none"/>';
  return o;
}
function lmLook(fl){
  var t=fl.toLowerCase();
  if(/polar/.test(t))return {a:"#1fa56a",b:"#7be2ab",bn:"#4a3fb5"};
  if(/freez/.test(t))return {a:"#4a5fe0",b:"#8fa8ff",bn:"#5a3fc0"};
  if(/ice|ghiacc/.test(t))return {a:"#18aaa0",b:"#7de6d6",bn:"#4a3fb5"};
  if(/cool|ment|mint/.test(t))return {a:"#2a85dc",b:"#7ccbff",bn:"#4a3fc0"};
  if(/rose|grape|uva/.test(t))return {a:"#d93f4e",b:"#ff8f95",bn:"#4a3fb5"};
  if(/straw|fragol/.test(t))return {a:"#d9468a",b:"#ff9cc6",bn:"#4a3fb5"};
  return {a:"var(--s-lid)",b:"var(--s-lidhi)",bn:"#4a3fb5"};
}
var PLANE="M0 -46C4 -46 6 -36 6 -28L6 -10L44 14L44 22L6 12L5 32L16 40L16 46L0 42L-16 46L-16 40L-5 32L-6 12L-44 22L-44 14L-6 -10L-6 -28C-6 -36 -4 -46 0 -46Z";
function lmFace(p,R){
  var n=nn,k=lmLook(p.flavor),mg=Number(p.mg),dots=mg<=8?1:mg<=14?2:4,mgg=(mg===6||mg===12||mg===20)?mgTxt(mg*1.5)+" mg/g · ":"",
    fl=p.flavor.toUpperCase(),fs=R*.075,j,o,rl=R*.875,ra=R*.7,ax=ra*Math.sin(.95),ay=ra*Math.cos(.95),sc=R*.0105,
    sk=' stroke="rgba(0,0,0,.35)" stroke-width=".6" paint-order="stroke"';
  o='<defs><radialGradient id="pc-brim" cx=".42" cy=".38" r=".8"><stop offset="0" stop-color="#3a3d43"/><stop offset=".8" stop-color="#17191c"/><stop offset="1" stop-color="#0b0c0e"/></radialGradient>'+
    '<clipPath id="pc-lclip"><circle r="'+n(rl)+'"/></clipPath></defs>'+
    '<circle cy="'+n(R*.1)+'" r="'+n(R*.97)+'" fill="var(--s-shadow)" filter="url(#pc-sh)"/>'+
    '<circle cy="'+n(R*.035)+'" r="'+n(R)+'" fill="var(--s-edge)"/>'+
    '<circle r="'+n(R)+'" fill="url(#pc-brim)"/>'+
    '<circle r="'+n(R*.955)+'" fill="none" stroke="#555" stroke-width="1" opacity=".4"/>'+
    '<path d="M'+n(-R*.93)+' '+n(-R*.16)+'L'+n(-R*.93)+' '+n(R*.16)+'M'+n(R*.93)+' '+n(-R*.16)+'L'+n(R*.93)+' '+n(R*.16)+'" stroke="#000" stroke-width="'+n(R*.05)+'" stroke-linecap="round" opacity=".35"/>'+
    '<circle r="'+n(R*.885)+'" fill="#0b0c0e"/><g clip-path="url(#pc-lclip)">';
  for(j=0;j<9;j++){o+='<circle r="'+n(rl*(1-j/9.6))+'" fill="'+(j%2?k.b:k.a)+'"'+(j%2?' fill-opacity=".55"':'')+'/>'}
  o+='<circle r="'+n(rl)+'" fill="url(#pc-sheen)"/>'+
    '<g transform="translate('+n(R*.02)+' '+n(R*.03)+') rotate(42) scale('+n(sc)+')"><path d="'+PLANE+'" fill="#000" opacity=".28" transform="translate(2.5 3.5)"/><path d="'+PLANE+'" fill="#0e0f12"/></g>'+
    '<path d="M'+n(-R)+' '+n(R*.46)+'Q'+n(-R*.5)+' '+n(R*.38)+' 0 '+n(R*.48)+'T'+n(R)+' '+n(R*.44)+'V'+n(R)+'H'+n(-R)+'Z" fill="'+k.bn+'"/></g>';
  o+='<g font-family="'+FONT+'" fill="#fff" text-anchor="middle">'+
    '<text font-size="'+n(R*.055)+'" font-weight="700" letter-spacing="'+n(R*.012)+'"><textPath href="#pc-lm1" startOffset="50%" text-anchor="middle">NICOTINE POUCHES</textPath></text>'+
    '<circle cx="'+n(-R*.2)+'" cy="'+n(-R*.58)+'" r="'+n(R*.07)+'" fill="none" stroke="#fff" stroke-width="'+n(R*.018)+'"/>'+
    '<g transform="translate('+n(-R*.2)+' '+n(-R*.58)+') rotate(42) scale('+n(R*.0013)+')"><path d="'+PLANE+'" fill="#fff"/></g>'+
    '<text x="'+n(-R*.1)+'" y="'+n(-R*.595)+'" text-anchor="start" font-size="'+n(R*.075)+'" font-weight="700">airplane</text><text x="'+n(-R*.1)+'" y="'+n(-R*.51)+'" text-anchor="start" font-size="'+n(R*.075)+'" font-weight="700">mode</text>'+
    '<g transform="translate('+n(-R*.72)+' 0) rotate(-90)"><text x="'+n(-R*.12)+'" y="'+n(fs*.35)+'" text-anchor="start" font-size="'+n(fs)+'" font-weight="700"'+sk+'>'+esc(mgg+mgTxt(p.mg)+' mg')+'</text>';
  for(j=0;j<4;j++){o+='<circle cx="'+n(-R*.4+j*R*.075)+'" cy="0" r="'+n(R*.024)+'" fill="'+(j<dots?'#fff':'none')+'" stroke="#fff" stroke-width="'+n(R*.012)+'"/>'}
  o+='</g><g transform="translate('+n(R*.72)+' 0) rotate(90)"><text text-anchor="middle" y="'+n(fs*.35)+'" font-size="'+n(fs)+'" font-weight="800" letter-spacing="'+n(R*.008)+'"'+sk+'>'+esc(p.format.toUpperCase()+' · '+fl)+'</text></g>'+
    '<text font-size="'+n(R*.068)+'" font-weight="900" letter-spacing="'+n(R*.004)+'"><textPath href="#pc-lm2" startOffset="50%" text-anchor="middle">POWERED BY LOST MARY</textPath></text></g>'+
    '<path id="pc-lm1" d="M'+n(-R*.76*Math.sin(.9))+' '+n(-R*.76*Math.cos(.9))+'A'+n(R*.76)+' '+n(R*.76)+' 0 0 1 '+n(R*.76*Math.sin(.9))+' '+n(-R*.76*Math.cos(.9))+'" fill="none"/>'+
    '<path id="pc-lm2" d="M'+n(-ax)+' '+n(ay)+'A'+n(ra)+' '+n(ra)+' 0 0 0 '+n(ax)+' '+n(ay)+'" fill="none"/>';
  return o;
}
function niuLook(fl){
  var t=fl.toLowerCase();
  if(/water|anguria|cocomer/.test(t))return {a:"#e2464f",b:"#f47d82",r1:"#ff86cc",r2:"#d9429f"};
  if(/cherry|ciliegi/.test(t))return {a:"#a21f6f",b:"#d03c9b",r1:"#e552b4",r2:"#a81f7c"};
  if(/velvet|mint|menta/.test(t))return {a:"#9cc22a",b:"#c6e056",r1:"#cde85a",r2:"#8fb320"};
  return {a:"var(--s-lid)",b:"var(--s-lidhi)",r1:"var(--s-lidhi)",r2:"var(--s-lid)"};
}
function niuFace(p,R){
  var n=nn,k=niuLook(p.flavor),mg=Number(p.mg),dots=mg<=2.5?1:mg<=4.5?2:mg<=6.5?3:mg<=8.5?4:mg<=11?5:6,
    fl=p.flavor,f2=Math.min(R*.115,R*1.4/(fl.length*.6)),rl=R*.875,dg=R*.092,dr=R*.032,j,o,W=R*.13,
    mgt=mgTxt(p.mg)+" mg",fs=R*.09,tw=mgt.length*fs*.58,dw=5*dg+2*dr,gp=R*.05,x0=-(dw+gp+tw)/2,ya=-R*.585,
    c=function(v){return n(v*R)};
  o='<defs><radialGradient id="pc-nrim" cx=".4" cy=".35" r=".85"><stop offset="0" stop-color="'+k.r1+'"/><stop offset="1" stop-color="'+k.r2+'"/></radialGradient>'+
    '<radialGradient id="pc-nlid" cx=".3" cy=".25" r="1"><stop offset="0" style="stop-color:'+k.b+'"/><stop offset="1" style="stop-color:'+k.a+'"/></radialGradient>'+
    '<clipPath id="pc-nclip"><circle r="'+n(rl)+'"/></clipPath></defs>'+
    '<circle cy="'+n(R*.1)+'" r="'+n(R*.97)+'" fill="var(--s-shadow)" filter="url(#pc-sh)"/>'+
    '<circle cy="'+n(R*.035)+'" r="'+n(R)+'" fill="var(--s-edge)"/>'+
    '<circle r="'+n(R)+'" fill="url(#pc-nrim)"/>'+
    '<circle r="'+n(R*.955)+'" fill="none" stroke="#000" stroke-width="1" opacity=".12"/>'+
    '<circle r="'+n(R*.9)+'" fill="#000" opacity=".1"/>'+
    '<circle r="'+n(rl)+'" fill="url(#pc-nlid)"/><g clip-path="url(#pc-nclip)">'+
    '<circle cx="'+c(-.4)+'" cy="'+c(.1)+'" r="'+c(.5)+'" fill="#000" opacity=".07"/><circle cx="'+c(.5)+'" cy="'+c(-.2)+'" r="'+c(.45)+'" fill="#fff" opacity=".1"/><circle cx="'+c(.3)+'" cy="'+c(.55)+'" r="'+c(.5)+'" fill="#000" opacity=".06"/><circle cx="'+c(-.45)+'" cy="'+c(-.45)+'" r="'+c(.35)+'" fill="#fff" opacity=".08"/></g>'+
    '<circle r="'+n(rl)+'" fill="url(#pc-sheen)"/>'+
    '<g transform="translate(0 '+c(.08)+')"><g font-family="'+FONT+'" text-anchor="middle" fill="#fff">'+
    '<text font-size="'+c(.058)+'" font-weight="700" letter-spacing="'+c(.01)+'"><textPath href="#pc-narc" startOffset="50%" text-anchor="middle">NICOTINE POUCHES</textPath></text>'+
    '<rect x="'+n(x0-R*.05)+'" y="'+n(ya-R*.06)+'" width="'+n(dw+gp+tw+R*.1)+'" height="'+c(.12)+'" rx="'+c(.06)+'" fill="#000" opacity=".2"/>'+
    '<text x="'+n(x0+dw+gp)+'" y="'+n(ya+fs*.34)+'" text-anchor="start" font-size="'+n(fs)+'" font-weight="700">'+esc(mgt)+'</text>'+
    '<text y="'+c(.14)+'" font-size="'+n(f2)+'" font-weight="800">'+esc(fl)+'</text>'+
    '<rect x="'+c(-.17)+'" y="'+c(.27)+'" width="'+c(.34)+'" height="'+c(.13)+'" rx="'+c(.065)+'" fill="#fff"/>'+
    '<text y="'+n(R*.27+R*.093)+'" font-size="'+c(.09)+'" font-weight="700" fill="#222">'+esc(p.format)+'</text></g>';
  for(j=0;j<6;j++){var cx=x0+dr+j*dg;
    o+=j<dots?'<circle cx="'+n(cx)+'" cy="'+n(ya)+'" r="'+n(dr)+'" fill="#fff"/>':'<circle cx="'+n(cx)+'" cy="'+n(ya)+'" r="'+n(dr*.85)+'" fill="none" stroke="#fff" stroke-width="'+c(.012)+'"/>'}
  o+='<g fill="none" stroke="#ece7e7" stroke-width="'+n(W)+'" stroke-linecap="butt">'+
    '<path d="M'+c(-.533)+' '+c(-.03)+'V'+c(-.2685)+'A'+c(.1465)+' '+c(.1465)+' 0 0 1 '+c(-.24)+' '+c(-.2685)+'V'+c(-.03)+'"/>'+
    '<path d="M'+c(.058)+' '+c(-.48)+'V'+c(-.03)+'"/>'+
    '<path d="M'+c(.298)+' '+c(-.48)+'V'+c(-.2195)+'A'+c(.1245)+' '+c(.1245)+' 0 0 0 '+c(.547)+' '+c(-.2195)+'V'+c(-.48)+'"/></g></g>'+
    '<path id="pc-narc" d="M'+n(-R*.76*Math.sin(.6))+' '+n(-R*.76*Math.cos(.6))+'A'+n(R*.76)+' '+n(R*.76)+' 0 0 1 '+n(R*.76*Math.sin(.6))+' '+n(-R*.76*Math.cos(.6))+'" fill="none"/>';
  return o;
}
var CANS={zyn:zynFace,velo:veloFace,niu:niuFace,"lost mary":lmFace,"airplane mode":lmFace};
function canFace(p,R){var f=CANS[(p.brand||"").trim().toLowerCase()];return f?f(p,R):canFaceBase(p,R)}
function canHTML(p,chg){
  var st=function(v,o){return '<stop offset="'+o+'" style="stop-color:var(--s-'+v+')"/>'};
  return '<button type="button" class="packcan'+(chg?' is-new':'')+'" id="pouch" data-act="pick" aria-label="Confezione attiva: '+esc(lab(p))+', '+p.mg+' mg. Tocca per cambiarla">'+
    '<svg viewBox="-150 -146 300 300" aria-hidden="true"><defs><filter id="pc-sh" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="9"/></filter>'+
    '<radialGradient id="pc-rim" cx=".42" cy=".38" r=".75">'+st("wallhi",0)+st("wall",.8)+st("edge",1)+'</radialGradient>'+
    '<radialGradient id="pc-sheen" cx=".3" cy=".25" r=".95"><stop offset="0" stop-color="#fff" stop-opacity=".2"/><stop offset="1" stop-color="#000" stop-opacity=".1"/></radialGradient>'+
    '<radialGradient id="pc-lid" cx=".32" cy=".28" r=".95">'+st("lidhi",0)+st("lid",.72)+'</radialGradient></defs>'+
    canFace(p,134)+'</svg></button>';
}
/* ---------- illustrazioni del gusto ---------- */
function bubbleDefs(){
  function V(v,o){return '<stop offset="@" style="stop-color:var('+v+');stop-opacity:'+o+'"/>'}
  function g(id,cx,cy,r,a){return '<radialGradient id="'+id+'" cx="'+cx+'" cy="'+cy+'" r="'+r+'">'+a.map(function(q){return '<stop offset="'+q[0]+'" style="stop-color:'+q[1]+';stop-opacity:'+q[2]+'"/>'}).join("")+'</radialGradient>'}
  var o="",T=["var(--s-lidhi)","var(--s-fx4)","var(--s-lid)"],i;
  for(i=0;i<3;i++){
    o+=g("bbB"+i,.5,.5,.5,[[0,T[i],.03],[.6,T[i],.1],[.86,T[i],.3],[1,T[i],.62]]);
    o+='<linearGradient id="bbR'+i+'" x1="0" y1="0" x2="1" y2="1">'+
      '<stop offset="0" style="stop-color:'+T[(i+1)%3]+';stop-opacity:.95"/><stop offset=".3" style="stop-color:#fff;stop-opacity:.5"/>'+
      '<stop offset=".55" style="stop-color:'+T[i]+';stop-opacity:.25"/><stop offset=".8" style="stop-color:'+T[(i+2)%3]+';stop-opacity:.7"/><stop offset="1" style="stop-color:#fff;stop-opacity:.85"/></linearGradient>';
  }
  for(i=0;i<3;i++)o+=g("bbO"+i,.5,.5,.5,[[0,T[i],.16],[.78,T[i],.24],[.94,T[i],.46],[1,T[i],.0]]);
  o+=g("bbO3",.5,.5,.5,[[0,"#fff",.14],[.78,"#fff",.22],[.94,"#fff",.42],[1,"#fff",0]]);
  o+=g("bbG",.7,.76,.46,[[0,"#fff",.62],[.45,"#fff",.2],[1,"#fff",0]]);
  o+=g("bbH",.5,.5,.5,[[0,"#fff",.95],[.55,"#fff",.55],[1,"#fff",0]]);
  o+=g("bbK",.5,.5,.5,[[0,"#fff",.55],[1,"#fff",0]]);
  o+=g("bbA",.35,.3,.9,[[0,"#fff",.55],[1,"#fff",0]]);
  o+='<filter id="sc-b3" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="16"/></filter>';
  return o;
}
function fxDefs0(){
  function stops(a){return a.map(function(q){return '<stop offset="'+q[0]+'" stop-color="'+q[1]+'"'+(q[2]!=null?' stop-opacity="'+q[2]+'"':'')+'/>'}).join("")}
  function rg(id,cx,cy,r,a){return '<radialGradient id="'+id+'" cx="'+cx+'" cy="'+cy+'" r="'+r+'">'+stops(a)+'</radialGradient>'}
  function lg(id,x1,y1,x2,y2,a){return '<linearGradient id="'+id+'" x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'">'+stops(a)+'</linearGradient>'}
  return rg("fOrF",.5,.5,.55,[[0,"#ffe58f"],[.5,"#ffb12e"],[1,"#f58a07"]])+rg("fOrR",.5,.5,.5,[[0,"#f79a14"],[1,"#d86a00"]])+
    rg("fLeF",.5,.5,.55,[[0,"#fffbd0"],[.5,"#fdee7a"],[1,"#f5d62e"]])+rg("fLeR",.5,.5,.5,[[0,"#f7d21c"],[1,"#e0b400"]])+
    rg("fLiF",.5,.5,.55,[[0,"#f2fcb4"],[.5,"#b9de45"],[1,"#86bb1c"]])+rg("fLiR",.5,.5,.5,[[0,"#7cb82a"],[1,"#47881a"]])+
    rg("fBnL",.3,.22,.95,[[0,"#c08a60"],[.5,"#744829"],[1,"#2f180a"]])+rg("fBnR",.7,.22,.95,[[0,"#b27c55"],[.5,"#6a4125"],[1,"#2a1509"]])+
    rg("fBdL",.3,.22,.95,[[0,"#8f6040"],[.5,"#4c2c16"],[1,"#1d0e06"]])+rg("fBdR",.7,.22,.95,[[0,"#84583a"],[.5,"#45270f"],[1,"#190b05"]])+
    lg("fLeaf",0,1,0,0,[[0,"#1f7a30"],[.55,"#3fa042"],[1,"#7fcf5e"]])+lg("fIceS",0,0,1,1,[[0,"#f4feff",.78],[.5,"#bfe8f1",.55],[1,"#8ccfe0",.72]])+rg("fBn1",.35,.28,.85,[[0,"#b0774c"],[.45,"#6e4125"],[1,"#2b150a"]])+rg("fBn2",.35,.28,.85,[[0,"#8c5b38"],[.45,"#4d2b16"],[1,"#1c0d06"]])+rg("fBlu2",.4,.3,.85,[[0,"#8aa6dc"],[.5,"#4a68a8"],[1,"#233a76"]])+
    lg("fIceT",0,0,1,1,[[0,"#ffffff",.95],[1,"#d3f1f6",.85]])+lg("fIceL",0,0,0,1,[[0,"#dcf4f9",.7],[1,"#9fdbe8",.6]])+lg("fIceR",0,0,0,1,[[0,"#a9dfeb",.66],[1,"#68bccf",.7]])+
    rg("fFrost",.5,.5,.5,[[0,"#ffffff",.6],[1,"#ffffff",0]])+
    rg("fBlue",.36,.3,.8,[[0,"#8196ea"],[.45,"#3446a8"],[1,"#12184f"]])+rg("fRasp",.35,.3,.8,[[0,"#ff8fa0"],[.45,"#e0264d"],[1,"#7a0e29"]])+
    rg("fBlk",.35,.3,.8,[[0,"#9566b8"],[.4,"#3d1b5e"],[1,"#0e0418"]])+rg("fStr",.38,.3,.85,[[0,"#ff7d8c"],[.4,"#e3213f"],[1,"#850a20"]])+
    rg("fCur",.35,.3,.8,[[0,"#ffb3bd"],[.3,"#ff3a56"],[1,"#98102a"]])+
    lg("fVanP",0,1,0,0,[[0,"#f1d9a0"],[1,"#fff7e4"]])+rg("fVanL",.5,.5,.55,[[0,"#ffd24a"],[.6,"#ffeb99"],[1,"#fff7cf"]])+
    lg("fPchA",0,0,1,1,[[0,"#ffe08a"],[.5,"#ffb25a"],[1,"#f2873f"]])+rg("fPchB",.72,.62,.78,[[0,"#d92f43",.9],[.55,"#ee5a47",.45],[1,"#ff8a55",0]])+rg("fPchF",.5,.55,.55,[[0,"#e4472d"],[.3,"#f67a37"],[.68,"#ffbb4a"],[1,"#ffd978"]])+lg("fStone",0,0,1,1,[[0,"#b9784a"],[1,"#5b3118"]])+
    rg("fCher",.36,.3,.85,[[0,"#e0546b"],[.3,"#a01a3a"],[.65,"#4b0a1e"],[1,"#17030a"]])+
    rg("fGrp",.36,.3,.85,[[0,"#d1a7ec"],[.3,"#8a4cc0"],[.7,"#4a1a7a"],[1,"#1f0838"]])+rg("fBloom",.5,.5,.5,[[0,"#ffffff",.5],[1,"#ffffff",0]])+
    lg("fMngA",0,0,1,1,[[0,"#a8cf3a"],[.35,"#f7d33a"],[.75,"#f7a22d"],[1,"#ee6b2a"]])+rg("fMngB",.75,.7,.7,[[0,"#e8472d",.7],[1,"#f58a2d",0]])+lg("fMngF",0,0,0,1,[[0,"#ffe27a"],[.6,"#ffc42e"],[1,"#ff9f0a"]])+
    lg("fWm",0,0,0,1,[[0,"#ee2d4b"],[.65,"#ff5d77"],[1,"#ff93a2"]])+
    bubbleDefs()+
    '<filter id="sc-sh2" filterUnits="userSpaceOnUse" x="-260" y="-260" width="520" height="520"><feGaussianBlur stdDeviation="1.8"/></filter>'+
    '<filter id="sc-sh" filterUnits="userSpaceOnUse" x="-260" y="-260" width="520" height="520"><feGaussianBlur stdDeviation="5"/></filter>'+
    '<filter id="sc-b1" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="1.8"/></filter>'+
    '<filter id="sc-b2" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="4.5"/></filter>';
}
function fxElem0(kind,i,s){
  var n=nn,PI=Math.PI;
  function P(a){return a.map(function(q){return n(q[0])+" "+n(q[1])}).join("L")}
  function ci(x,y,r,f,o,ex){return '<circle cx="'+n(x)+'" cy="'+n(y)+'" r="'+n(r)+'" fill="'+f+'"'+(o!=null?' opacity="'+o+'"':'')+(ex||'')+'/>'}
  function el(x,y,rx,ry,rot,f,o){return '<ellipse cx="'+n(x)+'" cy="'+n(y)+'" rx="'+n(rx)+'" ry="'+n(ry)+'" fill="'+f+'"'+(o!=null?' opacity="'+o+'"':'')+(rot?' transform="rotate('+rot+' '+n(x)+' '+n(y)+')"':'')+'/>'}
  function spark(x,y,r){return '<path d="M'+n(x)+' '+n(y-r)+'L'+n(x+r*.18)+' '+n(y-r*.18)+'L'+n(x+r)+' '+n(y)+'L'+n(x+r*.18)+' '+n(y+r*.18)+'L'+n(x)+' '+n(y+r)+'L'+n(x-r*.18)+' '+n(y+r*.18)+'L'+n(x-r)+' '+n(y)+'L'+n(x-r*.18)+' '+n(y-r*.18)+'Z" fill="#fff" opacity=".95"/>'}
  function stk(d,col,w,extra){return '<path d="'+d+'" fill="none" stroke="'+col+'" stroke-width="'+n(w)+'" stroke-linecap="round"'+(extra||'')+'/>'}
  function bz(p0,p1,p2,p3,N){var o=[],j,t,u;for(j=0;j<=N;j++){t=j/N;u=1-t;o.push([u*u*u*p0[0]+3*u*u*t*p1[0]+3*u*t*t*p2[0]+t*t*t*p3[0],u*u*u*p0[1]+3*u*u*t*p1[1]+3*u*t*t*p2[1]+t*t*t*p3[1]])}return o}
  function tube(cl,W,wf){
    var N=cl.length,nm=[],j;
    for(j=0;j<N;j++){var a=cl[Math.max(0,j-1)],b=cl[Math.min(N-1,j+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1;nm.push([-dy/l,dx/l])}
    function off(f){return cl.map(function(q,j){var w=W*wf(j/(N-1))/2*f;return [q[0]+nm[j][0]*w,q[1]+nm[j][1]*w]})}
    return {poly:'M'+P(off(1))+'L'+P(off(-1).reverse())+'Z',line:function(f){return 'M'+P(off(f))}}
  }
  /* fetta d'agrume intera: buccia, parte bianca, spicchi succosi */
  function slice(s,type){
    var F={orange:["fOrF","fOrR","#fff6df"],lemon:["fLeF","fLeR","#fffbe3"],lime:["fLiF","fLiR","#f3fbd9"]}[type],N=type==="lemon"?9:10,o,j,k,a;
    o=ci(0,0,s,"url(#"+F[1]+")")+ci(0,0,s*.925,F[2])+ci(0,0,s*.9,"none",null,' stroke="#000" stroke-opacity=".06"')+ci(0,0,s*.85,"url(#"+F[0]+")");
    for(j=0;j<N;j++){
      a=j*PI*2/N+i*.3;
      for(k=0;k<7;k++){var r0=s*(.16+rnd(i*50+j*7+k)*.5),L=s*(.07+rnd(i*50+j*7+k+3)*.13),aa=a+(rnd(i*50+j*7+k+9)-.5)*(PI*2/N)*.7;
        o+='<path d="M'+n(Math.cos(aa)*r0)+' '+n(Math.sin(aa)*r0)+'L'+n(Math.cos(aa)*(r0+L))+' '+n(Math.sin(aa)*(r0+L))+'" stroke="#fff" stroke-opacity=".38" stroke-width="'+n(s*.02)+'" stroke-linecap="round"/>'}
      o+='<path d="M'+n(Math.cos(a)*s*.07)+' '+n(Math.sin(a)*s*.07)+'L'+n(Math.cos(a)*s*.85)+' '+n(Math.sin(a)*s*.85)+'" stroke="'+F[2]+'" stroke-width="'+n(s*.035)+'" stroke-linecap="round"/>';
    }
    o+=ci(0,0,s*.075,F[2])+el(-s*.3,-s*.34,s*.34,s*.13,-38,"#fff",.2)+
      '<path d="M'+n(-s*.78)+' '+n(-s*.2)+'A'+n(s*.8)+' '+n(s*.8)+' 0 0 1 '+n(-s*.2)+' '+n(-s*.78)+'" fill="none" stroke="#fff" stroke-width="'+n(s*.045)+'" stroke-linecap="round" opacity=".55"/>';
    return {art:o,sil:'<circle r="'+n(s)+'"/>'};
  }
  /* spicchio: buccia, parte bianca spessa, polpa a vescicole */
  function wedge(s,type){
    var F={orange:["fOrF","fOrR","#fff6df"],lemon:["fLeF","fLeR","#fffbe3"],lime:["fLiF","fLiR","#f3fbd9"]}[type],R=s*1.2,a1=-132*PI/180,a2=-48*PI/180,o,j,N=7,oy=-s*.05,A1=a1+.1,A2=a2-.1;
    function sec(r,b1,b2,ox,oy2){return 'M'+n(ox)+' '+n(oy2)+'L'+n(ox+Math.cos(b1)*r)+' '+n(oy2+Math.sin(b1)*r)+'A'+n(r)+' '+n(r)+' 0 0 1 '+n(ox+Math.cos(b2)*r)+' '+n(oy2+Math.sin(b2)*r)+'Z'}
    var sh=sec(R,a1,a2,0,0);
    o='<path d="'+sh+'" fill="url(#'+F[1]+')" stroke="url(#'+F[1]+')" stroke-width="'+n(s*.05)+'" stroke-linejoin="round"/>'+
      '<path d="'+sec(R*.93,a1,a2,0,0)+'" fill="'+F[2]+'" stroke="'+F[2]+'" stroke-width="'+n(s*.05)+'" stroke-linejoin="round"/>'+
      '<path d="'+sec(R*.85,A1,A2,0,oy)+'" fill="url(#'+F[0]+')" stroke="url(#'+F[0]+')" stroke-width="'+n(s*.06)+'" stroke-linejoin="round"/>';
    for(j=1;j<N;j++){var aa=A1+(A2-A1)*j/N;o+='<path d="M'+n(Math.cos(aa)*s*.06)+' '+n(oy+Math.sin(aa)*s*.06)+'L'+n(Math.cos(aa)*R*.83)+' '+n(oy+Math.sin(aa)*R*.83)+'" stroke="'+F[2]+'" stroke-width="'+n(s*.04)+'" stroke-linecap="round"/>'}
    for(j=0;j<34;j++){var ab=A1+(A2-A1)*rnd(i*60+j),r0=R*(.14+rnd(i*60+j+4)*.6),Ln=R*(.06+rnd(i*60+j+8)*.1);
      o+='<path d="M'+n(Math.cos(ab)*r0)+' '+n(oy+Math.sin(ab)*r0)+'L'+n(Math.cos(ab)*(r0+Ln))+' '+n(oy+Math.sin(ab)*(r0+Ln))+'" stroke="#fff" stroke-opacity=".42" stroke-width="'+n(s*.022)+'" stroke-linecap="round"/>'}
    o+='<path d="M'+n(Math.cos(a1+.2)*R*.97)+' '+n(Math.sin(a1+.2)*R*.97)+'A'+n(R*.97)+' '+n(R*.97)+' 0 0 1 '+n(Math.cos(a1+.55)*R*.97)+' '+n(Math.sin(a1+.55)*R*.97)+'" fill="none" stroke="#fff" stroke-width="'+n(s*.04)+'" stroke-linecap="round" opacity=".5"/>';
    return {art:'<g transform="translate(0 '+n(R*.42)+')">'+o+'</g>',sil:'<g transform="translate(0 '+n(R*.42)+')"><path d="'+sh+'"/></g>'};
  }
  /* cubetto di ghiaccio visto dall'alto: smussato, opaco al centro, bolle e riflessi; a volte con una foglia di menta congelata dentro */
  function cube(s){
    var a=s*.8,r=a*.3,o,j;
    function rr(k,f,ex){return '<rect x="'+n(-a*k)+'" y="'+n(-a*k)+'" width="'+n(2*a*k)+'" height="'+n(2*a*k)+'" rx="'+n(r*k)+'" fill="'+f+'"'+(ex||'')+'/>'}
    o=rr(1,"url(#fIceS)",' stroke="#86cde0" stroke-width="'+n(s*.05)+'"')+rr(.86,"url(#fFrost)")+rr(.9,"none",' stroke="#fff" stroke-opacity=".5" stroke-width="1.2"')+
      el(-a*.2,a*.12,a*.55,a*.36,20,"#fff",.34)+el(a*.28,-a*.22,a*.4,a*.24,-30,"#fff",.24);
    o+='<path d="M'+n(a*.88)+' '+n(-a*.4)+'L'+n(a*.88)+' '+n(a*.45)+'Q'+n(a*.88)+' '+n(a*.88)+' '+n(a*.45)+' '+n(a*.88)+'L'+n(-a*.4)+' '+n(a*.88)+'" fill="none" stroke="#4fa6bd" stroke-width="'+n(s*.07)+'" stroke-linecap="round" opacity=".4"/>';
    if(i%2===0){var lf=leaf(s*.44);o+='<g transform="translate('+n(a*.04)+' '+n(a*.06)+') rotate('+((i*53)%360)+')" opacity=".92">'+lf.art+'</g>'+rr(.84,"#eafcff",' opacity=".2"')}
    for(j=0;j<30;j++){var x=(rnd(i*70+j)*2-1)*a*.8,y=(rnd(i*70+j+5)*2-1)*a*.8;o+=ci(x,y,s*(.01+rnd(i*70+j+9)*.02),"#fff",.35+rnd(i*70+j+2)*.4)}
    for(j=0;j<14;j++){var bx=-a*.7+rnd(i*80+j)*a*1.1,by=-a*.1+rnd(i*80+j+3)*a*.85,br=s*(.016+rnd(i*80+j+7)*.04);
      o+=ci(bx,by,br,"#fff",.3)+ci(bx,by,br,"none",null,' stroke="#fff" stroke-width=".8" stroke-opacity=".85"')+ci(bx-br*.3,by-br*.3,br*.25,"#fff",.9)}
    o+='<path d="M'+n(-a*.5)+' '+n(a*.1)+'L'+n(-a*.25)+' '+n(a*.28)+'L'+n(-a*.34)+' '+n(a*.5)+'M'+n(a*.3)+' '+n(-a*.4)+'L'+n(a*.45)+' '+n(-a*.15)+'" fill="none" stroke="#fff" stroke-width="1" opacity=".6" stroke-linecap="round" stroke-linejoin="round"/>'+
      '<path d="M'+n(-a*.58)+' '+n(-a*.9)+'L'+n(a*.68)+' '+n(-a*.9)+'" stroke="#fff" stroke-width="'+n(s*.075)+'" stroke-linecap="round" opacity=".85"/>'+
      '<path d="M'+n(-a*.9)+' '+n(-a*.5)+'L'+n(-a*.9)+' '+n(a*.3)+'" stroke="#fff" stroke-width="'+n(s*.05)+'" stroke-linecap="round" opacity=".55"/>'+
      '<path d="M'+n(a*.55)+' '+n(-a*.7)+'L'+n(a*.85)+' '+n(-a*.4)+'" stroke="#fff" stroke-width="'+n(s*.04)+'" stroke-linecap="round" opacity=".7"/>'+
      spark(-a*.62,-a*.62,s*.1);
    return {art:o,sil:'<rect x="'+n(-a)+'" y="'+n(-a)+'" width="'+n(2*a)+'" height="'+n(2*a)+'" rx="'+n(r)+'"/>'};
  }
  /* foglia di menta: venature fitte, superficie bollosa, gocce d'acqua */
  function leaf(s){
    var N=26,R=[],Lf=[],j,u,wr,tt;
    for(j=0;j<=N;j++){u=j/N;wr=s*.74*Math.pow(Math.max(0,Math.sin(PI*Math.pow(u,.78))),.85);tt=(j%2)*s*.05*Math.sin(PI*u);R.push([wr+tt,s-2*s*u]);Lf.push([-(wr*.93+tt),s-2*s*u])}
    var outl='M'+P(R)+'L'+P(Lf.slice().reverse())+'Z',o,y0;
    o='<path d="M0 '+n(s*.98)+'L'+n(s*.02)+' '+n(s*1.32)+'" stroke="#5f8f3d" stroke-width="'+n(s*.07)+'" stroke-linecap="round"/><path d="'+outl+'" fill="url(#fLeaf)"/>'+
      '<path d="M0 '+n(s)+'L'+P(R)+'Z" fill="#06240a" opacity=".22"/>';
    for(j=0;j<30;j++){var uu=rnd(i*40+j),yy=s*(.85-uu*1.6),ww=s*.74*Math.pow(Math.max(0,Math.sin(PI*Math.pow((s-yy)/(2*s),.78))),.85)*.82,xx=(rnd(i*40+j+7)*2-1)*ww,ra=rnd(i*40+j+3)*180;
      o+=el(xx,yy,s*.075,s*.045,ra,"#0d4416",.22)+el(xx-s*.016,yy-s*.016,s*.045,s*.024,ra,"#cdf3a6",.26)}
    o+='<path d="M0 '+n(s*1.05)+'L0 '+n(-s*.9)+'" stroke="#d4efae" stroke-width="'+n(s*.05)+'" stroke-linecap="round" opacity=".9"/><path d="M'+n(s*.03)+' '+n(s*.9)+'L'+n(s*.03)+' '+n(-s*.8)+'" stroke="#16501d" stroke-width="'+n(s*.02)+'" opacity=".5"/>';
    for(j=0;j<8;j++){y0=s*(.72-j*.21);u=(s-y0)/(2*s);var w=s*.74*Math.pow(Math.max(0,Math.sin(PI*Math.pow(Math.min(1,u+.12),.78))),.85);
      o+='<path d="M0 '+n(y0)+'Q'+n(w*.5)+' '+n(y0-s*.04)+' '+n(w*.88)+' '+n(y0-s*.26)+'M0 '+n(y0)+'Q'+n(-w*.46)+' '+n(y0-s*.04)+' '+n(-w*.82)+' '+n(y0-s*.26)+'" fill="none" stroke="#c9e8a4" stroke-width="'+n(s*.03)+'" stroke-linecap="round" opacity=".62"/>'+
        '<path d="M0 '+n(y0)+'Q'+n(w*.5)+' '+n(y0-s*.04)+' '+n(w*.88)+' '+n(y0-s*.26)+'M0 '+n(y0)+'Q'+n(-w*.46)+' '+n(y0-s*.04)+' '+n(-w*.82)+' '+n(y0-s*.26)+'" fill="none" stroke="#0f4a18" stroke-width="'+n(s*.012)+'" opacity=".4" transform="translate('+n(s*.012)+' '+n(s*.012)+')"/>'}
    [[.15,-.2,.07],[-.22,.3,.05],[.1,.55,.04]].forEach(function(d){o+=ci(d[0]*s,d[1]*s,d[2]*s,"#fff",.16)+ci(d[0]*s,d[1]*s,d[2]*s,"none",null,' stroke="#fff" stroke-width=".8" stroke-opacity=".8"')+ci((d[0]-d[2]*.3)*s,(d[1]-d[2]*.3)*s,d[2]*s*.28,"#fff",.9)});
    o+='<path d="M'+n(-s*.32)+' '+n(s*.5)+'Q'+n(-s*.52)+' 0 '+n(-s*.24)+' '+n(-s*.6)+'" fill="none" stroke="#fff" stroke-width="'+n(s*.07)+'" stroke-linecap="round" opacity=".22"/>';
    return {art:o,sil:'<path d="'+outl+'"/>'};
  }
  /* chicco di caffè tostato: ovale pieno, fessura centrale, riflessi d'olio; qualche chicco è visto dal dorso */
  function bean(s){
    var back=i%5===3,dark=i%2===1,a=s*.7,b=s,o,g=dark?"fBn2":"fBn1";
    var shape='M0 '+n(-b)+'C'+n(a*.62)+' '+n(-b)+' '+n(a)+' '+n(-b*.45)+' '+n(a)+' '+n(b*.05)+'C'+n(a)+' '+n(b*.6)+' '+n(a*.6)+' '+n(b)+' 0 '+n(b)+'C'+n(-a*.62)+' '+n(b)+' '+n(-a)+' '+n(b*.55)+' '+n(-a)+' '+n(-b*.05)+'C'+n(-a)+' '+n(-b*.5)+' '+n(-a*.62)+' '+n(-b)+' 0 '+n(-b)+'Z';
    o='<path d="'+shape+'" fill="url(#'+g+')" stroke="#1a0b04" stroke-opacity=".55" stroke-width="'+n(s*.03)+'"/>';
    if(!back){
      var cd='M'+n(s*.02)+' '+n(-b*.86)+'C'+n(s*.12)+' '+n(-b*.45)+' '+n(-s*.1)+' '+n(b*.4)+' '+n(-s*.01)+' '+n(b*.86);
      o+=stk(cd,"#2a1307",s*.17)+stk(cd,"#0d0502",s*.1)+stk(cd,"#b3733f",s*.026,' opacity=".75" transform="translate('+n(-s*.095)+' '+n(-s*.01)+')"')+stk(cd,"#e0a468",s*.02,' opacity=".5" transform="translate('+n(s*.105)+' '+n(s*.01)+')"');
    }else{
      o+='<path d="M'+n(-a*.55)+' '+n(-b*.55)+'Q'+n(-a*.25)+' '+n(b*.3)+' '+n(a*.1)+' '+n(b*.72)+'" fill="none" stroke="#000" stroke-width="'+n(s*.04)+'" stroke-linecap="round" opacity=".22"/>';
    }
    o+=el(-a*.42,-b*.4,a*.16,b*.32,-12,"#fff",dark?.3:.42)+el(-a*.5,b*.28,a*.07,b*.14,-12,"#fff",.2)+el(a*.45,-b*.5,a*.09,b*.12,14,"#fff",.22)+
      '<path d="M'+n(a*.9)+' '+n(b*.1)+'C'+n(a*.9)+' '+n(b*.55)+' '+n(a*.5)+' '+n(b*.9)+' '+n(a*.1)+' '+n(b*.97)+'" fill="none" stroke="#ffb06a" stroke-opacity=".28" stroke-width="'+n(s*.04)+'" stroke-linecap="round"/>';
    return {art:o,sil:'<path d="'+shape+'"/>'};
  }
  /* fragola: forma piena, semini gialli nelle fossette, calice aperto e gambo lungo */
  function strawberry(s){
    var N=34,R=[],Lf=[],j,y,hw,o,x,row=0,H=2.1*s,y0=-s;
    function HW(y){var t=(y-y0)/H;if(t<=0||t>=1)return 0;return s*.95*Math.pow(1-Math.pow(t,1.7),.7)*Math.pow(Math.sin(Math.min(1,t/.34)*PI/2),.62)}
    for(j=0;j<=N;j++){y=y0+H*j/N;hw=HW(y);R.push([hw,y]);Lf.push([-hw,y])}
    var d='M'+P(R)+'L'+P(Lf.slice().reverse())+'Z';
    o='<path d="M0 '+n(y0)+'C'+n(s*.05)+' '+n(y0-s*.5)+' '+n(s*.4)+' '+n(y0-s*.95)+' '+n(s*.85)+' '+n(y0-s*1.2)+'" fill="none" stroke="#4f8f2e" stroke-width="'+n(s*.085)+'" stroke-linecap="round"/>'+
      '<path d="M0 '+n(y0)+'C'+n(s*.05)+' '+n(y0-s*.5)+' '+n(s*.4)+' '+n(y0-s*.95)+' '+n(s*.85)+' '+n(y0-s*1.2)+'" fill="none" stroke="#9bd66d" stroke-width="'+n(s*.02)+'" stroke-linecap="round" opacity=".7" transform="translate('+n(-s*.02)+' '+n(-s*.02)+')"/>'+
      '<path d="'+d+'" fill="url(#fStr)"/>';
    for(y=y0+.2*s;y<y0+H*.95;y+=.19*s){row++;hw=HW(y)*.9;var sc=1-.35*((y-y0)/H);
      for(x=-hw+(row%2?.1*s:0);x<hw;x+=.2*s){var jx=(rnd(i*90+row*13+Math.round(x*3))-.5)*.03*s;
        o+=el(x+jx,y+s*.012,s*.037*sc,s*.05*sc,0,"#7a0c1e",.45)+el(x+jx,y,s*.02*sc,s*.03*sc,0,"#ffd77a")}}
    o+=el(-s*.4,-s*.2,s*.32,s*.14,-50,"#fff",.3)+'<path d="'+d+'" fill="none" stroke="#5c0716" stroke-opacity=".35" stroke-width="'+n(s*.03)+'" stroke-linejoin="round"/>';
    var k,lf='M0 0Q'+n(s*.17)+' '+n(-s*.22)+' 0 '+n(-s*.5)+'Q'+n(-s*.17)+' '+n(-s*.22)+' 0 0Z';
    for(k=0;k<8;k++){var ang=k*45+(rnd(i*9+k)-.5)*20;o+='<g transform="translate(0 '+n(y0+s*.05)+') rotate('+n(ang)+')"><path d="'+lf+'" fill="#5fb148" stroke="#2c7a2b" stroke-width="'+n(s*.02)+'" stroke-linejoin="round"/><path d="M0 '+n(-s*.05)+'L0 '+n(-s*.42)+'" stroke="#2c7a2b" stroke-width="'+n(s*.014)+'" opacity=".6"/></g>'}
    o+=ci(0,y0+s*.05,s*.07,"#3f8a30");
    return {art:o,sil:'<path d="'+d+'"/>'};
  }
  function drupes(s,g,rx,ry,hi,rf,tp){
    var cells=[],x,y,r=s*rf,o=el(0,s*.02,rx*.92,ry*.94,0,g==="fBlk"?"#14061d":"#4a0b1c",.97);
    for(y=-10;y<=10;y++)for(x=-9;x<=9;x++){var cy=y*r*1.2+(rnd(i*70+y*11+x+2)-.5)*r*.3,wsc=tp?1-.24*((cy/ry)+1)/2:1,cx=(x+(y%2?.5:0))*r*1.5+(rnd(i*70+y*11+x)-.5)*r*.3,k=Math.pow(cx/(rx*wsc),2)+Math.pow((cy+s*.02)/ry,2);if(k<1)cells.push([cx,cy,1-k*.3])}
    cells.sort(function(a,b){return a[1]-b[1]});
    cells.forEach(function(q){var rr=r*q[2];o+=ci(q[0],q[1],rr,"url(#"+g+")",null,' stroke="#000" stroke-opacity=".35" stroke-width=".7"')+ci(q[0]-rr*.32,q[1]-rr*.36,rr*.28,"#fff",hi)});
    return {art:o,sil:'<ellipse rx="'+n(rx)+'" ry="'+n(ry)+'"/>'};
  }
  /* mirtillo: opaco, fiorito, con la corona a stella */
  function blueb(s){
    var o=ci(0,0,s,"url(#fBlu2)")+ci(-s*.2,-s*.25,s*.7,"#e6eeff",.15),j,pts=[],cx=-s*.04,cy=-s*.06;
    for(j=0;j<22;j++)o+=ci((rnd(i*33+j)*2-1)*s*.8,(rnd(i*33+j+4)*2-1)*s*.8,s*(.02+rnd(i*33+j+8)*.03),"#fff",.08+rnd(i*33+j+1)*.1);
    for(j=0;j<10;j++){var rr=j%2?s*.12:s*.3,aa=j/10*PI*2-PI/2+.2;pts.push([cx+Math.cos(aa)*rr,cy+Math.sin(aa)*rr*.92])}
    o+=ci(cx,cy,s*.36,"#1b2b60",.32)+ci(cx,cy,s*.36,"none",null,' stroke="#6e89c4" stroke-width="'+n(s*.03)+'" stroke-opacity=".5"')+
      '<path d="M'+P(pts)+'Z" fill="#141f4b" stroke="#6e89c4" stroke-width="'+n(s*.025)+'" stroke-linejoin="round" stroke-opacity=".7"/>'+
      el(-s*.42,-s*.5,s*.2,s*.1,-35,"#fff",.24)+
      '<path d="M'+n(s*.82)+' '+n(s*.2)+'A'+n(s*.84)+' '+n(s*.84)+' 0 0 1 '+n(s*.2)+' '+n(s*.82)+'" fill="none" stroke="#a6b9ee" stroke-width="'+n(s*.05)+'" opacity=".25" stroke-linecap="round"/>';
    return {art:o,sil:'<circle r="'+n(s)+'"/>'};
  }
  /* radice di liquirizia: bastoncino fibroso con taglio giallo */
  function root(s){
    var L=s*.95,bow=(rnd(i*5+1)-.5)*s*.5,w=s*.44,d='M'+n(-L)+' 0Q0 '+n(bow)+' '+n(L)+' '+n(-bow*.2),o,j,
      ang1=Math.atan2(bow,L)*180/PI,ang2=Math.atan2(-bow*.2-bow,L)*180/PI;
    o=stk(d,"#5f3b1b",w,' stroke-linecap="butt"')+stk(d,"#8e5f2f",w*.84,' stroke-linecap="butt"')+stk(d,"#b98b4c",w*.5,' stroke-linecap="butt" transform="translate(0 '+n(-w*.1)+')"')+stk(d,"#e6cc92",w*.14,' stroke-linecap="butt" opacity=".75" transform="translate(0 '+n(-w*.2)+')"');
    for(j=-3;j<=3;j++)if(j)o+=stk(d,"#3e250f",s*.012,' stroke-linecap="butt" opacity=".5" transform="translate(0 '+n(j*w*.12)+')"');
    for(j=0;j<7;j++){var t=.1+rnd(i*20+j)*.8,x=-L+2*L*t,y=2*(1-t)*t*bow+t*t*(-bow*.2);o+='<path d="M'+n(x)+' '+n(y-w*.3)+'l'+n(s*.03)+' '+n(w*.3)+'" stroke="#3e250f" stroke-width="'+n(s*.012)+'" opacity=".45"/>'}
    function cut(x,y,ang){var g='<g transform="translate('+n(x)+' '+n(y)+') rotate('+n(ang)+')">'+el(0,0,w*.12,w*.5,0,"#b88a43")+el(0,0,w*.09,w*.44,0,"#f1dc8f"),k;
      for(k=0;k<6;k++){var aa=k/6*PI;g+='<path d="M'+n(-Math.sin(aa)*w*.04)+' '+n(-Math.cos(aa)*w*.4)+'L'+n(Math.sin(aa)*w*.04)+' '+n(Math.cos(aa)*w*.4)+'" stroke="#c39a4d" stroke-width=".7" opacity=".7"/>'}
      return g+el(0,0,w*.03,w*.18,0,"#caa357",.7)+'</g>'}
    o+=cut(-L,0,ang1)+cut(L,-bow*.2,ang2);
    return {art:o,sil:stk(d,"var(--s-shadow)",w)};
  }
  /* girella di liquirizia: nastro lucido a spirale stretta con la coda */
  function wheel(s){
    var d="",j,tt,rr,w=s*.2,T=4.6,M=160,ex=0,ey=0;
    for(j=0;j<=M;j++){tt=j/M*T*PI*2;rr=s*.1+tt/(T*PI*2)*s*.84;ex=Math.cos(tt)*rr;ey=Math.sin(tt)*rr;d+=(j?"L":"M")+n(ex)+" "+n(ey)}
    var te=T*PI*2;d+="L"+n(ex-Math.sin(te)*s*.32)+" "+n(ey+Math.cos(te)*s*.32);
    var o=stk(d,"#07040b",w*1.06,' opacity=".55" transform="translate('+n(s*.03)+' '+n(s*.045)+')"')+stk(d,"#0a0710",w)+stk(d,"#1b1623",w*.84)+stk(d,"#312a3d",w*.5,' transform="translate('+n(-s*.012)+' '+n(-s*.02)+')"')+
      stk(d,"#7a6c92",w*.14,' opacity=".75" stroke-dasharray="'+n(s*.28)+' '+n(s*2.1)+'" transform="translate('+n(-s*.03)+' '+n(-s*.04)+')"')+el(-s*.28,-s*.32,s*.34,s*.13,-40,"#fff",.1);
    return {art:o,sil:'<circle r="'+n(s*.98)+'"/>'};
  }
  /* baccello di vaniglia: lungo, rugoso, affusolato, con la punta ricurva */
  function pod1(L,W,flip){
    var A=bz([0,0],[0,-.35*L],[L*.05,-.7*L],[0,-.9*L],18),B=bz([0,-.9*L],[-L*.02,-1.04*L],[L*.14,-1.08*L],[L*.18,-.98*L],8).slice(1),cl=A.concat(B),f,o,
      wf=function(t){return t<.1?.78+.22*t/.1:t>.72?Math.max(.12,1-(t-.72)/.28*.88):1},T=tube(cl,W,wf),T2=tube(cl,W*.62,wf),T3=tube(cl,W*.26,wf);
    o='<path d="'+T.poly+'" fill="#170b06"/><path d="'+T2.poly+'" fill="#3a2012" transform="translate('+n(-W*.1)+' '+n(-W*.04)+')"/><path d="'+T3.poly+'" fill="#6b4529" opacity=".75" transform="translate('+n(-W*.22)+' '+n(-W*.04)+')"/>';
    [-.62,-.3,0,.3,.62].forEach(function(f){o+='<path d="'+T.line(f)+'" fill="none" stroke="#0b0402" stroke-width="'+n(W*.04)+'" opacity=".55" stroke-linecap="round"/>'});
    o+='<path d="'+T.line(-.5)+'" fill="none" stroke="#a37751" stroke-width="'+n(W*.035)+'" opacity=".5" stroke-linecap="round"/><ellipse cx="0" cy="0" rx="'+n(W*.34)+'" ry="'+n(W*.14)+'" fill="#6a4429"/>';
    return {art:o,poly:T.poly};
  }
  function pod(s){
    var o="",sl="",cfg=[[-11,1,1,-.55],[1,.93,-1,0],[12,.86,1,.6]],L0=s*1.65,W=s*.27;
    cfg.forEach(function(c){var g=pod1(L0*c[1],W),tr='translate('+n(c[3]*W*1.5)+' '+n(L0*.5)+') rotate('+c[0]+') scale('+c[2]+' 1)';
      o+='<g transform="'+tr+'">'+g.art+'</g>';sl+='<g transform="'+tr+'"><path d="'+g.poly+'"/></g>'});
    return {art:o,sil:sl};
  }
  /* fiore di vaniglia: cinque petali crema, labello rosato */
  function vflower(s){
    var o="",k,arm='M0 0C'+n(s*.38)+' '+n(-s*.1)+' '+n(s*.42)+' '+n(-s*.72)+' 0 '+n(-s)+'C'+n(-s*.42)+' '+n(-s*.72)+' '+n(-s*.38)+' '+n(-s*.1)+' 0 0Z';
    for(k=0;k<5;k++){o+='<g transform="rotate('+(k*72)+')"><path d="'+arm+'" fill="url(#fVanP)" stroke="#e2c98c" stroke-width="'+n(s*.015)+'"/>'+[-.14,0,.14].map(function(f){return '<path d="M0 '+n(-s*.08)+'Q'+n(s*f*.9)+' '+n(-s*.5)+' '+n(s*f*.45)+' '+n(-s*.88)+'" fill="none" stroke="#d8bd7e" stroke-width="'+n(s*.01)+'" opacity=".6"/>'}).join("")+'</g>'}
    o+=ci(0,0,s*.26,"#f9ecd0")+ci(0,0,s*.2,"#f3c7a0",.9)+ci(0,s*.02,s*.12,"#e58f66",.8)+el(0,-s*.03,s*.07,s*.05,0,"#fff0c2")+el(-s*.08,-s*.1,s*.07,s*.035,-30,"#fff",.55);
    return {art:o,sil:'<circle r="'+n(s*.95)+'"/>'};
  }
  function bokeh(s,i){var v=(i||0)%4;return {art:ci(0,0,s,"url(#bbO"+v+")"),sil:""}}
  function bubble(s,i){
    var v=((i||0)%3+3)%3,w=n(s*.07),o="",r=s,pt=function(a,k){a=a*PI/180;return n(Math.cos(a)*r*k)+" "+n(Math.sin(a)*r*k)};
    o+=ci(0,0,r,"url(#bbB"+v+")");                                         /* corpo: vuoto al centro, denso al bordo */
    o+=ci(0,0,r,"url(#bbG)");                                              /* luce rifratta in basso a destra */
    o+='<circle r="'+n(r-s*.035)+'" fill="none" stroke="url(#bbR'+v+')" stroke-width="'+w+'"/>';   /* pellicola iridescente */
    o+='<circle r="'+n(r)+'" fill="none" stroke="#fff" stroke-width=".8" opacity=".45"/>';
    o+='<path d="M'+pt(200,.8)+'A'+n(r*.8)+' '+n(r*.8)+' 0 0 1 '+pt(262,.8)+'" fill="none" stroke="#fff" stroke-width="'+n(s*.075)+'" stroke-linecap="round" opacity=".9"/>';   /* riflesso ad arco */
    o+='<path d="M'+pt(18,.82)+'A'+n(r*.82)+' '+n(r*.82)+' 0 0 1 '+pt(58,.82)+'" fill="none" stroke="#fff" stroke-width="'+n(s*.04)+'" stroke-linecap="round" opacity=".55"/>';
    o+=el(-r*.38,-r*.42,r*.2,r*.1,-38,"url(#bbH)",1);                      /* finestra di luce */
    o+=ci(-r*.62,-r*.12,r*.045,"#fff",.9);
    return {art:o,sil:'<circle r="'+n(r)+'"/>'}}
  /* foglia lanceolata rivolta verso l'alto, con nervatura e venature laterali */
  function lance(L,W,fill,rib){
    var o='<path d="M0 0C'+n(W)+' '+n(-L*.3)+' '+n(W*1.05)+' '+n(-L*.75)+' 0 '+n(-L)+'C'+n(-W*1.05)+' '+n(-L*.75)+' '+n(-W)+' '+n(-L*.3)+' 0 0Z" fill="'+fill+'"/>'+
      '<path d="M0 0C'+n(W*.9)+' '+n(-L*.3)+' '+n(W*.95)+' '+n(-L*.7)+' 0 '+n(-L)+'L0 0Z" fill="#fff" opacity=".12"/>',k,y;
    for(k=1;k<=3;k++){y=-L*(.12+.2*k);o+='<path d="M0 '+n(y)+'Q'+n(W*.4)+' '+n(y-L*.03)+' '+n(W*.72)+' '+n(y-L*.14)+'M0 '+n(y)+'Q'+n(-W*.4)+' '+n(y-L*.03)+' '+n(-W*.72)+' '+n(y-L*.14)+'" fill="none" stroke="'+rib+'" stroke-width="'+n(Math.max(.7,W*.05))+'" stroke-linecap="round" opacity=".4"/>'}
    return o+'<path d="M0 '+n(-L*.02)+'L0 '+n(-L*.94)+'" stroke="'+rib+'" stroke-width="'+n(Math.max(.9,W*.09))+'" stroke-linecap="round" opacity=".75"/>';
  }
  /* rametto di menta verde: stelo con coppie di foglie appuntite */
  function sprig(s){
    var o='<path d="M'+n(s*.02)+' '+n(s*1.05)+'C'+n(-s*.06)+' '+n(s*.3)+' '+n(s*.06)+' '+n(-s*.4)+' 0 '+n(-s*.78)+'" fill="none" stroke="#4d8a34" stroke-width="'+n(s*.06)+'" stroke-linecap="round"/>',
      L=[[.74,.5,.2,52],[.28,.6,.24,46],[-.2,.58,.24,38]],sg;
    L.forEach(function(q){[-1,1].forEach(function(sd){o+='<g transform="translate('+n(sd*s*.02)+' '+n(q[0]*s)+') rotate('+(sd*q[3])+')">'+lance(q[1]*s,q[2]*s,"url(#fLeaf)","#d4efae")+'</g>'})});
    o+='<g transform="translate(0 '+n(-s*.74)+')">'+lance(s*.5,s*.19,"url(#fLeaf)","#d4efae")+'</g>';
    return {art:o,sil:'<g transform="translate(0 '+n(-s*.1)+')"><ellipse rx="'+n(s*.7)+'" ry="'+n(s*.95)+'"/></g>'};
  }
  /* pesca: frutto vellutato con la fossetta, giallo che vira al rosso, foglia; oppure mezza pesca col nocciolo */
  function peach(s){
    var v=i%3,o,j,sk='M0 '+n(-s*.74)+'C'+n(s*.26)+' '+n(-s*1.02)+' '+n(s*1.0)+' '+n(-s*.82)+' '+n(s*.98)+' '+n(-s*.02)+'C'+n(s*.96)+' '+n(s*.6)+' '+n(s*.52)+' '+n(s*1.0)+' 0 '+n(s*1.0)+'C'+n(-s*.52)+' '+n(s*1.0)+' '+n(-s*.96)+' '+n(s*.6)+' '+n(-s*.98)+' '+n(-s*.02)+'C'+n(-s*1.0)+' '+n(-s*.82)+' '+n(-s*.26)+' '+n(-s*1.02)+' 0 '+n(-s*.74)+'Z';
    if(v===1){
      o=ci(0,0,s,"url(#fPchA)")+ci(0,0,s,"url(#fPchB)")+ci(0,0,s*.9,"url(#fPchF)");
      for(j=0;j<26;j++){var a=rnd(i*30+j)*PI*2,r0=s*(.38+rnd(i*30+j+5)*.1),r1=s*(.62+rnd(i*30+j+9)*.24);
        o+='<path d="M'+n(Math.cos(a)*r0)+' '+n(Math.sin(a)*r0)+'L'+n(Math.cos(a)*r1)+' '+n(Math.sin(a)*r1)+'" stroke="#d6381f" stroke-opacity=".3" stroke-width="'+n(s*.015)+'" stroke-linecap="round"/>'}
      o+='<g transform="rotate(22)">'+el(0,0,s*.3,s*.43,0,"url(#fStone)")+el(0,0,s*.3,s*.43,0,"none").replace('fill="none"','fill="none" stroke="#3a1d0c" stroke-opacity=".6" stroke-width="'+n(s*.025)+'"');
      for(j=0;j<7;j++){var y=-s*.3+j*s*.1,x=s*.2*Math.sin(j*1.9+i);o+='<path d="M'+n(-s*.17+x*.3)+' '+n(y)+'Q'+n(x)+' '+n(y-s*.05)+' '+n(s*.17+x*.2)+' '+n(y+s*.02)+'" fill="none" stroke="#3a1d0c" stroke-width="'+n(s*.018)+'" stroke-linecap="round" opacity=".55"/>'}
      o+=el(-s*.1,-s*.2,s*.08,s*.17,0,"#fff",.3)+'</g>'+
        '<path d="M'+n(-s*.78)+' '+n(-s*.3)+'A'+n(s*.84)+' '+n(s*.84)+' 0 0 1 '+n(-s*.3)+' '+n(-s*.78)+'" fill="none" stroke="#fff" stroke-width="'+n(s*.05)+'" stroke-linecap="round" opacity=".5"/>';
      return {art:o,sil:'<circle r="'+n(s)+'"/>'};
    }
    o='<path d="'+sk+'" fill="url(#fPchA)"/><path d="'+sk+'" fill="url(#fPchB)"/>'+
      '<path d="M0 '+n(-s*.74)+'C'+n(s*.14)+' '+n(-s*.3)+' '+n(s*.2)+' '+n(s*.3)+' '+n(s*.03)+' '+n(s*.84)+'" fill="none" stroke="#b92f22" stroke-width="'+n(s*.05)+'" stroke-linecap="round" opacity=".4"/>'+
      '<path d="M'+n(-s*.03)+' '+n(-s*.7)+'C'+n(s*.1)+' '+n(-s*.3)+' '+n(s*.15)+' '+n(s*.3)+' '+n(-s*.02)+' '+n(s*.82)+'" fill="none" stroke="#fff" stroke-width="'+n(s*.02)+'" stroke-linecap="round" opacity=".25"/>'+
      el(-s*.5,-s*.32,s*.3,s*.15,-42,"#fff",.4)+el(-s*.55,s*.2,s*.06,s*.14,-10,"#fff",.25)+
      '<path d="'+sk+'" fill="none" stroke="#a52f1d" stroke-opacity=".3" stroke-width="'+n(s*.03)+'"/>'+
      '<path d="M0 '+n(-s*.72)+'Q'+n(s*.03)+' '+n(-s*.88)+' '+n(s*.1)+' '+n(-s*1.0)+'" fill="none" stroke="#6b3d1e" stroke-width="'+n(s*.07)+'" stroke-linecap="round"/>'+
      '<g transform="translate('+n(s*.08)+' '+n(-s*.9)+') rotate('+(v===0?52:-48)+')">'+lance(s*1.0,s*.3,"#4f9d3d","#d8f2a8")+'</g>';
    return {art:o,sil:'<path d="'+sk+'"/>'};
  }
  /* ciliegia nera: lucida, con fossetta, due frutti sullo stesso gambo e una foglia */
  function cherry(s){
    var v=i%3,o="";
    function ball(x,y,r){
      var a1=20*PI/180,a2=82*PI/180;
      return ci(x,y,r,"url(#fCher)")+ci(x,y,r,"none",null,' stroke="#15020a" stroke-opacity=".5" stroke-width="'+n(s*.02)+'"')+
        el(x+r*.02,y-r*.82,r*.2,r*.08,0,"#0e0107",.6)+
        '<path d="M'+n(x+Math.cos(a1)*r*.86)+' '+n(y+Math.sin(a1)*r*.86)+'A'+n(r*.86)+' '+n(r*.86)+' 0 0 1 '+n(x+Math.cos(a2)*r*.86)+' '+n(y+Math.sin(a2)*r*.86)+'" fill="none" stroke="#ff6d8d" stroke-width="'+n(r*.07)+'" stroke-linecap="round" opacity=".38"/>'+
        el(x-r*.38,y-r*.36,r*.27,r*.15,-40,"#fff",.62)+el(x-r*.58,y-r*.08,r*.06,r*.1,-20,"#fff",.4);
    }
    function stem(x0,y0,x1,y1,bx){return '<path d="M'+n(x0)+' '+n(y0)+'C'+n(x0+bx)+' '+n(y0-s*.5)+' '+n(x1-bx*.4)+' '+n(y1+s*.3)+' '+n(x1)+' '+n(y1)+'" fill="none" stroke="#5c7a2a" stroke-width="'+n(s*.055)+'" stroke-linecap="round"/>'+
      '<path d="M'+n(x0-s*.012)+' '+n(y0)+'C'+n(x0+bx-s*.012)+' '+n(y0-s*.5)+' '+n(x1-bx*.4-s*.012)+' '+n(y1+s*.3)+' '+n(x1-s*.012)+' '+n(y1)+'" fill="none" stroke="#b9cd72" stroke-width="'+n(s*.014)+'" stroke-linecap="round" opacity=".7"/>'}
    if(v===1){
      o=stem(0,s*.22-s*.4,s*.3,-s*1.0,-s*.06)+'<g transform="translate('+n(s*.3)+' '+n(-s*.98)+') rotate(40)">'+lance(s*.9,s*.28,"#4a9a3a","#d8f2a8")+'</g>'+ball(0,s*.38,s*.64);
      return {art:o,sil:'<circle cx="0" cy="'+n(s*.38)+'" r="'+n(s*.64)+'"/>'};
    }
    var B1=[-s*.5,s*.5,s*.5],B2=[s*.52,s*.56,s*.46],J=[s*.06,-s*.96];
    o=stem(B1[0]+s*.02,B1[1]-B1[2]*.82,J[0],J[1],s*.1)+stem(B2[0]+s*.02,B2[1]-B2[2]*.82,J[0],J[1],-s*.1)+
      '<g transform="translate('+n(J[0])+' '+n(J[1])+') rotate(-62)">'+lance(s*.85,s*.27,"#4a9a3a","#d8f2a8")+'</g>'+ball(B1[0],B1[1],B1[2])+ball(B2[0],B2[1],B2[2]);
    return {art:o,sil:'<circle cx="'+n(B1[0])+'" cy="'+n(B1[1])+'" r="'+n(B1[2])+'"/><circle cx="'+n(B2[0])+'" cy="'+n(B2[1])+'" r="'+n(B2[2])+'"/>'};
  }
  /* uva: grappolo con la patina chiara sugli acini, raspo e foglia */
  function grape(s){
    var v=i%3,o="",sil="",j,k;
    function gb(x,y,r){
      sil+='<circle cx="'+n(x)+'" cy="'+n(y)+'" r="'+n(r)+'"/>';
      return ci(x,y,r,"url(#fGrp)")+ci(x,y,r,"none",null,' stroke="#1c0733" stroke-opacity=".5" stroke-width="'+n(s*.015)+'"')+ci(x-r*.1,y-r*.08,r*.92,"url(#fBloom)")+
        el(x-r*.4,y-r*.42,r*.27,r*.13,-40,"#fff",.62)+ci(x-r*.58,y-r*.14,r*.06,"#fff",.55)+ci(x+r*.04,y+r*.8,r*.07,"#12041f",.4);
    }
    if(v===1){
      var G=[[-.42,.34,.46],[.44,.38,.5],[-.02,-.38,.48]];
      o='<path d="M'+n(-s*.02)+' '+n(-s*.8)+'C'+n(s*.02)+' '+n(-s*1.0)+' '+n(s*.2)+' '+n(-s*1.1)+' '+n(s*.34)+' '+n(-s*1.2)+'" fill="none" stroke="#5b3a1b" stroke-width="'+n(s*.07)+'" stroke-linecap="round"/>';
      G.forEach(function(g){o+=gb(g[0]*s,g[1]*s,g[2]*s)});
      return {art:o,sil:sil};
    }
    var rows=[4,3,3,2,1],sc=.86,r=s*.26*sc*1.05,pts=[];
    rows.forEach(function(cnt,jj){for(k=0;k<cnt;k++){pts.push([(k-(cnt-1)/2)*r*1.82+(rnd(i*40+jj*7+k)-.5)*r*.3,(-.66+jj*.4)*s*sc+(rnd(i*40+jj*7+k+3)-.5)*r*.3])}});
    pts.sort(function(a,b){return b[1]-a[1]});
    o='<path d="M0 '+n(-s*.6)+'C'+n(-s*.04)+' '+n(-s*.9)+' '+n(s*.04)+' '+n(-s*1.05)+' '+n(s*.14)+' '+n(-s*1.2)+'" fill="none" stroke="#5b3a1b" stroke-width="'+n(s*.075)+'" stroke-linecap="round"/>'+
      '<path d="M'+n(s*.14)+' '+n(-s*1.2)+'C'+n(s*.3)+' '+n(-s*1.32)+' '+n(s*.46)+' '+n(-s*1.16)+' '+n(s*.36)+' '+n(-s*1.08)+'" fill="none" stroke="#7aa23a" stroke-width="'+n(s*.02)+'" stroke-linecap="round"/>';
    pts.forEach(function(q){o+=gb(q[0],q[1],r)});
    o+='<g transform="translate('+n(s*.1)+' '+n(-s*1.08)+') rotate(-56)">'+lance(s*.8,s*.27,"#4f9d3d","#d8f2a8")+'</g>';
    return {art:o,sil:sil};
  }
  /* mango: frutto intero verde-giallo-arancio, oppure mezza guancia incisa a quadretti */
  function mango(s){
    var v=i%3,o,j;
    if(v===1){
      var rx=s*.56,ry=s*.9,d=s*.17,c,yh,xh;
      o=el(0,0,s*.66,s*.98,0,"url(#fMngA)")+el(0,0,s*.66,s*.98,0,"url(#fMngB)")+el(0,0,rx,ry,0,"url(#fMngF)");
      for(c=-3;c<=3;c++){
        yh=ry*Math.sqrt(Math.max(0,1-Math.pow(c*d/rx,2)))*.97;xh=rx*Math.sqrt(Math.max(0,1-Math.pow(c*d/ry,2)))*.97;
        if(Math.abs(c*d)<rx*.97)o+='<path d="M'+n(c*d)+' '+n(-yh)+'L'+n(c*d)+' '+n(yh)+'" stroke="#d98200" stroke-opacity=".5" stroke-width="'+n(s*.02)+'" stroke-linecap="round"/><path d="M'+n(c*d+s*.018)+' '+n(-yh)+'L'+n(c*d+s*.018)+' '+n(yh)+'" stroke="#fff3b0" stroke-opacity=".55" stroke-width="'+n(s*.012)+'" stroke-linecap="round"/>';
        if(Math.abs(c*d)<ry*.97)o+='<path d="M'+n(-xh)+' '+n(c*d)+'L'+n(xh)+' '+n(c*d)+'" stroke="#d98200" stroke-opacity=".5" stroke-width="'+n(s*.02)+'" stroke-linecap="round"/><path d="M'+n(-xh)+' '+n(c*d+s*.018)+'L'+n(xh)+' '+n(c*d+s*.018)+'" stroke="#fff3b0" stroke-opacity=".55" stroke-width="'+n(s*.012)+'" stroke-linecap="round"/>';
      }
      o+=el(-rx*.5,-ry*.55,rx*.2,ry*.3,12,"#fff",.28)+'<path d="M'+n(-s*.6)+' '+n(-s*.3)+'A'+n(s*.7)+' '+n(s*.98)+' 0 0 1 '+n(-s*.3)+' '+n(-s*.86)+'" fill="none" stroke="#fff" stroke-width="'+n(s*.04)+'" stroke-linecap="round" opacity=".4"/>';
      return {art:o,sil:'<ellipse rx="'+n(s*.66)+'" ry="'+n(s*.98)+'"/>'};
    }
    var sk='M'+n(-s*.1)+' '+n(-s*.95)+'C'+n(s*.5)+' '+n(-s*1.0)+' '+n(s*1.0)+' '+n(-s*.5)+' '+n(s*.95)+' '+n(s*.15)+'C'+n(s*.9)+' '+n(s*.75)+' '+n(s*.4)+' '+n(s*1.0)+' '+n(-s*.1)+' '+n(s*.98)+'C'+n(-s*.7)+' '+n(s*.95)+' '+n(-s*1.0)+' '+n(s*.4)+' '+n(-s*.92)+' '+n(-s*.2)+'C'+n(-s*.85)+' '+n(-s*.7)+' '+n(-s*.5)+' '+n(-s*.92)+' '+n(-s*.1)+' '+n(-s*.95)+'Z';
    o='<g transform="scale(.8 1)"><path d="'+sk+'" fill="url(#fMngA)"/><path d="'+sk+'" fill="url(#fMngB)"/>';
    for(j=0;j<22;j++){var a=rnd(i*50+j)*PI*2,rr=Math.sqrt(rnd(i*50+j+4))*s*.82;o+=ci(Math.cos(a)*rr,Math.sin(a)*rr*1.02,s*(.012+rnd(i*50+j+9)*.014),"#fff6c4",.45)}
    o+='<path d="'+sk+'" fill="none" stroke="#b5521a" stroke-opacity=".28" stroke-width="'+n(s*.03)+'"/>'+
      el(-s*.1,-s*.88,s*.2,s*.07,0,"#5d3a12",.6)+'<path d="M'+n(-s*.1)+' '+n(-s*.9)+'Q'+n(-s*.06)+' '+n(-s*1.0)+' '+n(s*.02)+' '+n(-s*1.08)+'" fill="none" stroke="#6b4a1e" stroke-width="'+n(s*.07)+'" stroke-linecap="round"/></g>'+
      el(-s*.46,-s*.4,s*.12,s*.3,12,"#fff",.34)+el(-s*.52,s*.16,s*.04,s*.12,8,"#fff",.25);
    return {art:o,sil:'<g transform="scale(.8 1)"><path d="'+sk+'"/></g>'};
  }
  /* anguria: spicchio, mezzaluna o cubetto; buccia scura, parte bianca, polpa rossa con semi neri */
  function melon(s){
    var m6=i%6,v=m6===5?2:m6%2,o="",j,k;
    function sec(ax,ay,R,a1,a2){var A1=a1*PI/180,A2=a2*PI/180;return 'M'+n(ax)+' '+n(ay)+'L'+n(ax+Math.cos(A1)*R)+' '+n(ay+Math.sin(A1)*R)+'A'+n(R)+' '+n(R)+' 0 0 1 '+n(ax+Math.cos(A2)*R)+' '+n(ay+Math.sin(A2)*R)+'Z'}
    function seed(x,y,rot,k){return '<g transform="translate('+n(x)+' '+n(y)+') rotate('+n(rot)+')"><ellipse rx="'+n(k*.034)+'" ry="'+n(k*.07)+'" fill="#1b1212"/><ellipse cx="'+n(-k*.01)+'" cy="'+n(-k*.025)+'" rx="'+n(k*.01)+'" ry="'+n(k*.025)+'" fill="#fff" opacity=".45"/></g>'}
    if(v===2){
      var a=s*.78,r=a*.22;
      o='<rect x="'+n(-a)+'" y="'+n(-a)+'" width="'+n(2*a)+'" height="'+n(2*a)+'" rx="'+n(r)+'" fill="url(#fWm)"/>'+
        '<rect x="'+n(-a*.9)+'" y="'+n(-a*.9)+'" width="'+n(1.8*a)+'" height="'+n(1.8*a)+'" rx="'+n(r*.8)+'" fill="none" stroke="#ff9aa8" stroke-opacity=".5" stroke-width="'+n(s*.03)+'"/>';
      [[-.4,-.35,20],[.3,-.1,-30],[-.1,.45,50],[.5,.55,5]].forEach(function(q){o+=seed(q[0]*a,q[1]*a,q[2],s)});
      o+=el(-a*.42,-a*.5,a*.36,a*.12,-20,"#fff",.4)+'<path d="M'+n(-a*.8)+' '+n(-a*.2)+'L'+n(-a*.8)+' '+n(a*.5)+'" stroke="#fff" stroke-width="'+n(s*.05)+'" stroke-linecap="round" opacity=".4"/>';
      return {art:o,sil:'<rect x="'+n(-a)+'" y="'+n(-a)+'" width="'+n(2*a)+'" height="'+n(2*a)+'" rx="'+n(r)+'"/>'};
    }
    var ax,ay,R,a1,a2,cnt;
    if(v===0){ax=0;ay=-s*.52;R=s*1.02;a1=0;a2=180}else{ax=0;ay=-s*.95;R=s*1.95;a1=58;a2=122}
    var sh=sec(ax,ay,R,a1,a2);
    o='<path d="'+sh+'" fill="#2f7a38" stroke="#2f7a38" stroke-width="'+n(s*.03)+'" stroke-linejoin="round"/>'+
      '<path d="'+sec(ax,ay,R*.985,a1,a2)+'" fill="none"/>'+
      '<path d="'+sec(ax,ay,R*.945,a1,a2)+'" fill="#bfe58f" stroke="#bfe58f" stroke-width="'+n(s*.03)+'" stroke-linejoin="round"/>'+
      '<path d="'+sec(ax,ay,R*.915,a1,a2)+'" fill="#f5fbe6" stroke="#f5fbe6" stroke-width="'+n(s*.03)+'" stroke-linejoin="round"/>'+
      '<path d="'+sec(ax,ay,R*.88,a1,a2)+'" fill="#ffb5c0" stroke="#ffb5c0" stroke-width="'+n(s*.03)+'" stroke-linejoin="round"/>'+
      '<path d="'+sec(ax,ay,R*.85,a1,a2)+'" fill="url(#fWm)" stroke="url(#fWm)" stroke-width="'+n(s*.03)+'" stroke-linejoin="round"/>';
    var A=a1*PI/180,B=a2*PI/180;
    for(j=0;j<9;j++){var t=(j+.5)/9,aa=A+(B-A)*t;o+='<path d="M'+n(ax+Math.cos(aa)*R*.975)+' '+n(ay+Math.sin(aa)*R*.975)+'L'+n(ax+Math.cos(aa+.02)*R*.935)+' '+n(ay+Math.sin(aa+.02)*R*.935)+'" stroke="#58a845" stroke-width="'+n(s*.05)+'" stroke-linecap="round" opacity=".7"/>'}
    [[.38,3],[.58,4],[.76,5]].forEach(function(q,qi){
      for(k=0;k<q[1];k++){var aa2=A+(B-A)*((k+.5)/q[1])+(rnd(i*30+qi*7+k)-.5)*.05;
        o+=seed(ax+Math.cos(aa2)*R*q[0],ay+Math.sin(aa2)*R*q[0],aa2*180/PI-90+(rnd(i*30+qi*7+k+3)-.5)*14,s)}});
    for(j=0;j<12;j++){var ab=A+(B-A)*rnd(i*60+j),r0=R*(.2+rnd(i*60+j+4)*.55);o+='<path d="M'+n(ax+Math.cos(ab)*r0)+' '+n(ay+Math.sin(ab)*r0)+'L'+n(ax+Math.cos(ab)*(r0+R*.07))+' '+n(ay+Math.sin(ab)*(r0+R*.07))+'" stroke="#fff" stroke-opacity=".28" stroke-width="'+n(s*.02)+'" stroke-linecap="round"/>'}
    o+='<path d="M'+n(ax+Math.cos(A+.1)*R*.8)+' '+n(ay+Math.sin(A+.1)*R*.8)+'A'+n(R*.8)+' '+n(R*.8)+' 0 0 1 '+n(ax+Math.cos(A+.34)*R*.8)+' '+n(ay+Math.sin(A+.34)*R*.8)+'" fill="none" stroke="#fff" stroke-width="'+n(s*.045)+'" stroke-linecap="round" opacity=".45"/>';
    return {art:o,sil:'<path d="'+sh+'"/>'};
  }
  if(kind==="leaf")return i%4===3?sprig(s*.95):leaf(s*(1+rnd(i*3+1)*.22));
  if(kind==="peach")return peach(s*.9);
  if(kind==="cherry")return cherry(s*.9);
  if(kind==="grape")return grape(s*.95);
  if(kind==="mango")return mango(s*.92);
  if(kind==="melon")return melon(s*.95);
  if(kind==="ice")return i%3===0?leaf(s*.95):cube(s*.92);
  if(kind==="citrus"){var cm=i%6;return cm===3?wedge(s*1.08,"lemon"):cm===4?wedge(s*1.08,"orange"):slice(s*.92,["orange","lemon","lime","lemon","orange","lemon"][cm])}
  if(kind==="coffee")return bean(s*.72);
  if(kind==="berry"){var m=i%8;return m===0||m===4?strawberry(s*.62):m===1||m===5?drupes(s*.85,"fRasp",s*.62,s*.78,.2,.125,true):m===2||m===6?blueb(s*.6):drupes(s*.85,"fBlk",s*.6,s*.74,.6,.165,false)}
  if(kind==="licorice"){var q=i%5;return q===3?root(s*.95):wheel(s*.92)}
  if(kind==="vanilla")return i%4===1?vflower(s*.8):pod(s);
  return bokeh(s*1.05,i);
}
/* sfondo: il gusto, grande e fluttuante */
function sceneSVG0(p){
  var kind=sceneTheme(p).kind,n=nn,hard=kind==="berry"||kind==="licorice"||kind==="cherry"||kind==="grape";
  var SL=[],sd=hashStr(lab(p))%89,cx,cy,jj;
  for(cy=0;cy<11;cy++)for(cx=0;cx<5;cx++){
    var q=sd*60+cy*5+cx,x=(cx+.5)*78+(rnd(q*3+1)-.5)*78*.9,y=(cy+.5)*76.7+(rnd(q*3+2)-.5)*76.7*.9,r=rnd(q*3+3),sz=34+rnd(q+700)*40,ok=true;
    if(r<.2)sz*=1.3;
    if(Math.hypot(x-195,y-372)<sz*.5+150)continue;                    /* sotto la lattina */
    if(Math.hypot(x-344,y-30)<sz+40||(x<130&&y<75))continue;          /* mini cerchio e titolo */
    for(jj=0;jj<SL.length;jj++)if(Math.hypot(SL[jj][0]-x,SL[jj][1]-y)<(SL[jj][2]+sz)*.72){ok=false;break}
    if(ok)SL.push([n(x),n(y),n(sz),Math.round(rnd(q+300)*360),r<.2?2:r<.5?1:0]);
  }
  var layers=["","",""],pc={peach:"#ffb27a",cherry:"#c2183f",grape:"#b07ad6",mango:"#ffb52e",melon:"#ff5a73",leaf:"#a8e6a0",ice:"#ffffff",citrus:"#ffc247",coffee:"#6b3a1a",berry:"#d91f48",licorice:"#e9c6dc",vanilla:"#fff1d0",bubble:"#ffffff"}[kind],j;
  SL.forEach(function(q,jj){
    var e=fxElem0(kind,jj,q[2]);
    layers[q[4]]+='<g transform="translate('+q[0]+' '+q[1]+') rotate('+q[3]+')"><g transform="translate('+n(q[2]*(hard?.2:.15))+' '+n(q[2]*(hard?.27:.22))+')" fill="var(--s-shadow)"'+(kind==="bubble"?' opacity=".55"':'')+' filter="url(#'+(hard?'sc-sh2':'sc-sh')+')">'+e.sil+'</g>'+e.art+'</g>';
  });
  var parts="";
  for(j=0;j<34;j++){var r=1.4+rnd(j+500)*3.2;parts+='<circle cx="'+n(rnd(j*2+1)*390)+'" cy="'+n(rnd(j*2+2)*844)+'" r="'+n(r)+'" fill="'+pc+'" opacity="'+n(.45+rnd(j+90)*.4)+'"/>'}
  var amb="";
  if(kind==="bubble"){
    var bk="",bi;
    for(bi=0;bi<7;bi++){bk+='<circle cx="'+n(rnd(sd+bi*3+1)*390)+'" cy="'+n(rnd(sd+bi*3+2)*844)+'" r="'+n(50+rnd(sd+bi*3+3)*70)+'" fill="var('+(bi%2?'--s-fx4':'--s-lidhi')+')" opacity="'+n(.16+rnd(bi+40)*.12)+'"/>'}
    amb='<g filter="url(#sc-b3)">'+bk+'</g>'+
      '<circle cx="70" cy="40" r="360" fill="url(#bbK)" opacity=".75"/>'+
      '<rect width="390" height="844" fill="url(#bbV)"/>';
  }
  return '<svg viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><defs>'+fxDefs0()+'<linearGradient id="bbV" x1="0" y1="0" x2="0" y2="1"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" style="stop-color:var(--s-lid);stop-opacity:.22"/></linearGradient></defs>'+amb+
    '<g filter="url(#sc-b2)" opacity="'+(kind==="bubble"?.85:1)+'">'+layers[2]+'</g><g filter="url(#sc-b1)">'+layers[1]+'</g>'+layers[0]+'<g>'+parts+'</g></svg>';
}
/* ---------- sfondi v2: luce unica in alto a sinistra, tre piani di profondità, liquidi del gusto ---------- */
var FXU=0;
function f3(v){return +(+v).toFixed(3)}
/* goccia: bordo scuro dal lato della luce, caustica luminosa dal lato opposto, riflesso netto */
function fxDrop(x,y,r,la,tint,to){
  var n=nn,c=Math.cos(la),s=Math.sin(la),D=function(k){return [c*k,s*k]},h=D(r*.42),cc=D(-r*.42),sd=D(-r*.3),
    a0=la-1.15,a1=la+1.15;
  return '<ellipse cx="'+n(x+sd[0])+'" cy="'+n(y+sd[1])+'" rx="'+n(r)+'" ry="'+n(r)+'" fill="#000" opacity=".14"/>'+
    '<circle cx="'+n(x)+'" cy="'+n(y)+'" r="'+n(r)+'" fill="'+(tint||"#ffffff")+'" opacity="'+(to==null?.14:to)+'"/>'+
    '<circle cx="'+n(x)+'" cy="'+n(y)+'" r="'+n(r)+'" fill="url(#gDropE)"/>'+
    '<path d="M'+n(x+Math.cos(a0)*r*.84)+' '+n(y+Math.sin(a0)*r*.84)+'A'+n(r*.84)+' '+n(r*.84)+' 0 0 1 '+n(x+Math.cos(a1)*r*.84)+' '+n(y+Math.sin(a1)*r*.84)+'" fill="none" stroke="#000" stroke-opacity=".2" stroke-width="'+n(r*.2)+'" stroke-linecap="round"/>'+
    '<circle cx="'+n(x+cc[0])+'" cy="'+n(y+cc[1])+'" r="'+n(r*.38)+'" fill="url(#gHi)" opacity=".7"/>'+
    '<ellipse cx="'+n(x+h[0])+'" cy="'+n(y+h[1])+'" rx="'+n(r*.28)+'" ry="'+n(r*.17)+'" fill="#fff" opacity=".96" transform="rotate('+n(la*180/Math.PI+90)+' '+n(x+h[0])+' '+n(y+h[1])+')"/>';
}
function fxDefs(){
  function stops(a){return a.map(function(q){return '<stop offset="'+q[0]+'" stop-color="'+q[1]+'"'+(q[2]!=null?' stop-opacity="'+q[2]+'"':'')+'/>'}).join("")}
  function rg(id,cx,cy,r,a){return '<radialGradient id="'+id+'" cx="'+cx+'" cy="'+cy+'" r="'+r+'">'+stops(a)+'</radialGradient>'}
  function lg(id,x1,y1,x2,y2,a){return '<linearGradient id="'+id+'" x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'">'+stops(a)+'</linearGradient>'}
  return fxDefs0()+
    rg("gHi",.5,.5,.5,[[0,"#fff",.95],[.45,"#fff",.5],[1,"#fff",0]])+
    rg("gSoft",.5,.5,.5,[[0,"#fff",.55],[1,"#fff",0]])+
    rg("gDropE",.5,.5,.5,[[.68,"#000",0],[1,"#000",.22]])+
    rg("gCore",.5,.5,.5,[[0,"#fff",.9],[.5,"#fff",.45],[1,"#fff",0]])+
    rg("gCaus",.5,.5,.5,[[0,"#f6ffff",.9],[.5,"#c6f4ff",.4],[1,"#c6f4ff",0]])+
    rg("gFuzz",.5,.5,.5,[[.72,"#fff",0],[.93,"#fff",.14],[1,"#fff",.34]])+
    /* agrumi */
    rg("gOrZ",.5,.5,.5,[[.9,"#ffb43c"],[.97,"#f78f0e"],[1,"#d86400"]])+rg("gOrS",.5,.5,.62,[[0,"#ffcd70"],[.6,"#ffa024"],[1,"#ef7600"]])+
    rg("gLeZ",.5,.5,.5,[[.9,"#fff07a"],[.97,"#f6d214"],[1,"#d8ac00"]])+rg("gLeS",.5,.5,.62,[[0,"#fff8b0"],[.6,"#ffe450"],[1,"#f1c51c"]])+
    rg("gLiZ",.5,.5,.5,[[.9,"#86c84a"],[.97,"#53a024"],[1,"#326e10"]])+rg("gLiS",.5,.5,.62,[[0,"#eef9b0"],[.6,"#c6e45e"],[1,"#8ebd2c"]])+
    /* frutti di bosco */
    rg("gRaspD",.5,.5,.5,[[0,"#ff96a6"],[.5,"#ec3352"],[1,"#8a0b25"]])+rg("gBlkD",.5,.5,.5,[[0,"#66388a"],[.55,"#290d3c"],[1,"#090210"]])+rg("gBlkR",.5,.5,.5,[[0,"#d4466a"],[.6,"#7d1032"],[1,"#2a0510"]])+
    rg("gBlueB",.5,.5,.5,[[0,"#8c9fd8",.3],[.75,"#7f93cf",.32],[1,"#cdd6f2",.62]])+
    lg("gStrA",0,0,0,1,[[0,"#ff7a64"],[.22,"#f02c3e"],[1,"#ad0f27"]])+
    /* ciliegia, uva */
    rg("gCherA",.5,.5,.5,[[0,"#a01c3c"],[.6,"#5c0921"],[1,"#26030e"]])+rg("gGrpA",.5,.5,.5,[[0,"#a466d2"],[.6,"#5d248c"],[1,"#2a0a48"]])+
    /* vaniglia */
    lg("gTep",0,1,0,0,[[0,"#d8de88"],[.4,"#f4f1c0"],[1,"#fffae2"]])+rg("gThroat",.5,.45,.55,[[0,"#e3901f"],[.55,"#f5c442"],[1,"#fff0a6"]])+
    rg("gCream",.5,.5,.5,[[0,"#fffdf6"],[.7,"#fbf1dc"],[1,"#ead8b4"]])+
    /* caffè */
    rg("gCof",.5,.5,.5,[[0,"#7a4320"],[.6,"#3d1d0b"],[1,"#170802"]])+
    /* ombre e profondità */
    '<filter id="sc-shS" filterUnits="userSpaceOnUse" x="-320" y="-320" width="640" height="640"><feGaussianBlur stdDeviation="8"/></filter>'+
    '<filter id="sc-shT" filterUnits="userSpaceOnUse" x="-320" y="-320" width="640" height="640"><feGaussianBlur stdDeviation="2.6"/></filter>'+
    '<filter id="sc-bF" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="9"/></filter>'+
    '<filter id="sc-bM" x="-15%" y="-15%" width="130%" height="130%"><feGaussianBlur stdDeviation="1.3"/></filter>'+
    '<filter id="sc-bB" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="4"/></filter>'+
    '<filter id="sc-mist" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="22"/></filter>'+
    '<filter id="sc-grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="matrix" values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  .9 .9 .9 0 -1.1"/></filter>';
}
function fxElem(kind,i,s,rot){
  var n=nn,PI=Math.PI,U=++FXU,la=(225-(rot||0))*PI/180,lc=[Math.cos(la),Math.sin(la)],SH="sh"+U,FL="fl"+U;
  var defs='<defs><radialGradient id="'+SH+'" cx="'+f3(.5+lc[0]*.22)+'" cy="'+f3(.5+lc[1]*.22)+'" r=".78" fx="'+f3(.5+lc[0]*.3)+'" fy="'+f3(.5+lc[1]*.3)+'">'+
    '<stop offset="0" stop-color="#fff" stop-opacity=".2"/><stop offset=".34" stop-color="#fff" stop-opacity="0"/><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset=".88" stop-color="#000" stop-opacity=".34"/><stop offset="1" stop-color="#000" stop-opacity=".52"/></radialGradient>'+
    '<linearGradient id="'+FL+'" x1="'+f3(.5+lc[0]*.5)+'" y1="'+f3(.5+lc[1]*.5)+'" x2="'+f3(.5-lc[0]*.5)+'" y2="'+f3(.5-lc[1]*.5)+'"><stop offset="0" stop-color="#fff" stop-opacity=".18"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".16"/></linearGradient></defs>';
  function P(a){return a.map(function(q){return n(q[0])+" "+n(q[1])}).join("L")}
  function ci(x,y,r,f,o,ex){return '<circle cx="'+n(x)+'" cy="'+n(y)+'" r="'+n(r)+'" fill="'+f+'"'+(o!=null?' opacity="'+o+'"':'')+(ex||'')+'/>'}
  function el(x,y,rx,ry,r2,f,o,ex){return '<ellipse cx="'+n(x)+'" cy="'+n(y)+'" rx="'+n(rx)+'" ry="'+n(ry)+'" fill="'+f+'"'+(o!=null?' opacity="'+o+'"':'')+(r2?' transform="rotate('+n(r2)+' '+n(x)+' '+n(y)+')"':'')+(ex||'')+'/>'}
  function pa(d,f,o,ex){return '<path d="'+d+'" fill="'+f+'"'+(o!=null?' opacity="'+o+'"':'')+(ex||'')+'/>'}
  function stk(d,col,w,o,ex){return '<path d="'+d+'" fill="none" stroke="'+col+'" stroke-width="'+n(w)+'" stroke-linecap="round" stroke-linejoin="round"'+(o!=null?' opacity="'+o+'"':'')+(ex||'')+'/>'}
  function pol(r,a){return [Math.cos(a)*r,Math.sin(a)*r]}
  function R(k){return rnd(i*131+k+U*17)}
  function deg(a){return a*180/PI}
  function arcD(cx,cy,r,a0,a1){var p=pol(r,a0),q=pol(r,a1);return 'M'+n(cx+p[0])+' '+n(cy+p[1])+'A'+n(r)+' '+n(r)+' 0 '+(a1-a0>PI?1:0)+' 1 '+n(cx+q[0])+' '+n(cy+q[1])}
  function tr(v){return ' transform="translate('+n(v[0])+' '+n(v[1])+')"'}
  function smooth(pts){var N=pts.length,d="M"+n(pts[0][0])+" "+n(pts[0][1]),j;for(j=0;j<N;j++){var p0=pts[(j-1+N)%N],p1=pts[j],p2=pts[(j+1)%N],p3=pts[(j+2)%N];
    d+="C"+n(p1[0]+(p2[0]-p0[0])/6)+" "+n(p1[1]+(p2[1]-p0[1])/6)+" "+n(p2[0]-(p3[0]-p1[0])/6)+" "+n(p2[1]-(p3[1]-p1[1])/6)+" "+n(p2[0])+" "+n(p2[1])}return d+"Z"}
  function rp(pts,rad){var N=pts.length,d="",j;for(j=0;j<N;j++){var p=pts[(j-1+N)%N],v=pts[j],q=pts[(j+1)%N],l1=Math.hypot(p[0]-v[0],p[1]-v[1]),l2=Math.hypot(q[0]-v[0],q[1]-v[1]),t1=Math.min(.45,rad/l1),t2=Math.min(.45,rad/l2);
    d+=(j?"L":"M")+n(v[0]+(p[0]-v[0])*t1)+" "+n(v[1]+(p[1]-v[1])*t1)+"Q"+n(v[0])+" "+n(v[1])+" "+n(v[0]+(q[0]-v[0])*t2)+" "+n(v[1]+(q[1]-v[1])*t2)}return d+"Z"}
  function drop(x,y,r,tint,to){return fxDrop(x,y,r,la,tint,to)}
  function spec(x,y,r,o){var h=pol(r*.42,la);return el(x+h[0],y+h[1],r*.26,r*.15,deg(la)+90,"url(#gHi)",o==null?.9:o)+el(x+h[0]*1.18,y+h[1]*1.18,r*.08,r*.05,deg(la)+90,"#fff",o==null?.95:o)}
  function rim(x,y,r,col,o){return stk(arcD(x,y,r*.9,la+PI-.75,la+PI+.75),col,r*.07,o==null?.35:o)}
  function withLa(dg,fn){var o=la,oc=lc;la=o-dg*PI/180;lc=[Math.cos(la),Math.sin(la)];var r=fn();la=o;lc=oc;return r}
  function withMirror(fn){var o=la,oc=lc;la=PI-o;lc=[Math.cos(la),Math.sin(la)];var r=fn();la=o;lc=oc;return r}
  function place(x,y,ang,L,fn){return '<g transform="translate('+n(x)+' '+n(y)+') rotate('+n(ang)+') translate(0 '+n(-1.2*L)+')">'+withLa(ang,fn)+'</g>'}

  /* ---- foglia seghettata: nervature incavate, bolle tra le venature, cera lucida ---- */
  function leaf2(s,tone){
    var C={pep:["#2a7630","#45a245","#1f5f25","#d3f2b0",.62,13,.04],spear:["#45a63a","#72cb50","#2f8a2c","#e4f9c6",.48,14,.042],fruit:["#3c8c34","#5cab45","#2a7429","#d8f2a8",.4,9,.012]}[tone],
      Wd=C[4],T=C[5],amp=s*C[6],N=T*6,Rr=[],Ll=[],j,k,u,w,ph,y,o;
    function W(u){return s*Wd*Math.pow(Math.max(0,Math.sin(PI*Math.pow(u,.75))),.9)}
    for(j=0;j<=N;j++){u=j/N;y=s*.95-u*1.95*s;w=W(u);ph=(u*T)%1;Rr.push([w+amp*Math.sin(PI*u)*ph,y]);ph=(u*T+.5)%1;Ll.push([-(w*.95+amp*Math.sin(PI*u)*ph),y])}
    var out='M'+P(Rr)+'L'+P(Ll.slice().reverse())+'Z',inner='M'+P(Rr.map(function(p){return [p[0]*.48,p[1]]}))+'L'+P(Ll.slice().reverse().map(function(p){return [p[0]*.48,p[1]]}))+'Z',
      tw=pol(s*.012,la),aw=pol(s*.016,la+PI);
    o='<path d="M'+n(s*.01)+' '+n(s*.9)+'Q'+n(s*.04)+' '+n(s*1.1)+' '+n(s*.1)+' '+n(s*1.28)+'" fill="none" stroke="'+C[2]+'" stroke-width="'+n(s*.06)+'" stroke-linecap="round"/>'+
      pa(out,C[0])+pa(inner,C[1],.55);
    var K=tone==="fruit"?6:7,vy=[];
    for(k=0;k<K;k++){var u0=.1+k*.8/K,y0=s*.95-u0*1.95*s,u1=Math.min(.97,u0+.17),y1=s*.95-u1*1.95*s,w1=W(u1)*.9,wm=W(u0+.05);vy.push([y0,wm]);
      var vd='M0 '+n(y0)+'Q'+n(w1*.45)+' '+n(y0-s*.05)+' '+n(w1)+' '+n(y1)+'M0 '+n(y0)+'Q'+n(-w1*.43)+' '+n(y0-s*.05)+' '+n(-w1*.95)+' '+n(y1);
      o+=stk(vd,"#0e3a13",s*.028,.42,tr(aw))+stk(vd,C[3],s*.013,.55,tr(tw))}
    for(k=0;k<K-1;k++){var ym=(vy[k][0]+vy[k+1][0])/2-s*.05,wq=vy[k][1],bo=tone==="spear"?.24:.16;
      [-1,1].forEach(function(sd){o+=el(sd*wq*.5+tw[0]*1.5,ym+tw[1]*1.5,wq*.3,Math.abs(vy[k][0]-vy[k+1][0])*.3,sd*-25,C[3],bo)+el(sd*wq*.5+aw[0]*1.2,ym+aw[1]*1.2,wq*.28,Math.abs(vy[k][0]-vy[k+1][0])*.22,sd*-25,"#0a3010",bo*.6)})}
    var mr='M0 '+n(s*.92)+'Q'+n(s*.03)+' 0 0 '+n(-s*.92);
    o+=stk(mr,"#0f4214",s*.03,.4,tr(aw))+stk(mr,C[3],s*.035,.85);
    var side=lc[0]>0?Rr:Ll;o+=pa('M0 '+n(s*.95)+'L'+P(side)+'Z',"#fff",.1);
    for(j=0;j<36;j++){var tx=(R(j)*2-1)*s*Wd*.7,ty=(R(j+50)*2-1)*s*.8;o+=stk('M'+n(tx)+' '+n(ty)+'l'+n(s*.03)+' '+n(s*.012),"#0b3510",s*.008,.18)}
    o+=pa(out,"none",null,' stroke="#174a1c" stroke-opacity=".45" stroke-width="'+n(s*.012)+'"');
    return {art:o,sil:'<path d="'+out+'"/>'};
  }
  /* ---- fetta d'agrume: spessore, buccia porosa, albedo, spicchi con vescicole traslucide, bagnata ---- */
  function slice(s,type){
    var C={orange:["gOrZ","#fff1d6","#ffdfa8","gOrS","#ffd893","#c25500",10],lemon:["gLeZ","#fffbe6","#fff2c0","gLeS","#fffbd8","#c09c00",9],lime:["gLiZ","#f3fbdf","#e1f3b2","gLiS","#f4fdd0","#2f6a10",9]}[type],
      th=pol(s*.065,la+PI),o,j,k,N=C[6],g=.04,r0=s*.09,r1=s*.83,rt=R(7)*PI*2;
    o=ci(th[0],th[1],s,C[5])+ci(th[0]*.5,th[1]*.5,s,C[5],.6)+ci(0,0,s,"url(#"+C[0]+")")+ci(0,0,s*.93,C[1])+ci(0,0,s*.865,C[2]);
    for(j=0;j<70;j++){var pa1=R(j)*PI*2,pr=s*(.952+R(j+100)*.04);o+=ci(Math.cos(pa1)*pr,Math.sin(pa1)*pr,s*(.006+R(j+200)*.007),R(j+300)>.5?"#fff":"#7a3c00",.22)}
    function sp(r,a){return n(Math.cos(a)*r)+" "+n(Math.sin(a)*r)}
    for(j=0;j<N;j++){var a0=rt+j*2*PI/N,a1=a0+2*PI/N,am=(a0+a1)/2,cw=(a1-a0)*.12;
      var d='M'+sp(r0,am)+'Q'+sp(r0*1.3,a0+g)+' '+sp(r0*1.7,a0+g*1.5)+'L'+sp(r1*.93,a0+g)+'Q'+sp(r1,a0+g)+' '+sp(r1,a0+g+cw)+'A'+n(r1)+' '+n(r1)+' 0 0 1 '+sp(r1,a1-g-cw)+'Q'+sp(r1,a1-g)+' '+sp(r1*.93,a1-g)+'L'+sp(r0*1.7,a1-g*1.5)+'Q'+sp(r0*1.3,a1-g)+' '+sp(r0,am)+'Z';
      o+=pa(d,"url(#"+C[3]+")");
      for(k=0;k<17;k++){var t=R(j*31+k+500),rr=r0*2+(r1*.94-r0*2)*Math.sqrt(t),span=Math.max(0,(a1-a0)/2-g*1.6-s*.025/rr),aa=am+(R(j*31+k+900)*2-1)*span,L=s*(.04+R(j*31+k+1300)*.04),w=L*.36,x=Math.cos(aa)*rr,y=Math.sin(aa)*rr;
        o+=el(x,y,w,L,deg(aa)+90,C[4],.5);
        if(k%3===0){var hv=pol(w*.35,la);o+=el(x+hv[0],y+hv[1],w*.3,L*.45,deg(aa)+90,"#fff",.6)}}
    }
    o+=ci(0,0,s*.075,C[2])+ci(0,0,s*.04,"#fff",.55);
    if(type!=="lime")for(k=0;k<2;k++){var sa=rt+(k*4+1.5)*2*PI/N,sx=Math.cos(sa)*s*.28,sy=Math.sin(sa)*s*.28;o+=el(sx,sy,s*.035,s*.075,deg(sa)+90,"#f8f1d4",1,' stroke="#d7c79a" stroke-width="'+n(s*.008)+'"')+el(sx+lc[0]*s*.01,sy+lc[1]*s*.01,s*.012,s*.035,deg(sa)+90,"#fff",.8)}
    o+=ci(0,0,s,"url(#"+FL+")");
    var gc=pol(s*.3,la);o+=ci(gc[0],gc[1],s*.62,"url(#gSoft)",.32);
    for(k=0;k<11;k++){var ga=la+(R(k+3000)*2-1)*.9,gr=s*(.2+R(k+3100)*.6),gp=pol(gr,ga);o+=el(gp[0],gp[1],s*(.02+R(k+3200)*.035),s*(.012+R(k+3300)*.016),deg(ga)+90,"#fff",.85)}
    o+=stk(arcD(0,0,s*.975,la-.7,la+.6),"#fff",s*.03,.6);
    if(i%2===0){var dp=pol(s*.45,la+2.1);o+=drop(dp[0],dp[1],s*.08)}
    return {art:o,sil:'<circle r="'+n(s)+'"/>'};
  }
  /* ---- cubetto di ghiaccio in tre quarti: facce traslucide, spigoli luminosi, cuore lattiginoso, caustica ---- */
  function cube(s){
    var a=s*.74,h=.87,o="",j,
      T=[[0,-a],[a*h,-a*.5],[0,0],[-a*h,-a*.5]],Lf=[[-a*h,-a*.5],[0,0],[0,a],[-a*h,a*.5]],Rf=[[0,0],[a*h,-a*.5],[a*h,a*.5],[0,a]],
      hex=[[0,-a],[a*h,-a*.5],[a*h,a*.5],[0,a],[-a*h,a*.5],[-a*h,-a*.5]],hx=rp(hex,a*.2);
    var dL=-.87*lc[0]+.5*lc[1],dR=.87*lc[0]+.5*lc[1],dT=-lc[1]*.4,cs=pol(a*1.15,la+PI);
    o+=el(cs[0],cs[1],a*.75,a*.5,deg(la)+90,"url(#gCaus)",.75);
    o+=pa(hx,"#bfe9f5",.62);
    if(i%3===0){o+='<g transform="translate('+n(a*.05)+' '+n(a*.1)+') scale(.36) rotate('+n(R(1)*360)+')" opacity=".9">'+withLa(R(1)*360,function(){return leaf2(s,"pep").art})+'</g>'}
    o+=el(0,a*.12,a*.55,a*.6,0,"url(#gCore)",.8);
    for(j=0;j<18;j++){var bx=(R(j)*2-1)*a*.45,by=a*.1+(R(j+40)*2-1)*a*.45,br=a*(.015+R(j+80)*.04);o+=ci(bx,by,br,"#fff",.25,' stroke="#fff" stroke-width=".7" stroke-opacity=".85"')}
    o+=pa(rp(T,a*.14),"#ffffff",.3+Math.max(0,dT)*.3)+
      pa(rp(Lf,a*.14),dL>0?"#ffffff":"#0b5c75",.06+Math.abs(dL)*.22)+pa(rp(Rf,a*.14),dR>0?"#ffffff":"#0b5c75",.06+Math.abs(dR)*.22);
    o+=pa(rp(hex.map(function(p){return [p[0]*.88,p[1]*.88]}),a*.16),"none",null,' stroke="#4ba8c0" stroke-opacity=".3" stroke-width="'+n(a*.025)+'"');
    o+=stk('M'+n(T[1][0])+' '+n(T[1][1])+'L0 0L'+n(T[3][0])+' '+n(T[3][1])+'M0 0L0 '+n(a*.92),"#fff",a*.035,.6);
    o+=pa(hx,"none",null,' stroke="#7cc7da" stroke-opacity=".7" stroke-width="'+n(a*.1)+'"')+pa(hx,"none",null,' stroke="#ffffff" stroke-opacity=".95" stroke-width="'+n(a*.05)+'"');
    for(j=0;j<6;j++){var p1=hex[j],p2=hex[(j+1)%6],mx=(p1[0]+p2[0])/2,my=(p1[1]+p2[1])/2,ml=Math.hypot(mx,my)||1;
      if((mx*lc[0]+my*lc[1])/ml>.45)o+=stk('M'+n(p1[0]*.8+p2[0]*.2)+' '+n(p1[1]*.8+p2[1]*.2)+'L'+n(p1[0]*.25+p2[0]*.75)+' '+n(p1[1]*.25+p2[1]*.75),"#fff",a*.07,.95)}
    o+=stk('M'+n(-a*.4)+' '+n(a*.05)+'L'+n(-a*.22)+' '+n(a*.22)+'L'+n(-a*.3)+' '+n(a*.45)+'M'+n(a*.25)+' '+n(-a*.35)+'L'+n(a*.42)+' '+n(-a*.12)+'L'+n(a*.36)+' '+n(a*.08),"#fff",a*.014,.55);
    for(j=0;j<34;j++){o+=ci((R(j+200)*2-1)*a*.75,(R(j+260)*2-1)*a*.75,a*(.008+R(j+320)*.012),"#fff",.6)}
    var d1=pol(a*.35,la+2.4);o+=drop(d1[0],d1[1],a*.1);if(i%2)o+=drop(-d1[0]*.6,a*.55,a*.07);
    return {art:o,sil:'<path d="'+hx+'"/>'};
  }
  /* ---- chicco di caffè: lobi lucidi d'olio, solco a S con pellicina chiara, screziatura ---- */
  function bean(s){
    var back=i%5===3,a=s*.68,b=s,o,j;
    var sh=smooth([[0,-b],[a*.7,-b*.82],[a,-b*.2],[a*.92,b*.45],[a*.45,b*.93],[-a*.1,b],[-a*.68,b*.75],[-a*.98,b*.15],[-a*.85,-b*.5],[-a*.45,-b*.92]]);
    o=pa(sh,"url(#gCof)");
    for(j=0;j<80;j++){var x=(R(j)*2-1)*a*.9,y=(R(j+80)*2-1)*b*.9;if(x*x/(a*a)+y*y/(b*b)>.8)continue;o+=el(x,y,s*(.03+R(j+160)*.06),s*(.02+R(j+240)*.04),R(j+320)*180,R(j+400)>.5?"#7a4422":"#251005",.26)}
    if(!back){
      var cd='M'+n(s*.02)+' '+n(-b*.9)+'C'+n(s*.16)+' '+n(-b*.4)+' '+n(-s*.14)+' '+n(b*.4)+' '+n(-s*.01)+' '+n(b*.9);
      [-1,1].forEach(function(sd){var cx=sd*a*.46,h=pol(a*.24,la);
        o+=el(cx,0,a*.44,b*.74,0,"url(#"+SH+")")+el(cx+h[0],h[1]*.7-b*.06,a*.13,b*.34,0,"url(#gHi)",.5)+el(cx+h[0]*1.15,h[1]*.75-b*.12,a*.045,b*.14,0,"#fff",.7)});
      var lo=pol(s*.06,la);
      o+=stk(cd,"#120703",s*.16)+stk(cd,"#050201",s*.075)+stk(cd,"#d9b48a",s*.024,.75,' stroke-dasharray="'+n(s*.2)+' '+n(s*.06)+' '+n(s*.32)+' '+n(s*.09)+'"')+stk(cd,"#a8744a",s*.026,.4,tr(lo));
    }else{
      var h2=pol(a*.36,la);o+=pa(sh,"url(#"+SH+")")+el(h2[0],h2[1],a*.2,b*.42,0,"url(#gHi)",.5)+el(h2[0]*1.15,h2[1]*1.15,a*.06,b*.17,0,"#fff",.6)+
        stk('M'+n(-a*.1)+' '+n(-b*.8)+'Q'+n(a*.15)+' 0 '+n(-a*.05)+' '+n(b*.8),"#000",s*.03,.25);
    }
    o+=pa(sh,"url(#"+SH+")",.55)+pa(sh,"none",null,' stroke="#170904" stroke-opacity=".6" stroke-width="'+n(s*.025)+'"')+rim(0,0,b*.9,"#c98a55",.28);
    return {art:o,sil:'<path d="'+sh+'"/>'};
  }
  /* ---- schizzo di caffè: goccia lucida e corona di gocce ---- */
  function cofDrop(s){
    var r=s*.5,o=ci(0,0,r,"url(#gCof)")+ci(0,0,r,"url(#"+SH+")")+spec(0,0,r)+rim(0,0,r,"#e0a066",.4);
    var t=pol(r*1.2,la+PI*1.1);o+=ci(t[0],t[1],r*.28,"url(#gCof)")+spec(t[0],t[1],r*.28,.8);
    return {art:o,sil:'<circle r="'+n(r)+'"/>'};
  }
  /* ---- fragola ---- */
  function straw(s){
    var N=34,Rr=[],Lf=[],j,y,hw,o,x,row=0,H=2.1*s,y0=-s;
    function HW(y){var t=(y-y0)/H;if(t<=0||t>=1)return 0;return s*.95*Math.pow(1-Math.pow(t,1.7),.7)*Math.pow(Math.sin(Math.min(1,t/.34)*PI/2),.62)}
    for(j=0;j<=N;j++){y=y0+H*j/N;hw=HW(y);Rr.push([hw,y]);Lf.push([-hw,y])}
    var d='M'+P(Rr)+'L'+P(Lf.slice().reverse())+'Z',tw=pol(s*.012,la),aw=pol(s*.014,la+PI);
    o='<path d="M0 '+n(y0)+'C'+n(s*.05)+' '+n(y0-s*.45)+' '+n(s*.35)+' '+n(y0-s*.8)+' '+n(s*.7)+' '+n(y0-s*1.0)+'" fill="none" stroke="#4a8a2c" stroke-width="'+n(s*.08)+'" stroke-linecap="round"/>'+pa(d,"url(#gStrA)")+pa(d,"url(#"+SH+")");
    for(y=y0+.2*s;y<y0+H*.95;y+=.18*s){row++;hw=HW(y)*.9;var sc=1-.35*((y-y0)/H);
      for(x=-hw+(row%2?.09*s:0);x<hw;x+=.19*s){var jx=(rnd(i*90+row*13+Math.round(x*3))-.5)*.03*s,px=x+jx,py=y,dl=(px*lc[0]+(py-s*.1)*lc[1])/s;
        o+=el(px+aw[0],py+aw[1],s*.04*sc,s*.052*sc,0,"#7a0a1c",.5)+el(px+tw[0],py+tw[1],s*.03*sc,s*.04*sc,0,"#ff9a9a",.22)+el(px,py,s*.019*sc,s*.03*sc,0,"#f3cf5c")+el(px+tw[0]*.6,py+tw[1]*.6,s*.007*sc,s*.012*sc,0,"#fff",.8);
        if(dl>.25)o+=ci(px+tw[0]*3+s*.06*lc[1],py+tw[1]*3,s*.012*sc,"#fff",.55*Math.min(1,dl*1.4))}}
    var hp=pol(s*.38,la);o+=el(hp[0],hp[1]+s*.05,s*.26,s*.12,deg(la)+90,"url(#gHi)",.55);
    var k,lf='M0 0C'+n(s*.14)+' '+n(-s*.12)+' '+n(s*.12)+' '+n(-s*.4)+' 0 '+n(-s*.52)+'C'+n(-s*.12)+' '+n(-s*.4)+' '+n(-s*.14)+' '+n(-s*.12)+' 0 0Z';
    for(k=0;k<9;k++){var ang=k*40+(rnd(i*9+k)-.5)*18;o+='<g transform="translate(0 '+n(y0+s*.06)+') rotate('+n(ang)+')"><path d="'+lf+'" fill="'+(k%2?"#4f9a35":"#3d8a2c")+'" stroke="#245e1f" stroke-width="'+n(s*.015)+'" stroke-linejoin="round"/><path d="M0 '+n(-s*.04)+'L0 '+n(-s*.44)+'" stroke="#a8dc82" stroke-width="'+n(s*.014)+'" opacity=".6"/></g>'}
    o+=ci(0,y0+s*.06,s*.08,"#3a7d2a")+ci(0,y0+s*.06,s*.08,"url(#"+SH+")");
    if(i%3===0){var dp=pol(s*.35,la+2.3);o+=drop(dp[0],dp[1]+s*.2,s*.07)}
    return {art:o,sil:'<path d="'+d+'"/>'};
  }
  /* ---- lampone e mora: drupe su una cupola, ognuna con la sua luce ---- */
  function drupes(s,black){
    var Rx=s*.62,Ry=s*.78,o=el(0,0,Rx*.97,Ry*.97,0,black?"#10041a":"#5a0718"),pts=[],Nn=82,j;
    for(j=0;j<Nn;j++){var z=1-(j+.5)/Nn,rr=Math.sqrt(1-z*z),th=j*2.39996;pts.push([Math.cos(th)*rr*Rx,Math.sin(th)*rr*Ry,z])}
    pts.sort(function(a,b){return a[2]-b[2]});
    var r0=s*(black?.13:.12);
    pts.forEach(function(q,k){if(q[2]<.06)return;var rr=r0*(.42+.58*q[2]),g=black?(R(k)<.12?"gBlkR":"gBlkD"):"gRaspD",h=pol(rr*.42,la);
      o+=ci(q[0],q[1],rr,"url(#"+g+")")+ci(q[0],q[1],rr,"url(#"+SH+")",.85)+el(q[0]+h[0],q[1]+h[1],rr*(black?.22:.26),rr*(black?.12:.15),deg(la)+90,"#fff",black?.9:.55)});
    if(!black)for(j=0;j<16;j++){var ha=R(j)*PI*2,hr=Math.sqrt(R(j+30))*.9;o+=stk('M'+n(Math.cos(ha)*hr*Rx)+' '+n(Math.sin(ha)*hr*Ry)+'l'+n(s*.04)+' '+n(-s*.05),"#ffe0e6",s*.008,.45)}
    o+=el(0,0,Rx,Ry,0,"url(#"+SH+")",.55)+rim(0,0,Rx,black?"#b27ad6":"#ff9db0",.3);
    return {art:o,sil:'<ellipse rx="'+n(Rx)+'" ry="'+n(Ry)+'"/>'};
  }
  /* ---- mirtillo: pruina opaca e corona a cinque punte ---- */
  function blueb(s){
    var o=ci(0,0,s,"#33468c")+ci(0,0,s,"url(#gBlueB)"),j,c=pol(s*.28,R(3)*PI*2),pts=[];
    for(j=0;j<14;j++)o+=el((R(j)*2-1)*s*.7,(R(j+20)*2-1)*s*.7,s*(.1+R(j+40)*.15),s*(.06+R(j+60)*.1),R(j+80)*180,"#d6def4",.13);
    o+=ci(0,0,s,"url(#"+SH+")");
    for(j=0;j<10;j++){var rr=j%2?s*.11:s*.29,aa=j/10*PI*2+R(5);pts.push([c[0]+Math.cos(aa)*rr,c[1]+Math.sin(aa)*rr*.92])}
    o+=ci(c[0],c[1],s*.33,"#1b2a5c",.28)+'<path d="M'+P(pts)+'Z" fill="#202b5a" stroke="#93a6db" stroke-width="'+n(s*.025)+'" stroke-linejoin="round" stroke-opacity=".7"/>'+ci(c[0],c[1],s*.1,"#0d1330");
    var hp=pol(s*.45,la);o+=el(hp[0],hp[1],s*.32,s*.18,deg(la)+90,"url(#gHi)",.32)+rim(0,0,s,"#bfcaf0",.4);
    return {art:o,sil:'<circle r="'+n(s)+'"/>'};
  }
  /* ---- girella di liquirizia: nastro a coste, lucido dove guarda la luce ---- */
  function wheel(s){
    var w=s*.2,T=4.6,M=220,pts=[],j,tt,rr;
    for(j=0;j<=M;j++){tt=j/M*T*PI*2;rr=s*.1+tt/(T*PI*2)*s*.84;pts.push([Math.cos(tt)*rr,Math.sin(tt)*rr,tt])}
    var te=T*PI*2,e=pts[M];for(j=1;j<=6;j++)pts.push([e[0]-Math.sin(te)*s*.06*j,e[1]+Math.cos(te)*s*.06*j,te]);
    function off(f){return pts.map(function(p){return [p[0]+Math.cos(p[2])*f*w,p[1]+Math.sin(p[2])*f*w]})}
    var base='M'+P(off(0)),o=stk(base,"#050306",w*1.05)+stk(base,"#151019",w*.9);
    [-.3,0,.3].forEach(function(f){o+=stk('M'+P(off(f)),"#2c2434",w*.08,.85)});
    [-.15,.15].forEach(function(f){o+=stk('M'+P(off(f)),"#000",w*.06,.6)});
    function hl(f,sg,col,wd,om){var out="",cur=[],tier=-1;
      pts.forEach(function(p){var d=(Math.cos(p[2])*lc[0]+Math.sin(p[2])*lc[1])*sg,t=d>.2?Math.round(d*4)/4:0,q=[p[0]+Math.cos(p[2])*f*w,p[1]+Math.sin(p[2])*f*w];
        if(t!==tier){if(cur.length>1&&tier>0)out+=stk('M'+P(cur),col,wd,tier*om);cur=cur.length?[cur[cur.length-1]]:[];tier=t}cur.push(q)});
      if(cur.length>1&&tier>0)out+=stk('M'+P(cur),col,wd,tier*om);return out}
    o+=hl(.3,1,"#a99abd",w*.14,.75)+hl(-.3,-1,"#a99abd",w*.14,.55)+hl(.32,1,"#f2ecfa",w*.045,.9)+hl(-.32,-1,"#f2ecfa",w*.045,.7);
    var ep=pts[pts.length-1];o+=el(ep[0],ep[1],w*.5,w*.2,deg(te),"#2a2230")+ci(0,0,s,"url(#"+FL+")");
    return {art:o,sil:'<circle r="'+n(s*.98)+'"/>'};
  }
  /* ---- caramella di liquirizia lucida ---- */
  function lpill(s){
    var a=s*.62,b=s*.3,o=rp([[-a,-b],[a,-b],[a,b],[-a,b]],b*.95);
    return {art:pa(o,"#0d0910")+pa(o,"url(#"+SH+")")+el(pol(a*.3,la)[0],pol(b*.5,la)[1],a*.55,b*.22,0,"url(#gHi)",.6)+el(pol(a*.38,la)[0],pol(b*.62,la)[1],a*.25,b*.07,0,"#fff",.85),sil:'<path d="'+o+'"/>'};
  }
  /* ---- baccello di vaniglia: rugoso, oleoso, con il riflesso che segue la luce ---- */
  function bz(p0,p1,p2,p3,Nb){var o=[],j,t,u;for(j=0;j<=Nb;j++){t=j/Nb;u=1-t;o.push([u*u*u*p0[0]+3*u*u*t*p1[0]+3*u*t*t*p2[0]+t*t*t*p3[0],u*u*u*p0[1]+3*u*u*t*p1[1]+3*u*t*t*p2[1]+t*t*t*p3[1]])}return o}
  function pod1(Lp,W,split){
    var A=bz([0,0],[0,-.35*Lp],[Lp*.05,-.7*Lp],[0,-.9*Lp],22),B=bz([0,-.9*Lp],[-Lp*.02,-1.04*Lp],[Lp*.14,-1.08*Lp],[Lp*.18,-.98*Lp],8).slice(1),cl=A.concat(B),Nc=cl.length,nm=[],j;
    for(j=0;j<Nc;j++){var a=cl[Math.max(0,j-1)],b=cl[Math.min(Nc-1,j+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1;nm.push([-dy/l,dx/l])}
    function wf(t){return t<.1?.78+.22*t/.1:t>.72?Math.max(.12,1-(t-.72)/.28*.88):1}
    function off(f,jit){return cl.map(function(q,j){var ww=W*wf(j/(Nc-1))/2*f+(jit?Math.sin(j*1.7+jit)*W*.03:0);return [q[0]+nm[j][0]*ww,q[1]+nm[j][1]*ww]})}
    var poly='M'+P(off(1))+'L'+P(off(-1).reverse())+'Z',o=pa(poly,"#1a0c06")+pa(poly,"#3a2012",.55,' transform="scale(.94 1)"');
    [-.7,-.4,-.12,.18,.46,.72].forEach(function(f,k){o+=stk('M'+P(off(f,k*2.1)),k%2?"#0a0402":"#5d3b22",W*(k%2?.05:.03),k%2?.6:.4)});
    [1,-1].forEach(function(sg){var cur=[],tier=-1;cl.forEach(function(q,j){var d=(nm[j][0]*lc[0]+nm[j][1]*lc[1])*sg,t=d>.15?Math.round(d*3)/3:0,ww=W*wf(j/(Nc-1))/2*.42*sg,p=[q[0]+nm[j][0]*ww,q[1]+nm[j][1]*ww];
      if(t!==tier){if(cur.length>1&&tier>0)o+=stk('M'+P(cur),"#c99a6a",W*.13,tier*.42)+stk('M'+P(cur),"#f3d7b4",W*.04,tier*.6);cur=cur.length?[cur[cur.length-1]]:[];tier=t}cur.push(p)});
      if(cur.length>1&&tier>0)o+=stk('M'+P(cur),"#c99a6a",W*.13,tier*.42)+stk('M'+P(cur),"#f3d7b4",W*.04,tier*.6)});
    if(split){var sp=off(.05).slice(2,12);o+=stk('M'+P(sp),"#070302",W*.22)+stk('M'+P(sp),"#3b2414",W*.05,.6);for(j=0;j<14;j++){var q=sp[Math.floor(R(j+700)*sp.length)];o+=ci(q[0]+(R(j+720)-.5)*W*.2,q[1],W*.03,"#000",.9)}}
    o+='<ellipse cx="0" cy="0" rx="'+n(W*.36)+'" ry="'+n(W*.15)+'" fill="#6a4429"/>';
    return {art:o,poly:poly};
  }
  function pod(s){
    var o="",sl="",cfg=[[-11,1,1,-.55],[1,.93,-1,0],[12,.86,1,.6]],L0=s*1.65,W=s*.27;
    cfg.forEach(function(c,k){var tf='translate('+n(c[3]*W*1.5)+' '+n(L0*.5)+') rotate('+c[0]+') scale('+c[2]+' 1)',g=withLa(c[0],function(){return c[2]<0?withMirror(function(){return pod1(L0*c[1],W,k===1&&i%2===0)}):pod1(L0*c[1],W,k===1&&i%2===0)});
      o+='<g transform="'+tf+'">'+g.art+'</g>';sl+='<path transform="'+tf+'" d="'+g.poly+'"/>'});
    return {art:o,sil:sl};
  }
  /* ---- orchidea della vaniglia: tepali crema-verdi, labello a trombetta giallo ---- */
  function orchid(s){
    var o="",C=[[0,.95,.2],[125,.95,.2],[-125,.95,.2],[55,.82,.23],[-55,.82,.23]];
    C.forEach(function(c){var Lt=s*c[1],Wt=s*c[2],d='M0 0C'+n(Wt*.9)+' '+n(-Lt*.15)+' '+n(Wt*1.15)+' '+n(-Lt*.6)+' 0 '+n(-Lt)+'C'+n(-Wt*1.15)+' '+n(-Lt*.6)+' '+n(-Wt*.9)+' '+n(-Lt*.15)+' 0 0Z';
      o+='<g transform="rotate('+c[0]+')">'+pa(d,"url(#gTep)")+pa(d,"none",null,' stroke="#c9c07d" stroke-opacity=".55" stroke-width="'+n(s*.012)+'"')+stk('M0 '+n(-Lt*.08)+'Q'+n(Wt*.1)+' '+n(-Lt*.5)+' 0 '+n(-Lt*.9),"#fffef2",s*.02,.7)+
        stk('M0 '+n(-Lt*.1)+'Q'+n(Wt*.5)+' '+n(-Lt*.5)+' '+n(Wt*.15)+' '+n(-Lt*.88)+'M0 '+n(-Lt*.1)+'Q'+n(-Wt*.5)+' '+n(-Lt*.5)+' '+n(-Wt*.15)+' '+n(-Lt*.88),"#d6cf8f",s*.008,.5)+pa(d,"url(#"+FL+")")+'</g>'});
    var lab=[],k;for(k=0;k<18;k++){var aa=k/18*PI*2,rr=s*.32*(1+.09*Math.sin(k*3.1+i));lab.push([Math.cos(aa)*rr,s*.14+Math.sin(aa)*rr*.95])}
    o+=pa(smooth(lab),"#fff3b6")+pa(smooth(lab),"none",null,' stroke="#e8cf6a" stroke-width="'+n(s*.015)+'"')+el(0,s*.1,s*.2,s*.22,0,"url(#gThroat)");
    for(k=0;k<8;k++){var a2=-PI*.1+k/7*PI*1.2;o+=stk('M'+n(Math.cos(a2)*s*.06)+' '+n(s*.1+Math.sin(a2)*s*.06)+'L'+n(Math.cos(a2)*s*.24)+' '+n(s*.1+Math.sin(a2)*s*.24),"#d9822a",s*.01,.45)}
    o+=el(0,-s*.02,s*.065,s*.15,0,"#fffbea")+spec(0,-s*.02,s*.1,.7)+pa(smooth(lab),"url(#"+FL+")");
    return {art:o,sil:'<circle r="'+n(s*.95)+'"/>'};
  }
  /* ---- goccia di crema alla vaniglia ---- */
  function cream(s){
    var r=s*.48,pts=[],k;for(k=0;k<12;k++){var a=k/12*PI*2,rr=r*(1+.08*Math.sin(k*2.3+i));pts.push([Math.cos(a)*rr,Math.sin(a)*rr])}
    var d=smooth(pts),o=pa(d,"url(#gCream)")+pa(d,"url(#"+SH+")",.6);
    for(k=0;k<16;k++){var a2=R(k)*PI*2,r2=Math.sqrt(R(k+20))*r*.8;o+=ci(Math.cos(a2)*r2,Math.sin(a2)*r2,r*.025,"#2a1608",.7)}
    return {art:o+spec(0,0,r,.85)+rim(0,0,r,"#fff",.5),sil:'<path d="'+d+'"/>'};
  }
  /* ---- pesca ---- */
  function peach(s){
    var v=i%3,o,j,sk='M0 '+n(-s*.74)+'C'+n(s*.26)+' '+n(-s*1.02)+' '+n(s*1.0)+' '+n(-s*.82)+' '+n(s*.98)+' '+n(-s*.02)+'C'+n(s*.96)+' '+n(s*.6)+' '+n(s*.52)+' '+n(s*1.0)+' 0 '+n(s*1.0)+'C'+n(-s*.52)+' '+n(s*1.0)+' '+n(-s*.96)+' '+n(s*.6)+' '+n(-s*.98)+' '+n(-s*.02)+'C'+n(-s*1.0)+' '+n(-s*.82)+' '+n(-s*.26)+' '+n(-s*1.02)+' 0 '+n(-s*.74)+'Z';
    if(v===1){
      var th=pol(s*.07,la+PI);o=ci(th[0],th[1],s,"#b8371f")+ci(0,0,s,"url(#fPchA)")+ci(0,0,s,"url(#fPchB)")+ci(0,0,s*.92,"url(#fPchF)");
      for(j=0;j<40;j++){var a=R(j)*PI*2,r0=s*(.36+R(j+5)*.1),r1=s*(.55+R(j+9)*.32);o+=stk('M'+n(Math.cos(a)*r0)+' '+n(Math.sin(a)*r0)+'L'+n(Math.cos(a)*r1)+' '+n(Math.sin(a)*r1),"#d6381f",s*.014,.28)}
      o+='<g transform="rotate(22)">'+el(0,0,s*.31,s*.44,0,"#c03018",.55)+el(0,0,s*.28,s*.41,0,"url(#fStone)")+el(0,0,s*.28,s*.41,0,"url(#"+SH+")");
      for(j=0;j<20;j++){var yy=-s*.34+R(j+40)*s*.68,xx=(R(j+60)*2-1)*s*.18*Math.sqrt(Math.max(0,1-Math.pow(yy/(s*.41),2))),tl=pol(s*.008,la-22*PI/180);
        var gd='M'+n(xx-s*.06)+' '+n(yy)+'Q'+n(xx)+' '+n(yy-s*.03*(R(j+70)-.5)*2)+' '+n(xx+s*.06)+' '+n(yy+s*.02);o+=stk(gd,"#2a1206",s*.016,.55)+stk(gd,"#d29a6a",s*.008,.35,tr(tl))}
      o+='</g>'+ci(0,0,s*.92,"url(#"+FL+")");
      for(j=0;j<12;j++){var ga=la+(R(j+90)*2-1)*.9,gp=pol(s*(.5+R(j+95)*.35),ga);o+=el(gp[0],gp[1],s*(.02+R(j+99)*.03),s*.012,deg(ga)+90,"#fff",.85)}
      var sc=pol(s*.45,la);o+=ci(sc[0],sc[1],s*.4,"url(#gSoft)",.3)+stk(arcD(0,0,s*.97,la-.7,la+.6),"#fff",s*.03,.45);
      return {art:o,sil:'<circle r="'+n(s)+'"/>'};
    }
    var tw=pol(s*.015,la),aw=pol(s*.02,la+PI),cl='M0 '+n(-s*.74)+'C'+n(s*.14)+' '+n(-s*.3)+' '+n(s*.2)+' '+n(s*.3)+' '+n(s*.03)+' '+n(s*.84);
    o=pa(sk,"url(#fPchA)")+pa(sk,"url(#fPchB)");
    for(j=0;j<9;j++){var x0=(j/8*2-1)*s*.72;o+=stk('M'+n(x0*.3)+' '+n(-s*.68)+'Q'+n(x0*1.2)+' 0 '+n(x0*.5)+' '+n(s*.9),"#c4283a",s*.06,.1)}
    for(j=0;j<60;j++){var sa=R(j)*PI*2,sr=Math.sqrt(R(j+30))*s*.82;o+=ci(Math.cos(sa)*sr,Math.sin(sa)*sr,s*(.007+R(j+60)*.01),"#ffe08a",.4)}
    o+=stk(cl,"#9e2618",s*.06,.4,tr(aw))+stk(cl,"#ffd3a0",s*.025,.35,tr(tw))+pa(sk,"url(#"+SH+")")+pa(sk,"url(#gFuzz)");
    var hp=pol(s*.42,la);o+=el(hp[0],hp[1],s*.38,s*.22,deg(la)+90,"url(#gHi)",.36);
    o+=stk('M0 '+n(-s*.72)+'Q'+n(s*.03)+' '+n(-s*.88)+' '+n(s*.1)+' '+n(-s*1.0),"#6b3d1e",s*.07)+place(s*.1,-s*.98,v===0?52:-48,s*.55,function(){return leaf2(s*.55,"fruit").art});
    if(v===2){var dp=pol(s*.38,la+2.2);o+=drop(dp[0],dp[1],s*.08)}
    return {art:o,sil:'<path d="'+sk+'"/>'};
  }
  /* ---- ciliegie nere lucide ---- */
  function cherry(s){
    var v=i%3,o="";
    function ball(x,y,r){var lip=pol(r*.06,la);
      return ci(x,y,r,"url(#gCherA)")+ci(x,y,r,"url(#"+SH+")")+ci(x,y,r,"none",null,' stroke="#120108" stroke-opacity=".55" stroke-width="'+n(s*.02)+'"')+
        el(x+lip[0],y-r*.8+lip[1],r*.24,r*.1,0,"#ff8aa6",.22)+el(x,y-r*.8,r*.2,r*.08,0,"#0b0005",.65)+spec(x,y,r)+rim(x,y,r,"#ff6d8d",.42)}
    function stem(x0,y0,x1,y1,bx){var d='M'+n(x0)+' '+n(y0)+'C'+n(x0+bx)+' '+n(y0-s*.5)+' '+n(x1-bx*.4)+' '+n(y1+s*.3)+' '+n(x1)+' '+n(y1);
      return stk(d,"#4f6e22",s*.06)+stk(d,"#c3d77d",s*.016,.75,tr(pol(s*.014,la)))}
    if(v===1){o=stem(0,-s*.18,s*.3,-s*1.0,-s*.06)+place(s*.3,-s*.98,40,s*.5,function(){return leaf2(s*.5,"fruit").art})+ball(0,s*.38,s*.64);
      if(i%2)o+=drop(pol(s*.3,la+2)[0],s*.38+pol(s*.3,la+2)[1],s*.08);
      return {art:o,sil:'<circle cx="0" cy="'+n(s*.38)+'" r="'+n(s*.64)+'"/>'}}
    var B1=[-s*.5,s*.5,s*.5],B2=[s*.52,s*.56,s*.46],J=[s*.06,-s*.96];
    o=stem(B1[0]+s*.02,B1[1]-B1[2]*.82,J[0],J[1],s*.1)+stem(B2[0]+s*.02,B2[1]-B2[2]*.82,J[0],J[1],-s*.1)+place(J[0],J[1],-62,s*.48,function(){return leaf2(s*.48,"fruit").art})+ball(B1[0],B1[1],B1[2])+ball(B2[0],B2[1],B2[2]);
    var dp=pol(B2[2]*.35,la+2.3);o+=drop(B2[0]+dp[0],B2[1]+dp[1],s*.07);
    return {art:o,sil:'<circle cx="'+n(B1[0])+'" cy="'+n(B1[1])+'" r="'+n(B1[2])+'"/><circle cx="'+n(B2[0])+'" cy="'+n(B2[1])+'" r="'+n(B2[2])+'"/>'};
  }
  /* ---- uva: acini traslucidi con pruina, pedicelli, raspo ---- */
  function grape(s){
    var v=i%3,o="",sil="",k,pts=[];
    function gb(x,y,r){sil+='<circle cx="'+n(x)+'" cy="'+n(y)+'" r="'+n(r)+'"/>';var j,b="";
      for(j=0;j<3;j++)b+=el(x+(R(j+Math.round(x))*2-1)*r*.5,y+(R(j+Math.round(y)+9)*2-1)*r*.5,r*.3,r*.2,R(j)*180,"#efe4fb",.14);
      return ci(x,y,r,"url(#gGrpA)")+ci(x,y,r,"url(#"+SH+")")+ci(x,y,r,"#efe6fa",.12)+b+ci(x,y,r,"none",null,' stroke="#1c0733" stroke-opacity=".45" stroke-width="'+n(s*.014)+'"')+spec(x,y,r,.6)+rim(x,y,r,"#d9b8ff",.4)}
    if(v===1){[[-.42,.34,.46],[.44,.38,.5],[-.02,-.38,.48]].forEach(function(g){pts.push([g[0]*s,g[1]*s,g[2]*s])});
      o=stk('M'+n(-s*.02)+' '+n(-s*.8)+'C'+n(s*.02)+' '+n(-s*1.0)+' '+n(s*.2)+' '+n(-s*1.1)+' '+n(s*.34)+' '+n(-s*1.2),"#5b3a1b",s*.07);
      pts.forEach(function(g){o+=gb(g[0],g[1],g[2])});o+=drop(pts[1][0]+pol(s*.2,la+2)[0],pts[1][1]+pol(s*.2,la+2)[1],s*.08);return {art:o,sil:sil}}
    var rows=[4,3,3,2,1],sc=.86,r=s*.27*sc;
    rows.forEach(function(cnt,jj){for(k=0;k<cnt;k++)pts.push([(k-(cnt-1)/2)*r*1.82+(rnd(i*40+jj*7+k)-.5)*r*.3,(-.66+jj*.4)*s*sc+(rnd(i*40+jj*7+k+3)-.5)*r*.3])});
    pts.sort(function(a,b){return b[1]-a[1]});
    o=stk('M0 '+n(-s*.62)+'C'+n(-s*.04)+' '+n(-s*.9)+' '+n(s*.04)+' '+n(-s*1.05)+' '+n(s*.14)+' '+n(-s*1.2),"#5b3a1b",s*.075)+stk('M'+n(s*.14)+' '+n(-s*1.2)+'C'+n(s*.3)+' '+n(-s*1.32)+' '+n(s*.46)+' '+n(-s*1.16)+' '+n(s*.36)+' '+n(-s*1.08),"#7aa23a",s*.02);
    pts.forEach(function(q){o+=stk('M'+n(q[0])+' '+n(q[1]-r*.8)+'L'+n(q[0]*.3)+' '+n(-s*.62),"#6b4a22",s*.025,.8)});
    pts.forEach(function(q){o+=gb(q[0],q[1],r)});
    o+=place(s*.1,-s*1.08,-56,s*.48,function(){return leaf2(s*.48,"fruit").art});
    if(i%2===0)o+=drop(pts[2][0]+pol(r*.3,la+2)[0],pts[2][1]+pol(r*.3,la+2)[1],r*.22);
    return {art:o,sil:sil};
  }
  /* ---- mango ---- */
  function mango(s){
    var v=i%3,o,j;
    if(v===1){var rx=s*.56,ry=s*.9,d=s*.17,c,yh,xh,th=pol(s*.06,la+PI);
      o=el(th[0],th[1],s*.66,s*.98,0,"#9c4a10")+el(0,0,s*.66,s*.98,0,"url(#fMngA)")+el(0,0,s*.66,s*.98,0,"url(#fMngB)")+el(0,0,rx,ry,0,"url(#fMngF)");
      for(c=-3;c<=3;c++){yh=ry*Math.sqrt(Math.max(0,1-Math.pow(c*d/rx,2)))*.97;xh=rx*Math.sqrt(Math.max(0,1-Math.pow(c*d/ry,2)))*.97;
        if(Math.abs(c*d)<rx*.97)o+=stk('M'+n(c*d)+' '+n(-yh)+'L'+n(c*d)+' '+n(yh),"#c97400",s*.022,.55)+stk('M'+n(c*d+s*.02)+' '+n(-yh)+'L'+n(c*d+s*.02)+' '+n(yh),"#fff5b8",s*.012,.6);
        if(Math.abs(c*d)<ry*.97)o+=stk('M'+n(-xh)+' '+n(c*d)+'L'+n(xh)+' '+n(c*d),"#c97400",s*.022,.55)+stk('M'+n(-xh)+' '+n(c*d+s*.02)+'L'+n(xh)+' '+n(c*d+s*.02),"#fff5b8",s*.012,.6)}
      o+=el(0,0,rx,ry,0,"url(#"+FL+")");
      for(j=0;j<12;j++){var ga=la+(R(j+90)*2-1)*.8,gp=pol(s*(.2+R(j+95)*.5),ga);o+=el(gp[0]*.7,gp[1],s*(.02+R(j+99)*.03),s*.012,deg(ga)+90,"#fff",.85)}
      var sp2=pol(s*.35,la);o+=el(sp2[0]*.7,sp2[1],rx*.6,ry*.45,0,"url(#gSoft)",.3);
      return {art:o,sil:'<ellipse rx="'+n(s*.66)+'" ry="'+n(s*.98)+'"/>'}}
    var sk='M'+n(-s*.1)+' '+n(-s*.95)+'C'+n(s*.5)+' '+n(-s*1.0)+' '+n(s*1.0)+' '+n(-s*.5)+' '+n(s*.95)+' '+n(s*.15)+'C'+n(s*.9)+' '+n(s*.75)+' '+n(s*.4)+' '+n(s*1.0)+' '+n(-s*.1)+' '+n(s*.98)+'C'+n(-s*.7)+' '+n(s*.95)+' '+n(-s*1.0)+' '+n(s*.4)+' '+n(-s*.92)+' '+n(-s*.2)+'C'+n(-s*.85)+' '+n(-s*.7)+' '+n(-s*.5)+' '+n(-s*.92)+' '+n(-s*.1)+' '+n(-s*.95)+'Z';
    o='<g transform="scale(.8 1)">'+pa(sk,"url(#fMngA)")+pa(sk,"url(#fMngB)");
    for(j=0;j<40;j++){var a=R(j)*PI*2,rr=Math.sqrt(R(j+4))*s*.85;o+=ci(Math.cos(a)*rr,Math.sin(a)*rr,s*(.01+R(j+9)*.014),"#fff6c4",.5)}
    o+=pa(sk,"url(#"+SH+")")+pa(sk,"none",null,' stroke="#a5481a" stroke-opacity=".3" stroke-width="'+n(s*.03)+'"')+el(-s*.1,-s*.88,s*.2,s*.07,0,"#5d3a12",.6)+stk('M'+n(-s*.1)+' '+n(-s*.9)+'Q'+n(-s*.06)+' '+n(-s*1.0)+' '+n(s*.02)+' '+n(-s*1.08),"#6b4a1e",s*.07)+'</g>';
    var hp=pol(s*.4,la);o+=el(hp[0]*.8,hp[1],s*.28,s*.17,deg(la)+90,"url(#gHi)",.5)+el(hp[0]*.95,hp[1]*1.15,s*.07,s*.04,deg(la)+90,"#fff",.8)+rim(0,0,s*.85,"#ffd66b",.35);
    if(v===2){var dp=pol(s*.3,la+2.3);o+=drop(dp[0]*.8,dp[1],s*.08)}
    return {art:o,sil:'<path transform="scale(.8 1)" d="'+sk+'"/>'};
  }
  /* ---- anguria ---- */
  function melon(s){
    var m6=i%6,v=m6===5?2:m6%2,o="",j,k;
    function sec(ax,ay,Rr,a1,a2){var A1=a1*PI/180,A2=a2*PI/180;return 'M'+n(ax)+' '+n(ay)+'L'+n(ax+Math.cos(A1)*Rr)+' '+n(ay+Math.sin(A1)*Rr)+'A'+n(Rr)+' '+n(Rr)+' 0 0 1 '+n(ax+Math.cos(A2)*Rr)+' '+n(ay+Math.sin(A2)*Rr)+'Z'}
    function seed(x,y,rt){var h=pol(s*.012,la-rt*PI/180);return '<g transform="translate('+n(x)+' '+n(y)+') rotate('+n(rt)+')"><ellipse rx="'+n(s*.036)+'" ry="'+n(s*.072)+'" fill="#1b1212"/><ellipse cx="'+n(h[0])+'" cy="'+n(h[1]-s*.02)+'" rx="'+n(s*.01)+'" ry="'+n(s*.026)+'" fill="#fff" opacity=".55"/></g>'}
    if(v===2){var a=s*.74,rr=a*.22,sq=rp([[-a,-a],[a,-a],[a,a],[-a,a]],rr),th=pol(s*.07,la+PI);
      o=pa(sq,"#c2223c",null,tr(th))+pa(sq,"url(#fWm)");
      for(j=0;j<60;j++)o+=ci((R(j)*2-1)*a*.85,(R(j+70)*2-1)*a*.85,s*(.008+R(j+140)*.01),"#ffd5dc",.35);
      [[-.4,-.35,20],[.3,-.1,-30],[-.1,.45,50],[.5,.55,5]].forEach(function(q){o+=seed(q[0]*a,q[1]*a,q[2])});
      o+=pa(sq,"url(#"+FL+")");for(j=0;j<8;j++){var gp=pol(a*(.2+R(j+300)*.55),la+(R(j+310)*2-1)*.8);o+=ci(gp[0],gp[1],s*(.012+R(j+320)*.02),"#fff",.8)}
      return {art:o,sil:'<path d="'+sq+'"/>'}}
    var ax,ay,Rr,a1,a2;if(v===0){ax=0;ay=-s*.52;Rr=s*1.02;a1=0;a2=180}else{ax=0;ay=-s*.95;Rr=s*1.95;a1=58;a2=122}
    var sh=sec(ax,ay,Rr,a1,a2),th2=pol(s*.07,la+PI),A=a1*PI/180,B=a2*PI/180;
    o=pa(sh,"#1f5a26",null,tr(th2))+pa(sh,"#2f7a38")+pa(sec(ax,ay,Rr*.945,a1,a2),"#bfe58f")+pa(sec(ax,ay,Rr*.915,a1,a2),"#f5fbe6")+pa(sec(ax,ay,Rr*.88,a1,a2),"#ffb5c0")+pa(sec(ax,ay,Rr*.85,a1,a2),"url(#fWm)");
    for(j=0;j<11;j++){var aa=A+(B-A)*(j+.5)/11;o+=stk('M'+n(ax+Math.cos(aa)*Rr*.985)+' '+n(ay+Math.sin(aa)*Rr*.985)+'L'+n(ax+Math.cos(aa+.015)*Rr*.95)+' '+n(ay+Math.sin(aa+.015)*Rr*.95),"#5fae48",s*.05,.7)}
    for(j=0;j<130;j++){var ab=A+(B-A)*R(j),r0=Rr*.84*Math.sqrt(R(j+200));o+=ci(ax+Math.cos(ab)*r0,ay+Math.sin(ab)*r0,s*(.007+R(j+400)*.011),"#ffd3da",.32)}
    [[.38,3],[.58,4],[.76,5]].forEach(function(q,qi){for(k=0;k<q[1];k++){var a3=A+(B-A)*((k+.5)/q[1])+(rnd(i*30+qi*7+k)-.5)*.05;o+=seed(ax+Math.cos(a3)*Rr*q[0],ay+Math.sin(a3)*Rr*q[0],deg(a3)-90+(rnd(i*30+qi*7+k+3)-.5)*14)}});
    o+=pa(sec(ax,ay,Rr*.85,a1,a2),"url(#"+FL+")");
    for(j=0;j<12;j++){var gb=A+(B-A)*R(j+600),gr=Rr*(.2+R(j+620)*.6);o+=ci(ax+Math.cos(gb)*gr,ay+Math.sin(gb)*gr,s*(.01+R(j+640)*.018),"#fff",.75*Math.max(.2,(Math.cos(gb)*lc[0]+Math.sin(gb)*lc[1]+1)/2))}
    if(i%2===0){var dp=pol(s*.3,la+2);o+=drop(dp[0],dp[1],s*.08,"#ff7088",.25)}
    return {art:o,sil:'<path d="'+sh+'"/>'};
  }
  /* ---- rametto di menta verde ---- */
  function sprig(s){
    var o=stk('M'+n(s*.02)+' '+n(s*1.05)+'C'+n(-s*.06)+' '+n(s*.3)+' '+n(s*.06)+' '+n(-s*.4)+' 0 '+n(-s*.78),"#4d8a34",s*.06),Lv=[[.74,.42,52],[.28,.5,46],[-.2,.48,36]];
    Lv.forEach(function(q){[-1,1].forEach(function(sd){o+=place(sd*s*.02,q[0]*s,sd*q[2],q[1]*s,function(){return leaf2(q[1]*s,"spear").art})})});
    o+=place(0,-s*.74,0,s*.42,function(){return leaf2(s*.42,"spear").art});
    return {art:o,sil:'<ellipse cy="'+n(-s*.1)+'" rx="'+n(s*.7)+'" ry="'+n(s*.95)+'"/>'};
  }
  function wrap(e){e.art=defs+e.art;return e}
  if(kind==="ice")return wrap(i%3===0?(function(){var e=leaf2(s*.95,"pep");e.art+=drop(s*.15,-s*.2,s*.08)+drop(-s*.12,s*.35,s*.055);return e})():cube(s*1.12));
  if(kind==="leaf")return wrap(i%4===3?sprig(s*.95):(function(){var e=leaf2(s*(1+R(1)*.2),"spear");e.art+=drop(s*.12,-s*.25,s*.08);return e})());
  if(kind==="citrus"){var cm=i%6;if(cm===3||cm===4)return fxElem0("citrus",i-(i%6)+cm,s);return wrap(slice(s*.92,["orange","lemon","lime","lemon","orange","lemon"][cm]))}
  if(kind==="coffee")return wrap(i%6===5?cofDrop(s):bean(s*.72));
  if(kind==="berry"){var m=i%8;return wrap(m===0||m===4?straw(s*.62):m===1||m===5?drupes(s*.85,false):m===2||m===6?blueb(s*.6):drupes(s*.85,true))}
  if(kind==="licorice"){var q=i%6;return q===3?fxElem0("licorice",i-(i%5)+3,s):wrap(q===5?lpill(s*.8):wheel(s*.92))}
  if(kind==="vanilla"){var vq=i%5;return wrap(vq===1?orchid(s*.8):(i%10===3)?cream(s):pod(s))}
  if(kind==="peach")return wrap(peach(s*.9));
  if(kind==="cherry")return wrap(cherry(s*.9));
  if(kind==="grape")return wrap(grape(s*.95));
  if(kind==="mango")return wrap(mango(s*.92));
  if(kind==="melon")return wrap(melon(s*.95));
  return fxElem0(kind,i,s);
}
/* sfondo: composizione a tre piani con primo piano sfocato, alone dietro la lattina, liquidi del gusto e grana */
function sceneSVG(p){
  var kind=sceneTheme(p).kind,n=nn;
  if(kind==="bubble")return sceneSVG0(p);
  FXU=0;
  var sd=hashStr(lab(p))%89,LA=225*Math.PI/180,all=[],layers={F:"",N:"",M:"",B:""};
  function free(x,y,r,k){for(var j=0;j<all.length;j++){var q=all[j];if(Math.hypot(q[0]-x,q[1]-y)<(q[2]+r)*k)return false}return true}
  function hidden(x,y,r,canPad){return Math.hypot(x-195,y-372)<r*.5+canPad||Math.hypot(x-344,y-30)<r+34||(x<130&&y<70)}
  /* primo piano: 2-3 grandi elementi sfocati tagliati dai bordi */
  var FC=[[-14,190],[404,120],[-24,640],[410,560],[60,905],[352,905]],j,t=0,picks=[];
  for(j=0;j<FC.length;j++)if(rnd(sd*7+j)>.42&&picks.length<3)picks.push(FC[j]);if(picks.length<2)picks=[FC[1],FC[2]];
  picks.forEach(function(q,k){var sz=118+rnd(sd+k*5)*40,rt=Math.round(rnd(sd+k*9)*360),e=fxElem(kind,90+k,sz,rt);
    layers.F+='<g transform="translate('+n(q[0])+' '+n(q[1])+') rotate('+rt+')">'+e.art+'</g>'});
  /* tre piani: a fuoco (N), intermedio (M), lontano (B) */
  var plan=[["N",9,52,26,140],["M",10,36,16,128],["B",14,22,12,60]];
  plan.forEach(function(pl){var cnt=0,tries=0;
    while(cnt<pl[1]&&tries<400){tries++;var q=sd*1000+t++,x=rnd(q*3+1)*400-5,y=rnd(q*3+2)*860-8,sz=pl[2]+rnd(q*3+3)*pl[3];
      if(hidden(x,y,sz,pl[4]))continue;if(!free(x,y,sz,pl[0]==="B"?.8:.9))continue;
      all.push([x,y,sz]);cnt++;
      var rt=Math.round(rnd(q+300)*360),e=fxElem(kind,cnt+(pl[0]==="M"?20:pl[0]==="B"?50:0),sz,rt),od=sz*(pl[0]==="N"?.26:pl[0]==="M"?.17:.1),
        sh='<g transform="translate('+n(od*.6)+' '+n(od)+')" fill="var(--s-shadow)" filter="url(#sc-shS)"'+(pl[0]==="B"?' opacity=".6"':'')+'><g transform="rotate('+rt+')">'+e.sil+'</g></g>'+
          (pl[0]==="N"?'<g transform="translate('+n(od*.22)+' '+n(od*.38)+')" fill="var(--s-shadow)" opacity=".55" filter="url(#sc-shT)"><g transform="rotate('+rt+')">'+e.sil+'</g></g>':'');
      layers[pl[0]]+='<g transform="translate('+n(x)+' '+n(y)+')">'+sh+'<g transform="rotate('+rt+')">'+e.art+'</g></g>'}});
  /* gocce, schizzi e particelle del gusto */
  var DT={ice:["#ffffff",.12],leaf:["#ffffff",.12],citrus:["#ffcf3a",.38],berry:["#e0204a",.4],cherry:["#7a0a2a",.5],grape:["#7a3aa8",.4],peach:["#ff9a52",.35],mango:["#ffb020",.4],melon:["#ff4f6d",.4],coffee:["#3d1d0b",.85],vanilla:["#fff6e2",.9],licorice:["#160f18",.9]}[kind],parts="",k;
  for(k=0;k<22;k++){var x=rnd(sd+k*2+1)*390,y=rnd(sd+k*2+2)*844,r=2+Math.pow(rnd(sd+k+90),2)*7;if(hidden(x,y,r,120))continue;parts+=fxDrop(x,y,r,LA,DT[0],DT[1])}
  if(kind==="ice")for(k=0;k<26;k++){var xs=rnd(k*5+1)*390,ys=rnd(k*5+2)*844,rs=2+rnd(k*5+3)*4;parts+='<path d="M'+n(xs)+' '+n(ys-rs)+'L'+n(xs+rs*.2)+' '+n(ys-rs*.2)+'L'+n(xs+rs)+' '+n(ys)+'L'+n(xs+rs*.2)+' '+n(ys+rs*.2)+'L'+n(xs)+' '+n(ys+rs)+'L'+n(xs-rs*.2)+' '+n(ys+rs*.2)+'L'+n(xs-rs)+' '+n(ys)+'L'+n(xs-rs*.2)+' '+n(ys-rs*.2)+'Z" fill="#fff" opacity="'+n(.5+rnd(k+7)*.45)+'"/>'}
  if(kind==="vanilla"||kind==="coffee")for(k=0;k<60;k++)parts+='<circle cx="'+n(rnd(k*3+11)*390)+'" cy="'+n(rnd(k*3+12)*844)+'" r="'+n(.6+rnd(k*3+13)*1.3)+'" fill="'+(kind==="vanilla"?"#2a1608":"#4a2412")+'" opacity="'+n(.35+rnd(k)*.4)+'"/>';
  var mist="";
  if(kind==="ice"||kind==="leaf")for(k=0;k<6;k++)mist+='<ellipse cx="'+n(rnd(sd+k*4+1)*390)+'" cy="'+n(rnd(sd+k*4+2)*844)+'" rx="'+n(70+rnd(k+3)*80)+'" ry="'+n(40+rnd(k+5)*50)+'" fill="#fff" opacity=".2"/>';
  return '<svg viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><defs>'+fxDefs()+
    '<radialGradient id="scHalo" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset=".55" stop-color="#fff" stop-opacity=".22"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>'+
    '<radialGradient id="scKey" cx=".2" cy=".08" r=".9"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/></radialGradient>'+
    '<radialGradient id="scVig" cx=".5" cy=".45" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" style="stop-color:var(--s-lid);stop-opacity:.32"/></radialGradient></defs>'+
    '<rect width="390" height="844" fill="url(#scKey)"/><rect width="390" height="844" fill="url(#scVig)"/>'+
    '<g filter="url(#sc-mist)">'+mist+'</g>'+
    '<g filter="url(#sc-bB)" opacity=".9">'+layers.B+'</g>'+
    '<g filter="url(#sc-bM)">'+layers.M+'</g>'+
    '<circle cx="195" cy="372" r="230" fill="url(#scHalo)"/>'+
    layers.N+'<g>'+parts+'</g>'+
    '<g filter="url(#sc-bF)">'+layers.F+'</g>'+
    '<rect width="390" height="844" filter="url(#sc-grain)" opacity=".1"/></svg>';
}

var sceneKey="";
function applyScene(p){
  var key=lab(p)+"|"+p.format+"|"+p.mg;
  if(key===sceneKey)return;
  sceneKey=key;
  var th=sceneTheme(p),scr=$("#screen"),m;
  for(m in th.sl)scr.style.setProperty("--sl-"+m,th.sl[m]);
  for(m in th.sd)scr.style.setProperty("--sd-"+m,th.sd[m]);
  $("#scene").innerHTML=sceneSVG(p);
}
/* ---------- viste ---------- */
var RR=82,CC=2*Math.PI*RR;
function arcEl(cls,level){
  return '<circle class="'+cls+'" cx="100" cy="100" r="'+RR+'" transform="rotate(-90 100 100)" stroke-dasharray="'+(level*CC).toFixed(2)+' '+CC.toFixed(2)+'"'+(level<0.004?' style="visibility:hidden"':'')+'/>';
}
function ringState(){
  var rem=Math.max(0,(S.ps+S.pd-now())/1000),f=S.pd>0?rem/(S.pd/1000):0;
  var level=S.phase==="active"?f:1-f;
  var label=S.phase==="active"?(rem<=0?"Tempo finito":"In uso"):"Attesa";
  return {rem:rem,level:level,label:label,time:mmss(rem)};
}
function pouchHTML(){
  var r=ringState(),aria=r.label+", "+Math.ceil(r.rem/60)+" minuti";
  var inner='<span class="text-timer" data-t>'+r.time+'</span><span class="text-body-strong" data-l>'+r.label+'</span>';
  var ring='<circle class="ds-ring__track" cx="100" cy="100" r="'+RR+'"/>'+arcEl("ds-ring__arc-o",r.level)+arcEl("ds-ring__arc",r.level);
  return '<div class="ds-ring ds-ring--'+S.phase+'" id="pouch" role="img" aria-label="'+esc(aria)+'">'+
    '<svg viewBox="0 0 200 200" aria-hidden="true"><defs><linearGradient id="gShine" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".7"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs><circle class="ds-ring__disc" cx="100" cy="100" r="97"/><ellipse class="ds-ring__shine" cx="100" cy="64" rx="54" ry="26"/>'+ring+'</svg>'+
    '<div class="ds-ring__content">'+inner+'</div></div>';
}
function updatePouch(){
  var el=$("#pouch");if(!el||S.phase==="ready"||el.classList.contains("packcan"))return;
  var r=ringState(),i;
  var arcs=el.querySelectorAll(".ds-ring__arc,.ds-ring__arc-o");
  for(i=0;i<arcs.length;i++){
    arcs[i].setAttribute("stroke-dasharray",(r.level*CC).toFixed(2)+" "+CC.toFixed(2));
    arcs[i].style.visibility=r.level<0.004?"hidden":"visible";
  }
  var ts=el.querySelectorAll("[data-t]"),ls=el.querySelectorAll("[data-l]");
  for(i=0;i<ts.length;i++){if(ts[i].textContent!==r.time)ts[i].textContent=r.time}
  for(i=0;i<ls.length;i++){if(ls[i].textContent!==r.label)ls[i].textContent=r.label}
  var aria=r.label+", "+Math.ceil(r.rem/60)+" minuti";
  if(el.getAttribute("aria-label")!==aria&&Math.ceil(r.rem)%60===0)el.setAttribute("aria-label",aria);
}
function emptyHTML(title,body,btn,act){
  return '<section class="ds-empty"><div class="ds-pouch ds-pouch--small" style="--level:0" role="img" aria-label="Bustina vuota"><span class="ds-pouch__seam ds-pouch__seam--l"></span><span class="ds-pouch__seam ds-pouch__seam--r"></span></div>'+
    '<h2 class="text-heading">'+title+'</h2><p class="text-body muted">'+body+'</p>'+
    (btn?'<button class="ds-button ds-button--primary text-button" data-act="'+act+'">'+btn+'</button>':'')+'</section>';
}
function viewOggi(){
  var p=curPack();
  if(!p&&S.phase==="ready"){return '<div class="oggi"><h1 class="large-title">Oggi</h1>'+emptyHTML(S.packs.length?"Confezioni finite":"Aggiungi una confezione",S.packs.length?"Aggiungi la prossima per continuare a contare.":"Ti serve per contare nicotina e spesa.","Aggiungi confezione","addpack")+'</div>'}
  var main="";
  if(S.phase==="ready"){
    main='<button class="ds-button ds-button--primary ds-button--block text-button" data-act="start">Metti una bustina</button>';
  }else if(S.phase==="active"){
    main='<button class="ds-button ds-button--primary ds-button--block text-button" data-act="remove">Togli la bustina</button>';
  }else{
    main=p?'<button class="ds-button ds-button--primary ds-button--block text-button" data-act="early">Inizia comunque</button>':'<button class="ds-button ds-button--primary ds-button--block text-button" data-act="addpack">Aggiungi confezione</button>';
  }
  var chg=!!p&&!!S.shownPack&&S.shownPack!==p.id;if(p)S.shownPack=p.id;
  var g=goalNow(),used=usedToday(),pr=Math.min(1,used/Math.max(1,g)),MC=2*Math.PI*20;
  var mini='<button type="button" class="mini" data-act="today" aria-label="Bustine di oggi: '+used+' su '+g+'. Apri l’elenco"><svg viewBox="0 0 48 48" aria-hidden="true"><circle class="mini__track" cx="24" cy="24" r="20"/><circle class="mini__arc" cx="24" cy="24" r="20" transform="rotate(-90 24 24)" stroke-dasharray="'+(pr*MC).toFixed(2)+' '+MC.toFixed(2)+'"'+(pr<0.004?' style="visibility:hidden"':'')+'/></svg><span class="mini__n num'+((used+"/"+g).length>4?' mini__n--s':'')+'">'+used+'/'+g+'</span></button>';
  return '<section class="oggi"><div class="page__head"><h1 class="large-title">Oggi</h1>'+mini+'</div>'+
    '<div class="oggi__pouch">'+(S.phase==="ready"?canHTML(p,chg):pouchHTML())+'</div>'+
    '<div class="oggi__actions">'+main+'</div></section>';
}
function packHTML(p){
  var sel=p.id===S.use;
  return '<button type="button" class="ds-list__row" role="radio" aria-checked="'+sel+'" data-act="use" data-id="'+p.id+'">'+
    '<span class="ds-list__text"><span class="text-body-strong">'+esc(lab(p))+'</span><span class="text-detail muted">'+p.format+' · '+mgTxt(p.mg)+' mg</span></span>'+
    '<span class="ds-list__side text-detail">'+p.left+' rimaste</span>'+
    '<span class="ds-list__check">'+(sel?ICON.check:'')+'</span></button>';
}
function stockHTML(p){
  var empty=p.left<=0,sel=p.id===S.use&&!empty,n=lab(p);
  return '<article class="ds-stock'+(empty?' ds-stock--empty':'')+'" data-use="'+sel+'">'+
    '<button class="ds-stock__main" role="radio" aria-checked="'+sel+'" data-act="use" data-id="'+p.id+'"'+(empty?' disabled':'')+'>'+
      '<span class="text-body-strong">'+esc(n)+'</span>'+
      '<span class="ds-stock__meta text-detail">'+p.format+' · '+mgTxt(p.mg)+' mg · '+p.size+' bustine</span>'+
      (sel?'<span class="ds-pack__badge text-label">'+ICON.check+'Prossima bustina</span>':empty?'<span class="text-label muted">Finita</span>':'')+'</button>'+
    '<button type="button" class="ds-stock__more" data-act="manage" data-id="'+p.id+'" aria-label="Gestisci '+esc(n)+'">'+ICON.more+'</button>'+
    '<div class="ds-stock__adj"><span class="text-detail muted">Bustine rimaste</span>'+
      '<div class="ds-stepper" role="group" aria-label="Bustine rimaste in '+esc(n)+'">'+
        '<button type="button" data-act="adj" data-id="'+p.id+'" data-d="-1" aria-label="Togli una bustina da '+esc(n)+'"'+(p.left<=0?' disabled':'')+'>'+ICON.minus+'</button>'+
        '<output class="text-body-strong num">'+p.left+'</output>'+
        '<button type="button" data-act="adj" data-id="'+p.id+'" data-d="1" aria-label="Aggiungi una bustina a '+esc(n)+'"'+(p.left>=p.size?' disabled':'')+'>'+ICON.plus+'</button>'+
      '</div></div></article>';
}
function viewScorte(){
  var head='<div class="page__head"><h1 class="large-title">Scorte</h1>'+(S.packs.length?'<button class="ds-button ds-button--primary ds-button--pill text-body-strong" data-act="addpack">'+ICON.plus+'Aggiungi</button>':'')+'</div>';
  if(!S.packs.length)return '<div class="page">'+head+emptyHTML("Nessuna confezione","Aggiungi la prima per iniziare.","Aggiungi confezione","addpack")+'</div>';
  var ps=S.packs.filter(function(p){return p.left>0}).concat(S.packs.filter(function(p){return p.left<=0}));
  return '<div class="page">'+head+
    '<p class="text-detail muted">Si usa in automatico la confezione già aperta. Tocca una confezione per usare quella. Con − togli le bustine che dai a qualcuno: non contano come usate.</p>'+
    '<div class="page__list" role="radiogroup" aria-label="Confezione in uso">'+ps.map(stockHTML).join("")+'</div></div>';
}

/* ---------- dati ---------- */
var MN=["gen","feb","mar","apr","mag","giu","lug","ago","set","ott","nov","dic"];
var WD=["dom","lun","mar","mer","gio","ven","sab"];
var MET=[["pouches","Bustine"],["mg","Nicotina"],["duration","Durata pacchetto"],["spend","Spesa"]];
var METTITLE={spend:"Spesa",mg:"Nicotina",pouches:"Bustine"};
var KEYS=["pouches","mg","spend"];
function r2(n){return Math.round(n*100)/100}
function monthKey(t){var d=new Date(t);return d.getFullYear()*12+d.getMonth()}
function packDurs(){
  var a=S.packs.filter(function(p){return p.finishedAt&&p.openedAt}).map(function(p){return {t:p.finishedAt,o:p.openedAt,name:lab(p)}}).concat(S.archived.map(function(x){return {t:x.finishedAt,o:x.openedAt,name:x.name}}));
  return a.map(function(x){return {t:x.t,dur:Math.max(.05,(x.t-x.o)/DAY),name:x.name}}).sort(function(x,y){return x.t-y.t});
}
function firstT(){
  var f=S.createdAt;
  S.uses.forEach(function(u){if(u.t<f)f=u.t});S.purchases.forEach(function(p){if(p.t<f)f=p.t});
  return f;
}
function avgOf(a){return a.length?a.reduce(function(s,v){return s+v},0)/a.length:0}
function dataset(){
  var N=new Date(),Y=N.getFullYear(),M=N.getMonth(),T=N.getDate(),DIM=new Date(Y,M+1,0).getDate();
  var vals={pouches:[],mg:[],spend:[]},labels=[],ticks=[],i,elapsed,dur={vals:[],labels:[],ticks:[],n:0,avg:0,count:0},PD=packDurs();
  if(S.range==="mese"){
    var start=new Date(Y,M,1).getTime();
    for(i=0;i<DIM;i++){
      KEYS.forEach(function(x){vals[x].push(i<T?0:null)});
      labels.push(WD[new Date(Y,M,i+1).getDay()]+" "+(i+1)+" "+MN[M]);
    }
    S.uses.forEach(function(u){if(u.t>=start){var d=new Date(u.t).getDate()-1;if(vals.pouches[d]!=null){vals.pouches[d]++;vals.mg[d]=r2(vals.mg[d]+u.mg)}}});
    S.purchases.forEach(function(p){if(p.t>=start){var d=new Date(p.t).getDate()-1;if(vals.spend[d]!=null)vals.spend[d]=r2(vals.spend[d]+p.price)}});
    [1,8,15,22,29].forEach(function(d){if(d<=DIM)ticks.push({i:d-1,t:String(d)})});
    var f0=Math.max(start,dayStart(firstT()));elapsed=Math.max(1,Math.round((dayStart(N.getTime())-f0)/DAY)+1);
    var md=PD.filter(function(x){return x.t>=start});
    md.forEach(function(x){dur.vals.push(r2(x.dur));dur.labels.push(x.name+", finita il "+new Date(x.t).getDate()+" "+MN[M])});
    var np=md.length;
    [0,Math.floor((np-1)/2),np-1].forEach(function(j,q,arr){if(np&&arr.indexOf(j)===q)dur.ticks.push({i:j,t:String(new Date(md[j].t).getDate())})});
    dur.avg=avgOf(md.map(function(x){return x.dur}));dur.count=np;
  }else{
    var f=firstT(),fk=monthKey(f),nk=monthKey(N.getTime()),n=nk-fk+1,every=Math.max(1,Math.ceil(n/6)),k;
    for(k=0;k<n;k++){
      var y=Math.floor((fk+k)/12),m=(fk+k)%12;
      KEYS.forEach(function(x){vals[x].push(0)});
      labels.push(MN[m]+" "+y);
      if(k%every===0||k===n-1&&n<=6)ticks.push({i:k,t:MN[m]});
      var pm=PD.filter(function(x){return monthKey(x.t)===fk+k}).map(function(x){return x.dur});
      dur.vals.push(pm.length?r2(avgOf(pm)):null);dur.labels.push(MN[m]+" "+y);
    }
    dur.ticks=ticks.slice();
    S.uses.forEach(function(u){var j=monthKey(u.t)-fk;if(j>=0&&j<n){vals.pouches[j]++;vals.mg[j]=r2(vals.mg[j]+u.mg)}});
    S.purchases.forEach(function(p){var j=monthKey(p.t)-fk;if(j>=0&&j<n)vals.spend[j]=r2(vals.spend[j]+p.price)});
    elapsed=Math.max(1,Math.round((dayStart(N.getTime())-dayStart(f))/DAY)+1);
    dur.avg=avgOf(PD.map(function(x){return x.dur}));dur.count=PD.length;
    if(!PD.length){dur.vals=[];dur.labels=[];dur.ticks=[]}
  }
  dur.n=dur.vals.length;
  return {vals:vals,labels:labels,ticks:ticks,elapsed:elapsed,n:labels.length,dur:dur,first:firstT()};
}
function series(D,m){
  return m==="duration"?{vals:D.dur.vals,labels:D.dur.labels,ticks:D.dur.ticks,n:D.dur.n}:{vals:D.vals[m],labels:D.labels,ticks:D.ticks,n:D.n};
}
function sumOf(a){return a.reduce(function(s,v){return s+(v==null?0:v)},0)}
function lastIdx(a){for(var i=a.length-1;i>=0;i--)if(a[i]!=null)return i;return 0}
function dec(n){return (Math.round(n*10)/10).toString().replace(".",",")}
function fmtVal(m,v){
  if(v==null)return "—";
  if(m==="spend")return eur(v);
  if(m==="mg")return fmtN(v)+" mg";
  if(m==="duration")return dec(v)+(dec(v)==="1"?" giorno":" giorni");
  return fmtN(v)+(v===1?" bustina":" bustine");
}
function fmtAxis(m,v){
  if(m==="spend")return dec(v)+" €";
  if(m==="duration")return dec(v);
  return fmtN(v);
}
function nice(v){
  var p=Math.pow(10,Math.floor(Math.log(v)/Math.LN10)),f=v/p,s=[1,1.5,2,3,4,5,6,8,10];
  for(var i=0;i<s.length;i++)if(f<=s[i]+1e-9)return s[i]*p;
  return 10*p;
}
function chartTitle(m){
  if(m==="duration")return S.range==="mese"?"Durata per confezione":"Durata media per mese";
  return METTITLE[m]+(S.range==="mese"?" per giorno":" per mese");
}
function tileHTML(D,m){
  var el=D.elapsed,fig,sub;
  if(m[0]==="duration"){
    fig=D.dur.count?dec(D.dur.avg)+'<small class="unit"> '+(dec(D.dur.avg)==="1"?"giorno":"giorni")+'</small>':"—";
    sub=D.dur.count?"Media per confezione. Ne hai finite "+D.dur.count:"Nessuna confezione finita";
  }else{
    var tot=sumOf(D.vals[m[0]]);
    if(m[0]==="spend"){fig=eur(tot);var pc=sumOf(D.vals.pouches);sub=pc?"Circa "+eur(tot/pc)+" a bustina":"Acquisti del periodo"}
    else if(m[0]==="mg"){fig=fmtN(tot)+'<small class="unit"> mg</small>';sub="Media "+fmtN(tot/el)+" mg al giorno"}
    else{fig=fmtN(tot);sub="Media "+dec(tot/el)+" al giorno"}
  }
  var on=S.metric===m[0];
  return '<button class="ds-tile" role="radio" aria-checked="'+on+'" data-act="metric" data-m="'+m[0]+'">'+
    '<span class="ds-tile__label text-label">'+m[1]+'</span><span class="text-title num">'+fig+'</span><span class="ds-tile__sub text-label">'+sub+'</span></button>';
}
function chartHTML(D){
  var m=S.metric,ser=series(D,m),vs=ser.vals,mx=0,goal=(m==="pouches"&&S.range==="mese")?goalNow():0,title=chartTitle(m);
  if(!ser.n||vs.every(function(v){return v==null}))return '<section class="ds-chart" aria-label="'+title+'"><h2 class="text-heading">'+title+'</h2><p class="text-body muted">'+(m==="duration"?"Ancora nessuna confezione finita "+(S.range==="mese"?"questo mese.":"."):"Ancora nessun dato.")+'</p></section>';
  vs.forEach(function(v){if(v!=null&&v>mx)mx=v});
  var top=nice(Math.max(mx,goal,1)),sel=S.sel!=null&&vs[S.sel]!=null?S.sel:lastIdx(vs);
  var bars=vs.map(function(v,i){
    return '<span class="ds-chart__bar'+(v==null?' is-future':'')+(i===sel?' is-sel':'')+'" style="height:'+(v==null?0:(v/top*100).toFixed(1))+'%"></span>';
  }).join("");
  var ticks=ser.ticks.map(function(t){return '<span class="text-label" style="left:'+((t.i+.5)/ser.n*100).toFixed(2)+'%">'+t.t+'</span>'}).join("");
  var goalEl=goal?'<span class="ds-chart__goal" style="bottom:'+(goal/top*100).toFixed(1)+'%"><span class="text-label">Obiettivo '+goal+'</span></span>':'';
  var txt=ser.labels[sel]+": "+fmtVal(m,vs[sel]);
  var pickW=(m==="duration"&&S.range==="mese")?"una confezione":S.range==="mese"?"un giorno":"un mese";
  return '<section class="ds-chart'+(ser.n<=16?' ds-chart--tot':'')+'" aria-label="'+title+'">'+
    '<h2 class="text-heading">'+title+'</h2>'+
    '<div class="ds-chart__head"><span class="text-detail muted" id="ch-when">'+esc(ser.labels[sel])+'</span><span class="text-body-strong num" id="ch-val">'+esc(fmtVal(m,vs[sel]))+'</span></div>'+
    '<div class="ds-chart__body"><div class="ds-chart__axis text-label" aria-hidden="true"><span style="top:0">'+fmtAxis(m,top)+'</span><span style="top:50%">'+fmtAxis(m,top/2)+'</span><span style="top:100%">'+fmtAxis(m,0)+'</span></div>'+
    '<div class="ds-chart__main"><div class="ds-chart__plot" tabindex="0" role="slider" aria-label="Scegli '+pickW+'" aria-valuemin="0" aria-valuemax="'+(ser.n-1)+'" aria-valuenow="'+sel+'" aria-valuetext="'+esc(txt)+'" data-n="'+ser.n+'">'+
      '<span class="ds-chart__grid" style="bottom:100%"></span><span class="ds-chart__grid" style="bottom:50%"></span>'+goalEl+
      '<div class="ds-chart__bars">'+bars+'</div></div>'+
    '<div class="ds-chart__x" aria-hidden="true">'+ticks+'</div></div></div>'+
    '</section>';
}
function row(label,value,note,share){
  return '<li class="ds-ledger__row"><span class="text-body">'+label+'</span><span class="ds-ledger__value text-body-strong">'+value+'</span>'+
    (note?'<span class="ds-ledger__note text-detail">'+note+'</span>':'')+
    (share!=null?'<span class="ds-ledger__bar" style="--share:'+Math.max(0,Math.min(1,share)).toFixed(3)+'" aria-hidden="true"><span></span></span>':'')+'</li>';
}
function topBy(f){
  var m={},tot=0,best=null;
  S.uses.forEach(function(e){var k=f(e);if(!k)return;m[k]=(m[k]||0)+1;tot++});
  Object.keys(m).forEach(function(k){if(best===null||m[k]>m[best])best=k});
  return best===null?null:{k:best,pct:Math.round(m[best]/tot*100)};
}
function viewDati(){
  var D=dataset(),N=new Date();
  var b=topBy(function(e){return e.brand}),f=topBy(function(e){return e.flavor}),t=topBy(function(e){return e.type});
  var prefs=(b?row("Marca preferita",esc(b.k),b.pct+"% delle bustine usate",b.pct/100):"")+
    (f?row("Gusto preferito",esc(f.k),f.pct+"% delle bustine usate",f.pct/100):"")+
    (t?row("Tipo preferito",esc(t.k),t.pct+"% delle bustine usate",t.pct/100):"")+
    row("Bustine date via",String(S.ceded.length),"Tolte dalle confezioni, non contano come usate");
  var fd=D.first?new Date(D.first):null;
  return '<div class="page"><div class="page__head"><h1 class="large-title">Dati</h1><div class="dash-seg">'+seg("range",[["mese","Mese"],["tot","Totale"]],S.range,true)+'</div></div>'+
    '<p class="text-detail muted">'+(S.range==="mese"?"Dal "+(fd.getMonth()===N.getMonth()&&fd.getFullYear()===N.getFullYear()&&fd.getDate()>1?fd.getDate():"1°")+" al "+N.getDate()+" "+MN[N.getMonth()]+".":"Dal "+fd.getDate()+" "+MN[fd.getMonth()]+" "+fd.getFullYear()+" a oggi.")+'</p>'+
    '<div class="tiles" role="radiogroup" aria-label="Statistica">'+MET.map(function(m){return tileHTML(D,m)}).join("")+'</div>'+
    (S.hintSeen?'':'<p class="text-detail muted dati-hint">Tocca un riquadro per cambiare il grafico, o il grafico per vedere un valore.</p>')+
    chartHTML(D)+
    '<h2 class="text-heading">Preferenze</h2><ul class="ds-ledger">'+prefs+'</ul></div>';
}
function selectBar(i){
  var D=dataset(),ser=series(D,S.metric),vs=ser.vals;
  if(i<0||i>=vs.length||vs[i]==null)return;
  S.sel=i;S.hintSeen=true;var hh=$(".dati-hint");if(hh)hh.hidden=true;
  var bars=document.querySelectorAll(".ds-chart__bar"),j;
  for(j=0;j<bars.length;j++)bars[j].classList.toggle("is-sel",j===i);
  var w=$("#ch-when"),val=$("#ch-val"),pl=$(".ds-chart__plot");
  if(w&&val&&pl){
    w.textContent=ser.labels[i];val.textContent=fmtVal(S.metric,vs[i]);
    pl.setAttribute("aria-valuenow",String(i));pl.setAttribute("aria-valuetext",ser.labels[i]+": "+val.textContent);
  }
}
function chartIdx(ev,el){
  var r=el.getBoundingClientRect(),n=parseInt(el.dataset.n,10);
  return Math.max(0,Math.min(n-1,Math.floor((ev.clientX-r.left)/r.width*n)));
}
function seg(key,opts,val,small){
  return '<div class="ds-segmented text-body'+(small?' ds-segmented--sm':'')+'" role="radiogroup">'+opts.map(function(o){
    return '<button type="button" class="ds-segmented__opt" role="radio" aria-checked="'+(String(o[0])===String(val))+'" data-act="seg" data-key="'+key+'" data-val="'+o[0]+'">'+o[1]+'</button>';
  }).join("")+'</div>';
}
function stepper(key,val,unit,min,max,label){
  return '<div class="ds-stepper" role="group" aria-label="'+label+'"><button type="button" data-act="step" data-key="'+key+'" data-d="-1" aria-label="Diminuisci" '+(val<=min?"disabled":"")+'>'+ICON.minus+'</button><output class="text-body-strong num">'+val+(unit?" "+unit:"")+'</output><button type="button" data-act="step" data-key="'+key+'" data-d="1" aria-label="Aumenta" '+(val>=max?"disabled":"")+'>'+ICON.plus+'</button></div>';
}
function sw(key,on,label){return '<button type="button" class="ds-switch" role="switch" aria-checked="'+on+'" aria-label="'+label+'" data-act="switch" data-key="'+key+'"></button>'}
function srow(label,ctrl,note){
  return '<li class="set-row"><div class="set-row__text"><span class="text-body">'+label+'</span>'+(note?'<span class="text-detail muted">'+note+'</span>':'')+'</div>'+ctrl+'</li>';
}
function backupNote(){
  var n=backupDays();
  if(n==null)return "Nessuna copia ancora. Salvala in iCloud Drive con «Salva su File».";
  if(n===0)return "Ultima copia: oggi.";
  var d=new Date(S.lastExport);
  return "Ultima copia: "+d.getDate()+" "+MN[d.getMonth()]+(n>=14?" · sono passati "+n+" giorni":"")+".";
}
function waitNote(){
  if(!S.calibrated)return "Intervallo base. Giorno "+Math.min(7,obsDay())+" di 7: imparo i tuoi ritmi.";
  return "Intervallo base, calibrato sui tuoi primi 7 giorni.";
}
function notifNote(){
  if(!S.notif)return isIOS()&&!isStandalone()?"Per riceverle aggiungi l’app alla schermata Home.":"Spente: non ricevi gli avvisi su togli e via libera.";
  if(!PUSH)return "Avvisi solo con l’app aperta: il server delle notifiche non è ancora attivo.";
  if(!S.sub)return "Collegamento al server delle notifiche in corso…";
  return "Ti avviso anche ad app chiusa.";
}
var btnS=' style="min-height:44px;padding:0 16px"';
function viewAltro(){
  return '<div class="page"><h1 class="large-title">Impostazioni</h1>'+
    '<ul class="set-list">'+
      srow("Obiettivo di oggi",stepper("goal",goalNow(),"",1,30,"Obiettivo di oggi"))+
      srow("Riduci l’obiettivo ogni settimana",sw("shrink",S.shrink,"Riduci l’obiettivo ogni settimana"),"1 bustina in meno a settimana.")+
      srow("Durata in uso",stepper("hold",S.hold,"min",5,60,"Durata in uso"))+
      srow("Attesa tra due bustine",stepper("wait",S.wait,"min",15,180,"Attesa tra due bustine"),waitNote())+
      srow("Attesa adattiva",sw("adaptive",S.adaptive,"Attesa adattiva"),"Si allunga quando mancano tante ore e poche bustine all’obiettivo.")+
    '</ul>'+
    '<ul class="set-list">'+
      srow("Notifiche",sw("notif",S.notif,"Notifiche"),notifNote())+
      (pushOn()?srow("Prova le notifiche",'<button class="ds-button ds-button--secondary text-body-strong"'+btnS+' data-act="testpush">Prova</button>',"Arriva entro pochi secondi."):"")+
      '<li class="set-row set-row--stack"><span class="text-body">Aspetto</span>'+seg("theme",[["auto","Auto"],["light","Chiaro"],["dark","Scuro"]],S.theme,true)+'</li>'+
    '</ul>'+
    '<h2 class="text-heading">Copia di sicurezza</h2>'+
    '<ul class="set-list">'+
      srow("Esporta i dati",'<button class="ds-button ds-button--secondary text-body-strong"'+btnS+' data-act="export">Esporta</button>',backupNote())+
      srow("Importa una copia",'<button class="ds-button ds-button--secondary text-body-strong"'+btnS+' data-act="import">Importa</button>',"Sostituisce i dati attuali con quelli di una copia.")+
      srow("Cancella tutti i dati",'<button class="ds-button ds-button--danger text-body-strong"'+btnS+' data-act="wipe">Cancella</button>',"Confezioni, bustine e statistiche.")+
    '</ul>'+
    '<p class="text-label muted" style="text-align:center">Snus Tracker '+esc(VERSION)+' · I dati restano su questo iPhone.</p></div>';
}

/* ---------- fogli e moduli ---------- */
function sheetWrap(title,body,actions,extra){
  return '<div class="ds-scrim" data-act="scrim"><div class="ds-sheet" role="dialog" aria-modal="true" aria-labelledby="sh-title"><div class="ds-sheet__grab"></div>'+
    '<h2 class="ds-sheet__title text-heading" id="sh-title" tabindex="-1">'+title+'</h2>'+(body?'<p class="ds-sheet__body text-body">'+body+'</p>':'')+(extra||"")+
    (actions?'<div class="ds-sheet__actions">'+actions+'</div>':'')+'<button type="button" class="sheet-close text-body-strong" data-act="close">Chiudi</button></div></div>';
}
function history(){
  var m={};
  S.purchases.forEach(function(p){
    var k=[p.brand,p.flavor,p.mg,p.format,p.size].join("|");
    if(!m[k])m[k]={brand:p.brand,flavor:p.flavor,mg:p.mg,format:p.format,type:p.type,size:p.size,price:p.price,n:0,last:0};
    m[k].n++;if(p.t>=m[k].last){m[k].last=p.t;m[k].price=p.price}
  });
  return Object.keys(m).map(function(k){return m[k]});
}
function presets(){
  var h=history().sort(function(a,b){return b.n-a.n||b.last-a.last});
  var top=h.slice(0,2).map(function(x){return Object.assign({tag:"Più usata"},x)});
  var rest=h.slice(2).sort(function(a,b){return b.last-a.last}).slice(0,2).map(function(x){return Object.assign({tag:"Recente"},x)});
  return top.concat(rest);
}
function priceStr(n){return n.toFixed(2).replace(".",",")}
function formHTML(){
  var F=S.form||{v:{brand:"",flavor:"",price:"",size:20,mg:"",type:"Secche",format:"Mini"},e:{}},v=F.v,e=F.e;
  function fld(id,label,val,mode,err,ph){
    return '<div class="form-item'+(err?' is-error':'')+'"><div class="form-row"><label class="text-body" for="'+id+'">'+label+'</label>'+
      '<input class="form-input text-body" id="'+id+'" inputmode="'+mode+'" autocomplete="off"'+(mode==="text"?' autocapitalize="words"':'')+' value="'+esc(val)+'"'+(ph?' placeholder="'+ph+'"':'')+(err?' aria-invalid="true" aria-describedby="'+id+'-e"':'')+'></div>'+
      (err?'<p class="ds-field__error text-detail" id="'+id+'-e">'+ICON.alert+esc(err)+'</p>':'')+'</div>';
  }
  function segRow(id,label,key,opts,val){
    return '<div class="form-item"><div class="form-row"><span class="text-body" id="'+id+'">'+label+'</span>'+
      '<div class="ds-segmented text-body" style="width:180px" role="radiogroup" aria-labelledby="'+id+'">'+opts.map(function(t){
        return '<button type="button" class="ds-segmented__opt" role="radio" aria-checked="'+(val===t)+'" data-act="'+key+'" data-val="'+t+'">'+t+'</button>';
      }).join("")+'</div></div></div>';
  }
  var edit=!!S.editId,P=edit?[]:presets();
  var pre=P.length?'<div class="ds-field"><span class="text-detail form-sec-title" id="pre-l">Ripeti un acquisto</span><div class="presets" role="radiogroup" aria-labelledby="pre-l">'+P.map(function(x,i){
    var on=v.brand===x.brand&&v.flavor===x.flavor&&String(v.mg).replace(",",".")===String(x.mg)&&v.format===x.format&&String(v.size)===String(x.size);
    return '<button type="button" class="ds-preset" role="radio" aria-checked="'+on+'" data-act="preset" data-i="'+i+'"><span class="ds-preset__tag text-label">'+x.tag+'</span><span class="text-body-strong">'+esc(x.brand+" "+x.flavor)+'</span><span class="text-detail muted">'+mgTxt(x.mg)+' mg</span><span class="text-detail muted">'+x.format+' · '+x.size+' bustine</span><span class="text-detail muted">'+eur(x.price)+'</span></button>';
  }).join("")+'</div></div>':"";
  var stepRow='<div class="form-item"><div class="form-row"><span class="text-body" id="size-l">Bustine nella confezione</span><div class="ds-stepper" role="group" aria-labelledby="size-l"><button type="button" data-act="fsize" data-d="-1" aria-label="Diminuisci"'+(v.size<=1?' disabled':'')+'>'+ICON.minus+'</button><output class="text-body-strong num">'+v.size+'</output><button type="button" data-act="fsize" data-d="1" aria-label="Aumenta"'+(v.size>=60?' disabled':'')+'>'+ICON.plus+'</button></div></div></div>';
  return '<div class="ds-scrim" data-act="scrim"><div class="addpage" role="dialog" aria-modal="true" aria-labelledby="ap-title">'+
    '<div class="ds-sheet__grab addpage__grab"></div><div class="addpage__head"><h2 class="text-heading" id="ap-title" tabindex="-1">'+(edit?"Modifica confezione":"Nuova confezione")+'</h2></div>'+
    pre+
    '<div class="form-group">'+fld("f-brand","Marca",v.brand,"text",e.brand,"Per esempio Velo")+fld("f-flavor","Gusto",v.flavor,"text",e.flavor,"Per esempio Menta forte")+'</div>'+
    '<div class="form-group">'+fld("f-price","Prezzo (€)",v.price,"decimal",e.price,"4,50")+stepRow+fld("f-mg","Forza (mg per bustina)",v.mg,"decimal",e.mg,"14")+'</div>'+
    '<p class="form-foot text-label">Controlla il prezzo: cambia da una tabaccheria all’altra.</p>'+
    '<div class="form-group">'+segRow("fmt-l","Formato","fformat",["Mini","Slim"],v.format)+'</div><p class="form-foot text-label">Mini: bustine piccole e secche. Slim: bustine grandi e umide.</p>'+
    '<button class="ds-button ds-button--primary ds-button--block text-button" data-act="save">'+ICON.check+(edit?'Salva modifiche':'Salva acquisto')+'</button><button type="button" class="sheet-close text-body-strong" data-act="close">Chiudi</button></div></div>';
}
function readForm(){
  var g=function(id){var el=document.getElementById(id);return el?el.value:""};
  var fm=S.form&&S.form.v.format||"Mini",t=fm==="Slim"?"Umide":"Secche";
  return {brand:g("f-brand"),flavor:g("f-flavor"),price:g("f-price"),size:(S.form&&S.form.v.size)||20,mg:g("f-mg"),type:t,format:fm};
}
function savePack(){
  var v=readForm(),e={},price=num(v.price),size=parseInt(v.size,10),mg=num(v.mg);
  if(!v.brand.trim())e.brand="Inserisci la marca, per esempio Velo";
  if(!v.flavor.trim())e.flavor="Inserisci il gusto, per esempio Menta forte";
  if(!(price>0))e.price="Inserisci il prezzo, per esempio 4,50";
  if(!(mg>0))e.mg="Inserisci la forza in mg, per esempio 14";
  if(Object.keys(e).length){
    S.form={v:v,e:e};render();
    var first=document.getElementById(e.brand?"f-brand":e.flavor?"f-flavor":e.price?"f-price":"f-mg");if(first)first.focus();return;
  }
  var brand=v.brand.trim(),flavor=v.flavor.trim(),t=now();
  if(S.editId){
    var q=pack(S.editId);
    if(q){
      q.brand=brand;q.flavor=flavor;q.format=v.format;q.type=v.type;q.mg=mg;q.size=size;q.price=price;q.left=Math.min(q.left,size);
      for(var i=S.purchases.length-1;i>=0;i--)if(S.purchases[i].pid===q.id){Object.assign(S.purchases[i],{brand:brand,flavor:flavor,format:v.format,type:v.type,mg:mg,size:size,price:price});break}
    }
    S.sheet=null;S.form=null;S.editId=null;save();toast("Confezione aggiornata");render();return;
  }
  var p={id:S.nextId++,brand:brand,flavor:flavor,format:v.format,type:v.type,mg:mg,size:size,left:size,price:price,boughtAt:t,openedAt:null,finishedAt:null};
  S.packs.push(p);
  S.purchases.push({t:t,pid:p.id,brand:brand,flavor:flavor,format:v.format,type:v.type,mg:mg,size:size,price:price});
  if(!avail().some(function(x){return x.id===S.use&&x.left>0}))S.use=p.id;
  S.sheet=null;S.form=null;save();toast("Acquisto salvato");render();
}
function overlayHTML(){
  switch(S.sheet){
    case "early":
      var m=Math.floor((now()-S.ps)/MIN);
      return sheetWrap("Aspetta ancora?","Sono passati "+m+" minuti su "+Math.round(S.pd/MIN)+". Vuoi iniziare lo stesso?",
        '<button class="ds-button ds-button--primary ds-button--block text-button" data-act="early-go">Inizia ora</button><button class="ds-button ds-button--secondary ds-button--block text-button" data-act="close">Aspetta</button>');
    case "perm":
      return sheetWrap("Vuoi gli avvisi?","Ti avviso quando è ora di togliere la bustina e quando c’è via libera per la prossima.",
        '<button class="ds-button ds-button--primary ds-button--block text-button" data-act="perm-yes">Attiva notifiche</button><button class="ds-button ds-button--secondary ds-button--block text-button" data-act="perm-no">Non ora</button>');
    case "install":
      return sheetWrap("Aggiungi l’app alla Home","Su iPhone le notifiche arrivano solo dall’app installata. In Safari tocca Condividi, poi «Aggiungi alla schermata Home», e apri Snus Tracker dall’icona.",
        '<button class="ds-button ds-button--primary ds-button--block text-button" data-act="close">Ho capito</button>');
    case "pick":
      return sheetWrap("Confezione attiva","","",
        '<div class="ds-list" role="radiogroup" aria-label="Confezione attiva">'+avail().map(packHTML).join("")+'</div>'+
        '<div class="ds-list"><button type="button" class="ds-list__row ds-list__add text-body-strong" data-act="addpack">'+ICON.plus+'Aggiungi confezione</button></div>');
    case "add": return formHTML();
    case "import":
      return sheetWrap("Importare una copia?","I dati attuali verranno sostituiti con quelli del file che scegli.",
        '<button class="ds-button ds-button--primary ds-button--block text-button" data-act="import-go">Scegli il file</button><button class="ds-button ds-button--secondary ds-button--block text-button" data-act="close">Annulla</button>');
    case "wipe":
      return sheetWrap("Cancellare tutti i dati?","Confezioni, bustine usate e statistiche spariscono da questo iPhone. Se vuoi, prima esporta una copia.",
        '<button class="ds-button ds-button--danger ds-button--block text-button" data-act="wipe-go">Cancella tutto</button><button class="ds-button ds-button--secondary ds-button--block text-button" data-act="close">Annulla</button>');
    case "discard":
      return sheetWrap(S.editId?"Scartare le modifiche?":"Scartare la confezione?",S.editId?"Le modifiche che hai fatto andranno perse.":"Quello che hai scritto andrà perso.",
        '<button class="ds-button ds-button--danger ds-button--block text-button" data-act="discard-go">Scarta</button><button class="ds-button ds-button--secondary ds-button--block text-button" data-act="discard-back">Continua</button>');
    case "today":
      var us=[],i0,d0=dayStart(now()),g=goalNow();
      for(i0=S.uses.length-1;i0>=0&&S.uses[i0].t>=d0;i0--){var en=S.uses[i0];us.push('<li class="swipe"><button type="button" class="swipe__act text-body-strong" data-act="delentry" data-i="'+i0+'" aria-label="Elimina la bustina delle '+hhmm(en.t)+', '+esc(en.name)+'">Elimina</button><div class="swipe__row" data-i="'+i0+'" data-open="0"><span class="entry__t text-body-strong num">'+hhmm(en.t)+'</span><span class="entry__n text-body">'+esc(en.name)+'</span><span class="entry__mg text-detail muted">'+mgTxt(en.mg)+' mg</span></div></li>')}
      return sheetWrap("Bustine di oggi",us.length?us.length+" di "+g+" bustine · Scorri a sinistra per eliminare":"Ancora nessuna bustina oggi.","",
        '<div class="ds-list"><div class="ds-list__row"><span class="ds-list__text text-body">Obiettivo di oggi</span>'+stepper("goal",g,"",1,30,"Obiettivo di oggi")+'</div></div>'+
        (us.length?'<ul class="entries">'+us.join("")+'</ul>':""));
    case "manage":
      var mp=pack(S.mid);if(!mp)return "";
      return sheetWrap(esc(lab(mp)),mp.format+" · "+mgTxt(mp.mg)+" mg · "+mp.size+" bustine · "+eur(mp.price),
        '<button class="ds-button ds-button--secondary ds-button--block text-button" data-act="edit" data-id="'+mp.id+'">Modifica</button>'+
        (mp.left>0?'<button class="ds-button ds-button--secondary ds-button--block text-button" data-act="finish" data-id="'+mp.id+'">Segna come finita</button>':'')+
        '<button class="ds-button ds-button--danger ds-button--block text-button" data-act="askdel" data-id="'+mp.id+'">Elimina confezione</button>');
    case "del":
      var dp=pack(S.mid);if(!dp)return "";
      return sheetWrap("Eliminare “"+esc(lab(dp))+"”?","Le bustine già usate restano nei dati. Questa azione non si può annullare.",
        '<button class="ds-button ds-button--danger ds-button--block text-button" data-act="del-go">Elimina</button><button class="ds-button ds-button--secondary ds-button--block text-button" data-act="close">Annulla</button>');
  }
  return "";
}

/* ---------- render ---------- */
function render(){
  var screen=$("#screen"),view=$("#view");
  var keep=view.scrollTop,sameTab=screen.dataset.tab===S.tab;
  var scp=S.tab==="oggi"?curPack():null;
  if(scp)applyScene(scp);
  screen.dataset.scene=scp?"1":"0";
  screen.dataset.tab=S.tab;screen.dataset.phase=S.phase;
  view.innerHTML=S.tab==="oggi"?viewOggi():S.tab==="scorte"?viewScorte():S.tab==="dati"?viewDati():viewAltro();
  view.scrollTop=sameTab?keep:0;
  var due=backupDue();
  var tabs=[["oggi","Oggi",ICON.pouch],["scorte","Scorte",ICON.can],["dati","Dati",ICON.bars],["altro","Impostazioni",ICON.sliders]];
  $("#tabs").innerHTML=tabs.map(function(t){return '<button class="ds-tab text-label" data-act="tab" data-tab="'+t[0]+'"'+(S.tab===t[0]?' aria-current="page"':"")+(t[0]==="altro"&&due?' aria-label="Impostazioni, una cosa da fare"':'')+'>'+t[2]+t[1]+(t[0]==="altro"&&due?'<span class="ds-tab__dot" aria-hidden="true"></span>':'')+'</button>'}).join("");
  var ov=$("#overlay"),prev=ov.dataset.k||"",html=overlayHTML();
  ov.hidden=!html;ov.innerHTML=html;
  if(html&&prev!==S.sheet+(S.form?"f":"")){var h=document.getElementById("sh-title")||document.getElementById("ap-title");if(h)h.focus()}
  ov.dataset.k=html?S.sheet+(S.form?"f":""):"";
}
/* ---------- eventi ---------- */
var fileIn=document.createElement("input");
fileIn.type="file";fileIn.accept=".json,application/json";fileIn.hidden=true;document.body.appendChild(fileIn);
fileIn.addEventListener("change",function(){if(fileIn.files&&fileIn.files[0])importFile(fileIn.files[0]);fileIn.value=""});

document.addEventListener("click",function(ev){
  var el=ev.target.closest("[data-act]");if(!el)return;
  var a=el.dataset.act;
  if(a==="scrim"&&ev.target!==el)return;
  switch(a){
    case "tab":
      if(S.tab===el.dataset.tab){$("#view").scrollTop=0;return}
      S.tab=el.dataset.tab;S.sheet=null;S.form=null;S.editId=null;$("#toast").hidden=true;render();break;
    case "start":doStart();break;
    case "remove":doRemove();break;
    case "adj":doAdj(parseInt(el.dataset.id,10),parseInt(el.dataset.d,10));break;
    case "metric":S.metric=el.dataset.m;S.sel=null;S.hintSeen=true;render();break;
    case "preset":
      var pr=presets()[parseInt(el.dataset.i,10)];
      if(pr)S.form={v:{brand:pr.brand,flavor:pr.flavor,price:priceStr(pr.price),size:pr.size,mg:mgTxt(pr.mg),type:pr.type,format:pr.format},e:{}};
      render();break;
    case "early":S.sheet="early";render();break;
    case "early-go":doStart();break;
    case "pick":S.sheet="pick";render();break;
    case "use":S.use=parseInt(el.dataset.id,10);if(S.sheet==="pick")S.sheet=null;save();render();break;
    case "addpack":S.sheet="add";S.form=null;S.editId=null;render();break;
    case "fsize":
      S.form={v:readForm(),e:S.form?S.form.e:{}};
      S.form.v.size=Math.max(1,Math.min(60,S.form.v.size+parseInt(el.dataset.d,10)));
      render();
      var nb=document.querySelector('[data-act="fsize"][data-d="'+el.dataset.d+'"]');if(nb&&!nb.disabled)nb.focus();
      break;
    case "fformat":S.form={v:readForm(),e:S.form?S.form.e:{}};S.form.v.format=el.dataset.val;S.form.v.type=el.dataset.val==="Slim"?"Umide":"Secche";render();break;
    case "save":savePack();break;
    case "close":case "scrim":requestClose();break;
    case "discard-go":closeAll();break;
    case "discard-back":S.sheet="add";render();break;
    case "perm-yes":S.sheet=null;enableNotif();break;
    case "perm-no":S.sheet=null;save();render();break;
    case "banner-close":$("#banner").innerHTML="";break;
    case "today":S.sheet="today";render();break;
    case "delentry":delEntry(parseInt(el.dataset.i,10));break;
    case "manage":S.mid=parseInt(el.dataset.id,10);S.sheet="manage";render();break;
    case "finish":finishPack(parseInt(el.dataset.id,10));S.sheet=null;render();break;
    case "askdel":S.sheet="del";render();break;
    case "del-go":deletePack(S.mid);S.mid=null;S.sheet=null;toast("Confezione eliminata");render();break;
    case "edit":
      var ep=pack(parseInt(el.dataset.id,10));
      if(ep){S.editId=ep.id;S.form={v:{brand:ep.brand,flavor:ep.flavor,price:priceStr(ep.price),size:ep.size,mg:mgTxt(ep.mg),type:ep.type,format:ep.format},e:{}};S.sheet="add";render()}
      break;
    case "export":exportData();break;
    case "import":S.sheet="import";render();break;
    case "import-go":S.sheet=null;render();fileIn.click();break;
    case "wipe":S.sheet="wipe";render();break;
    case "wipe-go":wipe();setTheme(S.theme);S.tab="oggi";render();toast("Dati cancellati");break;
    case "testpush":testPush();break;
    case "seg":
      var k=el.dataset.key,val=el.dataset.val;
      if(k==="theme"){setTheme(val);save()}else if(k==="range"){S.range=val;S.sel=null}
      render();break;
    case "switch":
      var key=el.dataset.key;
      if(key==="notif"){if(S.notif)disableNotif();else enableNotif();break}
      S[key]=!S[key];
      if(key==="shrink")S.goalSet=now();
      save();render();break;
    case "step":
      var kk=el.dataset.key,d=parseInt(el.dataset.d,10);
      if(kk==="goal"){setGoal(goalNow()+d)}
      else{
        var cfg={hold:[5,60,5],wait:[15,180,5]}[kk];
        S[kk]=clamp(S[kk]+d*cfg[2],cfg[0],cfg[1]);
        if(S.phase==="active"&&kk==="hold"&&!S.notified){S.pd=S.hold*MIN;schedulePush()}
      }
      save();render();break;
  }
});
document.addEventListener("keydown",function(ev){
  if(ev.key==="Escape"&&S.sheet){requestClose();return}
  var pl=ev.target.closest&&ev.target.closest(".ds-chart__plot");
  if(pl&&(ev.key==="ArrowLeft"||ev.key==="ArrowRight")){
    ev.preventDefault();
    var cur=parseInt(pl.getAttribute("aria-valuenow"),10);selectBar(cur+(ev.key==="ArrowRight"?1:-1));
  }
});
document.addEventListener("pointerdown",function(ev){var pl=ev.target.closest(".ds-chart__plot");if(pl)selectBar(chartIdx(ev,pl))});
var dr=null,swp=null;
function swMark(row,on){var li=row.parentNode;if(on){li.classList.add("sw")}else{setTimeout(function(){if(row.dataset.open!=="1")li.classList.remove("sw")},240)}}
function closeAll(){S.sheet=null;S.form=null;S.editId=null;render()}
function formDirty(){
  if(S.sheet!=="add"||!document.getElementById("f-brand"))return false;
  var v=readForm(),t=function(x){return String(x==null?"":x).trim()};
  if(S.editId){
    var p=pack(S.editId);if(!p)return false;
    return t(v.brand)!==p.brand||t(v.flavor)!==p.flavor||num(v.price)!==p.price||num(v.mg)!==p.mg||parseInt(v.size,10)!==p.size||v.type!==p.type||v.format!==p.format;
  }
  return !!(t(v.brand)||t(v.flavor)||t(v.price)||t(v.mg));
}
function requestClose(){
  if(formDirty()){S.form={v:readForm(),e:(S.form&&S.form.e)||{}};S.sheet="discard";render();return}
  closeAll();
}
document.addEventListener("pointerdown",function(ev){
  var open=document.querySelectorAll('.swipe__row[data-open="1"]'),i;
  for(i=0;i<open.length;i++){if(!open[i].contains(ev.target)&&!ev.target.closest(".swipe__act")){open[i].style.transition="transform .22s ease-out";open[i].style.transform="";open[i].dataset.open="0";swMark(open[i],false)}}
  var row=ev.target.closest(".swipe__row");
  if(row){swp={row:row,x:ev.clientX,y:ev.clientY,base:row.dataset.open==="1"?-88:0,on:false,off:0,w:row.offsetWidth};return}
  var sh=ev.target.closest(".ds-sheet,.addpage");
  if(!sh||ev.target.closest("button,input,label,select,textarea,[role=slider]")||sh.scrollTop>0)return;
  dr={el:sh,x:ev.clientX,y:ev.clientY,dy:0,on:false,t:performance.now()};
});
document.addEventListener("pointermove",function(ev){
  var dx,dy;
  if(swp){
    dx=ev.clientX-swp.x;dy=ev.clientY-swp.y;
    if(!swp.on){
      if(Math.abs(dy)>8&&Math.abs(dy)>Math.abs(dx)){swp=null;return}
      if(Math.abs(dx)>6&&Math.abs(dx)>Math.abs(dy)*1.2){swp.on=true;swMark(swp.row,true);swp.row.style.transition="none";try{swp.row.setPointerCapture(ev.pointerId)}catch(e){}}
      else return;
    }
    var raw=Math.min(0,swp.base+dx);if(raw<-88)raw=-88+(raw+88)*0.25;
    swp.off=Math.max(-swp.w,raw);
    swp.row.style.transform="translateX("+swp.off+"px)";
    return;
  }
  if(dr){
    dx=ev.clientX-dr.x;dy=ev.clientY-dr.y;
    if(!dr.on){
      if(dy<-6||Math.abs(dx)>Math.abs(dy)+6){dr=null;return}
      if(dy>6){dr.on=true;dr.el.style.transition="none";try{dr.el.setPointerCapture(ev.pointerId)}catch(e){}}
      else return;
    }
    dr.dy=Math.max(0,dy);
    dr.el.style.transform="translateY("+dr.dy+"px)";
  }
});
function endPtr(){
  if(swp){
    var r=swp.row,off=swp.off;
    if(swp.on){
      r.style.transition="transform .22s ease-out";
      if(off<-44){r.style.transform="translateX(-88px)";r.dataset.open="1"}
      else{r.style.transform="";r.dataset.open="0";swMark(r,false)}
    }else if(r.dataset.open==="1"){r.style.transition="transform .22s ease-out";r.style.transform="";r.dataset.open="0";swMark(r,false)}
  }
  swp=null;
  if(dr&&dr.on){
    var el=dr.el,d=dr.dy,v=d/Math.max(1,performance.now()-dr.t);
    el.style.transition="transform .22s ease-out";
    if(d>110||(d>40&&v>0.5)){
      if(el.classList.contains("addpage")&&formDirty()){el.style.transform="";requestClose()}
      else{el.style.transform="translateY(110%)";setTimeout(requestClose,200)}
    }
    else{el.style.transform=""}
  }
  dr=null;
}
document.addEventListener("pointerup",endPtr);
document.addEventListener("pointercancel",endPtr);
document.addEventListener("pointermove",function(ev){if(!ev.buttons)return;var pl=ev.target.closest(".ds-chart__plot");if(pl)selectBar(chartIdx(ev,pl))});
function fit(){
  var h=window.innerHeight,w=window.innerWidth;
  var f=w<=480?1:Math.min(1,(h-32)/864);
  document.documentElement.style.setProperty("--fit",String(f));
  /* app installata su iPhone: la finestra risulta più bassa dello schermo (esclude barra di stato e indicatore Home), quindi si usa l'altezza reale dello schermo */
  var full=h;
  if(isIOS()&&isStandalone()&&w<=480){var sh=window.screen&&screen.width<screen.height?screen.height:h;if(sh>h)full=sh}
  document.documentElement.style.setProperty("--app-h",full+"px");
}
window.addEventListener("resize",fit);
/* niente zoom con le due dita né con il doppio tocco */
["gesturestart","gesturechange"].forEach(function(t){document.addEventListener(t,function(e){e.preventDefault()},{passive:false})});

/* ritorno in primo piano: ricalcola il timer, la calibrazione e riallinea il server delle notifiche */
var lastDay=dayStart(now());
function resume(){
  calibrate();step();
  var d=dayStart(now());if(d!==lastDay){lastDay=d;render()}
  if(S.notif&&PUSH&&!S.sub)subscribePush().then(schedulePush).catch(function(){});
  else schedulePush();
}
document.addEventListener("visibilitychange",function(){if(document.visibilityState==="visible"){resume();render()}});
window.addEventListener("pageshow",function(e){if(e.persisted){resume();render()}});
if(window.matchMedia)matchMedia("(prefers-color-scheme: dark)").addEventListener("change",function(){setTheme(S.theme)});
window.addEventListener("storage",function(e){if(e.key===KEY){var ui=pick(S,Object.keys(uiDefaults()));S=Object.assign(load(),ui);render()}});

if("serviceWorker" in navigator){
  navigator.serviceWorker.register("sw.js").catch(function(){});
  navigator.serviceWorker.addEventListener("message",function(e){if(e.data&&e.data.type==="open"){S.tab="oggi";S.sheet=null;render()}});
}

setTheme(S.theme);fit();curPack();render();updateClock();resume();
setInterval(tick,250);

})();
