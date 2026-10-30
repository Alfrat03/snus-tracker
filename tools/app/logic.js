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
  var sc=document.getElementById("screen");if(sc)barColor(sc,sc.dataset.scene==="1");
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
