/* 群組：元件和筆跡用同一個 g 綁在一起，點一個就選整組 */
function gMembers(g){return {ids:B.items.filter(function(x){return x.g===g;}).map(function(x){return x.id;}),stk:B.strokes.map(function(s,i){return s.g===g?i:-1;}).filter(function(i){return i>=0;})};}
function withGroups(ids,stk){ // 選到群組裡的一個，就把整組帶進來
  var gs={}; ids.forEach(function(id){var o=byId(id);if(o&&o.g)gs[o.g]=1;}); stk.forEach(function(i){var s=B.strokes[i];if(s&&s.g)gs[s.g]=1;});
  Object.keys(gs).forEach(function(g){var m=gMembers(g);m.ids.forEach(function(id){if(ids.indexOf(id)<0)ids.push(id);});m.stk.forEach(function(i){if(stk.indexOf(i)<0)stk.push(i);});});
  return {ids:ids,stk:stk};
}
function selGroups(){var gs={};groupIds().forEach(function(id){var o=byId(id);gs[o&&o.g||'']=1;});mstk.forEach(function(i){var s=B.strokes[i];gs[s&&s.g||'']=1;});return Object.keys(gs);} // '' 代表沒群組的
function isOneGroup(){var gs=selGroups(); if(gs.length!==1||!gs[0]) return false; var m=gMembers(gs[0]); return m.ids.length+m.stk.length===groupIds().length+mstk.length;}
function groupBtns(){var n=groupIds().length+mstk.length;
  return (n>1&&!isOneGroup()?'<button type="button" data-act="group" title="'+_T('群組（⌘G）')+'">'+_T('群組')+'</button>':'')+
    (selGroups().some(Boolean)?'<button type="button" data-act="ungroup" title="'+_T('取消群組（⇧⌘G）')+'">'+_T('取消群組')+'</button>':'')+'<span class="sep2"></span>';}
function groupSel(){
  var ids=groupIds(), n=ids.length+mstk.length; if(n<2||isOneGroup()) return;
  var g=nid(); ids.forEach(function(id){byId(id).g=g;}); mstk.forEach(function(i){B.strokes[i].g=g;});
  renderAll(); commit(); toast(_T('已群組 {n} 個',{n:n}));
}
function ungroupSel(){
  var any=false; groupIds().forEach(function(id){var o=byId(id);if(o&&o.g){delete o.g;any=true;}}); mstk.forEach(function(i){var s=B.strokes[i];if(s&&s.g){delete s.g;any=true;}});
  if(!any) return; pruneGroups(); renderAll(); commit(); toast(_T('已取消群組'));
}
function pruneGroups(){var all=B.items.concat(B.strokes),cnt={};all.forEach(function(o){if(o.g)cnt[o.g]=(cnt[o.g]||0)+1;});all.forEach(function(o){if(o.g&&cnt[o.g]<2)delete o.g;});} // 只剩一個的群組就拆掉
function freshGroups(list){var m={};list.forEach(function(o){if(o.g)o.g=m[o.g]||(m[o.g]=nid());});pruneGroups();} // 複製出來的另成一組，不會混進原本的群組
