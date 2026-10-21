/* ---------- 畫出元件 ---------- */
function nameHtml(it){return _T('<span class="nm" contenteditable="true" spellcheck="false" data-f="name" data-ph="名稱">')+esc(it.name)+'</span>';}
var SWN=6;
function BG(it,key){var n=it.cbg&&it.cbg[key];return n?' style="background:var(--sw'+n+')"':'';}
function XB(act,i){return '<button class="xb ctl" type="button" data-act="'+act+'" data-i="'+i+_T('" aria-label="刪除">×</button>');}
function cellsHtml(it,withIdx){
  var h=it.cells.map(function(c,i){return '<div class="cw">'+XB('delCell',i)+(withIdx?'<span class="ix">'+(i+idxBase)+'</span>':'')+'<div class="cell'+((it.hl||[]).indexOf(i)>=0?' hl':'')+((it.done||[]).indexOf(i)>=0?' done':'')+'"'+BG(it,i)+' contenteditable="true" spellcheck="false" data-c="'+i+'">'+esc(c)+'</div></div>';}).join('');
  return h+_T('<button class="addc ctl" type="button" data-act="addCell" aria-label="加一格">＋</button>')+(it.cells.length?'':_T('<span class="empty">（空的）</span>'));
}
function itemHtml(it){
  switch(it.type){
    case 'text': return '<div class="txt '+it.style+'" contenteditable="true" spellcheck="false" data-f="text" data-ph="'+({big:_T('標題'),code:_T('程式碼')}[it.style]||_T('文字'))+'">'+esc(it.text)+'</div>';
    case 'note': return _T('<div class="note" contenteditable="true" spellcheck="false" data-f="text" data-ph="便利貼">')+esc(it.text)+'</div>';
    case 'array': case 'string':
      return '<div class="grip">⠿ '+nameHtml(it)+'<span>'+(it.type==='string'?_T('字串'):_T('陣列'))+'</span></div><div class="cells">'+cellsHtml(it,true)+'</div>';
    case 'pointer': var dr=it.dir||'up'; return '<div class="ptr '+dr+'" style="color:'+COLORS[it.color||0]+'"><span class="ar">'+{up:'↑',down:'↓',left:'←',right:'→'}[dr]+_T('</span><span class="pn" contenteditable="true" spellcheck="false" data-f="name" data-ph="名稱">')+esc(it.name)+'</span></div>';
    case 'stack':
      return '<div class="grip">⠿ '+nameHtml(it)+_T('<span>堆疊</span></div><div class="toplab">')+(it.cells.length?_T('↓ 頂端'):'')+'</div><div class="stackbox">'+
        it.cells.map(function(c,i){return '<div class="cw">'+XB('delCell',i)+'<div class="cell"'+BG(it,i)+' contenteditable="true" spellcheck="false" data-c="'+i+'">'+esc(c)+'</div></div>';}).join('')+
        _T('<div class="cell slot ctl" contenteditable="true" spellcheck="false" data-slot="push" data-ph="＋ 推入"></div>')+(it.cells.length?'':_T('<span class="empty">（空的）</span>'))+'</div>';
    case 'queue':
      return '<div class="grip">⠿ '+nameHtml(it)+_T('<span>佇列</span></div><div class="qlab"><span>前端 ←</span><span>← 尾端</span></div><div class="queuebox">')+
        it.cells.map(function(c,i){return '<div class="cw">'+XB('delCell',i)+'<div class="cell"'+BG(it,i)+' contenteditable="true" spellcheck="false" data-c="'+i+'">'+esc(c)+'</div></div>';}).join('')+
        _T('<div class="cell slot ctl" contenteditable="true" spellcheck="false" data-slot="push" data-ph="＋ 加入"></div>')+(it.cells.length?'':_T('<span class="empty">（空的）</span>'))+'</div>';
    case 'dict':
      return '<div class="grip">⠿ '+nameHtml(it)+_T('<span>字典</span></div><table class="kv"><tr><th>key</th><th>value</th></tr>')+
        it.rows.map(function(r,i){return '<tr><td'+BG(it,i+',0')+' contenteditable="true" spellcheck="false" data-r="'+i+'" data-k="0">'+esc(r[0])+'</td><td'+BG(it,i+',1')+' contenteditable="true" spellcheck="false" data-r="'+i+'" data-k="1">'+esc(r[1])+'</td><td class="xrow ctl"><button class="xb" type="button" data-act="delRow" data-i="'+i+_T('" aria-label="刪除這筆">×</button></td></tr>');}).join('')+
        (it.rows.length?'':_T('<tr class="emptyrow"><td colspan="2" class="empty">（空的）</td></tr>'))+
        _T('<tr class="ctl"><td class="slot" contenteditable="true" spellcheck="false" data-slot="dk" data-ph="＋ key"></td><td class="slot" contenteditable="true" spellcheck="false" data-slot="dv" data-ph="value"></td></tr></table>');
    case 'set':
      return '<div class="grip">⠿ '+nameHtml(it)+_T('<span>集合</span></div><div class="chips">')+
        it.cells.map(function(c,i){return '<span class="chipw">'+XB('delCell',i)+'<span class="chip"'+BG(it,i)+' contenteditable="true" spellcheck="false" data-c="'+i+'">'+esc(c)+'</span></span>';}).join('')+
        _T('<span class="chip slot ctl" contenteditable="true" spellcheck="false" data-slot="push" data-ph="＋ 加入"></span>')+(it.cells.length?'':_T('<span class="empty">（空的）</span>'))+'</div>';
    case 'grid':
      var cols=it.rows[0]?it.rows[0].length:0;
      return '<div class="grip">⠿ '+nameHtml(it)+_T('<span>二維陣列</span></div><div class="gwrap"><table class="grid"><tr><th></th><th class="axis" colspan="')+Math.max(1,cols)+_T('"><span class="ax" contenteditable="true" spellcheck="false" data-f="cl" data-ph="欄">')+esc(it.colLabel||'')+_T('</span> →</th></tr><tr><th class="axis rax"><span class="ax" contenteditable="true" spellcheck="false" data-f="rl" data-ph="列">')+esc(it.rowLabel||'')+'</span> ↓</th>'+
        Array.apply(null,{length:cols}).map(function(_,j){return '<th class="xh">'+(j+idxBase)+'<button class="xb ctl" type="button" data-act="delCol" data-i="'+j+'" aria-label="'+_T('刪除第 {n} 欄',{n:j+idxBase})+'">×</button></th>';}).join('')+'</tr>'+
        it.rows.map(function(r,i){return '<tr><th class="xh">'+(i+idxBase)+'<button class="xb ctl" type="button" data-act="delRow" data-i="'+i+'" aria-label="'+_T('刪除第 {n} 列',{n:i+idxBase})+'">×</button></th>'+
          r.map(function(c,j){return '<td class="'+((it.hl||[]).indexOf(i+','+j)>=0?'hl':'')+'"'+BG(it,i+','+j)+' contenteditable="true" spellcheck="false" data-r="'+i+'" data-k="'+j+'">'+esc(c)+'</td>';}).join('')+'</tr>';}).join('')+
        _T('</table><button class="addcol ctl" type="button" data-act="addCol" aria-label="加一欄">＋</button><button class="addrow ctl" type="button" data-act="addRow" aria-label="加一列">＋ 列</button></div>');
    case 'var': return '<div class="varbox"'+(it.bg?' style="background:var(--sw'+it.bg+')"':'')+_T('><span class="grip" style="padding:0">⠿</span><span class="vn" contenteditable="true" spellcheck="false" data-f="name" data-ph="名稱">')+esc(it.name)+_T('</span>=<span class="vv" contenteditable="true" spellcheck="false" data-f="value" data-ph="值">')+esc(it.value)+'</span></div>';
    case 'tree':
      return '<div class="nodew"><div class="node'+(it.hl?' hl':'')+'"'+(it.bg?' style="background:var(--sw'+it.bg+')"':'')+'><span class="nv" data-f="val" data-ph="?">'+esc(it.val)+'</span></div>'+
        _T('<button class="np l ctl" type="button" data-act="addL" title="加左子節點">＋</button><button class="np r ctl" type="button" data-act="addR" title="加右子節點">＋</button></div>');
    case 'list':
      return '<div class="nodew"><div class="node list'+(it.hl?' hl':'')+'"'+(it.bg?' style="background:var(--sw'+it.bg+')"':'')+'><span class="nv" data-f="val" data-ph="?">'+esc(it.val)+_T('</span></div><button class="np nx ctl" type="button" data-act="addNext" title="接下一個">＋</button></div>');
    case 'gnode':
      return '<div class="nodew"><div class="node graph'+(it.hl?' hl':'')+'"'+(it.bg?' style="background:var(--sw'+it.bg+')"':'')+'><span class="nv" data-f="val" data-ph="?">'+esc(it.val)+_T('</span></div><button class="np adj ctl" type="button" data-act="addAdj" title="加一個相鄰節點">＋</button></div>');
    case 'steps':
      return _T('<div class="grip">⠿ 表格</div><div class="gwrap"><table class="steps"><tr>')+it.cols.map(function(c,j){return '<th class="xh"><span contenteditable="true" spellcheck="false" data-h="'+j+_T('" data-ph="欄">')+esc(c)+'</span><button class="xb ctl" type="button" data-act="delCol" data-i="'+j+_T('" aria-label="刪除這一欄">×</button></th>');}).join('')+'<th class="xrow ctl" style="border:0;background:none"></th></tr>'+
        it.rows.map(function(r,i){return '<tr>'+r.map(function(c,j){return '<td class="'+((it.hl||[]).indexOf(i+','+j)>=0?'hl':'')+'"'+BG(it,i+','+j)+' contenteditable="true" spellcheck="false" data-r="'+i+'" data-k="'+j+'">'+esc(c)+'</td>';}).join('')+
          '<td class="xrow ctl"><button class="xb" type="button" data-act="delRow" data-i="'+i+_T('" aria-label="刪除這一列">×</button></td></tr>');}).join('')+
        _T('</table><button class="addcol ctl" type="button" data-act="addCol" aria-label="加一欄">＋</button><button class="addrow ctl" type="button" data-act="stepAdd">＋ 新增一列</button></div>');
  }
  return '';
}
function renderItem(it){
  if((it.type==='tree'||it.type==='list'||it.type==='gnode')&&it.hl){it.bg=it.bg||1;delete it.hl;}
  var el=itemsEl.querySelector('[data-id="'+it.id+'"]');
  if(!el){el=document.createElement('div');el.className='it';el.dataset.id=it.id;itemsEl.appendChild(el);}
  el.style.left=it.x+'px'; el.style.top=it.y+'px'; el.style.zIndex=(it.z||0)+1;
  el.innerHTML=itemHtml(it);
  if(LPY.indexOf(it.type)>=0){ // 名稱以外的部分包成一塊，名稱放上下左右交給 CSS 排
    var bd=document.createElement('div'); bd.className='ibody';
    [].slice.call(el.children).forEach(function(c){if(!c.classList.contains('grip'))bd.appendChild(c);}); el.appendChild(bd);
    el.dataset.lp=lpOf(it);
  }
  el.classList.toggle('sel',sel===it.id);
  el.classList.toggle('connsrc',connSrc===it.id);
  el.classList.toggle('msel',msel.indexOf(it.id)>=0);
  if(it.type==='tree'||it.type==='list'||it.type==='gnode'){var nv=el.querySelector('.nv');nv.contentEditable=it.val===''?'true':'false';}
  return el;
}
function renderAll(){
  ensureZ();
  setTimeout(renderHandles,0);
  drawMini();
  msel=msel.filter(function(i){return byId(i);}); mstk=mstk.filter(function(i){return i<B.strokes.length;});
  itemsEl.innerHTML='';
  B.items.forEach(renderItem);
  renderEdges(); renderStrokes(); applyView(); renderToolbar();
}
function applyView(){drawMini();renderHandles();world.style.transform='translate('+view.x+'px,'+view.y+'px) scale('+view.z+')';$('zv').textContent=Math.round(view.z*100)+'%';placeToolbar();}

