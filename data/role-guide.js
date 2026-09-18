(function(){
  window.ED_ROLE_GUIDE={
    summary:[
      {role:"S",name:"主語",formula:"名詞の仲間",question:"だれが・なにが"},
      {role:"V",name:"動詞",formula:"動詞の仲間",question:"どうする・どんな状態"},
      {role:"O",name:"目的語",formula:"名詞の仲間",question:"だれを・なにを"},
      {role:"C",name:"補語",formula:"名詞・形容詞の仲間",question:"正体・状態を説明"},
      {role:"M",name:"修飾語",formula:"副詞・前置詞句など",question:"いつ・どこで・どのように"}
    ],
    roles:{
      S:{
        name:"主語",english:"Subject",question:"だれが・なにが",headline:"Sには「名詞の仲間」が入る",description:"Sは、その文で中心になる人・もの・こと。1語の名詞だけでなく、名詞と同じ働きをするまとまりもSになれます。",tip:"まずは「だれが・なにが？」を探す。SはVの前にあることが多いけれど、語順だけで決めない。",
        patterns:[
          {label:"代名詞",level:"基本",examples:["I","you","he","she","we","they"],sentence:"She runs.",focus:"She",note:"I や she は、名詞の代わりをする代名詞。"},
          {label:"人名・名詞",level:"基本",examples:["Ken","Yuki","students"],sentence:"Ken swims.",focus:"Ken",note:"人名や、人・ものを表す名詞もSになれる。"},
          {label:"名詞のまとまり",level:"基本",examples:["my brother","the new student"],sentence:"My brother studies.",focus:"My brother",note:"2語以上でも、まとまり全体で「だれが」ならS。"},
          {label:"動名詞（〜ing）",level:"あとで増える",examples:["playing soccer","reading books"],sentence:"Playing soccer is fun.",focus:"Playing soccer",note:"動詞＋ingのまとまりが「〜すること」という名詞の働きをする。"},
          {label:"to不定詞",level:"あとで増える",examples:["to study English"],sentence:"To study English is important.",focus:"To study English",note:"to＋動詞も「〜すること」としてSになることがある。"}
        ]
      },
      V:{
        name:"動詞",english:"Verb",question:"どうする・どんな状態",headline:"Vには「動詞」が入る",description:"Vは文の動き・状態の中心。1語だけでなく、助動詞や進行形が加わって「動詞のまとまり」になることがあります。",tip:"文型を考えるときは、can play や is playing のような形を、Vのまとまりとして見ると整理しやすい。",
        patterns:[
          {label:"be動詞",level:"基本",examples:["am","is","are"],sentence:"She is happy.",focus:"is",note:"「〜です・〜の状態です」をつなぐ動詞。過去では was / were も出てくる。"},
          {label:"一般動詞",level:"基本",examples:["run","play","like","study"],sentence:"I like music.",focus:"like",note:"動作や気持ちなどを表す。主語や時制で形が変わる。"},
          {label:"助動詞＋動詞",level:"あとで増える",examples:["can play","will go","must study"],sentence:"He can play tennis.",focus:"can play",note:"can / will / must などが前につき、後ろの動詞は原形になる。"},
          {label:"進行形",level:"あとで増える",examples:["is playing","was studying"],sentence:"She is playing tennis.",focus:"is playing",note:"be動詞＋〜ingで「〜している・していた」を表す。"}
        ]
      },
      O:{
        name:"目的語",english:"Object",question:"だれを・なにを",headline:"Oにも「名詞の仲間」が入る",description:"OはVの動作が向かう相手。Sと同じく名詞系が入りやすいけれど、文の中でしている仕事が違います。",tip:"Cと迷ったら「前の人・もの＝Oか？」を考える。I like music. なら I ≠ music なので、music はCではなくO。",
        patterns:[
          {label:"名詞",level:"基本",examples:["music","soccer","books"],sentence:"I like music.",focus:"music",note:"「何を？」の答えになる名詞。"},
          {label:"代名詞（目的格）",level:"基本",examples:["me","you","him","her","us","them"],sentence:"She knows him.",focus:"him",note:"I → me、he → him のように、Oの場所では形が変わるものがある。"},
          {label:"名詞のまとまり",level:"基本",examples:["this book","my homework","a new pen"],sentence:"I have this book.",focus:"this book",note:"まとまり全体で「何を？」ならO。"},
          {label:"動名詞（〜ing）",level:"あとで増える",examples:["playing soccer","reading books"],sentence:"I like playing soccer.",focus:"playing soccer",note:"「〜すること」という名詞の働きでOになる。"},
          {label:"to不定詞",level:"あとで増える",examples:["to play tennis","to study English"],sentence:"I want to play tennis.",focus:"to play tennis",note:"to＋動詞のまとまりがOになる動詞もある。"},
          {label:"that＋文",level:"あとで増える",examples:["that he is kind"],sentence:"I think that he is kind.",focus:"that he is kind",note:"文のまとまり全体が「〜ということ」としてOになることもある。"}
        ]
      },
      C:{
        name:"補語",english:"Complement",question:"正体・状態を説明",headline:"Cには「名詞」や「形容詞」が入る",description:"Cは、SやOが「何なのか」「どんな状態なのか」を説明する部分。Oとは違い、S＝C または O＝C に近い関係になります。",tip:"SVCなら「S＝C」、SVOCなら「O＝C」になるかを確かめる。これがCを見つける強い手がかり。",
        patterns:[
          {label:"形容詞",level:"基本",examples:["happy","kind","busy","tired"],sentence:"She is happy.",focus:"happy",note:"Sがどんな状態かを説明する。She ＝ happyな状態。"},
          {label:"名詞",level:"基本",examples:["a student","a teacher","Ken"],sentence:"He is a student.",focus:"a student",note:"Sが何者なのかを説明する。He ＝ a student。"},
          {label:"名詞のまとまり",level:"基本",examples:["my best friend"],sentence:"Ken is my best friend.",focus:"my best friend",note:"複数語でも、Sの正体を説明するまとまりならC。"},
          {label:"Oを説明するC",level:"基本",examples:["Ken","happy"],sentence:"We call him Ken.",focus:"Ken",note:"SVOCではCがOを説明する。him ＝ Ken。"},
          {label:"to不定詞",level:"あとで増える",examples:["to be a doctor"],sentence:"My dream is to be a doctor.",focus:"to be a doctor",note:"to＋動詞のまとまりが、Sの内容を説明するCになることもある。"}
        ]
      },
      M:{
        name:"修飾語",english:"Modifier",question:"いつ・どこで・どのように",headline:"Mには「情報を足すことば・まとまり」が入る",description:"Mは、S・V・O・Cでできた骨組みに、時間・場所・様子・頻度などの情報を足す部分です。文型の5つの型には数えません。",tip:"Mか迷ったら、その部分をいったん外してみる。S・V・O・Cの骨組みが残るなら、Mの可能性が高い。Mは文末だけでなく、文頭やVの近くにも置かれます。",
        patterns:[
          {label:"副詞",level:"基本",examples:["today","usually","sometimes"],sentence:"She is happy today.",focus:"today",note:"時間・頻度・様子などを1語で足す。"},
          {label:"前置詞＋名詞のまとまり",level:"基本",examples:["in the park","after school","on Sunday"],sentence:"I play soccer in the park.",focus:"in the park",note:"場所や時間を表すまとまり全体がMになる。"},
          {label:"文頭に来るM",level:"基本",examples:["On Sunday","Sometimes"],sentence:"On Sunday, I play tennis.",focus:"On Sunday",note:"Mは文末だけではなく文頭にも置ける。"},
          {label:"Vの近くに来るM",level:"基本",examples:["usually","often"],sentence:"I usually walk to school.",focus:"usually",note:"頻度を表す副詞は一般動詞の前など、文の途中に来ることもある。"},
          {label:"to不定詞の副詞的用法",level:"あとで増える",examples:["to study English"],sentence:"I went to the library to study English.",focus:"to study English",note:"「〜するために」のように目的を足すまとまりもMとして働く。"},
          {label:"節のまとまり",level:"あとで増える",examples:["when I got home","because it was raining"],sentence:"I studied when I got home.",focus:"when I got home",note:"文のようなまとまり全体が時間・理由などを足すこともある。"}
        ]
      }
    },
    comparison:{
      title:"同じ「名詞」でも、文の中の仕事は変わる",
      intro:"teacher は3つとも名詞。でも置かれた文によってS・O・Cの役割が変わります。",
      rows:[
        {sentence:"The teacher came.",focus:"The teacher",role:"S",reason:"「だれが来た？」の答え"},
        {sentence:"I saw the teacher.",focus:"the teacher",role:"O",reason:"「だれを見た？」の答え"},
        {sentence:"He is a teacher.",focus:"a teacher",role:"C",reason:"He ＝ a teacher と説明"}
      ],
      conclusion:"品詞は「材料の種類」。S・V・O・C・Mは「文の中での仕事」。この2つを分けると英文が整理しやすくなります。"
    }
  };
})();
