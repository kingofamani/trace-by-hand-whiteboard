/* ---------- 形狀的控制點（改大小） ---------- */
function resizable(){return !msel.length&&mstk.length===1&&!!B.strokes[mstk[0]]&&!drag;}
function stBox(st){var q=st.t?st.p:st.p,x1=1e9,y1=1e9,x2=-1e9,y2=-1e9;q.forEach(function(t){x1=Math.min(x1,t[0]);y1=Math.min(y1,t[1]);x2=Math.max(x2,t[0]);y2=Math.max(y2,t[1]);});return {x1:x1,y1:y1,x2:x2,y2:y2};}
var HANDLES={nw:[0,0,'nwse'],n:[.5,0,'ns'],ne:[1,0,'nesw'],e:[1,.5,'ew'],se:[1,1,'nwse'],s:[.5,1,'ns'],sw:[0,1,'nesw'],w:[0,.5,'ew']};
function renderHandles(){
  var H=$('hdl'); if(!H) return;
  if(!resizable()||tool!=='select'){H.innerHTML='';return;}
  var st=B.strokes[mstk[0]], sx=function(x){return view.x+x*view.z;}, sy=function(y){return view.y+y*view.z;}, h='';
  if(st.t==='line'||st.t==='arrow'){
    st.p.slice(0,2).forEach(function(q,k){h+='<div class="hd end" data-h="p'+k+'" style="left:'+sx(q[0])+'px;top:'+sy(q[1])+'px;cursor:move"></div>';});
  }else{
    var b=stBox(st), L=sx(b.x1), T=sy(b.y1), W=(b.x2-b.x1)*view.z, Hh=(b.y2-b.y1)*view.z;
    h+='<div class="hbox" style="left:'+L+'px;top:'+T+'px;width:'+W+'px;height:'+Hh+'px"></div>';
    Object.keys(HANDLES).forEach(function(k){var d=HANDLES[k];h+='<div class="hd" data-h="'+k+'" style="left:'+(L+W*d[0])+'px;top:'+(T+Hh*d[1])+'px;cursor:'+d[2]+'-resize"></div>';});
  }
  H.innerHTML=h;
}
(function(){
  var H=$('hdl'), rs=null;
  H.addEventListener('pointerdown',function(e){
    var hd=e.target.closest('.hd'); if(!hd) return; e.preventDefault(); e.stopPropagation();
    var i=mstk[0], st=B.strokes[i]; rs={i:i,h:hd.dataset.h,orig:clone(st.p),box:stBox(st)};
    window.addEventListener('pointermove',onMove); window.addEventListener('pointerup',end); window.addEventListener('pointercancel',end);
  });
  function onMove(e){
    if(!rs) return; var st=B.strokes[rs.i], w=toWorld(e.clientX,e.clientY), x=Math.round(w.x), y=Math.round(w.y);
    if(rs.h==='p0'||rs.h==='p1'){ // 直線、箭頭：拖端點
      var k=rs.h==='p0'?0:1, o=rs.orig[1-k];
      if(e.shiftKey){var ang=Math.round(Math.atan2(y-o[1],x-o[0])/(Math.PI/4))*(Math.PI/4),Ln=Math.hypot(x-o[0],y-o[1]);x=Math.round(o[0]+Ln*Math.cos(ang));y=Math.round(o[1]+Ln*Math.sin(ang));}
      st.p=rs.orig.map(function(q){return q.slice();}); st.p[k]=[x,y];
    }else{ // 矩形、圓形、手繪：拖外框
      var b=rs.box, d=HANDLES[rs.h], nx1=b.x1,ny1=b.y1,nx2=b.x2,ny2=b.y2;
      if(d[0]===0) nx1=x; if(d[0]===1) nx2=x; if(d[1]===0) ny1=y; if(d[1]===1) ny2=y;
      if(e.shiftKey&&d[0]!==.5&&d[1]!==.5){ // 角落＋Shift：維持比例
        var ow=b.x2-b.x1||1, oh=b.y2-b.y1||1, nw=nx2-nx1, nh=ny2-ny1, sc=Math.max(Math.abs(nw)/ow,Math.abs(nh)/oh);
        var sw=(nw<0?-1:1)*ow*sc, sh=(nh<0?-1:1)*oh*sc; if(d[0]===0) nx1=nx2-sw; else nx2=nx1+sw; if(d[1]===0) ny1=ny2-sh; else ny2=ny1+sh;
      }
      var ow2=(b.x2-b.x1)||1, oh2=(b.y2-b.y1)||1;
      st.p=rs.orig.map(function(q){return [Math.round(nx1+(q[0]-b.x1)/ow2*(nx2-nx1)),Math.round(ny1+(q[1]-b.y1)/oh2*(ny2-ny1))];});
    }
    renderStrokes(); renderHandles(); placeToolbar(); drawMini();
  }
  function end(){ window.removeEventListener('pointermove',onMove); window.removeEventListener('pointerup',end); window.removeEventListener('pointercancel',end);
    if(!rs) return; var st=B.strokes[rs.i];
    if(st.t==='rect'||st.t==='ellipse'){var b=stBox(st);st.p=[[b.x1,b.y1],[b.x2,b.y2]];} // 翻轉後整理成左上→右下
    rs=null; renderStrokes(); commit(); renderHandles(); }
})();
