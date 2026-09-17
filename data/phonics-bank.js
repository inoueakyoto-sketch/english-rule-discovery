(function(){
  const stages=[
    {
      id:"sound-not-name",order:0,code:"SOUND 00",title:"文字には「名前」と「音」がある",short:"名前と音",pattern:"LETTER → SOUND",sound:"",kana:"",
      lead:"ABCを言えることと、英単語を読めることは別の力。まず、文字が単語の中で出す『音』に気づく。",
      discover:"M は文字の名前では『エム』。でも map の最初では /m/ の音になる。S も『エス』ではなく sun の最初で /s/ の音になる。",
      note:"英単語を読むときは、文字の『名前』ではなく、単語の中での『音』をつないでいく。",
      examples:[
        {word:"map",meaning:"地図",focus:"m",soundCue:"最初は /m/"},
        {word:"sun",meaning:"太陽",focus:"s",soundCue:"最初は /s/"},
        {word:"top",meaning:"上・頂上",focus:"t",soundCue:"最初は /t/"}
      ],
      probes:[
        {word:"man",meaning:"男性",answer:"sound",prompt:"Mを『エム』と読まず、最初の音を使えそう？"},
        {word:"sit",meaning:"座る",answer:"sound",prompt:"Sを『エス』と読まず、最初の音を使えそう？"}
      ]
    },
    {
      id:"short-a",order:1,code:"SOUND 01",title:"a が短い音になる形",short:"a /æ/",pattern:"CVC",sound:"/æ/",kana:"「ア」と「エ」の間に近い音",
      lead:"cat / map / bag を聞いて、真ん中の a の音を比べる。",
      discover:"a が子音にはさまれた短い形では、a は /æ/ になることが多い。ローマ字の『ア』そのままではない。",
      note:"まずは1音節の短い単語で、この形を見慣れる。ここでいう子音は a / e / i / o / u 以外の文字。",
      examples:[
        {word:"cat",meaning:"ねこ",focus:"a",soundCue:"/æ/"},
        {word:"map",meaning:"地図",focus:"a",soundCue:"/æ/"},
        {word:"bag",meaning:"かばん",focus:"a",soundCue:"/æ/"},
        {word:"hat",meaning:"帽子",focus:"a",soundCue:"/æ/"}
      ],
      probes:[
        {word:"man",meaning:"男性",answer:"short-a",prompt:"この a も同じ短い音になりそう？"},
        {word:"cap",meaning:"帽子・キャップ",answer:"short-a",prompt:"この a はどの仲間？"}
      ]
    },
    {
      id:"short-i",order:2,code:"SOUND 02",title:"i が短い音になる形",short:"i /ɪ/",pattern:"CVC",sound:"/ɪ/",kana:"短い『イ』に近い音",
      lead:"sit / big / six / fish を聞いて、i の音を比べる。",
      discover:"i が子音にはさまれた短い形では、i は /ɪ/ になることが多い。",
      note:"日本語の『イ』より短く、力を抜いた音。音声を基準にする。",
      examples:[{word:"sit",meaning:"座る",focus:"i",soundCue:"/ɪ/"},{word:"big",meaning:"大きい",focus:"i",soundCue:"/ɪ/"},{word:"six",meaning:"6",focus:"i",soundCue:"/ɪ/"},{word:"kid",meaning:"子ども",focus:"i",soundCue:"/ɪ/"}],
      probes:[{word:"milk",meaning:"牛乳",answer:"short-i",prompt:"この i も短い音の仲間？"},{word:"win",meaning:"勝つ",answer:"short-i",prompt:"i の音を予想してから聞こう。"}]
    },
    {
      id:"short-e",order:3,code:"SOUND 03",title:"e が短い音になる形",short:"e /ɛ/",pattern:"CVC",sound:"/ɛ/",kana:"短い『エ』に近い音",
      lead:"pen / bed / ten / red を聞いて、e の音を比べる。",
      discover:"e が子音にはさまれた短い形では、e は /ɛ/ になることが多い。",
      note:"ローマ字の e ではなく、英語の短い e の音としてまとまりで覚える。",
      examples:[{word:"pen",meaning:"ペン",focus:"e",soundCue:"/ɛ/"},{word:"bed",meaning:"ベッド",focus:"e",soundCue:"/ɛ/"},{word:"ten",meaning:"10",focus:"e",soundCue:"/ɛ/"},{word:"red",meaning:"赤い",focus:"e",soundCue:"/ɛ/"}],
      probes:[{word:"desk",meaning:"机",answer:"short-e",prompt:"この e はどの仲間？"},{word:"help",meaning:"助ける",answer:"short-e",prompt:"e の音を予想してから聞こう。"}]
    },
    {
      id:"short-o",order:4,code:"SOUND 04",title:"o が短い音になる形",short:"o /ɑ/",pattern:"CVC",sound:"/ɑ/",kana:"米語では口を開く短い音",
      lead:"hot / dog / box / stop を聞いて、o の音を比べる。",
      discover:"o が子音にはさまれた短い形では、米語では /ɑ/ に近い音になることが多い。",
      note:"地域差がある音なので、カタカナよりスピーカーの音を基準にする。",
      examples:[{word:"hot",meaning:"熱い",focus:"o",soundCue:"/ɑ/"},{word:"job",meaning:"仕事",focus:"o",soundCue:"/ɑ/"},{word:"box",meaning:"箱",focus:"o",soundCue:"/ɑ/"},{word:"stop",meaning:"止まる",focus:"o",soundCue:"/ɑ/"}],
      probes:[{word:"shop",meaning:"店・買い物する",answer:"short-o",prompt:"この o も短い音になりそう？"},{word:"not",meaning:"〜ではない",answer:"short-o",prompt:"o の音を予想しよう。"}]
    },
    {
      id:"short-u",order:5,code:"SOUND 05",title:"u が短い音になる形",short:"u /ʌ/",pattern:"CVC",sound:"/ʌ/",kana:"力を抜いた短い『ア』に近い音",
      lead:"sun / bus / cup / run を聞いて、u の音を比べる。",
      discover:"u が子音にはさまれた短い形では、u は /ʌ/ になることが多い。",
      note:"日本語の『ウ』ではなく、短い中央寄りの音。",
      examples:[{word:"sun",meaning:"太陽",focus:"u",soundCue:"/ʌ/"},{word:"bus",meaning:"バス",focus:"u",soundCue:"/ʌ/"},{word:"cup",meaning:"カップ",focus:"u",soundCue:"/ʌ/"},{word:"run",meaning:"走る",focus:"u",soundCue:"/ʌ/"}],
      probes:[{word:"fun",meaning:"楽しい・楽しみ",answer:"short-u",prompt:"この u はどの仲間？"},{word:"cut",meaning:"切る",answer:"short-u",prompt:"u の音を予想しよう。"}]
    },
    {
      id:"a-e",order:6,code:"SOUND 06",title:"game / take の a はなぜ『エイ』？",short:"a_e /eɪ/",pattern:"a + 子音 + e",sound:"/eɪ/",kana:"「エイ」に近い音",
      lead:"game / take / name / cake。離れている a と e に共通する形を探す。",
      discover:"a + 子音 + e の形では、最後の e は強く読まず、前の a が /eɪ/ になることが多い。",
      note:"『a はいつもエイ』ではなく、a_e という“並び方”が手がかり。",
      examples:[
        {word:"game",meaning:"ゲーム・試合",focus:"a_e",soundCue:"/eɪ/"},
        {word:"take",meaning:"取る・連れて行く",focus:"a_e",soundCue:"/eɪ/"},
        {word:"name",meaning:"名前",focus:"a_e",soundCue:"/eɪ/"},
        {word:"cake",meaning:"ケーキ",focus:"a_e",soundCue:"/eɪ/"}
      ],
      contrast:[{left:"cap",right:"cape",caption:"e が加わると、a の音が変わる"},{left:"mad",right:"made",caption:"同じ a でも形で音が変わる"}],
      probes:[
        {word:"late",meaning:"遅い・遅れて",answer:"a-e",prompt:"初めて見ても a_e を手がかりにできる？"},
        {word:"gate",meaning:"門・ゲート",answer:"a-e",prompt:"この a はどの音になりそう？"},
        {word:"plane",meaning:"飛行機",answer:"a-e",prompt:"a と最後の e に注目。"}
      ]
    },
    {
      id:"i-e",order:7,code:"SOUND 07",title:"time / bike の i は『アイ』",short:"i_e /aɪ/",pattern:"i + 子音 + e",sound:"/aɪ/",kana:"「アイ」に近い音",
      lead:"time / bike / five / like。i と最後の e の組み合わせを見る。",
      discover:"i + 子音 + e の形では、i は /aɪ/ になることが多い。",
      note:"a_e と同じ“最後の e が前の母音を変える”仲間。",
      examples:[
        {word:"time",meaning:"時間",focus:"i_e",soundCue:"/aɪ/"},
        {word:"bike",meaning:"自転車",focus:"i_e",soundCue:"/aɪ/"},
        {word:"five",meaning:"5",focus:"i_e",soundCue:"/aɪ/"},
        {word:"like",meaning:"好き・好む",focus:"i_e",soundCue:"/aɪ/"}
      ],
      contrast:[{left:"kit",right:"kite",caption:"最後の e で i の音が変わる"}],
      probes:[
        {word:"kite",meaning:"たこ（凧）",answer:"i-e",prompt:"i_e を見つけられる？"},
        {word:"nine",meaning:"9",answer:"i-e",prompt:"この i はどの音？"}
      ]
    },
    {
      id:"o-e",order:8,code:"SOUND 08",title:"home / note の o は『オウ』",short:"o_e /oʊ/",pattern:"o + 子音 + e",sound:"/oʊ/",kana:"「オウ」に近い音",
      lead:"home / note / hope / rose。o と最後の e を見る。",
      discover:"o + 子音 + e の形では、o は /oʊ/ になることが多い。",
      note:"silent e の仲間をまとめて見ると、知らない単語でも予想しやすい。",
      examples:[
        {word:"home",meaning:"家・家庭",focus:"o_e",soundCue:"/oʊ/"},
        {word:"note",meaning:"メモ・ノート",focus:"o_e",soundCue:"/oʊ/"},
        {word:"hope",meaning:"望む・希望",focus:"o_e",soundCue:"/oʊ/"},
        {word:"rose",meaning:"バラ",focus:"o_e",soundCue:"/oʊ/"}
      ],
      contrast:[{left:"hop",right:"hope",caption:"e が加わると o の音が変わる"}],
      probes:[
        {word:"rope",meaning:"ロープ・なわ",answer:"o-e",prompt:"o_e の形を使って読めそう？"},
        {word:"stone",meaning:"石",answer:"o-e",prompt:"この o はどの音？"}
      ]
    },
    {
      id:"ee",order:9,code:"SOUND 09",title:"ee が並ぶと『イー』",short:"ee /iː/",pattern:"ee",sound:"/iː/",kana:"「イー」に近い長い音",
      lead:"see / green / meet / week。2つの e が並んだ部分を聞き比べる。",
      discover:"ee は /iː/ という長い『イー』の音になることが多い。",
      note:"2文字で1つの母音のように働く“vowel team”の代表。",
      examples:[
        {word:"see",meaning:"見る",focus:"ee",soundCue:"/iː/"},
        {word:"green",meaning:"緑の",focus:"ee",soundCue:"/iː/"},
        {word:"meet",meaning:"会う",focus:"ee",soundCue:"/iː/"},
        {word:"week",meaning:"週",focus:"ee",soundCue:"/iː/"}
      ],
      probes:[
        {word:"keep",meaning:"保つ・持ち続ける",answer:"ee",prompt:"ee を1つの音のまとまりとして見られる？"},
        {word:"need",meaning:"必要とする",answer:"ee",prompt:"この ee はどの音？"}
      ]
    },
    {
      id:"ea",order:10,code:"SOUND 10",title:"ea も『イー』になることが多い",short:"ea /iː/",pattern:"ea",sound:"/iː/",kana:"「イー」に近い長い音",
      lead:"team / read / clean / speak。ea の共通した音を探す。",
      discover:"ea も /iː/ になることが多い。ee と違うつづりでも、同じ音になることがある。",
      note:"英語は『1つの音＝1つのつづり』ではない。だから、つづりのパターンを増やしていく。",
      examples:[
        {word:"team",meaning:"チーム",focus:"ea",soundCue:"/iː/"},
        {word:"eat",meaning:"食べる",focus:"ea",soundCue:"/iː/"},
        {word:"clean",meaning:"きれいな・掃除する",focus:"ea",soundCue:"/iː/"},
        {word:"speak",meaning:"話す",focus:"ea",soundCue:"/iː/"}
      ],
      probes:[
        {word:"dream",meaning:"夢・夢を見る",answer:"ea",prompt:"ea を見て音を予想できる？"},
        {word:"teacher",meaning:"先生",answer:"ea",prompt:"長い単語の中でも ea を見つけられる？"}
      ]
    },
    {
      id:"ai-ay",order:11,code:"SOUND 11",title:"ai / ay も『エイ』の仲間",short:"ai / ay /eɪ/",pattern:"ai / ay",sound:"/eɪ/",kana:"「エイ」に近い音",
      lead:"rain / train / day / play。a_e 以外にも /eɪ/ を作るつづりがある。",
      discover:"ai と ay は /eɪ/ になることが多い。ai は語の中、ay は語末に出やすい。",
      note:"同じ音でも、単語の場所によって別のつづりが使われることがある。",
      examples:[
        {word:"rain",meaning:"雨",focus:"ai",soundCue:"/eɪ/"},
        {word:"train",meaning:"電車・列車",focus:"ai",soundCue:"/eɪ/"},
        {word:"day",meaning:"日・1日",focus:"ay",soundCue:"/eɪ/"},
        {word:"play",meaning:"遊ぶ・する",focus:"ay",soundCue:"/eɪ/"}
      ],
      probes:[
        {word:"mail",meaning:"郵便・メール",answer:"ai-ay",prompt:"ai を音のまとまりとして見られる？"},
        {word:"stay",meaning:"滞在する",answer:"ai-ay",prompt:"語末の ay に注目。"}
      ]
    },
    {
      id:"oa",order:12,code:"SOUND 12",title:"oa が並ぶと『オウ』",short:"oa /oʊ/",pattern:"oa",sound:"/oʊ/",kana:"「オウ」に近い音",
      lead:"boat / road / coat / soap。2つの母音を1つのまとまりで聞く。",
      discover:"oa は /oʊ/ になることが多い。o_e と違うつづりでも、同じ音になることがある。",
      note:"同じ音に複数のつづりがあることも、英単語を覚える手がかりになる。",
      examples:[{word:"boat",meaning:"ボート・船",focus:"oa",soundCue:"/oʊ/"},{word:"road",meaning:"道",focus:"oa",soundCue:"/oʊ/"},{word:"coat",meaning:"コート",focus:"oa",soundCue:"/oʊ/"},{word:"soap",meaning:"せっけん",focus:"oa",soundCue:"/oʊ/"}],
      probes:[{word:"goat",meaning:"ヤギ",answer:"oa",prompt:"oa を1つの音のまとまりとして見られる？"},{word:"toast",meaning:"トースト",answer:"oa",prompt:"長めの単語でも oa を探そう。"}]
    },
    {
      id:"sh-ch",order:13,code:"SOUND 13",title:"子音も2文字で1つの音になる",short:"sh / ch",pattern:"sh / ch",sound:"",kana:"2文字を1まとまりで読む",
      lead:"ship / shop と chair / lunch。s+h、c+h をバラバラに読まない。",
      discover:"sh や ch は、2文字を1つの音のまとまりとして読むことが多い。",
      note:"母音だけでなく、子音にも“2文字セット”がある。",
      examples:[
        {word:"ship",meaning:"船",focus:"sh",soundCue:"/ʃ/"},
        {word:"shop",meaning:"店・買い物する",focus:"sh",soundCue:"/ʃ/"},
        {word:"chair",meaning:"いす",focus:"ch",soundCue:"/tʃ/"},
        {word:"lunch",meaning:"昼食",focus:"ch",soundCue:"/tʃ/"}
      ],
      probes:[
        {word:"fish",meaning:"魚",answer:"sh-ch",prompt:"最後の sh を1まとまりで見られる？"},
        {word:"much",meaning:"たくさん・とても",answer:"sh-ch",prompt:"最後の ch に注目。"}
      ]
    },
    {
      id:"exceptions",order:14,code:"SOUND 14",title:"ルールは『絶対』ではなく『手がかり』",short:"例外を知る",pattern:"EXCEPTIONS",sound:"",kana:"例外もパターンとして覚える",
      lead:"ここまでの規則で予想しにくい単語をあえて見る。",
      discover:"英語のつづりには例外や別の読み方がある。だから『規則を使って予想 → 音で確かめる』が大切。",
      note:"bread の ea は /ɛ/、great の ea は /eɪ/。have / give は最後に e があっても前の母音が長くならない。",
      examples:[
        {word:"bread",meaning:"パン",focus:"ea",soundCue:"ea だが /ɛ/"},
        {word:"great",meaning:"すばらしい・大きな",focus:"ea",soundCue:"ea だが /eɪ/"},
        {word:"have",meaning:"持っている",focus:"a_e",soundCue:"a_e の例外"},
        {word:"give",meaning:"与える",focus:"i_e",soundCue:"i_e の例外"}
      ],
      probes:[
        {word:"head",meaning:"頭",answer:"exception",prompt:"ea でも /iː/ とは限らない。音を確かめよう。"},
        {word:"live",meaning:"住む・生きる",answer:"exception",prompt:"i_e の見た目でも例外がある。"}
      ]
    }
  ];

  const practiceWords=[];
  stages.slice(1).forEach(stage=>{
    stage.examples.forEach(w=>practiceWords.push({...w,stageId:stage.id}));
    stage.probes.forEach(w=>practiceWords.push({...w,stageId:stage.id}));
  });

  const soundChoices=[
    {id:"short-a",label:"/æ/",sub:"短い a"},
    {id:"short-i",label:"/ɪ/",sub:"短い i"},
    {id:"short-e",label:"/ɛ/",sub:"短い e"},
    {id:"short-o",label:"/ɑ/",sub:"短い o（米語）"},
    {id:"short-u",label:"/ʌ/",sub:"短い u"},
    {id:"long-a",label:"/eɪ/",sub:"a_e / ai / ay"},
    {id:"long-i",label:"/aɪ/",sub:"i_e"},
    {id:"long-o",label:"/oʊ/",sub:"o_e / oa"},
    {id:"long-e",label:"/iː/",sub:"ee / ea"},
    {id:"sh",label:"/ʃ/",sub:"sh"},
    {id:"ch",label:"/tʃ/",sub:"ch"},
    {id:"other",label:"ほか",sub:"別の読み方"}
  ];

  function familyFor(stageId){
    if(["short-a","short-i","short-e","short-o","short-u"].includes(stageId)) return stageId;
    if(["a-e","ai-ay"].includes(stageId)) return "long-a";
    if(stageId==="i-e") return "long-i";
    if(["o-e","oa"].includes(stageId)) return "long-o";
    if(["ee","ea"].includes(stageId)) return "long-e";
    return "other";
  }
  function familyForWord(item){
    if(!item)return "other";
    if(item.stageId==="sh-ch"){const f=String(item.focus||"").toLowerCase();if(f==="sh"||String(item.word).toLowerCase().includes("sh"))return "sh";if(f==="ch"||String(item.word).toLowerCase().includes("ch"))return "ch";}
    if(item.stageId==="exceptions"){const w=String(item.word).toLowerCase();if(["bread","head"].includes(w))return "short-e";if(w==="great")return "long-a";if(w==="have")return "short-a";if(["give","live"].includes(w))return "short-i";}
    return familyFor(item.stageId);
  }

  window.ED_PHONICS_BANK={version:"0.2.0",stages,practiceWords,soundChoices,familyFor,familyForWord};
})();
