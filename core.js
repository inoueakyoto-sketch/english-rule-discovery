(function(){
  const B=window.ED_WORD_BANK;
  if(!B) throw new Error("ED_WORD_BANK is required");

  const STAGES=[
    {key:"SV",label:"SV",newRole:null,discoveryTitle:"最初の骨組み",explain:"Sは「だれが・なにが」、Vは「どうする・どういう状態」。まずはこの2つを英文から見つけます。"},
    {key:"SVC",label:"SVC",newRole:"C",discoveryTitle:"Cを発見",explain:"CはSの説明をする部分です。『S ＝ C』に近い関係になります。",compare:["She is happy.","She ＝ happy な状態"]},
    {key:"SVO",label:"SVO",newRole:"O",discoveryTitle:"Oを発見",explain:"Oは動作の相手になる部分です。Cと違って、ふつう『S ＝ O』にはなりません。",compare:["She likes music.","She ≠ music"]},
    {key:"SVOO",label:"SVOO",newRole:null,discoveryTitle:"Oが2つある形を発見",explain:"Oが2つ並ぶことがあります。『人に → ものを』のように、動作の相手が2つある形です。",compare:["I give you a book.","you ＝ 人に / a book ＝ ものを"]},
    {key:"SVOC",label:"SVOC",newRole:null,discoveryTitle:"OとCが並ぶ形を発見",explain:"OのあとにCが来る形です。ここでは『O ＝ C』の関係になります。",compare:["We call him Ken.","him ＝ Ken"]},
    {key:"M",label:"＋M",newRole:"M",discoveryTitle:"5文型の外にあるMを発見",explain:"Mは『いつ・どこで・どのように』などを足す部分です。文の骨組みには数えません。取っても元の骨組みが残ります。",compare:["She is happy today.","She is happy. ＋ today"]}
  ];
  const roleLong={S:"S 主語",V:"V 動詞",O:"O 目的語",C:"C 補語",M:"M 修飾語","?":"？ まだわからない"};

  function levelKey(grade,term){return `j${grade}t${term}`;}
  function levelRank(key){return B.levels[key]?.rank ?? 0;}
  function allowed(item,key){return levelRank(item.level||"base")<=levelRank(key);}
  function pick(arr,rng=Math.random){return arr.length?arr[Math.floor(rng()*arr.length)]:null;}
  function verbForm(verb,subject){return subject.person===3&&subject.number==="sg"?verb.third:verb.base;}
  function beForm(subject){
    if(subject.person===1&&subject.number==="sg") return "am";
    if(subject.person===2||subject.number==="pl") return "are";
    return "is";
  }
  function part(text,role,ja,meta={}){return {text,role,ja,...meta};}
  function pool(name,key){return B[name].filter(x=>allowed(x,key));}

  function genSV(key,rng){
    const s=pick(pool("subjects",key),rng),v=pick(pool("svVerbs",key),rng);
    return {pattern:"SV",parts:[part(s.text,"S",s.ja),part(verbForm(v,s),"V",v.ja)]};
  }
  function genSVC(key,rng){
    const s=pick(pool("subjects",key),rng),c=pick(pool("complements",key),rng);
    return {pattern:"SVC",parts:[part(s.text,"S",s.ja),part(beForm(s),"V","～です・～の状態です"),part(c.text,"C",c.ja)]};
  }
  function genSVO(key,rng){
    const s=pick(pool("subjects",key),rng),v=pick(pool("svoVerbs",key),rng);
    const objs=pool("objects",key).filter(o=>v.objectGroups.includes(o.group));
    const o=pick(objs,rng)||pick(pool("objects",key),rng);
    return {pattern:"SVO",parts:[part(s.text,"S",s.ja),part(verbForm(v,s),"V",v.ja),part(o.text,"O",o.ja)]};
  }
  function genSVOO(key,rng){
    const s=pick(pool("subjects",key),rng);
    const v=pick(pool("svooVerbs",key),rng)||B.svooVerbs[0];
    const io=pick(pool("indirectObjects",key),rng)||B.indirectObjects[1];
    const objs=pool("objects",key).filter(o=>(v.directGroups||["thing"]).includes(o.group));
    const d=pick(objs,rng)||B.objects.find(x=>x.id==="book");
    return {pattern:"SVOO",parts:[part(s.text,"S",s.ja),part(verbForm(v,s),"V",v.ja),part(io.text,"O",io.ja),part(d.text,"O",d.ja)]};
  }
  function genSVOC(key,rng){
    const frames=B.svocFrames.filter(f=>allowed(f.verb,key));
    const f=pick(frames,rng)||B.svocFrames[0],s=pick(pool("subjects",key),rng);
    const obj=pick(f.objects.filter(x=>allowed(x,key)),rng)||f.objects[0];
    const c=pick(f.complements.filter(x=>allowed(x,key)),rng)||f.complements[0];
    return {pattern:"SVOC",parts:[part(s.text,"S",s.ja),part(verbForm(f.verb,s),"V",f.verb.ja),part(obj.text,"O",obj.ja),part(c.text,"C",c.ja)]};
  }
  function genM(key,rng,basePattern){
    const base=generateSentence(basePattern||pick(["SV","SVC","SVO"],rng),key,rng);
    const m=pick(pool("modifiers",key),rng)||B.modifiers[0];
    const pos=pick(m.positions,rng)||"end",mp=part(m.text,"M",m.ja,{modifierPosition:pos});
    let parts=[...base.parts];
    if(pos==="front") parts=[mp,...parts];
    else if(pos==="mid"){
      const vIndex=parts.findIndex(p=>p.role==="V");
      const insertAt=base.pattern==="SVC"?vIndex+1:vIndex;
      parts.splice(Math.max(1,insertAt),0,mp);
    }else parts.push(mp);
    return {pattern:"M",basePattern:base.pattern,parts};
  }
  function generateSentence(pattern,key="j1t1",rng=Math.random,basePattern=null){
    const funcs={SV:genSV,SVC:genSVC,SVO:genSVO,SVOO:genSVOO,SVOC:genSVOC};
    return pattern==="M"?genM(key,rng,basePattern):funcs[pattern](key,rng);
  }
  function correctAssignments(sentence,assignments){return sentence.parts.every((p,i)=>assignments[i]===p.role);}
  function knownRolesForStage(index){
    const roles=["S","V"];
    for(let i=1;i<=index;i++){const r=STAGES[i].newRole;if(r&&!roles.includes(r)) roles.push(r);}
    return roles;
  }
  function discoveryRolesBefore(index){return knownRolesForStage(Math.max(0,index-1));}
  function validateSentence(sentence){
    const expected={SV:"SV",SVC:"SVC",SVO:"SVO",SVOO:"SVOO",SVOC:"SVOC"};
    if(sentence.pattern==="M"){
      const core=sentence.parts.filter(p=>p.role!=="M").map(p=>p.role).join("");
      return ["SV","SVC","SVO"].includes(core)&&sentence.parts.some(p=>p.role==="M");
    }
    return sentence.parts.map(p=>p.role).join("")===expected[sentence.pattern];
  }

  window.EnglishDiscoveryCore={
    STAGES,roleLong,levelKey,levelRank,allowed,pick,generateSentence,correctAssignments,
    knownRolesForStage,discoveryRolesBefore,validateSentence
  };
})();