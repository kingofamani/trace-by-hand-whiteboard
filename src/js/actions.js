function edgeById(id){return B.edges.filter(function(x){return x.id===id;})[0];}
function editEdgeLabel(id){
  var e=edgeById(id); if(!e) return; selEdge=id; sel=null; renderAll();
  var el=$('labels').querySelector('[data-e="'+id+'"]');
  if(!el){el=document.createElement('div');el.className='elabel';el.contentEditable='true';el.spellcheck=false;el.dataset.e=id;el.style.left=e._mx+'px';el.style.top=e._my+'px';$('labels').appendChild(el);}
  el.focus(); selectAll(el);
}
function split(t){return t.split(/\s*,\s*/).filter(function(x){return x!=='';});}
function act(a,v,i){
  if(selEdge&&['toggleDir','flip','edgeLabel','delEdge'].indexOf(a)>=0){var e=edgeById(selEdge);
    if(a==='delEdge'){B.edges=B.edges.filter(function(x){return x!==e;});selEdge=null;}
    if(a==='toggleDir') e.dir=!e.dir;
    if(a==='flip'){var t=e.from;e.from=e.to;e.to=t;}
    if(a==='edgeLabel'){editEdgeLabel(e.id);return;}
    renderAll(); commit(); return;}
  if(a==='bg'){
    var n=+v;
    if(msel.length){msel.forEach(function(id){var o=byId(id);if(o)paint(o,n);});renderAll();commit();return;}
    var t0=byId(sel); if(!t0) return;
    paint(t0,n,activeCell&&activeCell.id===t0.id?activeCell.key:null);
    var keep=activeCell; renderItem(t0); renderEdges(); commit(); activeCell=keep;
    if(keep){var ce=itemsEl.querySelector('[data-id="'+t0.id+'"] '+(keep.key.indexOf(',')>=0?'[data-r="'+keep.key.split(',')[0]+'"][data-k="'+keep.key.split(',')[1]+'"]':'[data-c="'+keep.key+'"]'));if(ce)ce.focus();}
    renderToolbar(); return;}
  if(a==='sfill'){var nf=+v;mstk.forEach(function(i){var st=B.strokes[i];if(st&&(st.t==='rect'||st.t==='ellipse')){if(nf)st.f=nf;else delete st.f;}});renderStrokes();commit();renderToolbar();return;}
  if(a==='scolor'){mstk.forEach(function(i){if(B.strokes[i])B.strokes[i].c=+v;});penColor=+v;try{localStorage.setItem('drycanvas-color',v);}catch(e){}paintCdot();renderStrokes();commit();return;}
  if(a==='zfront'){reorder('front');return;} if(a==='zback'){reorder('back');return;}
  if(a==='gdup'){dupGroup();return;} if(a==='gcopy'){copyGroup();return;} if(a==='gdel'){delGroup();return;}
  if(a==='group'){groupSel();return;} if(a==='ungroup'){ungroupSel();return;}
  var it=byId(sel); if(!it) return;
  switch(a){
    case 'dup': duplicate(it.id); return;
    case 'del': delItem(it.id); return;
    case 'addCell': it.cells.push(''); renderItem(it); commit(); focusCell(it,it.cells.length-1); placeToolbar(); return;
    case 'delCell': if(activeCell&&activeCell.id===it.id)activeCell=null; removeCell(it,+i); break;
    case 'clearHl': it.hl=[]; it.done=[]; break;
    case 'addPtr':
      var p=make('pointer',it.x,it.y+70);
      var names=['i','j','left','right','k'], used=B.items.filter(function(x){return x.type==='pointer';}).map(function(x){return x.name;});
      p.name=names.filter(function(n){return used.indexOf(n)<0;})[0]||'p'; p.color=(used.length%4)+1;
      B.items.push(p); sel=p.id; renderAll(); var el=itemsEl.querySelector('[data-id="'+it.id+'"] .cell'); if(el) snapPointer(p,el); renderAll(); commit(); return;
    case 'delRow': it.rows.splice(+i,1); if(it.hl) it.hl=it.hl.filter(function(k){return +k.split(',')[0]!==+i;}); break;
    case 'addRow': it.rows.push(it.rows[0]?it.rows[0].map(function(){return '';}):['']); break;
    case 'addCol': it.rows.forEach(function(r){r.push('');}); if(it.cols) it.cols.push(_T('欄')); break;
    case 'delCol': if((it.rows[0]||it.cols||[]).length<=1) return; it.rows.forEach(function(r){r.splice(+i,1);}); if(it.cols) it.cols.splice(+i,1);
      if(it.hl) it.hl=it.hl.filter(function(k){return +k.split(',')[1]!==+i;}).map(function(k){var q=k.split(',');return +q[1]>+i?q[0]+','+(+q[1]-1):k;});
      if(it.cbg){var nb={};Object.keys(it.cbg).forEach(function(k){var q=k.split(','),c=+q[1];if(c<+i)nb[k]=it.cbg[k];else if(c>+i)nb[q[0]+','+(c-1)]=it.cbg[k];});it.cbg=nb;}
      break;
    case 'stepAdd': var last=it.rows[it.rows.length-1]||it.cols.map(function(){return '';}); var nr=clone(last); if(/^\d+$/.test(nr[0])) nr[0]=String(+nr[0]+1); it.rows.push(nr); break;
    case 'addL': addChild(it.id,'L'); return;
    case 'addR': addChild(it.id,'R'); return;
    case 'addNext': addNext(it.id); return;
    case 'addAdj': var c=make('gnode',it.x+110,it.y+(Math.random()*80-40)); c.val=''; B.items.push(c); addEdge(it.id,c.id,{dir:false}); sel=c.id; renderAll(); commit(); focusVal(c.id); return;
    case 'tidy': layoutTree(rootOf(it.id)); break;
    case 'hl': it.hl=!it.hl; break;
    case 'connFrom': setTool('connect'); connSrc=it.id; renderAll(); toast(_T('點另一個元件，連過去')); return;
    case 'color': it.color=+v; break;
    case 'dir': it.dir=v; break;
    case 'style': it.style=v; break;
    case 'lpMenu': lpMenu(it); return;
  }
  renderAll(); commit();
}
function removeCell(it,i){
  it.cells.splice(i,1);
  var sh=function(arr){return (arr||[]).filter(function(x){return x!==i;}).map(function(x){return x>i?x-1:x;});};
  it.hl=sh(it.hl); it.done=sh(it.done);
  if(it.cbg){var nb={};Object.keys(it.cbg).forEach(function(k){var x=+k;if(x<i)nb[x]=it.cbg[k];else if(x>i)nb[x-1]=it.cbg[k];});it.cbg=nb;}
}
