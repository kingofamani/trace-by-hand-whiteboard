/* ---------- 複製一份（當下一步） ---------- */
function duplicate(id){
  var it=byId(id); if(!it) return;
  var el=itemsEl.querySelector('[data-id="'+id+'"]'); var h=el?el.offsetHeight:60, w=el?el.offsetWidth:100;
  var vertical=['array','string','queue','grid','steps','text','var','dict','set'].indexOf(it.type)>=0;
  var c=clone(it); c.id=nid(); delete c.z; delete c.g; c.x=it.x+(vertical?0:w+30); c.y=it.y+(vertical?h+26:0);
  B.items.push(c);
  // 指到這個陣列的指標也一起複製
  if(it.type==='array'||it.type==='string'){
    var r=el.getBoundingClientRect();
    B.items.filter(function(p){return p.type==='pointer';}).forEach(function(p){
      var pe=itemsEl.querySelector('[data-id="'+p.id+'"]'); if(!pe) return; var q=pe.getBoundingClientRect();
      if(q.left+q.width/2>=r.left-10&&q.left+q.width/2<=r.right+10&&q.top>=r.bottom-8&&q.top<=r.bottom+50){var pc=clone(p);pc.id=nid();delete pc.g;pc.y+=h+26;B.items.push(pc);}
    });
  }
  sel=c.id; renderAll(); commit(); toast(_T('已複製一份，改有變的地方就好'));
}

