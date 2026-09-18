(function(){
  const B=window.ED_PHONICS_BANK;
  if(!B) throw new Error("ED_PHONICS_BANK is required");
  function defaultState(){return {started:false,stageIndex:0,practiceStats:{},vocabStats:{},bestPractice:0,practiceRuns:0,bestMemory:0,memoryRuns:0,grade:1,term:1,studyDays:[]};}
  function statFor(state,id){return state.practiceStats[id]||{attempts:0,correct:0,wrong:0,lastSeen:0,lastResult:null};}
  function updateStat(state,id,correct){
    const p=statFor(state,id);state.practiceStats[id]={attempts:(p.attempts||0)+1,correct:(p.correct||0)+(correct?1:0),wrong:(p.wrong||0)+(correct?0:1),lastSeen:Date.now(),lastResult:correct?"correct":"wrong"};
  }
  function weight(stat,now=Date.now()){
    const a=Number(stat.attempts||0),c=Number(stat.correct||0),acc=a?c/a:0;let w=1;
    if(a===0)w+=3;else if(a<3)w+=1.8;
    if(a&&acc<.6)w+=2.8;else if(a&&acc<.8)w+=1.4;
    if(stat.lastResult==="wrong")w+=2;
    if(stat.lastSeen){const d=(now-stat.lastSeen)/86400000;if(d>=7)w+=2;else if(d>=3)w+=1.1;else if(d>=1)w+=.5;}
    return Math.max(.3,w);
  }
  function chooseStage(unlockedIds,state,recent=[],rng=Math.random){
    const items=unlockedIds.map(id=>{let w=weight(statFor(state,id));if(recent.slice(-1)[0]===id&&unlockedIds.length>1)w*=.35;return{id,w};});
    const total=items.reduce((s,x)=>s+x.w,0);let r=rng()*total;for(const x of items){r-=x.w;if(r<=0)return x.id;}return items.at(-1)?.id||unlockedIds[0];
  }
  function mastery(stat){const a=stat.attempts||0;if(!a)return"これから";const acc=(stat.correct||0)/a;if(a<3)return"練習中";if(acc>=.85&&stat.lastResult!=="wrong")return"かなり分かってきた";if(acc>=.65)return"あと少し";return"もう一度";}
  function unlockedStageIds(state){return B.stages.slice(0,Math.min(B.stages.length,state.stageIndex+1)).map(x=>x.id);}
  window.ED_PHONICS_CORE={defaultState,statFor,updateStat,weight,chooseStage,mastery,unlockedStageIds};
})();
