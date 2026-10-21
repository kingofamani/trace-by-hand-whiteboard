/* ---------- 右下角預覽框 ---------- */
var miniT=null, miniRaf=0;
function drawMini(){ if(miniRaf) return; miniRaf=requestAnimationFrame(function(){miniRaf=0;paintMini();}); }
function paintMini(){
  var c=$('mini'); if(!c||c.offsetParent===null) return;
  var dpr=window.devicePixelRatio||1, W=200, H=128; if(c.width!==W*dpr){c.width=W*dpr;c.height=H*dpr;}
  var g=c.getContext('2d'); g.setTransform(dpr,0,0,dpr,0,0); g.clearRect(0,0,W,H);
  var r=board.getBoundingClientRect(), vx=-view.x/view.z, vy=-view.y/view.z, vw=r.width/view.z, vh=r.height/view.z;
  var boxes=[].map.call(itemsEl.querySelectorAll('.it'),function(el){return [el.offsetLeft,el.offsetTop,el.offsetWidth,el.offsetHeight,el.classList.contains('sel')||el.classList.contains('msel')];});
  B.strokes.forEach(function(st){var q=shapePts(st),a1=1e9,b1=1e9,a2=-1e9,b2=-1e9;q.forEach(function(t){a1=Math.min(a1,t[0]);b1=Math.min(b1,t[1]);a2=Math.max(a2,t[0]);b2=Math.max(b2,t[1]);});boxes.push([a1,b1,Math.max(2,a2-a1),Math.max(2,b2-b1),false]);});
  var x1=vx,y1=vy,x2=vx+vw,y2=vy+vh; boxes.forEach(function(b){x1=Math.min(x1,b[0]);y1=Math.min(y1,b[1]);x2=Math.max(x2,b[0]+b[2]);y2=Math.max(y2,b[1]+b[3]);});
  var pad=60; x1-=pad;y1-=pad;x2+=pad;y2+=pad;
  var sc=Math.min((W-8)/(x2-x1),(H-8)/(y2-y1)), ox=(W-(x2-x1)*sc)/2-x1*sc, oy=(H-(y2-y1)*sc)/2-y1*sc; miniT={sc:sc,ox:ox,oy:oy};
  var cs=getComputedStyle(document.documentElement);
  boxes.forEach(function(b){g.fillStyle=b[4]?cs.getPropertyValue('--active').trim():cs.getPropertyValue('--mini-item').trim();g.fillRect(b[0]*sc+ox,b[1]*sc+oy,Math.max(2,b[2]*sc),Math.max(2,b[3]*sc));});
  var ac=cs.getPropertyValue('--active').trim(); g.strokeStyle=ac; g.lineWidth=1.5; g.globalAlpha=.12; g.fillStyle=ac;
  g.fillRect(vx*sc+ox,vy*sc+oy,vw*sc,vh*sc); g.globalAlpha=1; g.strokeRect(vx*sc+ox+.5,vy*sc+oy+.5,vw*sc-1,vh*sc-1);
}
(function(){
  var c=$('mini'), dragging=false;
  function go(e){if(!miniT)return;var q=c.getBoundingClientRect(),wx=(e.clientX-q.left-miniT.ox)/miniT.sc,wy=(e.clientY-q.top-miniT.oy)/miniT.sc,r=board.getBoundingClientRect();
    view.x=r.width/2-wx*view.z; view.y=r.height/2-wy*view.z; world.style.transform='translate('+view.x+'px,'+view.y+'px) scale('+view.z+')'; placeToolbar(); drawMini();}
  c.addEventListener('pointerdown',function(e){e.stopPropagation();e.preventDefault();dragging=true;c.setPointerCapture(e.pointerId);go(e);});
  c.addEventListener('pointermove',function(e){if(dragging)go(e);});
  c.addEventListener('pointerup',function(){dragging=false;persist();});
  window.addEventListener('resize',drawMini);
})();

