/* ---------- 鍵盤 ---------- */
document.addEventListener('keydown',function(e){
  var t=e.target, typing=t.isContentEditable||t.tagName==='INPUT'||t.tagName==='TEXTAREA'||t.tagName==='SELECT';
  var mod=e.metaKey||e.ctrlKey;
  if(mod&&e.key.toLowerCase()==='z'&&!typing){e.preventDefault();if(e.shiftKey)redo();else undo();return;}
  if(mod&&e.key.toLowerCase()==='d'&&(sel||msel.length||mstk.length)){e.preventDefault();if(typing)t.blur();dupGroup();return;}
  if(!typing&&mod&&e.key.toLowerCase()==='c'&&(sel||msel.length||mstk.length)){e.preventDefault();copyGroup();return;}
  if(!typing&&mod&&e.key.toLowerCase()==='v'&&clip){e.preventDefault();pasteClip();return;}
  if(!typing&&mod&&(e.code==='BracketRight'||e.code==='BracketLeft')&&(sel||msel.length||mstk.length)){e.preventDefault();reorder(e.code==='BracketRight'?(e.altKey?'front':'fwd'):(e.altKey?'back':'bwd'));return;}
  if(!typing&&mod&&e.key.toLowerCase()==='g'){e.preventDefault();if(e.shiftKey)ungroupSel();else groupSel();return;}
  if(!typing&&mod&&e.key.toLowerCase()==='a'){e.preventDefault();setMulti(B.items.map(function(x){return x.id;}),B.strokes.map(function(_,i){return i;}));return;}
  if(!typing&&e.shiftKey&&!mod&&(e.code==='Digit1')){e.preventDefault();fit();return;}
  if(!typing&&e.shiftKey&&!mod&&(e.code==='Digit0')){e.preventDefault();zoomTo(1);return;}
  if(mod&&(e.key==='='||e.key==='+')){e.preventDefault();zoomTo(view.z*1.25);return;}
  if(mod&&e.key==='-'){e.preventDefault();zoomTo(view.z/1.25);return;}
  if(typing) return;
  if(e.key===' '){space=true;board.classList.add('hand');e.preventDefault();return;}
  if((e.key==='Delete'||e.key==='Backspace')){if(selEdge){act('delEdge');}else if(msel.length||mstk.length){delGroup();}else if(sel){delItem(sel);}e.preventDefault();return;}
  if(e.key==='Escape'){setTool('select');sel=null;selEdge=null;clearMulti();renderAll();return;}
  var k=e.key.toLowerCase();
  if(k==='r'&&!mod&&sel&&byId(sel)&&byId(sel).type==='pointer'){var po=byId(sel),order=['up','right','down','left'];po.dir=order[(order.indexOf(po.dir||'up')+1)%4];renderAll();commit();return;}
  if(k==='l'&&e.shiftKey&&!mod){setTool('arrow');renderAll();return;}
  var map={v:'select',c:'connect',p:'pen',e:'erase',h:'hand',r:'rect',o:'ellipse',l:'line'};
  if(map[k]&&!mod){setTool(map[k]);renderAll();}
});
window.addEventListener('keydown',function(e){if(e.key==='Alt')board.classList.add('alt');});
window.addEventListener('blur',function(){board.classList.remove('alt');});
document.addEventListener('keyup',function(e){if(e.key==='Alt')board.classList.remove('alt');if(e.key===' '){space=false;board.classList.remove('hand');setTool(tool);}});

