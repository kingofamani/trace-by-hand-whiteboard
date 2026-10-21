/* ---------- 從左邊拖元件進來 ---------- */
[].forEach.call(document.querySelectorAll('.pal[data-add]'),function(b){
  b.addEventListener('pointerdown',function(e){
    e.preventDefault(); var type=b.dataset.add, ghost=null, sx=e.clientX, sy=e.clientY;
    function mv(ev){if(!ghost&&Math.hypot(ev.clientX-sx,ev.clientY-sy)>6){ghost=b.cloneNode(true);ghost.style.cssText='position:fixed;pointer-events:none;opacity:.8;z-index:20;background:var(--surface);box-shadow:var(--shadow)';document.body.appendChild(ghost);}
      if(ghost){ghost.style.left=ev.clientX+8+'px';ghost.style.top=ev.clientY+8+'px';}}
    function up(ev){window.removeEventListener('pointermove',mv);window.removeEventListener('pointerup',up);
      if(ghost){ghost.remove();var r=board.getBoundingClientRect();if(ev.clientX>r.left&&ev.clientX<r.right&&ev.clientY>r.top&&ev.clientY<r.bottom){var p=toWorld(ev.clientX,ev.clientY);addItem(type,p.x-20,p.y-20);}}
      else addItem(type);}
    window.addEventListener('pointermove',mv); window.addEventListener('pointerup',up);
  });
  b.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();addItem(b.dataset.add);}});
});
function setTool(t){tool=t;if(t!=='connect')connSrc=null;
  [].forEach.call(document.querySelectorAll('.pal.tool'),function(b){b.setAttribute('aria-pressed',b.dataset.tool===t?'true':'false');});
  board.className='board'+(t==='hand'?' hand':(t==='pen'||SHAPES.indexOf(t)>=0)?' pen':t==='connect'?' connect':t==='erase'?' erase':'');
  if(t==='erase'){var er=$('eraser');er.style.left=(mouseW.x*view.z+view.x)+'px';er.style.top=(mouseW.y*view.z+view.y)+'px';}}
[].forEach.call(document.querySelectorAll('.pal.tool'),function(b){b.onclick=function(){setTool(b.dataset.tool);if(b.dataset.tool==='connect')toast(_T('先點起點，再點終點'));renderAll();};});

