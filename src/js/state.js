var COLORS=['var(--ink)','var(--red)','var(--marker)','var(--green)','var(--purple)'];
var B={items:[],edges:[],strokes:[],seq:1};
var view={x:40,y:30,z:1};
var activeCell=null;
var idxBase=0; try{idxBase=localStorage.getItem('drycanvas-ib')==='1'?1:0;}catch(e){} // 陣列 index 從 0 或 1 開始（全部白板共用）；只影響顯示，格子的 key 一律從 0 算
var LPY=['array','string','stack','queue','dict','set','grid'], LPS={top:'↑',bottom:'↓',left:'←',right:'→'}; // 有名稱的元件；名稱可以放上下左右
var lpDef='top'; try{var lp0=localStorage.getItem('drycanvas-lp');if(LPS[lp0])lpDef=lp0;}catch(e){} // 名稱位置的預設（全部白板共用），元件自己有設 it.lp 就用自己的
function lpOf(it){return it.lp||lpDef;}
var msel=[], mstk=[], clip=null, mouseW={x:0,y:0}, marq=null;
var tool='select', sel=null, selEdge=null, connSrc=null, hist=[], fut=[], space=false;
var $=function(id){return document.getElementById(id);};
var board=$('board'), world=$('world'), itemsEl=$('items');
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function nid(){return 'n'+(B.seq++);}
function byId(id){for(var i=0;i<B.items.length;i++)if(B.items[i].id===id)return B.items[i];return null;}
function clone(o){return JSON.parse(JSON.stringify(o));}
function toast(t){[].forEach.call(document.querySelectorAll('.toast'),function(x){x.remove();});var e=document.createElement('div');e.className='toast';e.textContent=t;board.appendChild(e);setTimeout(function(){e.remove();},1400);}

