/* ---------- 浮動小工具列（複製、連線、刪除等） ---------- */
function fillSwatches(){return _T('<span class="cnt">填充</span><button type="button" class="bgsw none" data-act="sfill" data-v="0" title="不填" aria-label="不填"></button>')+[1,2,3,4,5,6].map(function(n){return '<button type="button" class="bgsw" style="background:var(--sw'+n+')" data-act="sfill" data-v="'+n+_T('" aria-label="填充 ')+n+'"></button>';}).join('')+'<span class="sep2"></span>';}
function swatches(label){return '<span class="cnt">'+label+_T('</span><button type="button" class="bgsw none" data-act="bg" data-v="0" title="清除底色" aria-label="清除底色"></button>')+
  [1,2,3,4,5,6].map(function(n){return '<button type="button" class="bgsw" style="background:var(--sw'+n+')" data-act="bg" data-v="'+n+_T('" aria-label="底色 ')+n+'"></button>';}).join('')+'<span class="sep2"></span>';}
var CELLY=['array','string','stack','queue','set','grid','steps','dict'], NODEY=['tree','list','gnode','var'];
function cellKeys(it){
  if(it.cells) return it.cells.map(function(_,i){return String(i);});
  if(it.type==='dict') return [].concat.apply([],it.rows.map(function(_,i){return [i+',0',i+',1'];}));
  if(it.rows) return [].concat.apply([],it.rows.map(function(r,i){return r.map(function(_,j){return i+','+j;});}));
  return [];
}
function paint(it,n,key){
  if(NODEY.indexOf(it.type)>=0){it.bg=n||0;return;}
  if(CELLY.indexOf(it.type)<0) return;
  it.cbg=it.cbg||{};
  (key!=null?[key]:cellKeys(it)).forEach(function(k){if(n) it.cbg[k]=n; else delete it.cbg[k];});
}
function renderToolbar(){
  var M=$('mt');
  if(selEdge){var e=edgeById(selEdge); if(!e){M.hidden=true;return;}
    M.innerHTML='<button type="button" data-act="toggleDir">'+(e.dir?_T('→ 有箭頭'):_T('— 沒箭頭'))+_T('</button><button type="button" data-act="flip">⇄ 反轉</button><button type="button" data-act="edgeLabel">T 文字</button><span class="sep2"></span><button type="button" class="danger" data-act="delEdge">刪除</button>');
    M.hidden=false; placeToolbar(); return;}
  if(msel.length+mstk.length>1||(msel.length===0&&mstk.length)){
    M.innerHTML='<span class="cnt">'+(isOneGroup()?_T('群組（{n} 個）',{n:msel.length+mstk.length}):_T('已選 {n} 個',{n:msel.length+mstk.length}))+'</span><span class="sep2"></span>'+(msel.length?swatches(_T('底色')):'<span class="cnt">'+(mstk.some(function(i){var t=B.strokes[i]&&B.strokes[i].t;return t==='rect'||t==='ellipse';})?_T('邊框'):_T('線條'))+'</span>'+COLORS.map(function(c,i){return '<button type="button" class="sw" style="background:'+c+'" data-act="scolor" data-v="'+i+_T('" aria-label="線條顏色 ')+(i+1)+'"></button>';}).join('')+'<span class="sep2"></span>'+(mstk.some(function(i){var t=B.strokes[i]&&B.strokes[i].t;return t==='rect'||t==='ellipse';})?fillSwatches():''))+groupBtns()+_T('<button type="button" data-act="zfront" title="移到最上層（⌘⌥]）" aria-label="移到最上層">⤒</button><button type="button" data-act="zback" title="移到最下層（⌘⌥[）" aria-label="移到最下層">⤓</button><span class="sep2"></span><button type="button" class="danger" data-act="gdel" title="刪除（Delete）" aria-label="刪除">✕</button>');
    M.hidden=false; placeToolbar(); return;}
  var it=sel&&byId(sel); if(!it){M.hidden=true;return;}
  var h='';
  if(it.type==='text') h+=['big','normal','code'].map(function(v,i){return '<button type="button" data-act="style" data-v="'+v+'" aria-pressed="'+(it.style===v)+'">'+[_T('大標題'),_T('一般'),_T('程式碼')][i]+'</button>';}).join('')+'<span class="sep2"></span>';
  if(it.type==='pointer') h+=[['up','↑'],['right','→'],['down','↓'],['left','←']].map(function(d){return '<button type="button" class="dirb" data-act="dir" data-v="'+d[0]+'" aria-pressed="'+((it.dir||'up')===d[0])+_T('" title="箭頭朝')+{up:_T('上'),right:_T('右'),down:_T('下'),left:_T('左')}[d[0]]+_T('（按 R 旋轉）">')+d[1]+'</button>';}).join('')+'<span class="sep2"></span>';
  if(it.type==='pointer') h+=COLORS.map(function(c,i){return '<button type="button" class="sw" style="background:'+c+'" data-act="color" data-v="'+i+_T('" aria-label="顏色 ')+(i+1)+'"></button>';}).join('')+'<span class="sep2"></span>';
  if(CELLY.indexOf(it.type)>=0||NODEY.indexOf(it.type)>=0){
    var lab=NODEY.indexOf(it.type)>=0?_T('底色'):(activeCell&&activeCell.id===it.id?(activeCell.key.indexOf(',')>=0?_T('這格'):_T('第 {n} 格',{n:+activeCell.key+idxBase})):_T('全部格子'));
    h+=swatches(lab);
  }
  if(it.type==='tree') h+=_T('<button type="button" data-act="tidy">整理這棵樹</button>');
  if(it.type==='tree'||it.type==='list'||it.type==='gnode') h+='<span class="sep2"></span>';
  if(it.type==='array'||it.type==='string') h+=_T('<button type="button" data-act="addPtr" title="加一個指標。Shift＋點格子＝標黃，Alt＋點格子＝變淡">＋指標</button>')+((it.hl||[]).length||(it.done||[]).length?_T('<button type="button" data-act="clearHl">清除標記</button>'):'')+'<span class="sep2"></span>';
  if((it.type==='grid'||it.type==='steps')&&(it.hl||[]).length) h+=_T('<button type="button" data-act="clearHl">清除標記</button><span class="sep2"></span>');
  if(SAMPLEY.indexOf(it.type)>=0) h+='<button type="button" data-act="sampleMenu" title="'+_T('填入範例資料')+'">'+_T('範例')+'</button><span class="sep2"></span>';
  if(LPY.indexOf(it.type)>=0) h+='<button type="button" data-act="lpMenu" title="'+_T('名稱位置')+'">'+_T('名稱')+' '+LPS[lpOf(it)]+'</button><span class="sep2"></span>';
  if(it.g) h+='<button type="button" data-act="ungroup">'+_T('移出群組')+'</button><span class="sep2"></span>';
  h+=_T('<button type="button" data-act="zfront" title="移到最上層（⌘⌥]；往上一層 ⌘]）" aria-label="移到最上層">⤒</button><button type="button" data-act="zback" title="移到最下層（⌘⌥[；往下一層 ⌘[）" aria-label="移到最下層">⤓</button><span class="sep2"></span>');
  h+=_T('<button type="button" data-act="dup" title="複製一份（⌘D）" aria-label="複製一份">⧉</button><button type="button" data-act="connFrom" title="從這裡拉一條線" aria-label="連線">→</button><button type="button" class="danger" data-act="del" title="刪除（Delete）" aria-label="刪除">✕</button>');
  M.innerHTML=h; M.hidden=false; placeToolbar();
}
function placeToolbar(){
  renderHandles();
  var M=$('mt'); if(!M||M.hidden) return; var br=board.getBoundingClientRect(), x, y;
  if(selEdge){var e=edgeById(selEdge); if(!e||e._mx==null){return;} x=view.x+e._mx*view.z; y=view.y+e._my*view.z-44;}
  else if(msel.length+mstk.length>1||(msel.length===0&&mstk.length)){var g=groupRect(); if(!g){M.hidden=true;return;} x=g.left-br.left; y=g.top-br.top-(resizable()?52:42);}
  else{var el=sel&&itemsEl.querySelector('[data-id="'+sel+'"]'); if(!el){M.hidden=true;return;} var r=el.getBoundingClientRect(); x=r.left-br.left; y=r.top-br.top-42;}
  y=Math.max(6,y); x=Math.max(6,Math.min(x,br.width-M.offsetWidth-6));
  M.style.left=x+'px'; M.style.top=y+'px';
}
