/* ---------- 存檔、復原 ---------- */
function snapshot(){return JSON.stringify(B);}
var lastSnap=null;
function commit(){var s=snapshot(); if(s===lastSnap) return; if(lastSnap!==null){hist.push(lastSnap); if(hist.length>150) hist.shift();} fut=[]; lastSnap=s; persist(); updUndo();}
var PROBLEMS=/*PROBLEMS*/[];
var BOARDS=[], curBoard=null; // BOARDS：[{id,name,pid,slug,updated}]
function lsGet(k){try{return localStorage.getItem(k);}catch(e){return null;}}
function lsSet(k,v){try{localStorage.setItem(k,v);return true;}catch(e){return false;}}
function lsDel(k){try{localStorage.removeItem(k);}catch(e){}}
function saveIndex(){lsSet('drycanvas-boards',JSON.stringify(BOARDS));lsSet('drycanvas-cur',curBoard||'');}
function boardMeta(id){return BOARDS.filter(function(b){return b.id===id;})[0];}
function persist(){
  if(!curBoard) return;
  var ok=lsSet('drycanvas-b-'+curBoard,lastSnap); lsSet('drycanvas-v-'+curBoard,JSON.stringify(view));
  lsSet('drycanvas',lastSnap); // 相容舊版
  var m=boardMeta(curBoard); if(m){m.updated=Date.now();saveIndex();}
  if(!ok) toast(_T('瀏覽器空間滿了，這次沒有存到。可以刪掉幾個舊白板，或用匯出備份。'));
}
function undo(){if(!hist.length)return; clearMulti(); fut.push(lastSnap); lastSnap=hist.pop(); B=JSON.parse(lastSnap); sel=null; selEdge=null; renderAll(); persist(); updUndo();}
function redo(){if(!fut.length)return; clearMulti(); hist.push(lastSnap); lastSnap=fut.pop(); B=JSON.parse(lastSnap); sel=null; selEdge=null; renderAll(); persist(); updUndo();}
function updUndo(){$('undo').disabled=!hist.length; $('redo').disabled=!fut.length;}

