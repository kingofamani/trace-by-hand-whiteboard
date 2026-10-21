/* ---------- 圖層順序 ---------- */
function allLayers(){return B.items.map(function(o){return o;}).concat(B.strokes);}
function ensureZ(){ // 沒有順序的（舊資料、新東西）→ 補上；舊資料維持「筆跡在下、元件在上」
  var hasAny=allLayers().some(function(o){return o.z!=null;});
  if(!hasAny){ B.strokes.forEach(function(st,i){st.z=i;}); B.items.forEach(function(o,i){o.z=B.strokes.length+i;}); return; }
  var mx=Math.max.apply(null,allLayers().map(function(o){return o.z!=null?o.z:-1;}));
  allLayers().forEach(function(o){if(o.z==null)o.z=++mx;});
}
function selectedLayers(){var out=groupIds().map(byId).filter(Boolean);mstk.forEach(function(i){if(B.strokes[i])out.push(B.strokes[i]);});return out;}
function reorder(mode){
  ensureZ(); var sel2=selectedLayers(); if(!sel2.length) return;
  var L=allLayers().sort(function(a,b){return a.z-b.z;}), S=new Set(sel2);
  if(mode==='front'){L=L.filter(function(o){return !S.has(o);}).concat(L.filter(function(o){return S.has(o);}));}
  else if(mode==='back'){L=L.filter(function(o){return S.has(o);}).concat(L.filter(function(o){return !S.has(o);}));}
  else if(mode==='fwd'){for(var i=L.length-2;i>=0;i--){if(S.has(L[i])&&!S.has(L[i+1])){var t=L[i];L[i]=L[i+1];L[i+1]=t;}}}
  else if(mode==='bwd'){for(var j=1;j<L.length;j++){if(S.has(L[j])&&!S.has(L[j-1])){var t2=L[j];L[j]=L[j-1];L[j-1]=t2;}}}
  L.forEach(function(o,k){o.z=k;});
  renderAll(); commit();
  toast({front:_T('移到最上層'),back:_T('移到最下層'),fwd:_T('往上一層'),bwd:_T('往下一層')}[mode]);
}
function shapePts(st){ // 外框上的點（橡皮擦用）
  var p=st.p; if(!st.t) return p; var a=p[0], b=p[p.length-1];
  if(st.t==='rect') return [[a[0],a[1]],[b[0],a[1]],[b[0],b[1]],[a[0],b[1]],[a[0],a[1]]];
  if(st.t==='ellipse'){var cx=(a[0]+b[0])/2,cy=(a[1]+b[1])/2,rx=Math.abs(b[0]-a[0])/2,ry=Math.abs(b[1]-a[1])/2,o=[];for(var k=0;k<=36;k++){var t=k/36*Math.PI*2;o.push([cx+rx*Math.cos(t),cy+ry*Math.sin(t)]);}return o;}
  return [a,b];
}

