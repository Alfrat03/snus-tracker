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
