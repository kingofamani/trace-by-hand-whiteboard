/* ---------- 樹、串列的小幫手 ---------- */
function childOf(id,side){var e=B.edges.filter(function(e){return e.from===id&&e.side===side;})[0];return e?byId(e.to):null;}
function addChild(id,side){
  var p=byId(id); if(childOf(id,side)){toast((side==='L'?_T('已經有左子節點了'):_T('已經有右子節點了')));return;}
  var c=make('tree',p.x+(side==='L'?-60:60),p.y+80); c.val='';
  B.items.push(c); addEdge(id,c.id,{dir:false,side:side}); layoutTree(rootOf(id)); sel=c.id; renderAll(); commit();
  focusVal(c.id);
}
function rootOf(id){var cur=id,guard=0;while(guard++<500){var e=B.edges.filter(function(e){return e.to===cur&&e.side;})[0];if(!e)return cur;cur=e.from;}return cur;}
function layoutTree(rid){
  var r=byId(rid); if(!r) return; var pos=[], k=0, gap=58, lv=80;
  (function walk(id,d){var n=byId(id);if(!n)return;var L=childOf(id,'L'),R=childOf(id,'R');if(L)walk(L.id,d+1);pos.push({n:n,x:k++,d:d});if(R)walk(R.id,d+1);})(rid,0);
  var me=pos.filter(function(p){return p.n.id===rid;})[0]; var ox=r.x-me.x*gap, oy=r.y;
  pos.forEach(function(p){p.n.x=Math.round(ox+p.x*gap);p.n.y=Math.round(oy+p.d*lv);});
}
function addNext(id){
  var p=byId(id), nx=B.edges.filter(function(e){return e.from===id;})[0];
  var c=make('list',p.x+100,p.y); c.val='';
  B.items.push(c);
  if(nx){ // 插在中間：原本的下一個往後推
    nx.from=c.id; shiftChain(nx.to,100);
  }
  addEdge(id,c.id,{dir:true}); sel=c.id; renderAll(); commit(); focusVal(c.id);
}
function shiftChain(id,dx){var seen={};while(id&&!seen[id]){seen[id]=1;var n=byId(id);if(!n)break;n.x+=dx;var e=B.edges.filter(function(e){return e.from===id;})[0];id=e?e.to:null;}}
function focusVal(id){var el=itemsEl.querySelector('[data-id="'+id+'"] .nv');if(el){el.contentEditable='true';el.focus();selectAll(el);}}
function selectAll(el){var r=document.createRange();r.selectNodeContents(el);var s=getSelection();s.removeAllRanges();s.addRange(r);}

