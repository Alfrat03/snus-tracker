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
window.addEventListener("resize",fit);window.addEventListener("orientationchange",function(){setTimeout(fit,300)});

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
