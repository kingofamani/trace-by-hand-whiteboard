/* ---------- 指標吸附到格子 ---------- */
function snapPointer(p,cellEl){
  var pe=itemsEl.querySelector('[data-id="'+p.id+'"]');
  var cr=cellEl.getBoundingClientRect(), br=world.getBoundingClientRect(), z=view.z;
  var L=(cr.left-br.left)/z, T=(cr.top-br.top)/z, R=(cr.right-br.left)/z, Bm=(cr.bottom-br.top)/z, cx=(L+R)/2, cy=(T+Bm)/2;
  var w=pe?pe.offsetWidth:20, h=pe?pe.offsetHeight:34, dir=p.dir||'up';
  // 同一格同一邊已經有其他指標就往外排
  var others=B.items.filter(function(o){return o.type==='pointer'&&o.id!==p.id&&(o.dir||'up')===dir&&o._snap===cellKey(cellEl);}).length;
  var ie=cellEl.closest('.it'), gp=dir==='up'&&ie&&ie.dataset.lp==='bottom'&&ie.querySelector('.grip'); // 名稱在下方：往上指的指標排到名稱下面，才不會蓋住名稱
  if(gp) Bm=Math.max(Bm,(gp.getBoundingClientRect().bottom-br.top)/z);
  if(dir==='up'){p.x=Math.round(cx-w/2);p.y=Math.round(Bm+2+others*34);}
  else if(dir==='down'){p.x=Math.round(cx-w/2);p.y=Math.round(T-h-2-others*34);}
  else if(dir==='left'){p.x=Math.round(R+3);p.y=Math.round(cy-h/2+others*20);}
  else {p.x=Math.round(L-w-3);p.y=Math.round(cy-h/2+others*20);}
  p._snap=cellKey(cellEl);
}
function cellKey(c){var ie=c.closest('.it');return (ie?ie.dataset.id:'')+':'+c.dataset.c;}
function nearCell(p){ // 最靠近指標箭頭那一端的格子
  var pe=itemsEl.querySelector('[data-id="'+p.id+'"]'); if(!pe) return null;
  var r=pe.getBoundingClientRect(), dir=p.dir||'up';
  var tx=dir==='left'?r.left:dir==='right'?r.right:r.left+r.width/2, ty=dir==='up'?r.top:dir==='down'?r.bottom:r.top+r.height/2;
  var best=null, bd=1e9;
  var q=(dir==='left'||dir==='right')?'.stackbox .cell':'.cells .cell, .queuebox .cell'; // 橫向箭頭只對齊直的容器（堆疊），不會蓋到陣列隔壁格
  [].forEach.call(itemsEl.querySelectorAll(q),function(c){var cr=c.getBoundingClientRect();
    var d=Math.hypot(cr.left+cr.width/2-tx,cr.top+cr.height/2-ty); if(d<bd&&d<110*view.z){bd=d;best=c;}});
  return best;
}

