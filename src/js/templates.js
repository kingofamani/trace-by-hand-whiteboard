/* ---------- 範本 ---------- */
function place(list,edges){ // list: [type, dx, dy, props]
  var c=center(), ox=c.x-260, oy=c.y-160, ids=[], els=itemsEl.querySelectorAll('.it');
  if(els.length){var x1=1e9,y2=-1e9;[].forEach.call(els,function(el){x1=Math.min(x1,el.offsetLeft);y2=Math.max(y2,el.offsetTop+el.offsetHeight);});ox=x1;oy=y2+90;}
  list.forEach(function(d){var it=make(d[0],ox+d[1],oy+d[2]);for(var k in (d[3]||{}))it[k]=d[3][k];B.items.push(it);ids.push(it);});
  (edges||[]).forEach(function(e){addEdge(ids[e[0]].id,ids[e[1]].id,{dir:e[2]!==false,side:e[3]||null});});
  sel=null; renderAll();
  ids.forEach(function(it){if(it.type==='tree'&&!B.edges.some(function(e){return e.to===it.id&&e.side;}))layoutTree(it.id);});
  // 指標吸附
  ids.filter(function(it){return it.type==='pointer'&&it.snap!=null;}).forEach(function(p){var arr=ids[p.snap.a];var cel=itemsEl.querySelectorAll('[data-id="'+arr.id+'"] .cell')[p.snap.i];delete p.snap;if(cel)snapPointer(p,cel);});
  renderAll(); commit();
  if(els.length){view.x=60-ox*view.z;view.y=40-oy*view.z;applyView();persist();}
}
var TPL={
  arr2:[['title',0,0,{text:_T('題目：')}],['array',0,70,{name:'nums',cells:['1','2','3','4','5','6']}],['pointer',0,0,{name:'left',color:2,snap:{a:1,i:0}}],['pointer',0,0,{name:'right',color:1,snap:{a:1,i:5}}],['var',330,90,{name:'best',value:'0'}],['steps',0,210,{cols:[_T('步'),'left','right','best',_T('說明')],rows:[['0','0','5','0',_T('起點')]]}]],
  stack:[['title',0,0,{text:_T('20. 有效的括號')}],['array',0,70,{name:'s',cells:'([)]'.split('')}],['pointer',0,0,{name:'i',color:2,snap:{a:1,i:0}}],['stack',260,50,{name:'stack',cells:[]}],['steps',0,220,{cols:[_T('步'),'i',_T('讀到'),'stack',_T('決定')],rows:[['0','0','','[]',_T('起點')]]}],['note',420,50,{text:_T('堆疊放：還沒關的左括號\n右括號：只跟頂端比')}]],
  dict:[['title',0,0,{text:_T('1. Two Sum　target = 9')}],['array',0,70,{name:'nums',cells:['2','7','11','15']}],['pointer',0,0,{name:'i',color:2,snap:{a:1,i:0}}],['dict',260,60,{name:'seen',rows:[]}],['var',260,190,{name:'target',value:'9'}],['steps',0,240,{cols:[_T('步'),'i','x','target-x',_T('在 seen 裡？'),'seen'],rows:[['0','0','2','7',_T('否'),'{}']]}]],
  tree:[['title',0,0,{text:_T('二元樹：root = [3,9,20,null,null,15,7]')}],['tree',200,80,{val:'3'}],['tree',0,0,{val:'9'}],['tree',0,0,{val:'20'}],['tree',0,0,{val:'15'}],['tree',0,0,{val:'7'}],['queue',420,90,{name:'q',cells:['3']}]],
  list:[['title',0,0,{text:_T('鏈結串列：head = [1,2,3,4,5]')}],['list',0,80,{val:'1'}],['list',100,80,{val:'2'}],['list',200,80,{val:'3'}],['list',300,80,{val:'4'}],['list',400,80,{val:'5'}],['var',0,170,{name:'prev',value:'None'}],['var',130,170,{name:'cur',value:'1'}]],
  dp:[['title',0,0,{text:_T('DP：dp[i][j] 代表…')}],['grid',0,60,{name:'dp',rows:[['0','0','0','0'],['0','','',''],['0','','',''],['0','','','']]}],['note',300,60,{text:_T('狀態：\n轉移：dp[i][j] = \n起點：\n答案在哪一格：')}]],
  graph:[['title',0,0,{text:_T('圖：從 A 出發')}],['gnode',40,80,{val:'A'}],['gnode',170,40,{val:'B'}],['gnode',170,150,{val:'C'}],['gnode',300,100,{val:'D'}],['queue',420,60,{name:'q',cells:['A']}],['set',420,170,{name:'visited',cells:['A']}]]
};
var TPLE={tree:[[1,2,false,'L'],[1,3,false,'R'],[3,4,false,'L'],[3,5,false,'R']],list:[[1,2],[2,3],[3,4],[4,5]],graph:[[1,2,false],[1,3,false],[2,4,false],[3,4,false]]};
$('psearch').oninput=function(){var q=this.value.trim().toLowerCase();
  [].forEach.call(document.querySelectorAll('.pal.tile'),function(b){b.hidden=!!q&&b.dataset.k.toLowerCase().indexOf(q)<0&&b.dataset.add.indexOf(q)<0;});
  [].forEach.call(document.querySelectorAll('#tab-comp .tiles'),function(g){var any=[].some.call(g.querySelectorAll('.pal.tile'),function(b){return !b.hidden;});g.hidden=!any;g.previousElementSibling.hidden=!any;});};

