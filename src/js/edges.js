/* ---------- 連線 ---------- */
function box(id){var el=itemsEl.querySelector('[data-id="'+id+'"]');if(!el)return null;var n=el.querySelector('.node');
  var x=el.offsetLeft,y=el.offsetTop,w=el.offsetWidth,h=el.offsetHeight;
  if(n){x+=n.offsetLeft;y+=n.offsetTop;w=n.offsetWidth;h=n.offsetHeight;}
  return {cx:x+w/2,cy:y+h/2,w:w,h:h,round:!!n&&!n.classList.contains('list')};}
function trim(b,tx,ty){
  var dx=tx-b.cx, dy=ty-b.cy, L=Math.hypot(dx,dy)||1;
  if(b.round){var r=b.w/2+2;return {x:b.cx+dx/L*r,y:b.cy+dy/L*r};}
  var sx=Math.abs(dx)/(b.w/2+3), sy=Math.abs(dy)/(b.h/2+3), s=Math.max(sx,sy)||1;
  return {x:b.cx+dx/s,y:b.cy+dy/s};
}
function renderEdges(){
  var g=$('edges'), h='';
  B.edges.forEach(function(e){
    var a=box(e.from), b=box(e.to); if(!a||!b) return;
    var p=trim(a,b.cx,b.cy), q=trim(b,a.cx,a.cy);
    var d='M'+p.x+','+p.y+' L'+q.x+','+q.y;
    h+='<g data-e="'+e.id+'" style="color:var(--ink-2)"><path class="hit" d="'+d+'"/><path class="edge'+(selEdge===e.id?' sel':'')+'" d="'+d+'"'+(e.dir?' marker-end="url(#ah)"':'')+'/></g>';
    e._mx=(p.x+q.x)/2; e._my=(p.y+q.y)/2;
  });
  g.innerHTML=h;
  var L=$('labels'), keep=document.activeElement&&document.activeElement.classList.contains('elabel')?document.activeElement.dataset.e:null;
  B.edges.forEach(function(e){
    var el=L.querySelector('[data-e="'+e.id+'"]');
    if(!e.label&&e.id!==keep){if(el)el.remove();return;}
    if(!el){el=document.createElement('div');el.className='elabel';el.contentEditable='true';el.spellcheck=false;el.dataset.e=e.id;el.textContent=e.label;L.appendChild(el);}
    if(e._mx!=null){el.style.left=e._mx+'px';el.style.top=e._my+'px';}
  });
  [].forEach.call(L.querySelectorAll('.elabel'),function(el){if(!B.edges.some(function(e){return e.id===el.dataset.e;}))el.remove();});
  [].forEach.call(g.querySelectorAll('[data-e]'),function(el){var hit=el.querySelector('.hit');hit.addEventListener('pointerdown',function(ev){ev.stopPropagation();ev.preventDefault();
      var id=el.dataset.e, now=Date.now(), dbl=edgeTap.id===id&&now-edgeTap.t<400; edgeTap={id:id,t:now};
      if(dbl){editEdgeLabel(id);return;} selEdge=id; sel=null; renderAll();});});
}
function addEdge(from,to,opt){
  if(from===to) return null;
  if(B.edges.some(function(e){return e.from===from&&e.to===to;})) return null;
  var e={id:nid(),from:from,to:to,dir:opt&&opt.dir!=null?opt.dir:true,label:'',side:opt&&opt.side||null};
  B.edges.push(e); return e;
}
function shapeSvg(st){ // 回傳一段 SVG（不含外層 g）
  var p=st.p, a=p[0], b=p[p.length-1];
  if(!st.t){var pts=p.map(function(q){return q[0]+','+q[1];}).join(' ');return {hit:'<polyline class="shit" points="'+pts+'"/>',vis:'<polyline class="svis" points="'+pts+'"/>'};}
  var fillV=st.f?' style="fill:var(--sw'+st.f+')"':'', hitV=st.f?' style="pointer-events:all"':'';
  if(st.t==='rect'){var x=Math.min(a[0],b[0]),y=Math.min(a[1],b[1]),w=Math.abs(b[0]-a[0]),h=Math.abs(b[1]-a[1]),r='x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="4"';return {hit:'<rect class="shit" '+r+hitV+'/>',vis:'<rect class="svis" '+r+fillV+'/>'};}
  if(st.t==='ellipse'){var e='cx="'+((a[0]+b[0])/2)+'" cy="'+((a[1]+b[1])/2)+'" rx="'+(Math.abs(b[0]-a[0])/2)+'" ry="'+(Math.abs(b[1]-a[1])/2)+'"';return {hit:'<ellipse class="shit" '+e+hitV+'/>',vis:'<ellipse class="svis" '+e+fillV+'/>'};}
  var ln='x1="'+a[0]+'" y1="'+a[1]+'" x2="'+b[0]+'" y2="'+b[1]+'"', head='';
  if(st.t==='arrow'){var ang=Math.atan2(b[1]-a[1],b[0]-a[0]), L=13, W=0.42;
    head='<polygon class="ahead" style="fill:currentColor" points="'+b[0]+','+b[1]+' '+(b[0]-L*Math.cos(ang-W))+','+(b[1]-L*Math.sin(ang-W))+' '+(b[0]-L*Math.cos(ang+W))+','+(b[1]-L*Math.sin(ang+W))+'"/>';}
  return {hit:'<line class="shit" '+ln+'/>',vis:'<line class="svis" '+ln+'/>'+head};
}
function strokeHtml(st,i){var g=shapeSvg(st),c=COLORS[st.c||0];return '<g class="stroke'+(mstk.indexOf(i)>=0?' msel':'')+'" data-s="'+i+'" style="color:'+c+';stroke:'+c+'">'+g.hit+g.vis+'</g>';}
function renderStrokes(){
  $('strokes').innerHTML=''; // 清掉畫到一半的預覽
  [].forEach.call(itemsEl.querySelectorAll('svg.sl'),function(x){x.remove();});
  var frag=document.createDocumentFragment();
  B.strokes.forEach(function(st,i){
    var sv=document.createElementNS('http://www.w3.org/2000/svg','svg'); sv.setAttribute('class','sl'); sv.style.zIndex=(st.z||0)+1;
    sv.innerHTML=strokeHtml(st,i); frag.appendChild(sv);
  });
  itemsEl.appendChild(frag);
}
