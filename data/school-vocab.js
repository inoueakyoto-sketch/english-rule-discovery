(function(){
  const levels={
    base:{rank:0,label:"小学校既習相当"},
    j1t1:{rank:1,label:"中1・1学期目安"},j1t2:{rank:2,label:"中1・2学期目安"},j1t3:{rank:3,label:"中1・3学期目安"},
    j2t1:{rank:4,label:"中2・1学期目安"},j2t2:{rank:5,label:"中2・2学期目安"},j2t3:{rank:6,label:"中2・3学期目安"}
  };
  // WORD CODEで扱う語を「最初に練習へ出してよい時期」の目安に割り当てる。
  // 学習指導要領は教科書Unitごとの語を固定していないため、特定教科書の配当表ではなく、
  // 小学校既習語・中学校の一般的な基本語彙の難度と綴りパターンから段階化している。
  const groups={
    j1t1:`cat map bag hat man cap sit big six kid pen bed ten red desk hot box not sun bus run fun game name time bike five like home see day play`,
    j1t2:`milk win help job stop shop cup cut take cake late gate kite nine note hope rose meet week keep need team eat rain train mail stay boat road coat ship chair lunch fish much`,
    j1t3:`plane rope stone green clean speak soap goat toast bread head have give`,
    j2t1:`dream teacher great live`,
    j2t2:``,
    j2t3:``
  };
  const rankByWord={};
  Object.entries(groups).forEach(([level,text])=>String(text).trim().split(/\s+/).filter(Boolean).forEach(word=>{rankByWord[word.toLowerCase()]=levels[level].rank;}));
  function key(grade,term){return `j${Number(grade)||1}t${Number(term)||1}`;}
  function rank(grade,term){return levels[key(grade,term)]?.rank??1;}
  function wordRank(word){return rankByWord[String(word).toLowerCase()]??0;}
  function allowed(word,grade,term){return wordRank(word)<=rank(grade,term);}
  function label(grade,term){return levels[key(grade,term)]?.label||levels.j1t1.label;}
  function assignedLevel(word){const r=wordRank(word);return Object.entries(levels).find(([,v])=>v.rank===r)?.[0]||"base";}
  window.ED_SCHOOL_VOCAB={
    version:"1.0.0",levels,rankByWord,key,rank,wordRank,allowed,label,assignedLevel,
    note:"特定教科書のUnit配当ではなく、小学校既習語と中学校の共通基礎語彙を学期単位で練習へ出すための目安です。学校・教科書によって導入時期は異なります。"
  };
})();
