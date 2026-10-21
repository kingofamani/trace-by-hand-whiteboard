function packGroup(){ // 把選到的東西（含它們之間的連線、選到的筆跡）打包
  var ids=groupIds(), set={}; ids.forEach(function(i){set[i]=1;});
  return {items:clone(B.items.filter(function(x){return set[x.id];})),
          edges:clone(B.edges.filter(function(e){return set[e.from]&&set[e.to];})),
          strokes:clone(mstk.map(function(i){return B.strokes[i];}).filter(Boolean))};
}
function pasteGroup(pk,dx,dy){
  var map={}, newIds=[], newStk=[], fresh=[];
  pk.items.forEach(function(it){var c=clone(it);map[it.id]=c.id=nid();delete c.z;c.x+=dx;c.y+=dy;B.items.push(c);newIds.push(c.id);fresh.push(c);});
  pk.edges.forEach(function(e){var c=clone(e);c.id=nid();c.from=map[e.from];c.to=map[e.to];B.edges.push(c);});
  pk.strokes.forEach(function(st){var ns={t:st.t,c:st.c,f:st.f,g:st.g,p:st.p.map(function(q){return [q[0]+dx,q[1]+dy];})};B.strokes.push(ns);fresh.push(ns);newStk.push(B.strokes.length-1);});
  freshGroups(fresh); setMulti(newIds,newStk); commit();
}
function packBox(pk){ // 世界座標的外框
  var x1=1e9,y1=1e9,x2=-1e9,y2=-1e9;
  pk.items.forEach(function(it){var el=itemsEl.querySelector('[data-id="'+it.id+'"]');var w=el?el.offsetWidth:80,h=el?el.offsetHeight:40;x1=Math.min(x1,it.x);y1=Math.min(y1,it.y);x2=Math.max(x2,it.x+w);y2=Math.max(y2,it.y+h);});
  pk.strokes.forEach(function(st){st.p.forEach(function(q){x1=Math.min(x1,q[0]);y1=Math.min(y1,q[1]);x2=Math.max(x2,q[0]);y2=Math.max(y2,q[1]);});});
  return {x:x1,y:y1,w:x2-x1,h:y2-y1};
}
function dupInPlace(pk){ // 在原位置複製一份，回傳新的 id（不存檔，拖完才存）
  var map={}, ids=[], stk=[], fresh=[];
  pk.items.forEach(function(it){var c=clone(it);map[it.id]=c.id=nid();delete c._snap;delete c.z;B.items.push(c);ids.push(c.id);fresh.push(c);});
  pk.edges.forEach(function(e){var c=clone(e);c.id=nid();c.from=map[e.from];c.to=map[e.to];B.edges.push(c);});
  pk.strokes.forEach(function(st){var ns={t:st.t,c:st.c,f:st.f,g:st.g,p:st.p.map(function(q){return [q[0],q[1]];})};B.strokes.push(ns);fresh.push(ns);stk.push(B.strokes.length-1);});
  freshGroups(fresh); return {ids:ids,stk:stk};
}
function dupGroup(){
  if(!groupIds().length&&!mstk.length) return;
  if(groupIds().length===1&&!mstk.length&&!msel.length){duplicate(sel);return;}
  var pk=packGroup(), b=packBox(pk); pasteGroup(pk,0,Math.round(b.h+40)); toast(_T('已複製一份放在下面'));
}
function copyGroup(){var pk=packGroup(); if(!pk.items.length&&!pk.strokes.length) return; clip=pk; toast(_T('已複製 {n} 個，按 ⌘V 貼上',{n:pk.items.length+pk.strokes.length}));}
function pasteClip(){
  if(!clip) return; var b=packBox(clip), dx=Math.round(mouseW.x-b.x), dy=Math.round(mouseW.y-b.y);
  var r=board.getBoundingClientRect(), vis=toWorld(r.left,r.top), vis2=toWorld(r.right,r.bottom);
  if(mouseW.x<vis.x||mouseW.x>vis2.x||mouseW.y<vis.y||mouseW.y>vis2.y){dx=30;dy=30;}
  pasteGroup(clip,dx,dy);
}
function delGroup(){
  var ids=groupIds(), set={}; ids.forEach(function(i){set[i]=1;});
  B.items=B.items.filter(function(x){return !set[x.id];});
  B.edges=B.edges.filter(function(e){return !set[e.from]&&!set[e.to];});
  if(mstk.length){var ks={};mstk.forEach(function(i){ks[i]=1;});B.strokes=B.strokes.filter(function(_,i){return !ks[i];});}
  pruneGroups(); clearMulti(); sel=null; renderAll(); commit();
}
function finishMarquee(){
  var r=marq.rect; marq.el.remove(); var m=marq; marq=null;
  if(!r||r.w<4&&r.h<4){ if(!m.add){clearMulti();sel=null;selEdge=null;renderAll();} return; }
  var R={l:r.x,t:r.y,r:r.x+r.w,b:r.y+r.h}, ids=[], stk=[];
  [].forEach.call(itemsEl.querySelectorAll('.it'),function(el){var q=el.getBoundingClientRect();if(q.right>R.l&&q.left<R.r&&q.bottom>R.t&&q.top<R.b)ids.push(el.dataset.id);});
  [].forEach.call(itemsEl.querySelectorAll('.stroke[data-s]'),function(el){var q=el.getBoundingClientRect();if(q.left>=R.l&&q.right<=R.r&&q.top>=R.t&&q.bottom<=R.b)stk.push(+el.dataset.s);});
  if(m.add){groupIds().forEach(function(i){if(ids.indexOf(i)<0)ids.push(i);});mstk.forEach(function(i){if(stk.indexOf(i)<0)stk.push(i);});}
  var w=withGroups(ids,stk); setMulti(w.ids,w.stk);
}

