/* ---------- 範例資料（工具列「範例」） ---------- */
var SAMPLEY=['array','string','stack','queue','set','dict','grid'];
var SAMPLE_NAMES={'zh-TW':['小明','小英','小華','小美','小強','小芳','阿傑','小玉','大雄','靜香'],'zh-CN':['小明','小英','小华','小美','小强','小芳','阿杰','小玉','大雄','静香'],
  ja:['太郎','花子','健太','さくら','翔太','美咲','大輔','陽菜','拓海','結衣'],ko:['민준','서연','지호','하은','도윤','지우','예준','수아','시우','하린'],
  en:['Alice','Bob','Carol','Dave','Eve','Frank','Grace','Heidi','Ivan','Judy'],fr:['Léa','Hugo','Chloé','Louis','Emma','Jules','Manon','Lucas','Inès','Nathan'],
  hi:['आरव','प्रिया','विवान','अनन्या','अर्जुन','दिया','कबीर','ईशा','रोहन','मीरा']};
var SAMPLE_WORDS=['hello','banana','racecar','leetcode','abcabcbb','pwwkew','anagram','mississippi'];
function rnd(n){return Math.floor(Math.random()*n);}
function shuffled(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=rnd(i+1),t=a[i];a[i]=a[j];a[j]=t;}return a;}
function sampleNames(n){var base=shuffled(SAMPLE_NAMES[LANG]||SAMPLE_NAMES.en),out=[];for(var i=0;i<n;i++)out.push(base[i%base.length]+(i<base.length?'':String(Math.floor(i/base.length)+1)));return out;} // 名字不夠就加編號，不會重複
function sampleNums(n,lo,hi,uniq){var out=[];while(out.length<n){var v=lo+rnd(hi-lo+1);if(!uniq||out.indexOf(v)<0||out.length>hi-lo)out.push(v);}return out.map(String);}
function sampleLetters(n,uniq){var out=[];while(out.length<n){var c=String.fromCharCode(97+rnd(26));if(!uniq||out.indexOf(c)<0||out.length>=26)out.push(c);}return out;}
function sampleKinds(it){ // [選單文字, 右邊的預覽, 種類]
  var nm=SAMPLE_NAMES[LANG]||SAMPLE_NAMES.en;
  if(it.type==='string') return [[_T('英文單字'),'banana …','word'],[_T('隨機字母'),'x q b …','letters']];
  if(it.type==='dict') return [[_T('名字 → 分數'),nm[0]+': 85 …','nameScore'],[_T('字母 → 次數'),'a: 3 …','letterCount']];
  if(it.type==='grid') return [[_T('隨機數字'),'7 42 15 …','nums'],[_T('0 和 1'),'0 1 1 …','bits']];
  return [[_T('名字'),nm.slice(0,3).join(' ')+' …','names'],[_T('隨機數字'),'7 42 15 …','nums'],[_T('排序好的數字'),'3 15 27 …','sorted'],[_T('隨機字母'),'x q b …','letters']];
}
function fillSample(it,kind){ // 照現有的格數填；空的就給預設大小。集合不重複
  var uniq=it.type==='set', gen={names:sampleNames,
    nums:function(n){return sampleNums(n,1,99,uniq);}, sorted:function(n){return sampleNums(n,1,99,true).sort(function(a,b){return a-b;});},
    letters:function(n){return sampleLetters(n,uniq);}, bits:function(n){return sampleNums(n,0,1,false);}};
  if(it.type==='dict'){var ks=kind==='nameScore'?sampleNames(it.rows.length||4):sampleLetters(it.rows.length||4,true);
    it.rows=ks.map(function(k){return [k,String(kind==='nameScore'?60+rnd(41):1+rnd(5))];});}
  else if(it.type==='grid'){var R=it.rows.length||3, C=(it.rows[0]||[]).length||3; it.rows=[]; for(var r=0;r<R;r++) it.rows.push(gen[kind](C));}
  else{it.cells=kind==='word'?SAMPLE_WORDS[rnd(SAMPLE_WORDS.length)].split(''):gen[kind](it.cells.length||5);
    var L=it.cells.length; // 字串換單字長度會變：超出的標記拿掉
    if(it.hl) it.hl=it.hl.filter(function(k){return k<L;}); if(it.done) it.done=it.done.filter(function(k){return k<L;});
    if(it.cbg) Object.keys(it.cbg).forEach(function(k){if(+k>=L)delete it.cbg[k];});}
  renderAll(); commit(); toast(_T('已填入範例資料'));
}
function sampleMenu(it){
  var b=$('mt').querySelector('[data-act="sampleMenu"]'); if(!b) return;
  popMenu(b,sampleKinds(it).map(function(k){return [k[0],k[1],function(){fillSample(it,k[2]);}];}));
}
