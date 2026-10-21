$('helpBtn').onclick=function(){$('help').hidden=!$('help').hidden;};
function fit(){
  var els=itemsEl.querySelectorAll('.it'); if(!els.length){view={x:40,y:30,z:1};applyView();return;}
  var x1=1e9,y1=1e9,x2=-1e9,y2=-1e9;
  [].forEach.call(els,function(el){x1=Math.min(x1,el.offsetLeft);y1=Math.min(y1,el.offsetTop);x2=Math.max(x2,el.offsetLeft+el.offsetWidth);y2=Math.max(y2,el.offsetTop+el.offsetHeight);});
  var r=board.getBoundingClientRect(), aw=r.width-120, ah=r.height-150, z=Math.min(1.1,Math.max(0.25,Math.min(aw/(x2-x1+40),ah/(y2-y1+40))));
  view.z=z; view.x=Math.round(r.width/2-(x1+x2)/2*z); view.y=Math.round((r.height-90)/2-(y1+y2)/2*z); applyView(); persist();
}
if(false)(function(){
  if($('clear').dataset.arm){B={items:[],edges:[],strokes:[],seq:B.seq};sel=null;selEdge=null;renderAll();commit();$('clear').textContent=_T('清空畫板');delete $('clear').dataset.arm;toast(_T('已清空，可以按復原找回來'));return;}
})();
$('exp').onclick=function(){
  var m=document.createElement('div'); m.className='modal';
  m.innerHTML=_T('<div class="box"><b>匯出／匯入</b><div style="font-size:12.5px;color:var(--ink-2)">複製下面的內容存起來；要還原時，把內容貼回來按「匯入」。</div><textarea id="ioText" spellcheck="false" aria-label="畫板內容"></textarea><div style="display:flex;gap:6px;justify-content:flex-end"><button class="tb" id="ioCopy" type="button">複製</button><button class="tb" id="ioLoad" type="button">匯入</button><button class="tb" id="ioClose" type="button">關閉</button></div></div>');
  board.appendChild(m); var ta=$('ioText'); ta.value=JSON.stringify(B);
  $('ioClose').onclick=function(){m.remove();};
  $('ioCopy').onclick=function(){var done=function(){toast(_T('已複製'));};if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(ta.value).then(done,function(){ta.select();});else ta.select();};
  $('ioLoad').onclick=function(){try{var o=JSON.parse(ta.value);if(!o||!Array.isArray(o.items))throw 0;B=o;B.edges=B.edges||[];B.strokes=B.strokes||[];B.seq=B.seq||999;sel=null;renderAll();commit();m.remove();fit();toast(_T('已匯入'));}catch(e){toast(_T('內容格式不對，沒有匯入'));}};
};
$('helpX').onclick=function(){$('help').hidden=true;try{localStorage.setItem('drycanvas-help','0');}catch(e){}};

