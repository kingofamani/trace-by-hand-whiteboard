board.addEventListener('pointermove',function(e){
  mouseW=toWorld(e.clientX,e.clientY);
  if(shp){shapeEnd(e);drawShpPreview();return;}
  if(tool==='erase'){var er=$('eraser'),bb=board.getBoundingClientRect();er.style.left=(e.clientX-bb.left)+'px';er.style.top=(e.clientY-bb.top)+'px';}
  if(erasing){eraseAt(e.clientX,e.clientY);return;}
  if(marq){var x=Math.min(marq.sx,e.clientX),y=Math.min(marq.sy,e.clientY),w=Math.abs(e.clientX-marq.sx),h=Math.abs(e.clientY-marq.sy);
    marq.rect={x:x,y:y,w:w,h:h}; marq.el.style.left=(x-marq.br.left)+'px'; marq.el.style.top=(y-marq.br.top)+'px'; marq.el.style.width=w+'px'; marq.el.style.height=h+'px'; return;}
  if(drag&&drag.group){var gx=Math.round((e.clientX-drag.sx)/view.z), gy=Math.round((e.clientY-drag.sy)/view.z);
    if(!drag.moved&&Math.hypot(gx,gy)<3) return;
    if(!drag.moved&&(drag.alt||e.altKey)){ var dp=dupInPlace(packGroup()); msel=dp.ids; mstk=dp.stk; sel=null; renderAll();
      drag.orig=dp.ids.map(function(i){var o=byId(i);return {id:i,x:o.x,y:o.y};}); drag.sorig=dp.stk.map(function(i){return {i:i,p:clone(B.strokes[i].p)};}); drag.copied=true; }
    drag.moved=true;
    drag.orig.forEach(function(o){var it=byId(o.id);it.x=o.x+gx;it.y=o.y+gy;var el=itemsEl.querySelector('[data-id="'+o.id+'"]');if(el){el.style.left=it.x+'px';el.style.top=it.y+'px';}});
    drag.sorig.forEach(function(o){B.strokes[o.i].p=o.p.map(function(q){return [q[0]+gx,q[1]+gy];});});
    renderStrokes(); renderEdges(); placeToolbar(); markTrash(overPalette(e)); return;}
  if(pan){view.x=pan.vx+(e.clientX-pan.sx);view.y=pan.vy+(e.clientY-pan.sy);applyView();return;}
  if(pen){var p=toWorld(e.clientX,e.clientY),q=[Math.round(p.x),Math.round(p.y)],l=pen.p[pen.p.length-1];
    if(q[0]!==l[0]||q[1]!==l[1]){pen.p.push(q);pen.el.setAttribute('points',pen.p.map(function(a){return a[0]+','+a[1];}).join(' '));}return;}
  if(!drag) return;
  var dx=(e.clientX-drag.sx)/view.z, dy=(e.clientY-drag.sy)/view.z;
  if(!drag.moved&&Math.hypot(dx,dy)<3) return;
  if(!drag.moved&&(drag.alt||e.altKey)){ var src=byId(drag.id), cp=clone(src); cp.id=nid(); cp.x=drag.ox; cp.y=drag.oy; delete cp._snap; delete cp.z; delete cp.g; B.items.push(cp);
    sel=cp.id; activeCell=null; renderAll(); drag.id=cp.id; drag.el=itemsEl.querySelector('[data-id="'+cp.id+'"]'); drag.copied=true; }
  drag.moved=true; var it=byId(drag.id);
  var nx=Math.round(drag.ox+dx), ny=Math.round(drag.oy+dy), ddx=nx-it.x, ddy=ny-it.y;
  it.x=nx; it.y=ny; drag.el.style.left=it.x+'px'; drag.el.style.top=it.y+'px';
  renderEdges(); placeToolbar(); drawMini(); markTrash(overPalette(e));
});
board.addEventListener('pointerup',function(e){
  if(shp){shapeEnd(e);finishShape();return;}
  if(erasing){var hit=erasing.hit;erasing=null;board.classList.remove('erasing');if(hit)commit();return;}
  if(marq){finishMarquee();return;}
  if(drag&&drag.group){var g=drag;drag=null; markTrash(false);
    if(g.moved&&overPalette(e)){dropDelete(g.orig.map(function(o){return o.id;}),g.sorig.map(function(o){return o.i;}));return;}
    if(g.moved){commit();if(g.copied)toast(_T('已複製一份'));return;}
    // 沒拖動：當成點一下 → 只選這一個
    if(!g.id||g.keep){renderAll();return;}
    clearMulti(); sel=g.id; renderAll();
    if(g.tapEl&&g.tapEl.isConnected===false&&g.tapEl.dataset){ // 重畫後找回同一格
      var ds=g.tapEl.dataset, q=ds.c!=null?'[data-c="'+ds.c+'"]':ds.r!=null?'[data-r="'+ds.r+'"][data-k="'+ds.k+'"]':null;
      var ce2=q&&itemsEl.querySelector('[data-id="'+g.id+'"] '+q); if(ce2){ce2.focus();selectAll(ce2);return;}
    }
    var it0=byId(g.id); if(it0&&(it0.type==='text'||it0.type==='note')){var ed0=itemsEl.querySelector('[data-id="'+g.id+'"] [data-f="text"]');if(ed0){ed0.focus();caretEnd(ed0);}}
    return;}
  if(pan){pan=null;board.classList.remove('panning');persist();return;}
  if(pen){var done=pen;pen=null;if(done.p.length>1)B.strokes.push({p:done.p,c:done.c});renderStrokes();commit();return;}
  if(!drag) return;
  var it=byId(drag.id), moved=drag.moved, del=drag.el, drag0copied=drag.copied; drag=null; markTrash(false);
  if(moved&&overPalette(e)){dropDelete([it.id],[]);return;}
  if(!moved){
    var now=Date.now(), dbl=lastTap.id===it.id&&now-lastTap.t<400; lastTap={id:it.id,t:now};
    if(it.type==='text'||it.type==='note'){var ed=del.querySelector('[data-f="text"]');ed.focus();caretEnd(ed);return;}
    if(dbl){var ne=del.querySelector('.nv,.pn');if(ne){ne.contentEditable='true';ne.focus();selectAll(ne);}}
    return;
  }
  if(moved&&it.type==='pointer'){delete it._snap; if(e.shiftKey){var c=nearCell(it);if(c){snapPointer(it,c);renderAll();}}}
  if(moved){commit(); if(drag0copied) toast(_T('已複製一份'));}
});
board.addEventListener('dblclick',function(e){
  var nv=e.target.closest('.node');
  if(nv){var el=nv.querySelector('.nv');el.contentEditable='true';el.focus();selectAll(el);}
});
