/* Snus Tracker — service worker: funziona offline e mostra le notifiche push */
var CACHE="snus-tracker-1.0.0";
var ASSETS=["./","index.html","app.js?v=1.0.0","config.js?v=1.0.0","manifest.webmanifest","icons/icon-180.png","icons/icon-192.png","icons/icon-512.png"];
self.addEventListener("install",function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(ASSETS)}).then(function(){return self.skipWaiting()}));
});
self.addEventListener("activate",function(e){
  e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}));
});
/* rete prima (max 3 s), poi la copia locale: funziona offline e gli aggiornamenti arrivano subito */
self.addEventListener("fetch",function(e){
  var r=e.request;if(r.method!=="GET"||new URL(r.url).origin!==location.origin)return;
  var cached=function(){return caches.match(r,{ignoreSearch:r.mode==="navigate"}).then(function(m){return m||(r.mode==="navigate"?caches.match("index.html"):undefined)})};
  var net=fetch(r).then(function(res){
    if(res.ok){var cp=res.clone();caches.open(CACHE).then(function(c){c.put(r,cp)})}
    return res;
  });
  e.respondWith(new Promise(function(done){
    var settled=false,fin=function(v){if(!settled&&v){settled=true;done(v)}};
    var t=setTimeout(function(){cached().then(fin)},3000);
    net.then(function(res){clearTimeout(t);fin(res)}).catch(function(){clearTimeout(t);cached().then(function(m){if(m)fin(m);else{settled=true;done(Response.error())}})});
  }));
});
self.addEventListener("push",function(e){
  var d={};try{d=e.data?e.data.json():{}}catch(x){d={title:"Snus Tracker",body:e.data?e.data.text():""}}
  e.waitUntil(self.registration.showNotification(d.title||"Snus Tracker",{body:d.body||"",tag:d.tag||"snus",icon:"icons/icon-192.png",badge:"icons/icon-192.png",data:{url:"./"}}));
});
self.addEventListener("notificationclick",function(e){
  e.notification.close();
  e.waitUntil(self.clients.matchAll({type:"window",includeUncontrolled:true}).then(function(cs){
    for(var i=0;i<cs.length;i++){if("focus" in cs[i]){cs[i].postMessage({type:"open"});return cs[i].focus()}}
    return self.clients.openWindow("./");
  }));
});
