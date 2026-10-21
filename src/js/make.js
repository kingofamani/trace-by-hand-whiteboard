/* ---------- 元件的預設內容 ---------- */
function make(type,x,y){
  var it={id:nid(),type:type,x:Math.round(x),y:Math.round(y)};
  var d={
    title:{kind:'text',text:'',style:'big'},
    text:{kind:'text',text:'',style:'normal'},
    code:{kind:'text',text:'',style:'code'},
    note:{text:''},
    array:{name:'',cells:['','','',''],hl:[],done:[]},
    string:{name:'',cells:['','','',''],hl:[],done:[]},
    pointer:{name:'',color:2},
    stack:{name:'',cells:[]},
    queue:{name:'',cells:[]},
    dict:{name:'',rows:[]},
    set:{name:'',cells:[]},
    grid:{name:'',rows:[['','',''],['','',''],['','','']],hl:[]},
    var:{name:'',value:''},
    tree:{val:''}, list:{val:''}, gnode:{val:''},
    steps:{cols:[_T('欄 1'),_T('欄 2'),_T('欄 3')],rows:[['','','']],hl:[]}
  }[type];
  for(var k in d) it[k]=clone(d[k]);
  if(it.kind==='text'){it.type='text';}
  return it;
}
function addItem(type,x,y){
  if(x==null){var c=center();x=c.x-60;y=c.y-40;}
  var it=make(type,x,y); B.items.push(it); sel=it.id; selEdge=null; setTool('select'); renderAll(); commit();
  if(type==='stack'||type==='queue'||type==='set') focusSlot(it,'push'); else if(type==='dict') focusSlot(it,'dk');
  else if(type==='array') goCell(it,0,'all');
  else if(type==='tree'||type==='list'||type==='gnode') focusVal(it.id);
  else if(type==='title'||type==='text'||type==='code'||type==='note'){var te=itemsEl.querySelector('[data-id="'+it.id+'"] [data-f="text"]');if(te)te.focus();}
  else if(type==='var'){var ve=itemsEl.querySelector('[data-id="'+it.id+'"] [data-f="name"]');if(ve)ve.focus();}
  else if(type==='pointer'){var pe2=itemsEl.querySelector('[data-id="'+it.id+'"] .pn');if(pe2)pe2.focus();}
  return it;
}
function center(){var r=board.getBoundingClientRect();return toWorld(r.left+r.width/2,r.top+r.height/2);}
function toWorld(cx,cy){var r=board.getBoundingClientRect();return {x:(cx-r.left-view.x)/view.z,y:(cy-r.top-view.y)/view.z};}

