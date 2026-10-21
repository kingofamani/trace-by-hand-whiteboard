/* ---------- 上方按鈕 ---------- */
$('undo').onclick=undo; $('redo').onclick=redo;
$('zin').onclick=function(){var r=board.getBoundingClientRect();zoomAt(r.left+r.width/2,r.top+r.height/2,1.2);persist();};
$('zout').onclick=function(){var r=board.getBoundingClientRect();zoomAt(r.left+r.width/2,r.top+r.height/2,1/1.2);persist();};
$('zfit').onclick=fit;
function zoomTo(z){var r=board.getBoundingClientRect();zoomAt(r.left+r.width/2,r.top+r.height/2,z/view.z);persist();}
$('zv').onclick=function(){popMenu($('zv'),[[_T('放大'),_T('⌘＋'),function(){zoomTo(view.z*1.25);}],[_T('縮小'),'⌘−',function(){zoomTo(view.z/1.25);}],'-',[_T('縮放到 100%'),'⇧0',function(){zoomTo(1);}],[_T('全部看得到'),'⇧1',fit]],'up');};
