/* ---------- 滑鼠：拖曳、選取、連線、畫筆 ---------- */
var drag=null;
// 把元件拖回左邊元件列＝刪除
$('palette').dataset.trash=_T('放開就刪除');
function overPalette(e){var r=$('palette').getBoundingClientRect();return e.clientX>=r.left&&e.clientX<r.right&&e.clientY>=r.top&&e.clientY<r.bottom;}
function markTrash(on){$('palette').classList.toggle('trash',!!on);}
function dropDelete(ids,stk){msel=ids; mstk=stk; sel=null; delGroup(); toast(_T('已刪除，可以按 ⌘Z 找回來'));}
board.addEventListener('pointerdown',function(e){
  if(e.target.closest('.help')||e.target.closest('.modal')||e.target.closest('.dock')||e.target.closest('.navi')) return;
  var ab=e.target.closest('[data-act]');
  if(ab){e.preventDefault();e.stopPropagation();
    if(ab.closest('.it')&&sel!==ab.closest('.it').dataset.id){sel=ab.closest('.it').dataset.id;selEdge=null;}
    act(ab.dataset.act,ab.dataset.v,ab.dataset.i);return;}
  if(e.target.closest('.mt')) return;
  if(e.target.closest('.elabel')){var le=e.target.closest('.elabel');selEdge=le.dataset.e;sel=null;renderEdges();renderToolbar();return;}
  var itEl=e.target.closest('.it');
  if(tool==='hand'||space||e.button===1){startPan(e);return;}
  if(tool==='pen'){startPen(e);return;}
  if(SHAPES.indexOf(tool)>=0){var w0=toWorld(e.clientX,e.clientY);shp={t:tool,a:[Math.round(w0.x),Math.round(w0.y)],b:[Math.round(w0.x),Math.round(w0.y)],c:penColor};
    shp.g=document.createElementNS('http://www.w3.org/2000/svg','g');tempLayer().appendChild(shp.g);board.setPointerCapture(e.pointerId);return;}
  if(tool==='erase'){erasing={hit:false};board.classList.add('erasing');board.setPointerCapture(e.pointerId);eraseAt(e.clientX,e.clientY);return;}
  if(tool==='connect'){
    if(!itEl){connSrc=null;renderAll();return;}
    var id=itEl.dataset.id;
    if(!connSrc){connSrc=id;renderAll();return;}
    var a=byId(connSrc), b=byId(id);
    var und=a&&b&&a.type==='gnode'&&b.type==='gnode'?false:true;
    var side=null;
    if(a&&b&&a.type==='tree'&&b.type==='tree'){side=!childOf(a.id,'L')?'L':!childOf(a.id,'R')?'R':null; und=false;}
    addEdge(connSrc,id,{dir:und,side:side}); connSrc=null; setTool('select'); sel=null; renderAll(); commit(); return;
  }
  var stEl=!itEl&&e.target.closest&&e.target.closest('.stroke[data-s]');
  if(stEl){ var si=+stEl.dataset.s; e.preventDefault(); if(document.activeElement&&document.activeElement.blur)document.activeElement.blur();
    if(e.shiftKey){var cs=mstk.slice(),at3=cs.indexOf(si);if(at3>=0)cs.splice(at3,1);else cs.push(si);setMulti(groupIds(),cs);return;}
    if(mstk.indexOf(si)<0){ var sw=withGroups([],[si]); setMulti(sw.ids,sw.stk); }
    drag={group:true,alt:e.altKey,id:null,sx:e.clientX,sy:e.clientY,moved:false,el:null,
      orig:msel.map(function(i){var o=byId(i);return {id:i,x:o.x,y:o.y};}),sorig:mstk.map(function(i){return {i:i,p:clone(B.strokes[i].p)};})};
    board.setPointerCapture(e.pointerId); return; }
  if(!itEl&&!e.shiftKey&&msel.length+mstk.length>1){
    var gr=groupRect();
    if(gr&&e.clientX>=gr.left-6&&e.clientX<=gr.right+6&&e.clientY>=gr.top-6&&e.clientY<=gr.bottom+6){
      e.preventDefault(); if(document.activeElement&&document.activeElement.blur)document.activeElement.blur();
      drag={group:true,alt:e.altKey,id:null,sx:e.clientX,sy:e.clientY,moved:false,el:null,
        orig:msel.map(function(i){var o=byId(i);return {id:i,x:o.x,y:o.y};}),sorig:mstk.map(function(i){return {i:i,p:clone(B.strokes[i].p)};})};
      board.setPointerCapture(e.pointerId); return; }
  }
  if(!itEl){
    if(document.activeElement&&document.activeElement.blur)document.activeElement.blur();
    var br=board.getBoundingClientRect(), el=document.createElement('div'); el.className='marq'; board.appendChild(el);
    marq={sx:e.clientX,sy:e.clientY,el:el,add:e.shiftKey,br:br,rect:null}; board.setPointerCapture(e.pointerId); return;}
  var it=byId(itEl.dataset.id);
  // Shift / Alt ＋ 點格子：標記
  var cell=e.target.closest('[data-c],[data-r]');
  var inMulti=msel.indexOf(it.id)>=0&&msel.length+mstk.length>1; // 框選中：Option＝複製整組，不是標記
  if(cell&&!inMulti&&(e.shiftKey||e.altKey)&&(it.type==='array'||it.type==='string'||it.type==='grid'||it.type==='steps')){
    e.preventDefault();
    var keyv=cell.dataset.c!=null?+cell.dataset.c:cell.dataset.r+','+cell.dataset.k, arr=e.altKey&&it.type!=='grid'&&it.type!=='steps'?(it.done=it.done||[]):(it.hl=it.hl||[]);
    var at=arr.indexOf(keyv); if(at>=0) arr.splice(at,1); else arr.push(keyv);
    sel=it.id; renderAll(); commit(); return;
  }
  if(e.shiftKey&&!cell){ e.preventDefault(); var cur=groupIds(), cs2=mstk.slice(), on=cur.indexOf(it.id)>=0, mem=it.g?gMembers(it.g):{ids:[it.id],stk:[]}; // 群組裡的就整組一起加選／取消
    mem.ids.forEach(function(id){var k=cur.indexOf(id);if(on&&k>=0)cur.splice(k,1);else if(!on&&k<0)cur.push(id);});
    mem.stk.forEach(function(i){var k=cs2.indexOf(i);if(on&&k>=0)cs2.splice(k,1);else if(!on&&k<0)cs2.push(i);});
    setMulti(cur,cs2); return; }
  // 點到已經被框選的元件：拖曳時整組一起動
  if(msel.indexOf(it.id)>=0){
    var multi=msel.length+mstk.length>1;
    var isN=!!e.target.closest('.node,.ptr'), onG=!!e.target.closest('.grip')&&!e.target.closest('.nm'), txt=it.type==='text'||it.type==='note';
    if(multi||isN||onG||txt){ e.preventDefault(); drag={group:true,alt:e.altKey,id:it.id,tapEl:e.target,sx:e.clientX,sy:e.clientY,moved:false,el:itEl,
      orig:msel.map(function(i){var o=byId(i);return {id:i,x:o.x,y:o.y};}),sorig:mstk.map(function(i){return {i:i,p:clone(B.strokes[i].p)};})};
      board.setPointerCapture(e.pointerId); return; }
  }
  // 群組：第一次點選整組（可以直接拖）；選好之後再點一下才是單選這一個，方便編輯
  var gm=it.g&&!(sel&&byId(sel)&&byId(sel).g===it.g)&&gMembers(it.g);
  if(gm&&gm.ids.length+gm.stk.length>1){
    e.preventDefault(); if(document.activeElement&&document.activeElement.blur)document.activeElement.blur(); setMulti(gm.ids,gm.stk);
    drag={group:true,keep:true,alt:e.altKey,id:it.id,sx:e.clientX,sy:e.clientY,moved:false,el:itEl,
      orig:msel.map(function(i){var o=byId(i);return {id:i,x:o.x,y:o.y};}),sorig:mstk.map(function(i){return {i:i,p:clone(B.strokes[i].p)};})};
    board.setPointerCapture(e.pointerId); return;
  }
  if(msel.length||mstk.length){clearMulti();itemsEl.querySelectorAll('.it.msel').forEach(function(x){x.classList.remove('msel');});renderStrokes();}
  if(!cell&&activeCell&&activeCell.id===it.id){activeCell=null;renderToolbar();}
  if(sel!==it.id){sel=it.id;activeCell=null;var hadEdge=selEdge;selEdge=null;itemsEl.querySelectorAll('.it.sel').forEach(function(x){x.classList.remove('sel');});itEl.classList.add('sel');if(hadEdge)renderEdges();renderToolbar();}
  var isNode=!!e.target.closest('.node,.ptr'), onGrip=!!e.target.closest('.grip')&&!e.target.closest('.nm'), editable=e.target.closest('[contenteditable="true"]');
  var bodyDrag=isNode&&!(editable&&document.activeElement===editable);
  if(it.type==='text'||it.type==='note'){ if(document.activeElement!==editable) bodyDrag=true; }
  if(!(onGrip||bodyDrag)) return; // 點格子就讓它編輯
  e.preventDefault();
  drag={id:it.id,alt:e.altKey,sx:e.clientX,sy:e.clientY,ox:it.x,oy:it.y,moved:false,el:itEl};
  board.setPointerCapture(e.pointerId);
});
