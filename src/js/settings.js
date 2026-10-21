$('setBtn').onclick=function(){var th=document.documentElement.dataset.theme||'system';
  popMenu($('setBtn'),[0,1].map(function(n){return [_T('陣列 index 從 {n} 開始',{n:n}),idxBase===n?'✓':'',function(){setIdxBase(n);}];}).concat(['-'],
    [['light',_T('風格：淺色')],['dark',_T('風格：深色')],['system',_T('風格：跟著系統')]].map(function(x){return [x[1],th===x[0]?'✓':'',function(){setTheme(x[0]);}];}),['-'],lpItems(lpDef,setLpDef)),'up');};
function lpItems(cur,fn){return [['top',_T('名稱位置：上')],['bottom',_T('名稱位置：下')],['left',_T('名稱位置：左')],['right',_T('名稱位置：右')]].map(function(x){return [x[1],cur===x[0]?'✓':'',function(){fn(x[0]);}];});}
function setLpDef(v){if(lpDef===v)return; lpDef=v; try{localStorage.setItem('drycanvas-lp',v);}catch(e){} renderAll();}
function lpMenu(it){ // 單一元件自己的名稱位置；選「跟著預設」就拿掉 it.lp
  var b=$('mt').querySelector('[data-act="lpMenu"]'); if(!b) return;
  popMenu(b,lpItems(it.lp,function(v){it.lp=v;renderAll();commit();}).concat(['-',[_T('跟著預設'),it.lp?'':'✓',function(){delete it.lp;renderAll();commit();}]]));
}
function setIdxBase(n){if(idxBase===n)return; idxBase=n; try{localStorage.setItem('drycanvas-ib',n);}catch(e){} renderAll(); toast(_T('陣列 index 改成從 {n} 開始',{n:n}));}
function setTheme(t){if(t==='system') delete document.documentElement.dataset.theme; else document.documentElement.dataset.theme=t; try{localStorage.setItem('drycanvas-theme',t);}catch(e){} drawMini();}
try{matchMedia('(prefers-color-scheme:dark)').addEventListener('change',drawMini);}catch(e){} // 跟著系統時，系統換深淺色要重畫小地圖
