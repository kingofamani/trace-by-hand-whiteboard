/* ---------- 開始 ---------- */
(function init(){
  if(lsGet('drycanvas-help')!=='0') $('help').hidden=false;
  setTool('select');
  try{BOARDS=JSON.parse(lsGet('drycanvas-boards')||'[]')||[];}catch(e){BOARDS=[];}
  if(!BOARDS.length){
    var old=lsGet('drycanvas'), ov=lsGet('drycanvas-view');
    if(old){ // 舊版的內容 → 第一個白板
      var id='b'+Date.now().toString(36); BOARDS=[{id:id,name:_T('我的第一個白板'),pid:null,slug:null,updated:Date.now()}];
      lsSet('drycanvas-b-'+id,old); if(ov) lsSet('drycanvas-v-'+id,ov); curBoard=id; saveIndex(); openBoard(id); return;
    }
    // 第一次打開：一張空白白板
    newBoard(null); return;
  }
  var cur=lsGet('drycanvas-cur'); if(!boardMeta(cur)) cur=BOARDS[0].id;
  openBoard(cur);
})();
