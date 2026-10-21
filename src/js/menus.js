function popMenu(anchor,items,place){ // items: [label, kbd, fn, cls] 或 '-'
  closePop(); var m=document.createElement('div'); m.className='pop'; m.id='popm';
  m.innerHTML=items.map(function(x,i){return x==='-'?'<div class="psep"></div>':'<button type="button" data-i="'+i+'" class="'+(x[3]||'')+'"><span>'+x[0]+'</span>'+(x[1]?'<kbd>'+x[1]+'</kbd>':'')+'</button>';}).join('');
  document.body.appendChild(m); var r=anchor.getBoundingClientRect();
  if(place==='up'){m.style.right=(innerWidth-r.right)+'px';m.style.bottom=(innerHeight-r.top+6)+'px';} else {m.style.left=r.left+'px';m.style.top=(r.bottom+4)+'px';}
  m.onclick=function(e){var b=e.target.closest('button[data-i]');if(!b)return;var it=items[+b.dataset.i];if(it[4]!=='keep')closePop();it[2](b);};
  setTimeout(function(){document.addEventListener('pointerdown',outside);},0);
  function outside(e){if(!m.contains(e.target)&&e.target!==anchor){closePop();}}
  m._off=function(){document.removeEventListener('pointerdown',outside);};
}
function closePop(){var m=$('popm');if(m){m._off&&m._off();m.remove();}}
function paintCdot(){var d=$('cdot');if(d)d.style.background=COLORS[penColor];}
$('colorBtn').onclick=function(){
  closePop(); var m=document.createElement('div'); m.className='pop cpop'; m.id='popm';
  m.innerHTML='<div class="crow">'+COLORS.map(function(c,i){return '<button type="button" data-c="'+i+'" style="background:'+c+'" aria-pressed="'+(i===penColor)+_T('" aria-label="顏色 ')+(i+1)+'"></button>';}).join('')+'</div>';
  document.body.appendChild(m); var r=$('colorBtn').getBoundingClientRect(); m.style.left=(r.left+r.width/2-m.offsetWidth/2)+'px'; m.style.bottom=(innerHeight-r.top+8)+'px';
  m.onclick=function(e){var b=e.target.closest('[data-c]');if(!b)return;penColor=+b.dataset.c;try{localStorage.setItem('drycanvas-color',penColor);}catch(x){}paintCdot();closePop();};
  var off=function(e){if(!m.contains(e.target)&&e.target.closest('#colorBtn')===null){closePop();}}; setTimeout(function(){document.addEventListener('pointerdown',off);},0); m._off=function(){document.removeEventListener('pointerdown',off);};
};
paintCdot();
$('boardBtn').onclick=function(){
  popMenu($('boardBtn'),[[_T('我的白板…'),'',showBoards],[_T('＋ 新的空白白板'),'',function(){newBoard(null);}],'-',[_T('匯出／匯入…'),'',function(){$('exp').click();}],'-',
    [_T('清空這個白板'),'',function(b){if(!b.dataset.arm){b.dataset.arm='1';b.querySelector('span').textContent=_T('再按一次確定清空');return;}
      B={items:[],edges:[],strokes:[],seq:B.seq};sel=null;selEdge=null;clearMulti();renderAll();commit();closePop();toast(_T('已清空，可以按 ⌘Z 找回來'));},'danger','keep']]);
};
var expBtn=document.createElement('button'); expBtn.id='exp'; expBtn.hidden=true; document.body.appendChild(expBtn);

