/* ---------- 直接編輯內容 ---------- */
world.addEventListener('input',function(e){
  var t=e.target;
  if(t.classList.contains('elabel')){var ed=edgeById(t.dataset.e);if(ed)ed.label=t.innerText.replace(/\n/g,'');return;}
  var itEl=t.closest('.it'); if(!itEl) return; var it=byId(itEl.dataset.id); if(!it||t.dataset.slot) return;
  var v=t.innerText.replace(/\n$/,'');
  if(t.dataset.f==='name') it.name=v.replace(/\n/g,'');
  else if(t.dataset.f==='text') it.text=v;
  else if(t.dataset.f==='value') it.value=v.replace(/\n/g,'');
  else if(t.dataset.f==='val') it.val=v.replace(/\n/g,'');
  else if(t.dataset.f==='rl') it.rowLabel=v.replace(/\n/g,'');
  else if(t.dataset.f==='cl') it.colLabel=v.replace(/\n/g,'');
  else if(t.dataset.c!=null){
    var ci=+t.dataset.c; v=v.replace(/\n/g,'');
    if(it.type==='string'&&!e.isComposing&&v.length>=1){ // 信用卡式：一格一個字，打完自動到下一格
      var chars=v.split(''); if(chars.length>1){spill(it,ci,chars);return;} it.cells[ci]=v; commit(); nextCell(it,ci); return; }
    it.cells[ci]=v;
  }
  else if(t.dataset.h!=null) it.cols[+t.dataset.h]=v.replace(/\n/g,'');
  else if(t.dataset.r!=null) it.rows[+t.dataset.r][+t.dataset.k]=v.replace(/\n/g,'');
  renderEdges(); placeToolbar();
});
function takeSlot(t){ // 把推入／加入格裡打的字收進元件
  var itEl=t.closest('.it'), it=itEl&&byId(itEl.dataset.id); if(!it) return false;
  var v=t.innerText.replace(/\n/g,'').trim();
  if(t.dataset.slot==='push'){ t.textContent=''; if(!v) return false; it.cells=it.cells.concat(split(v).length>1?split(v):[v]); renderItem(it); commit(); focusSlot(it,'push'); renderEdges(); placeToolbar(); return true; }
  if(t.dataset.slot==='dk'||t.dataset.slot==='dv'){
    var row=t.closest('tr'), k=row.querySelector('[data-slot="dk"]').innerText.trim(), val=row.querySelector('[data-slot="dv"]').innerText.trim();
    if(!k) return false;
    var r=it.rows.filter(function(x){return x[0]===k;})[0]; if(r) r[1]=val; else it.rows.push([k,val]);
    row.querySelector('[data-slot="dk"]').textContent=''; row.querySelector('[data-slot="dv"]').textContent='';
    renderItem(it); commit(); focusSlot(it,'dk'); placeToolbar(); return true;
  }
  return false;
}
world.addEventListener('compositionend',function(e){ // 中文輸入法選完字才跳格
  var t=e.target, ie=t.closest&&t.closest('.it'), it=ie&&byId(ie.dataset.id);
  if(it&&it.type==='string'&&t.dataset.c!=null){var v=t.innerText.replace(/\n/g,''),ci=+t.dataset.c;if(v.length>1)spill(it,ci,v.split(''));else if(v.length===1){it.cells[ci]=v;commit();nextCell(it,ci);}}
});
world.addEventListener('paste',function(e){ // 貼上一串 → 展開成好幾格
  var t=e.target, ie=t.closest&&t.closest('.it'), it=ie&&byId(ie.dataset.id);
  if(!it||t.dataset.c==null||!(it.type==='array'||it.type==='string')) return;
  var txt=(e.clipboardData||window.clipboardData).getData('text').trim(); if(!txt) return;
  var parts=it.type==='string'?txt.replace(/^["']|["']$/g,'').split(''):txt.replace(/^\[|\]$/g,'').split(/[\s,]+/).filter(Boolean);
  if(parts.length<2) return; e.preventDefault(); spill(it,+t.dataset.c,parts);
});
world.addEventListener('keydown',function(e){
  var t=e.target;
  var ie0=t.closest&&t.closest('.it'), it0=ie0&&byId(ie0.dataset.id);
  if(it0&&t.dataset.c!=null&&(it0.type==='array'||it0.type==='string')&&!e.isComposing&&!e.metaKey&&!e.ctrlKey){
    var ci=+t.dataset.c, pos=caretAt(t), empty=t.innerText.replace(/\n/g,'')==='';
    if(it0.type==='array'&&(e.key===' '||e.key===',')){e.preventDefault();it0.cells[ci]=t.innerText.replace(/\n/g,'').trim();commit();nextCell(it0,ci);return;}
    if(e.key==='Backspace'&&empty){e.preventDefault(); // 空格子按 Backspace：刪掉這格，回到上一格
      if(it0.cells.length>1){removeCell(it0,ci);renderItem(it0);renderEdges();commit();placeToolbar();goCell(it0,Math.max(0,ci-1),'end');}
      return;}
    if(e.key==='Backspace'&&pos.start&&ci>0){e.preventDefault();goCell(it0,ci-1,'end');return;}
    if(e.key==='ArrowLeft'&&pos.start&&ci>0){e.preventDefault();goCell(it0,ci-1,'end');return;}
    if(e.key==='ArrowRight'&&pos.end&&ci<it0.cells.length-1){e.preventDefault();goCell(it0,ci+1,'start');return;}
  }
  if(t.dataset.slot){
    if(e.key==='Enter'){e.preventDefault();
      if(t.dataset.slot==='dk'){var dv=t.closest('tr').querySelector('[data-slot="dv"]');dv.focus();return;}
      takeSlot(t);}
    if(e.key==='Tab'&&t.dataset.slot==='dk'){e.preventDefault();t.closest('tr').querySelector('[data-slot="dv"]').focus();}
    return;
  }
  if(t.classList.contains('elabel')&&e.key==='Enter'){e.preventDefault();t.blur();return;}
  if(e.key==='Enter'&&!(t.dataset.f==='text'&&!e.metaKey&&!e.ctrlKey)){e.preventDefault();t.blur();}
  if(e.key==='Tab'&&(t.dataset.c!=null||t.dataset.r!=null)){ // Tab 跳到下一格；陣列最後一格再按 Tab 會多一格
    var itEl=t.closest('.it'), it=byId(itEl.dataset.id), all=[].slice.call(itEl.querySelectorAll('[data-c],[data-r]')), i=all.indexOf(t), n=all[i+(e.shiftKey?-1:1)];
    e.preventDefault();
    if(n){n.focus();selectAll(n);}
    else if(!e.shiftKey&&(it.type==='array'||it.type==='string')){it.cells.push('');renderItem(it);commit();focusCell(it,it.cells.length-1);}
  }
});
world.addEventListener('focusout',function(e){
  var t=e.target;
  if(t.classList&&t.classList.contains('elabel')){var ed=edgeById(t.dataset.e);if(ed){ed.label=t.innerText.replace(/\n/g,'').trim();}renderEdges();commit();return;}
  if(t.dataset&&t.dataset.slot){ if(t.isConnected&&t.dataset.slot==='push'&&t.innerText.trim()) takeSlot(t); return; }
  var itEl=t.closest&&t.closest('.it'), it=itEl&&byId(itEl.dataset.id);
  if(it&&t.dataset.c!=null&&it.cells&&explode(it,+t.dataset.c)){renderItem(it);renderEdges();commit();placeToolbar();return;}
  if(it&&t.classList.contains('nv')){ if(buildFromText(it)) return; t.contentEditable=it.val===''?'true':'false'; }
  commit();
});
world.addEventListener('focusin',function(e){var t=e.target; if(skipSelect){skipSelect=false; var ie1=t.closest&&t.closest('.it'); if(ie1&&(t.dataset.c!=null)){activeCell={id:ie1.dataset.id,key:t.dataset.c};renderToolbar();} return;}
  var ie=t.closest&&t.closest('.it'); if(ie&&(t.dataset.c!=null||t.dataset.r!=null)&&!t.dataset.slot){activeCell={id:ie.dataset.id,key:t.dataset.c!=null?t.dataset.c:t.dataset.r+','+t.dataset.k};if(sel!==ie.dataset.id){sel=ie.dataset.id;clearMulti();itemsEl.querySelectorAll('.it.sel').forEach(function(x){x.classList.remove('sel');});ie.classList.add('sel');}renderToolbar();}if(t.isContentEditable&&(t.dataset.c!=null||t.dataset.r!=null)){setTimeout(function(){if(document.activeElement===t)selectAll(t);},0);}});

