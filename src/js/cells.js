var skipSelect=false;
function cellEl(it,i){return itemsEl.querySelectorAll('[data-id="'+it.id+'"] [data-c]')[i];}
function goCell(it,i,mode){ // mode：all（全選）、end（游標在最後）、start（游標在最前）
  var c=cellEl(it,i); if(!c) return; skipSelect=mode!=='all'; c.focus();
  var r=document.createRange(); r.selectNodeContents(c); if(mode==='end')r.collapse(false); else if(mode==='start')r.collapse(true);
  var sl=getSelection(); sl.removeAllRanges(); sl.addRange(r);
}
function caretAt(el){ // 游標在格子的最前面／最後面嗎？
  var sl=getSelection(); if(!sl.rangeCount||!sl.isCollapsed) return {start:false,end:false};
  var r=sl.getRangeAt(0), pre=r.cloneRange(); pre.selectNodeContents(el); pre.setEnd(r.startContainer,r.startOffset);
  var n=pre.toString().length; return {start:n===0,end:n===el.innerText.replace(/\n$/,'').length};
}
function nextCell(it,i,mode){ // 到下一格，最後一格就多開一格
  if(i+1>=it.cells.length){it.cells.push('');renderItem(it);renderEdges();placeToolbar();}
  goCell(it,i+1,mode||'all');
}
function spill(it,i,parts){ // 從第 i 格開始放一串值：第 i 格換掉，其餘插在後面
  it.cells.splice.apply(it.cells,[i,1].concat(parts));
  renderItem(it); renderEdges(); commit(); placeToolbar();
  var last=i+parts.length-1; if(it.type==='string'){nextCell(it,last);} else goCell(it,last,'end');
}
function focusCell(it,i){var c=itemsEl.querySelectorAll('[data-id="'+it.id+'"] [data-c]')[i];if(c){c.focus();selectAll(c);}}
function focusSlot(it,name){var s=itemsEl.querySelector('[data-id="'+it.id+'"] [data-slot="'+(name||'push')+'"]');if(s)s.focus();}
/* 打 2,7,11 或貼上一串 → 自動拆成好幾格 */
function explode(it,i){
  var v=it.cells[i]; if(v==null) return false; var parts;
  if(it.type==='string'&&v.length>1) parts=v.split('');
  else if(v.indexOf(',')>=0) parts=split(v.replace(/^\[|\]$/g,''));
  else return false;
  it.cells.splice.apply(it.cells,[i,1].concat(parts)); return true;
}
function buildFromText(it){
  var v=String(it.val||''); if(v.indexOf(',')<0) return false;
  var vals=split(v.replace(/^\[|\]$/g,''));
  if(it.type==='tree') buildTree(it,vals); else if(it.type==='list') buildList(it,vals); else return false;
  return true;
}
function buildTree(root,vals){
  if(!vals.length) return;
  var kill=[]; (function walk(id){['L','R'].forEach(function(s){var c=childOf(id,s);if(c){kill.push(c.id);walk(c.id);}});})(root.id);
  B.items=B.items.filter(function(x){return kill.indexOf(x.id)<0;}); B.edges=B.edges.filter(function(e){return kill.indexOf(e.from)<0&&kill.indexOf(e.to)<0;});
  root.val=vals[0]; var q=[root], i=1;
  while(q.length&&i<vals.length){var p=q.shift();
    ['L','R'].forEach(function(s){if(i>=vals.length)return;var v=vals[i++];if(v==='null'||v==='None'||v==='#')return;var c=make('tree',p.x,p.y+80);c.val=v;B.items.push(c);addEdge(p.id,c.id,{dir:false,side:s});q.push(c);});}
  layoutTree(root.id); renderAll(); commit();
}
function buildList(head,vals){
  if(!vals.length) return;
  var kill=[], id=(B.edges.filter(function(e){return e.from===head.id;})[0]||{}).to, seen={};
  while(id&&!seen[id]){seen[id]=1;kill.push(id);var e=B.edges.filter(function(e){return e.from===id;})[0];id=e?e.to:null;}
  B.items=B.items.filter(function(x){return kill.indexOf(x.id)<0;}); B.edges=B.edges.filter(function(e){return kill.indexOf(e.from)<0&&kill.indexOf(e.to)<0&&e.from!==head.id;});
  head.val=vals[0]; var prev=head;
  vals.slice(1).forEach(function(v,k){var c=make('list',head.x+100*(k+1),head.y);c.val=v;B.items.push(c);addEdge(prev.id,c.id,{dir:true});prev=c;});
  renderAll(); commit();
}
function delItem(id){
  B.items=B.items.filter(function(x){return x.id!==id;});
  B.edges=B.edges.filter(function(e){return e.from!==id&&e.to!==id;});
  pruneGroups(); if(sel===id) sel=null; renderAll(); commit();
}

