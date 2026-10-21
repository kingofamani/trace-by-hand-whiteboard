var erasing=null, ERASE_R=14; // 橡皮擦半徑（螢幕像素）
function segDist(px,py,ax,ay,bx,by){var dx=bx-ax,dy=by-ay,L=dx*dx+dy*dy,t=L?Math.max(0,Math.min(1,((px-ax)*dx+(py-ay)*dy)/L)):0;return Math.hypot(px-ax-t*dx,py-ay-t*dy);}
function eraseAt(cx,cy){
  var w=toWorld(cx,cy), r=ERASE_R/view.z, keep=[], removed=false;
  if(erasing.last){ // 快速拖曳時，把兩點之間也補上，才不會漏掉細線
    var lx=erasing.last.x, ly=erasing.last.y, steps=Math.ceil(Math.hypot(w.x-lx,w.y-ly)/(r*0.8));
    for(var k=1;k<steps;k++) eraseOne(lx+(w.x-lx)*k/steps, ly+(w.y-ly)*k/steps, r);
  }
  eraseOne(w.x,w.y,r); erasing.last=w;
}
function eraseOne(x,y,r){
  var before=B.strokes.length;
  B.strokes=B.strokes.filter(function(st){
    var p=shapePts(st); if(p.length===1) return Math.hypot(p[0][0]-x,p[0][1]-y)>r;
    for(var i=1;i<p.length;i++){ if(segDist(x,y,p[i-1][0],p[i-1][1],p[i][0],p[i][1])<=r) return false; }
    return true;
  });
  if(B.strokes.length!==before){erasing.hit=true;mstk=[];renderStrokes();drawMini();}
}
var pan=null, pen=null, lastTap={id:null,t:0}, edgeTap={id:null,t:0};
function caretEnd(el){var r=document.createRange();r.selectNodeContents(el);r.collapse(false);var s=getSelection();s.removeAllRanges();s.addRange(r);}
function startPan(e){pan={sx:e.clientX,sy:e.clientY,vx:view.x,vy:view.y};board.classList.add('panning');board.setPointerCapture(e.pointerId);}
function startPen(e){var p=toWorld(e.clientX,e.clientY);pen={p:[[Math.round(p.x),Math.round(p.y)]],c:penColor};board.setPointerCapture(e.pointerId);
  pen.el=document.createElementNS('http://www.w3.org/2000/svg','polyline');pen.el.setAttribute('class','stroke');pen.el.style.stroke=COLORS[penColor];pen.el.style.pointerEvents='none';
  pen.el.setAttribute('points',p.x+','+p.y+' '+(p.x+0.1)+','+p.y);tempLayer().appendChild(pen.el);}
function tempLayer(){var sv=document.createElementNS('http://www.w3.org/2000/svg','svg');sv.setAttribute('class','sl');sv.style.zIndex=999999;itemsEl.appendChild(sv);return sv;}
var penColor=0, shp=null, SHAPES=['rect','ellipse','line','arrow'];
try{var pc=localStorage.getItem('drycanvas-color');if(pc!==null)penColor=+pc;}catch(e){}
function shapeEnd(e){ // 依 Shift 限制比例或角度
  var w=toWorld(e.clientX,e.clientY), a=shp.a, x=w.x, y=w.y;
  if(e.shiftKey){
    if(shp.t==='rect'||shp.t==='ellipse'){var d=Math.max(Math.abs(x-a[0]),Math.abs(y-a[1]));x=a[0]+d*Math.sign(x-a[0]||1);y=a[1]+d*Math.sign(y-a[1]||1);}
    else{var ang=Math.round(Math.atan2(y-a[1],x-a[0])/(Math.PI/4))*(Math.PI/4),L=Math.hypot(x-a[0],y-a[1]);x=a[0]+L*Math.cos(ang);y=a[1]+L*Math.sin(ang);}
  }
  shp.b=[Math.round(x),Math.round(y)];
}
function drawShpPreview(){var st={t:shp.t,p:[shp.a,shp.b],c:shp.c},g=shapeSvg(st),c=COLORS[shp.c||0];shp.g.setAttribute('class','stroke');shp.g.setAttribute('style','color:'+c+';stroke:'+c);shp.g.innerHTML=g.vis;}
function finishShape(){
  var a=shp.a, b=shp.b, t=shp.t; (shp.g.ownerSVGElement||shp.g).remove();
  if(Math.hypot(b[0]-a[0],b[1]-a[1])<6){ // 只點一下：放一個預設大小
    if(t==='rect') b=[a[0]+120,a[1]+72]; else if(t==='ellipse') b=[a[0]+80,a[1]+80]; else b=[a[0]+120,a[1]];
  }
  B.strokes.push({t:t,p:[a,b],c:shp.c}); shp=null;
  setTool('select'); msel=[]; mstk=[B.strokes.length-1]; sel=null; selEdge=null; renderAll(); commit();
}
board.addEventListener('wheel',function(e){
  if(e.target.closest('.modal')) return;
  e.preventDefault();
  if(e.ctrlKey||e.metaKey){zoomAt(e.clientX,e.clientY,Math.exp(-e.deltaY*0.0022));}
  else{view.x-=e.deltaX;view.y-=e.deltaY;applyView();}
  clearTimeout(board._t); board._t=setTimeout(persist,300);
},{passive:false});
function zoomAt(cx,cy,f){var r=board.getBoundingClientRect(),px=cx-r.left,py=cy-r.top,nz=Math.min(3,Math.max(0.25,view.z*f));
  view.x=px-(px-view.x)*nz/view.z; view.y=py-(py-view.y)*nz/view.z; view.z=nz; applyView();}

