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
