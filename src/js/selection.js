/* ---------- 框選、多選 ---------- */
function groupIds(){return msel.length?msel.slice():(sel?[sel]:[]);}
function groupRect(){ // 螢幕座標
  var x1=1e9,y1=1e9,x2=-1e9,y2=-1e9,any=false;
  groupIds().forEach(function(id){var el=itemsEl.querySelector('[data-id="'+id+'"]');if(!el)return;var r=el.getBoundingClientRect();any=true;x1=Math.min(x1,r.left);y1=Math.min(y1,r.top);x2=Math.max(x2,r.right);y2=Math.max(y2,r.bottom);});
  mstk.forEach(function(i){var el=itemsEl.querySelector('.stroke[data-s="'+i+'"]');if(!el)return;var r=el.getBoundingClientRect();any=true;x1=Math.min(x1,r.left);y1=Math.min(y1,r.top);x2=Math.max(x2,r.right);y2=Math.max(y2,r.bottom);});
  return any?{left:x1,top:y1,right:x2,bottom:y2}:null;
}
function clearMulti(){msel=[];mstk=[];}
function setMulti(ids,stk){
  msel=ids; mstk=stk||[];
  if(msel.length===1&&!mstk.length){sel=msel[0];msel=[];} else sel=null;
  selEdge=null; renderAll();
}
