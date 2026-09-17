(function(){
  const L = {
    base:{rank:0,label:"小学校既習相当"},
    j1t1:{rank:1,label:"中1・1学期"},j1t2:{rank:2,label:"中1・2学期"},j1t3:{rank:3,label:"中1・3学期"},
    j2t1:{rank:4,label:"中2・1学期"},j2t2:{rank:5,label:"中2・2学期"},j2t3:{rank:6,label:"中2・3学期"}
  };
  const subjects=[
    {id:"i",text:"I",ja:"私は",level:"base",person:1,number:"sg"},
    {id:"you",text:"You",ja:"あなたは",level:"base",person:2,number:"sg"},
    {id:"we",text:"We",ja:"私たちは",level:"base",person:1,number:"pl"},
    {id:"they",text:"They",ja:"彼らは・彼女らは",level:"j1t1",person:3,number:"pl"},
    {id:"he",text:"He",ja:"彼は",level:"j1t1",person:3,number:"sg"},
    {id:"she",text:"She",ja:"彼女は",level:"j1t1",person:3,number:"sg"},
    {id:"ken",text:"Ken",ja:"ケンは",level:"base",person:3,number:"sg"},
    {id:"yuki",text:"Yuki",ja:"ユキは",level:"base",person:3,number:"sg"},
    {id:"brother",text:"My brother",ja:"私の兄・弟は",level:"j1t2",person:3,number:"sg"},
    {id:"friends",text:"My friends",ja:"私の友達は",level:"j1t2",person:3,number:"pl"}
  ];
  const svVerbs=[
    {id:"run",base:"run",third:"runs",ja:"走る",level:"base"},
    {id:"swim",base:"swim",third:"swims",ja:"泳ぐ",level:"base"},
    {id:"sing",base:"sing",third:"sings",ja:"歌う",level:"base"},
    {id:"dance",base:"dance",third:"dances",ja:"踊る",level:"base"},
    {id:"walk",base:"walk",third:"walks",ja:"歩く",level:"j1t1"},
    {id:"come",base:"come",third:"comes",ja:"来る",level:"j1t1"},
    {id:"go",base:"go",third:"goes",ja:"行く",level:"j1t1"},
    {id:"study",base:"study",third:"studies",ja:"勉強する",level:"j1t2"}
  ];
  const complements=[
    {id:"happy",text:"happy",ja:"うれしい・幸せな",level:"base",kind:"adj"},
    {id:"fine",text:"fine",ja:"元気な",level:"base",kind:"adj"},
    {id:"kind",text:"kind",ja:"親切な",level:"j1t1",kind:"adj"},
    {id:"busy",text:"busy",ja:"忙しい",level:"j1t2",kind:"adj"},
    {id:"tired",text:"tired",ja:"疲れた",level:"j1t2",kind:"adj"},
    {id:"student",text:"a student",ja:"生徒",level:"j1t1",kind:"noun"},
    {id:"teacher",text:"a teacher",ja:"先生",level:"j1t1",kind:"noun"}
  ];
  const objects=[
    {id:"soccer",text:"soccer",ja:"サッカー",level:"base",group:"sport"},
    {id:"tennis",text:"tennis",ja:"テニス",level:"base",group:"sport"},
    {id:"music",text:"music",ja:"音楽",level:"base",group:"like"},
    {id:"dogs",text:"dogs",ja:"犬",level:"base",group:"like"},
    {id:"books",text:"books",ja:"本",level:"j1t1",group:"read"},
    {id:"English",text:"English",ja:"英語",level:"j1t1",group:"study"},
    {id:"this-book",text:"this book",ja:"この本",level:"j1t1",group:"have"},
    {id:"pen",text:"a pen",ja:"ペン1本",level:"j1t1",group:"thing"},
    {id:"book",text:"a book",ja:"本1冊",level:"j1t1",group:"thing"},
    {id:"card",text:"a card",ja:"カード1枚",level:"j1t2",group:"thing"},
    {id:"picture",text:"this picture",ja:"この写真・絵",level:"j1t2",group:"thing"},
    {id:"answer",text:"the answer",ja:"答え",level:"j2t1",group:"thing"}
  ];
  const svoVerbs=[
    {id:"like",base:"like",third:"likes",ja:"～が好き",level:"base",objectGroups:["sport","like","read","study"]},
    {id:"play",base:"play",third:"plays",ja:"～をする",level:"base",objectGroups:["sport"]},
    {id:"read",base:"read",third:"reads",ja:"～を読む",level:"j1t1",objectGroups:["read"]},
    {id:"study",base:"study",third:"studies",ja:"～を勉強する",level:"j1t1",objectGroups:["study"]},
    {id:"have",base:"have",third:"has",ja:"～を持っている",level:"j1t1",objectGroups:["have","thing"]},
    {id:"use",base:"use",third:"uses",ja:"～を使う",level:"j1t2",objectGroups:["thing"]}
  ];
  const indirectObjects=[
    {id:"me",text:"me",ja:"私に",level:"j1t1"},
    {id:"you-io",text:"you",ja:"あなたに",level:"base"},
    {id:"him",text:"him",ja:"彼に",level:"j1t2"},
    {id:"her",text:"her",ja:"彼女に",level:"j1t2"},
    {id:"us",text:"us",ja:"私たちに",level:"j1t2"}
  ];
  const svooVerbs=[
    {id:"give",base:"give",third:"gives",ja:"～に…をあげる",level:"j1t1",directGroups:["thing"]},
    {id:"show",base:"show",third:"shows",ja:"～に…を見せる",level:"j1t2",directGroups:["thing"]}
  ];
  const names=[
    {id:"Ken-c",text:"Ken",ja:"ケン",level:"base"},
    {id:"Yuki-c",text:"Yuki",ja:"ユキ",level:"base"},
    {id:"Mike-c",text:"Mike",ja:"マイク",level:"j1t1"}
  ];
  const svocFrames=[
    {id:"call",verb:{base:"call",third:"calls",ja:"～を…と呼ぶ",level:"j1t1"},objects:[
      {text:"him",ja:"彼を",level:"j1t1"},{text:"her",ja:"彼女を",level:"j1t2"}],complements:names},
    {id:"make",verb:{base:"make",third:"makes",ja:"～を…にする",level:"j2t1"},objects:[
      {text:"me",ja:"私を",level:"j1t1"},{text:"us",ja:"私たちを",level:"j1t2"}],complements:[
      {text:"happy",ja:"うれしい状態に",level:"base"},{text:"tired",ja:"疲れた状態に",level:"j1t2"}]}
  ];
  const modifiers=[
    {id:"today",text:"today",ja:"今日",level:"base",positions:["end","front"]},
    {id:"every-day",text:"every day",ja:"毎日",level:"base",positions:["end"]},
    {id:"after-school",text:"after school",ja:"放課後に",level:"j1t1",positions:["end"]},
    {id:"at-school",text:"at school",ja:"学校で",level:"j1t1",positions:["end"]},
    {id:"in-park",text:"in the park",ja:"公園で",level:"j1t1",positions:["end"]},
    {id:"sunday",text:"on Sunday",ja:"日曜日に",level:"j1t1",positions:["end","front"]},
    {id:"sometimes",text:"sometimes",ja:"ときどき",level:"j1t2",positions:["mid","front"]},
    {id:"usually",text:"usually",ja:"たいてい",level:"j1t2",positions:["mid"]},
    {id:"yesterday",text:"yesterday",ja:"昨日",level:"j1t3",positions:["end","front"]}
  ];
  window.ED_WORD_BANK={meta:{version:"0.1.0",note:"学期別タグは試作の共通基礎語彙。特定教科書の公式配当表ではありません。"},
    levels:L,subjects,svVerbs,complements,objects,svoVerbs,indirectObjects,svooVerbs,svocFrames,modifiers};
})();