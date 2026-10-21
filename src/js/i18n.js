/* ---------- 多國語系 ---------- */
var I18N=/*I18N*/{};
var LANGS=[['zh-TW','繁體中文'],['zh-CN','简体中文'],['en','English'],['ja','日本語'],['ko','한국어'],['fr','Français'],['hi','हिन्दी']];
function normLang(c){c=String(c||'').toLowerCase(); if(!c) return null;
  if(c.indexOf('zh')===0) return (/cn|sg|hans/.test(c))?'zh-CN':'zh-TW';
  var b=c.split('-')[0]; return ['en','ja','ko','fr','hi'].indexOf(b)>=0?b:null;}
function pickLang(){var q=(location.search.match(/[?&]lang=([\w-]+)/)||[])[1], saved=null; try{saved=localStorage.getItem('drycanvas-lang');}catch(e){}
  var c=[q,saved].concat(navigator.languages||[navigator.language]); for(var i=0;i<c.length;i++){var l=normLang(c[i]); if(l) return l;} return 'en';}
var LANG=pickLang(), DICT=I18N[LANG]||{};
var CJKRUN=/[　-〿一-鿿＀-￯]+(?:[ 　]*[　-〿一-鿿＀-￯]+)*/g;
function _T(s,v){var r=s;
  if(LANG!=='zh-TW'){ if(DICT[s]!=null) r=DICT[s]; else r=s.replace(CJKRUN,function(m){return DICT[m]!=null?DICT[m]:m;}); }
  if(v) r=r.replace(/\{(\w+)\}/g,function(m,k){return v[k]!=null?v[k]:m;});
  return r;}
function i18nStatic(){
  document.documentElement.lang=LANG==='zh-TW'?'zh-Hant':LANG==='zh-CN'?'zh-Hans':LANG;
  document.title=_T('手動跑題白板');
  var FONTS={'zh-CN':['Noto+Sans+SC','"Noto Sans SC"'],ja:['Noto+Sans+JP','"Noto Sans JP"'],ko:['Noto+Sans+KR','"Noto Sans KR"'],hi:['Noto+Sans+Devanagari','"Noto Sans Devanagari"']};
  if(FONTS[LANG]){var l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family='+FONTS[LANG][0]+':wght@400;500;700;900&display=swap';document.head.appendChild(l);
    document.documentElement.style.setProperty('--body',FONTS[LANG][1]+',system-ui,-apple-system,sans-serif');}
  var sel=document.getElementById('langSel');
  sel.innerHTML=LANGS.map(function(x){return '<option value="'+x[0]+'"'+(x[0]===LANG?' selected':'')+'>'+x[1]+'</option>';}).join('');
  sel.onchange=function(){try{localStorage.setItem('drycanvas-lang',sel.value);}catch(e){} location.href=location.pathname+'?lang='+sel.value+location.hash;};
  if(LANG==='zh-TW') return;
  var help=document.getElementById('help'); if(DICT.__help__) help.innerHTML=DICT.__help__;
  var root=document.querySelector('.app');
  var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:function(n){var p=n.parentNode; if(p.closest&&p.closest('#items,#labels,#help,select')) return NodeFilter.FILTER_REJECT; return /[一-鿿]/.test(n.nodeValue)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;}});
  var ns=[]; while(w.nextNode()) ns.push(w.currentNode);
  ns.forEach(function(n){var v=n.nodeValue, lead=v.match(/^\s*/)[0], tail=v.match(/\s*$/)[0]; n.nodeValue=lead+_T(v.trim())+tail;});
  [].forEach.call(root.querySelectorAll('[title],[aria-label],[placeholder],[data-ph]'),function(el){
    ['title','aria-label','placeholder','data-ph'].forEach(function(a){var v=el.getAttribute(a); if(v&&/[一-鿿]/.test(v)) el.setAttribute(a,_T(v));});});
  [].forEach.call(root.querySelectorAll('.pal[data-k]'),function(el){el.dataset.k=_T(el.dataset.k)+' '+el.dataset.k;});
}
i18nStatic();
