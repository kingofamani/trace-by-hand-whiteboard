/* ---------- 我的白板 ---------- */
function probById(pid){for(var i=0;i<PROBLEMS.length;i++)if(PROBLEMS[i][0]===pid)return PROBLEMS[i];return null;}
function findProblem(q){
  q=String(q||'').trim(); if(!q) return null;
  var m=q.match(/^(\d+)/); if(m){var p=probById(+m[1]); if(p) return p;}
  var lq=q.toLowerCase(); for(var i=0;i<PROBLEMS.length;i++) if(PROBLEMS[i][1].toLowerCase()===lq) return PROBLEMS[i];
  for(i=0;i<PROBLEMS.length;i++) if(PROBLEMS[i][1].toLowerCase().indexOf(lq)>=0) return PROBLEMS[i];
  return null;
}
function renderBoardBtn(){
  var m=boardMeta(curBoard); $('boardBtn').textContent=(m?m.name:_T('白板'))+'  ▾';
  var a=$('lcLink'); if(m&&m.slug){a.href='https://leetcode.com/problems/'+m.slug+'/';a.hidden=false;} else a.hidden=true;
  document.title=m?m.name:_T('白板');
}
function openBoard(id){
  if(curBoard&&lastSnap!==null) persist();
  var data=lsGet('drycanvas-b-'+id), v=lsGet('drycanvas-v-'+id);
  curBoard=id; saveIndex();
  B=data?JSON.parse(data):{items:[],edges:[],strokes:[],seq:1}; B.edges=B.edges||[]; B.strokes=B.strokes||[]; B.seq=B.seq||1;
  view=v?JSON.parse(v):{x:40,y:30,z:1};
  sel=null; selEdge=null; clearMulti(); activeCell=null; hist=[]; fut=[];
  renderAll(); lastSnap=snapshot(); updUndo(); renderBoardBtn();
  if(!v) setTimeout(fit,30);
}
function newBoard(prob){
  if(curBoard&&lastSnap!==null) persist();
  var id='b'+Date.now().toString(36)+Math.floor(Math.random()*1e4), name;
  if(prob) name=prob[0]+'. '+prob[1];
  else {var n=1; while(BOARDS.some(function(b){return b.name===_T('未命名白板 {n}',{n:n});})) n++; name=_T('未命名白板 {n}',{n:n});}
  BOARDS.unshift({id:id,name:name,pid:prob?prob[0]:null,slug:prob?prob[2]:null,updated:Date.now()});
  curBoard=id; saveIndex();
  B={items:[],edges:[],strokes:[],seq:1}; view={x:40,y:30,z:1};
  sel=null; selEdge=null; clearMulti(); activeCell=null; hist=[]; fut=[];
  if(prob){var t=make('title',60,40); t.text=prob[0]+'. '+prob[1]+(prob[3]?_T('（')+prob[3]+_T('）'):''); B.items.push(t);}
  renderAll(); lastSnap=snapshot(); persist(); updUndo(); renderBoardBtn();
  toast(prob?_T('已開一個「{name}」的白板',{name:name}):_T('已開一個新白板'));
}
function relTime(t){
  var d=(Date.now()-t)/1000; if(d<60) return _T('剛剛'); if(d<3600) return _T('{n} 分鐘前',{n:Math.floor(d/60)});
  var dt=new Date(t), now=new Date(); var hm=('0'+dt.getHours()).slice(-2)+':'+('0'+dt.getMinutes()).slice(-2);
  if(dt.toDateString()===now.toDateString()) return _T('今天 {t}',{t:hm});
  return (dt.getMonth()+1)+'/'+dt.getDate()+' '+hm;
}
function showBoards(){
  var m=document.createElement('div'); m.className='modal'; m.id='bmodal';
  m.innerHTML=_T('<div class="bl" role="dialog" aria-label="我的白板"><h3>我的白板<button class="tb" id="bClose" type="button">關閉</button></h3>')+
    _T('<div class="newrow"><button class="tb" id="bBlank" type="button">＋ 空白白板</button><span style="color:var(--ink-3);font-size:12px">或</span>')+
    _T('<label for="bProb" style="position:absolute;left:-9999px">題號或題名</label><input type="text" id="bProb" list="probList" placeholder="輸入題號或題名，例：20、Two Sum" style="flex:1;min-width:180px">')+
    _T('<button class="tb" id="bNewProb" type="button" style="background:var(--ink);color:var(--surface);border-color:var(--ink)">＋ 這一題的白板</button><div id="bMsg" style="width:100%;font-size:12px;color:var(--red)"></div></div>')+
    '<datalist id="probList">'+PROBLEMS.map(function(p){return '<option value="'+p[0]+'. '+esc(p[1])+'">';}).join('')+'</datalist>'+
    _T('<label for="bSearch" style="position:absolute;left:-9999px">搜尋白板</label><input type="search" id="bSearch" placeholder="搜尋已存的白板">')+
    '<div class="list" id="bList"></div></div>';
  board.appendChild(m);
  function list(){
    var q=$('bSearch').value.trim().toLowerCase();
    var rows=BOARDS.slice().sort(function(a,b){return b.updated-a.updated;}).filter(function(b){return !q||b.name.toLowerCase().indexOf(q)>=0||String(b.pid||'')===q;});
    $('bList').innerHTML=rows.length?rows.map(function(b){
      var cnt=0; try{var d=JSON.parse(lsGet('drycanvas-b-'+b.id)||'{}');cnt=(d.items||[]).length;}catch(e){}
      return '<div class="row'+(b.id===curBoard?' cur':'')+'" data-b="'+b.id+'"><div style="min-width:0"><div class="nm2">'+esc(b.name)+'</div><div class="meta2">'+(b.pid?'<span class="pt">'+_T('題目 #{n}',{n:b.pid})+'</span>':_T('<span class="pt">空白</span>'))+'<span>'+relTime(b.updated)+'</span><span>'+_T('{n} 個元件',{n:cnt})+'</span>'+(b.id===curBoard?_T('<span style="color:var(--marker);font-weight:700">目前這個</span>'):'')+'</div></div>'+
        _T('<div class="acts"><button type="button" class="pri" data-bo="open">開啟</button><button type="button" data-bo="rename">改名</button><button type="button" data-bo="dup">複製</button><button type="button" class="danger" data-bo="del">刪除</button></div></div>');}).join(''):'<div class="none2">'+(q?_T('找不到符合的白板。'):_T('還沒有存任何白板。'))+'</div>';
  }
  list();
  $('bSearch').oninput=list;
  $('bClose').onclick=function(){m.remove();};
  m.addEventListener('pointerdown',function(e){if(e.target===m)m.remove();});
  $('bBlank').onclick=function(){newBoard(null);m.remove();};
  function mkProb(){var p=findProblem($('bProb').value); if(!p){$('bMsg').textContent=_T('找不到這一題，請輸入題號（例：20）或完整題名。');return;} newBoard(p); m.remove();}
  $('bNewProb').onclick=mkProb;
  $('bProb').onkeydown=function(e){if(e.key==='Enter'){e.preventDefault();mkProb();}};
  $('bList').onclick=function(e){
    var btn=e.target.closest('[data-bo]'); if(!btn) return; var row=btn.closest('.row'), id=row.dataset.b, b=boardMeta(id);
    var op=btn.dataset.bo;
    if(op==='open'){openBoard(id);m.remove();}
    else if(op==='rename'){
      var nm=row.querySelector('.nm2'); nm.innerHTML='<input type="text" value="'+esc(b.name)+_T('" aria-label="新名稱" style="width:100%;font-weight:700">');
      var inp=nm.querySelector('input'); inp.focus(); inp.select();
      var done=function(){var v=inp.value.trim(); if(v){b.name=v;saveIndex();renderBoardBtn();} list();};
      inp.onkeydown=function(ev){if(ev.key==='Enter'){ev.preventDefault();done();} if(ev.key==='Escape'){list();}}; inp.onblur=done;
    }
    else if(op==='dup'){
      if(id===curBoard) persist();
      var nid2='b'+Date.now().toString(36)+Math.floor(Math.random()*1e4);
      lsSet('drycanvas-b-'+nid2,lsGet('drycanvas-b-'+id)||''); var vv=lsGet('drycanvas-v-'+id); if(vv) lsSet('drycanvas-v-'+nid2,vv);
      BOARDS.unshift({id:nid2,name:_T('{name}（複製）',{name:b.name}),pid:b.pid,slug:b.slug,updated:Date.now()}); saveIndex(); list(); toast(_T('已複製'));
    }
    else if(op==='del'){
      if(!btn.classList.contains('arm')){btn.classList.add('arm');btn.textContent=_T('確定刪除？');setTimeout(function(){if(btn.isConnected){btn.classList.remove('arm');btn.textContent=_T('刪除');}},2500);return;}
      BOARDS=BOARDS.filter(function(x){return x.id!==id;}); lsDel('drycanvas-b-'+id); lsDel('drycanvas-v-'+id);
      if(id===curBoard){curBoard=null; if(BOARDS.length) openBoard(BOARDS[0].id); else newBoard(null);} saveIndex(); list(); toast(_T('已刪除'));
    }
  };
  setTimeout(function(){$('bProb').focus();},30);
}
