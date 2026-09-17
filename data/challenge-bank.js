(function(){
  const structure=[
    {
      id:"s1",level:"高校語彙",type:"structure",
      sentence:"The rapid expansion of digital technology has transformed modern communication.",
      translation:"デジタル技術の急速な拡大は、現代のコミュニケーションを変化させてきた。",
      pattern:"SVO",
      parts:[
        {text:"The rapid expansion of digital technology",role:"S",ja:"デジタル技術の急速な拡大",pos:"名詞のまとまり"},
        {text:"has transformed",role:"V",ja:"変化させてきた",pos:"動詞のまとまり（現在完了）"},
        {text:"modern communication",role:"O",ja:"現代のコミュニケーション",pos:"名詞のまとまり"}
      ],
      vocab:[
        {en:"rapid",ja:"急速な",pos:"形容詞"},{en:"expansion",ja:"拡大",pos:"名詞"},{en:"digital technology",ja:"デジタル技術",pos:"名詞のまとまり"},{en:"transform",ja:"変化させる",pos:"動詞"},{en:"communication",ja:"コミュニケーション・意思伝達",pos:"名詞"}
      ],
      insight:"Sが長くても、中心のVを見つけると骨組みは S→V→O。知らない語が増えても、文型の見方は変わりません。"
    },
    {
      id:"s2",level:"高校語彙",type:"structure",
      sentence:"The results remain remarkably consistent across different conditions.",
      translation:"その結果は、異なる条件でも驚くほど一貫している。",
      pattern:"SVC + M",
      parts:[
        {text:"The results",role:"S",ja:"その結果は",pos:"名詞のまとまり"},
        {text:"remain",role:"V",ja:"～のままである",pos:"一般動詞"},
        {text:"remarkably consistent",role:"C",ja:"驚くほど一貫した状態",pos:"形容詞のまとまり"},
        {text:"across different conditions",role:"M",ja:"異なる条件にわたって",pos:"前置詞＋名詞のまとまり"}
      ],
      vocab:[
        {en:"result",ja:"結果",pos:"名詞"},{en:"remain",ja:"～のままである",pos:"動詞"},{en:"remarkably",ja:"著しく・驚くほど",pos:"副詞"},{en:"consistent",ja:"一貫した",pos:"形容詞"},{en:"condition",ja:"条件",pos:"名詞"}
      ],
      insight:"remain の後ろはSの状態を説明しているのでC。最後の場所・範囲の情報はMとして外せます。"
    },
    {
      id:"s3",level:"高校～大学語彙",type:"structure",
      sentence:"Researchers often consider this method highly reliable.",
      translation:"研究者たちは、この方法を非常に信頼できるものだと考えることが多い。",
      pattern:"SVOC + M",
      parts:[
        {text:"Researchers",role:"S",ja:"研究者たちは",pos:"名詞"},
        {text:"often",role:"M",ja:"しばしば",pos:"副詞"},
        {text:"consider",role:"V",ja:"～だと考える",pos:"一般動詞"},
        {text:"this method",role:"O",ja:"この方法を",pos:"名詞のまとまり"},
        {text:"highly reliable",role:"C",ja:"非常に信頼できるものと",pos:"形容詞のまとまり"}
      ],
      vocab:[
        {en:"researcher",ja:"研究者",pos:"名詞"},{en:"consider",ja:"～だと考える",pos:"動詞"},{en:"method",ja:"方法",pos:"名詞"},{en:"highly",ja:"非常に",pos:"副詞"},{en:"reliable",ja:"信頼できる",pos:"形容詞"}
      ],
      insight:"this method ＝ highly reliable という O＝C の関係が見えればSVOC。oftenはVに情報を足すMです。"
    },
    {
      id:"s4",level:"大学レベルの長さ",type:"structure",
      sentence:"Students who regularly analyze unfamiliar sentences often develop a more flexible understanding of grammar.",
      translation:"見慣れない文を日頃から分析する学生は、文法についてより柔軟な理解を身につけることが多い。",
      pattern:"SVO + M",
      parts:[
        {text:"Students who regularly analyze unfamiliar sentences",role:"S",ja:"見慣れない文を日頃から分析する学生は",pos:"名詞のまとまり（関係代名詞を含む）"},
        {text:"often",role:"M",ja:"しばしば",pos:"副詞"},
        {text:"develop",role:"V",ja:"身につける・発達させる",pos:"一般動詞"},
        {text:"a more flexible understanding of grammar",role:"O",ja:"文法についてのより柔軟な理解を",pos:"名詞のまとまり"}
      ],
      vocab:[
        {en:"analyze",ja:"分析する",pos:"動詞"},{en:"unfamiliar",ja:"見慣れない",pos:"形容詞"},{en:"develop",ja:"身につける・発達させる",pos:"動詞"},{en:"flexible",ja:"柔軟な",pos:"形容詞"},{en:"understanding",ja:"理解",pos:"名詞"},{en:"grammar",ja:"文法",pos:"名詞"}
      ],
      insight:"Sの中に習っていない文法が入っても、S全体をひとかたまりにすると主文は S→V→O と見抜けます。"
    },
    {
      id:"s5",level:"大学レベルの構造",type:"structure",
      sentence:"What the experiment revealed surprised the research team.",
      translation:"その実験が明らかにしたことは、研究チームを驚かせた。",
      pattern:"SVO",
      parts:[
        {text:"What the experiment revealed",role:"S",ja:"その実験が明らかにしたことは",pos:"名詞の働きをする節"},
        {text:"surprised",role:"V",ja:"驚かせた",pos:"一般動詞（過去形）"},
        {text:"the research team",role:"O",ja:"研究チームを",pos:"名詞のまとまり"}
      ],
      vocab:[
        {en:"experiment",ja:"実験",pos:"名詞"},{en:"reveal",ja:"明らかにする",pos:"動詞"},{en:"surprise",ja:"驚かせる",pos:"動詞"},{en:"research team",ja:"研究チーム",pos:"名詞のまとまり"}
      ],
      insight:"Sは1語とは限りません。『～したこと』という文のようなかたまり全体がSになっても、主文はSVOです。"
    },
    {
      id:"s6",level:"大学レベルの構造",type:"structure",
      sentence:"Although the theory appears complicated, its central idea remains simple.",
      translation:"その理論は複雑に見えるが、中心となる考えは単純なままである。",
      pattern:"M + SVC",
      parts:[
        {text:"Although the theory appears complicated",role:"M",ja:"その理論は複雑に見えるけれど",pos:"副詞の働きをする節"},
        {text:"its central idea",role:"S",ja:"その中心となる考えは",pos:"名詞のまとまり"},
        {text:"remains",role:"V",ja:"～のままである",pos:"一般動詞"},
        {text:"simple",role:"C",ja:"単純な状態",pos:"形容詞"}
      ],
      vocab:[
        {en:"although",ja:"～だけれども",pos:"接続詞"},{en:"theory",ja:"理論",pos:"名詞"},{en:"appear",ja:"～のように見える",pos:"動詞"},{en:"complicated",ja:"複雑な",pos:"形容詞"},{en:"central",ja:"中心的な",pos:"形容詞"},{en:"remain",ja:"～のままである",pos:"動詞"}
      ],
      insight:"文頭の長い部分をMとしていったん外すと、its central idea / remains / simple のSVCが見えてきます。"
    }
  ];

  const gap=[
    {
      id:"g1",level:"高校入試～高校",type:"gap",
      sentenceBefore:"The new evidence made the conclusion ",sentenceAfter:".",
      translation:"新しい証拠は、その結論を明確なものにした。",
      options:["clear","clearly","clarity","clarify"],answer:"clear",
      vocab:[{en:"evidence",ja:"証拠",pos:"名詞"},{en:"conclusion",ja:"結論",pos:"名詞"},{en:"clear",ja:"明確な",pos:"形容詞"},{en:"clarity",ja:"明確さ",pos:"名詞"},{en:"clarify",ja:"明確にする",pos:"動詞"}],
      insight:"made / the conclusion / □ は O＝C の形。Cで『結論がどんな状態か』を言うので形容詞 clear が入ります。",
      pattern:"SVOC"
    },
    {
      id:"g2",level:"高校入試～高校",type:"gap",
      sentenceBefore:"The new policy had a significant ",sentenceAfter:" on student behavior.",
      translation:"新しい方針は、生徒の行動に大きな影響を与えた。",
      options:["effect","effective","effectively","affect"],answer:"effect",
      vocab:[{en:"policy",ja:"方針・政策",pos:"名詞"},{en:"significant",ja:"大きな・重要な",pos:"形容詞"},{en:"effect",ja:"影響",pos:"名詞"},{en:"effective",ja:"効果的な",pos:"形容詞"},{en:"affect",ja:"影響を与える",pos:"動詞"},{en:"behavior",ja:"行動",pos:"名詞"}],
      insight:"had の後ろはOになる名詞のまとまり。a significant の後ろには名詞 effect が必要です。",
      pattern:"SVO"
    },
    {
      id:"g3",level:"高校",type:"gap",
      sentenceBefore:"The results remained surprisingly ",sentenceAfter:" throughout the study.",
      translation:"研究の間、その結果は驚くほど一貫したままだった。",
      options:["consistent","consistently","consistency","consist"],answer:"consistent",
      vocab:[{en:"remain",ja:"～のままである",pos:"動詞"},{en:"surprisingly",ja:"驚くほど",pos:"副詞"},{en:"consistent",ja:"一貫した",pos:"形容詞"},{en:"consistency",ja:"一貫性",pos:"名詞"},{en:"throughout",ja:"～の間ずっと",pos:"前置詞"}],
      insight:"results ＝ □ の関係になるSVC。Sの状態を説明するCなので形容詞 consistent が合います。",
      pattern:"SVC + M"
    },
    {
      id:"g4",level:"高校",type:"gap",
      sentenceBefore:"The research team conducted a detailed ",sentenceAfter:" of the data.",
      translation:"研究チームはデータの詳細な分析を行った。",
      options:["analysis","analyze","analytical","analytically"],answer:"analysis",
      vocab:[{en:"conduct",ja:"実施する",pos:"動詞"},{en:"detailed",ja:"詳細な",pos:"形容詞"},{en:"analysis",ja:"分析",pos:"名詞"},{en:"analyze",ja:"分析する",pos:"動詞"},{en:"analytical",ja:"分析的な",pos:"形容詞"}],
      insight:"conducted の相手になるOは『a detailed □ of the data』全体。冠詞a＋形容詞detailedの後ろなので名詞 analysis が入ります。",
      pattern:"SVO"
    },
    {
      id:"g5",level:"高校",type:"gap",
      sentenceBefore:"Many teachers consider regular feedback extremely ",sentenceAfter:" for learning.",
      translation:"多くの教師は、定期的なフィードバックを学習に非常に重要だと考える。",
      options:["significant","significance","significantly","signify"],answer:"significant",
      vocab:[{en:"consider",ja:"～だと考える",pos:"動詞"},{en:"regular feedback",ja:"定期的なフィードバック",pos:"名詞のまとまり"},{en:"extremely",ja:"非常に",pos:"副詞"},{en:"significant",ja:"重要な・大きな意味をもつ",pos:"形容詞"},{en:"significance",ja:"重要性・意義",pos:"名詞"},{en:"signify",ja:"意味する・示す",pos:"動詞"}],
      insight:"regular feedback ＝ extremely □ という O＝C。CでOの状態を説明するため形容詞 significant が入ります。",
      pattern:"SVOC + M"
    }
  ];

  const order=[
    {
      id:"o1",level:"高校",type:"order",
      translation:"多くの生徒は、難しい試験でこの方法が役に立つと感じる。",
      answer:["Many students","find","this strategy","useful","in difficult exams."],
      vocab:[{en:"strategy",ja:"方法・戦略",pos:"名詞"},{en:"useful",ja:"役に立つ",pos:"形容詞"},{en:"difficult",ja:"難しい",pos:"形容詞"}],
      insight:"Many students=S、find=V、this strategy=O、useful=C、最後はM。O＝Cを意識すると並びが決まります。",
      pattern:"SVOC + M"
    },
    {
      id:"o2",level:"高校",type:"order",
      translation:"最近の研究は、定期的な練習が正確さを高めることを示している。",
      answer:["Recent studies","have shown","that regular practice improves accuracy."],
      vocab:[{en:"recent",ja:"最近の",pos:"形容詞"},{en:"study",ja:"研究",pos:"名詞"},{en:"show",ja:"示す",pos:"動詞"},{en:"regular practice",ja:"定期的な練習",pos:"名詞のまとまり"},{en:"accuracy",ja:"正確さ",pos:"名詞"}],
      insight:"主文は Recent studies=S / have shown=V / that～=O。Oが『文の形をした大きな名詞』になっています。",
      pattern:"SVO"
    },
    {
      id:"o3",level:"高校",type:"order",
      translation:"課題は難しそうだったが、生徒たちはそれを効率よく解決した。",
      answer:["Although the task looked difficult,","the students","solved","it","efficiently."],
      vocab:[{en:"although",ja:"～だけれども",pos:"接続詞"},{en:"task",ja:"課題",pos:"名詞"},{en:"solve",ja:"解決する",pos:"動詞"},{en:"efficiently",ja:"効率よく",pos:"副詞"}],
      insight:"Although～はMとして前に置き、その後の主文を S→V→O→M と組み立てると順番が決まります。",
      pattern:"M + SVO + M"
    },
    {
      id:"o4",level:"高校～大学",type:"order",
      translation:"急速な社会の変化は、若者が将来を考える方法に影響を与えている。",
      answer:["Rapid social change","has influenced","the way","young people think about their future."],
      vocab:[{en:"rapid",ja:"急速な",pos:"形容詞"},{en:"social change",ja:"社会の変化",pos:"名詞のまとまり"},{en:"influence",ja:"影響を与える",pos:"動詞"},{en:"the way",ja:"方法・あり方",pos:"名詞のまとまり"},{en:"future",ja:"将来",pos:"名詞"}],
      insight:"まず Rapid social change=S / has influenced=V / the way～=O と大きく分けると、長いOでも並びを作れます。",
      pattern:"SVO"
    },
    {
      id:"o5",level:"大学レベルの長さ",type:"order",
      translation:"注意深く集められたデータは、より正確な結論をしばしば支える。",
      answer:["Carefully collected data","often","supports","more accurate conclusions."],
      vocab:[{en:"carefully",ja:"注意深く",pos:"副詞"},{en:"collected",ja:"集められた",pos:"過去分詞"},{en:"support",ja:"支える・裏づける",pos:"動詞"},{en:"accurate",ja:"正確な",pos:"形容詞"},{en:"conclusion",ja:"結論",pos:"名詞"}],
      insight:"最初の長い名詞のまとまりをSとして押さえ、often=Mを外すと S→V→O の順が見えてきます。",
      pattern:"SVO + M"
    }
  ];

  function shuffled(arr,rng=Math.random){
    const copy=[...arr];
    for(let i=copy.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}
    return copy;
  }
  function buildSession(rng=Math.random){
    const s=shuffled(structure,rng),g=shuffled(gap,rng),o=shuffled(order,rng);
    const sequence=[s[0],g[0],o[0],s[1],rng()<.5?g[1]:o[1]];
    return sequence;
  }

  window.ED_CHALLENGE_BANK={meta:{version:"0.2.0",note:"難しい語彙を知っているかではなく、中学で学ぶ文の骨組みを応用するための編集済み例題。"},structure,gap,order,buildSession,shuffled};
})();
