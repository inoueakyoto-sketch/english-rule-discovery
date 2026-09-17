(function(){
  const B=window.ED_PHONICS_BANK,C=window.ED_PHONICS_CORE;
  if(!B||!C) throw new Error("phonics modules required");
  const KEY="english_word_code_v020",PRACTICE_LENGTH=5;
  const $=id=>document.getElementById(id);
  const els={
    homeBtn:$("phonicsHomeBtn"),progressCard:$("phonicsProgressCard"),foundCount:$("phonicsFoundCount"),progressMap:$("phonicsProgressMap"),intro:$("phonicsIntroCard"),start:$("phonicsStartBtn"),home:$("phonicsHomeCard"),discoverBtn:$("phonicsDiscoverBtn"),discoverTitle:$("phonicsDiscoverTitle"),discoverText:$("phonicsDiscoverText"),practiceBtn:$("phonicsPracticeBtn"),mapBtn:$("phonicsMapBtn"),mastery:$("phonicsMasteryList"),discover:$("phonicsDiscoverCard"),stageCode:$("phonicsStageCode"),stageTitle:$("phonicsStageTitle"),stageLead:$("phonicsStageLead"),stageCounter:$("phonicsStageCounter"),examples:$("phonicsExampleGrid"),guessPrompt:$("phonicsGuessPrompt"),guessOptions:$("phonicsGuessOptions"),reveal:$("phonicsRevealCard"),revealCode:$("phonicsRevealCode"),revealTitle:$("phonicsRevealTitle"),revealRule:$("phonicsRevealRule"),contrast:$("phonicsContrastArea"),probeWord:$("phonicsProbeWord"),probeAudio:$("phonicsProbeAudioBtn"),probePrompt:$("phonicsProbePrompt"),revealNext:$("phonicsRevealNextBtn"),map:$("phonicsMapCard"),mapList:$("phonicsMapList"),soundTable:$("phonicsSoundTable"),tableFound:$("phonicsTableFound"),tableTotal:$("phonicsTableTotal"),tableHint:$("phonicsTableHint"),mapHome:$("phonicsMapHomeBtn"),practice:$("phonicsPracticeCard"),practiceCounter:$("phonicsPracticeCounter"),practiceDots:$("phonicsPracticeDots"),practiceFocus:$("phonicsPracticeFocus"),practiceWord:$("phonicsPracticeWord"),meaningBtn:$("phonicsMeaningBtn"),practiceMeaning:$("phonicsPracticeMeaning"),soundChoices:$("phonicsSoundChoices"),practiceCheck:$("phonicsPracticeCheckBtn"),feedback:$("phonicsPracticeFeedbackCard"),feedbackKicker:$("phonicsFeedbackKicker"),feedbackMark:$("phonicsFeedbackMark"),feedbackTitle:$("phonicsFeedbackTitle"),feedbackRule:$("phonicsFeedbackRule"),feedbackAudio:$("phonicsFeedbackAudioBtn"),practiceNext:$("phonicsPracticeNextBtn"),practiceComplete:$("phonicsPracticeCompleteCard"),practiceScore:$("phonicsPracticeScore"),practiceMessage:$("phonicsPracticeMessage"),practiceResults:$("phonicsPracticeResults"),practiceAgain:$("phonicsPracticeAgainBtn"),practiceHome:$("phonicsPracticeHomeBtn"),toast:$("phonicsToast")
  };
  Object.assign(els,{
    memoryBtn:$("phonicsMemoryBtn"),memory:$("phonicsMemoryCard"),memoryCounter:$("phonicsMemoryCounter"),memoryDots:$("phonicsMemoryDots"),memoryPattern:$("phonicsMemoryPattern"),memoryWord:$("phonicsMemoryWord"),memoryAudio:$("phonicsMemoryAudioBtn"),memoryMeaningArea:$("phonicsMemoryMeaningArea"),memoryOptions:$("phonicsMemoryOptions"),memoryFeedback:$("phonicsMemoryFeedbackCard"),memoryFeedbackKicker:$("phonicsMemoryFeedbackKicker"),memoryFeedbackMark:$("phonicsMemoryFeedbackMark"),memoryFeedbackTitle:$("phonicsMemoryFeedbackTitle"),memoryFeedbackBody:$("phonicsMemoryFeedbackBody"),memoryNext:$("phonicsMemoryNextBtn"),memoryComplete:$("phonicsMemoryCompleteCard"),memoryScore:$("phonicsMemoryScore"),memoryMessage:$("phonicsMemoryMessage"),memoryResults:$("phonicsMemoryResults"),memoryAgain:$("phonicsMemoryAgainBtn"),memoryHome:$("phonicsMemoryHomeBtn")
  });
  let state=load(),screen=state.started?"home":"intro",currentStage=null,currentProbe=null,probeHeard=false,practiceSession=null,practiceItem=null,selectedSound=null,memorySession=null,memoryItem=null,memoryHeard=false,toastTimer=null,lastPracticeFocus=null;

  function load(){try{const merged={...C.defaultState(),...JSON.parse(localStorage.getItem(KEY)||"{}")};if(!merged.practiceStats)merged.practiceStats={};if(!merged.vocabStats)merged.vocabStats={};return merged;}catch(e){return C.defaultState();}}
  function save(){localStorage.setItem(KEY,JSON.stringify(state));}
  function show(el){el.classList.remove("hidden");}function hide(el){el.classList.add("hidden");}
  function hideCards(){[els.intro,els.home,els.discover,els.reveal,els.map,els.practice,els.feedback,els.practiceComplete,els.memory,els.memoryFeedback,els.memoryComplete].forEach(hide);}
  function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]));}
  function toast(t){clearTimeout(toastTimer);els.toast.textContent=t;show(els.toast);toastTimer=setTimeout(()=>hide(els.toast),1800);}
  function haptic(x="tap"){if(!navigator.vibrate)return;try{navigator.vibrate(x==="good"?12:x==="bad"?[20,30,20]:8);}catch(e){}}
  function stage(){return B.stages[Math.min(state.stageIndex,B.stages.length-1)];}
  function completed(){return state.stageIndex>=B.stages.length;}
  function unlocked(){return B.stages.slice(0,Math.min(B.stages.length,state.stageIndex+(state.started?1:0)));}

  function speak(text,rate=.72){
    if(!("speechSynthesis" in window)){toast("この端末では音声再生を使えません");return;}
    window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang="en-US";u.rate=rate;u.pitch=1;
    const voices=window.speechSynthesis.getVoices();const en=voices.find(v=>/^en-US/i.test(v.lang))||voices.find(v=>/^en/i.test(v.lang));if(en)u.voice=en;
    window.speechSynthesis.speak(u);haptic();
  }

  function focusFor(stage,wordObj){
    if(wordObj&&wordObj.focus) return wordObj.focus;
    const word=String(wordObj?.word||"").toLowerCase();
    if(stage.id==="a-e")return "a_e";if(stage.id==="i-e")return "i_e";if(stage.id==="o-e")return "o_e";
    if(stage.id==="ai-ay")return word.includes("ay")?"ay":"ai";
    if(stage.id==="oa")return "oa";
    if(stage.id==="sh-ch")return word.includes("sh")?"sh":"ch";
    if(stage.id==="exceptions"){if(word.includes("ea"))return "ea";if(word.includes("i")&&word.endsWith("e"))return "i_e";if(word.includes("a")&&word.endsWith("e"))return "a_e";}
    return stage.examples[0]?.focus||"";
  }
  function highlight(word,focus){
    const w=esc(word);if(!focus)return w;
    if(/^[aio]_e$/.test(focus)){const first=focus[0],i=word.toLowerCase().indexOf(first),j=word.toLowerCase().lastIndexOf("e");if(i>=0&&j>i)return esc(word.slice(0,i))+`<mark>${esc(word[i])}</mark>`+esc(word.slice(i+1,j))+`<mark>${esc(word[j])}</mark>`+esc(word.slice(j+1));}
    const f=focus.includes(" / ")?focus.split(" / ").find(x=>word.toLowerCase().includes(x)):focus;const idx=word.toLowerCase().indexOf(String(f).toLowerCase());if(idx>=0)return esc(word.slice(0,idx))+`<mark>${esc(word.slice(idx,idx+f.length))}</mark>`+esc(word.slice(idx+f.length));return w;
  }

  function refresh(){
    els.homeBtn.classList.toggle("hidden",!state.started||screen==="home");
    els.progressCard.classList.toggle("hidden",!state.started);
    const count=Math.min(state.stageIndex,B.stages.length);els.foundCount.textContent=count;
    els.progressMap.innerHTML="";B.stages.forEach((s,i)=>{const d=i<state.stageIndex,c=i===state.stageIndex&&!completed();const node=document.createElement("div");node.className=`phonics-progress-node${d?" done":""}${c?" current":""}`;node.innerHTML=`<span>${d?"✓":c?String(i+1).padStart(2,"0"):"·"}</span><b>${d?esc(s.short):c?"NEXT":"?"}</b>`;els.progressMap.appendChild(node);});
    if(screen==="home")renderHome();
  }

  function showHome(){if(!state.started){screen="intro";hideCards();show(els.intro);refresh();return;}screen="home";hideCards();show(els.home);renderHome();refresh();scrollToTop();}
  function renderHome(){
    if(completed()){els.discoverTitle.textContent="読みの発見はひと区切り";els.discoverText.textContent="基本パターンと『例外もある』まで発見済み。音の発見表でいつでも復習できます。";}else{const s=stage();els.discoverTitle.textContent="読み方を発見する";els.discoverText.textContent=`次は ${s.code}。まだ答えは見せず、単語を聞いて比べます。`;}
    els.mastery.innerHTML="";B.stages.slice(0,state.stageIndex).filter(s=>s.order>0).forEach(s=>{const row=document.createElement("div"),m=C.mastery(C.statFor(state,s.id));row.className="mastery-row";row.innerHTML=`<b>${esc(s.short)}</b><span>${esc(m)}</span>`;els.mastery.appendChild(row);});if(!els.mastery.children.length)els.mastery.innerHTML='<div class="phonics-empty-mastery">まず1つ、読みの手がかりを見つけるところから。</div>';
  }

  function guessChoices(s){
    const map={
      "sound-not-name":[["sound","単語の中では“文字の音”を使う"],["name","ABCの文字名をそのまま読む"],["romaji","ローマ字読みを使う"]],
      "short-a":[["short-a","a が子音にはさまれた形"],["a-e","a と最後の e の形"],["ee","ee が並んだ形"]],
      "short-i":[["short-i","i が子音にはさまれた形"],["i-e","i と最後の e の形"],["ee","ee が並んだ形"]],
      "short-e":[["short-e","e が子音にはさまれた形"],["ea","ea の2文字"],["a-e","a と最後の e の形"]],
      "short-o":[["short-o","o が子音にはさまれた形"],["o-e","o と最後の e の形"],["oa","oa の2文字"]],
      "short-u":[["short-u","u が子音にはさまれた形"],["a-e","a と最後の e の形"],["ee","ee の2文字"]],
      "a-e":[["a-e","a + 子音 + e"],["short-a","a が子音にはさまれた形"],["ea","ea の2文字"]],
      "i-e":[["i-e","i + 子音 + e"],["short-a","a が子音にはさまれた形"],["ee","ee の2文字"]],
      "o-e":[["o-e","o + 子音 + e"],["ea","ea の2文字"],["ai","ai の2文字"]],
      "ee":[["ee","ee を2文字セットで見る"],["e-single","e を1文字ずつ読む"],["a-e","a + 子音 + e"]],
      "ea":[["ea","ea を2文字セットで見る"],["ee","ee だけがイーになる"],["e-a","e と a を別々に読む"]],
      "ai-ay":[["ai-ay","ai / ay を1つの音のまとまりで見る"],["a-only","a だけを見る"],["i-y","i / y だけを見る"]],
      "oa":[["oa","oa を2文字セットで見る"],["o-e","o と最後の e だけを見る"],["separate","o と a を別々に読む"]],
      "sh-ch":[["sh-ch","sh / ch を2文字セットで読む"],["separate","1文字ずつ別々に読む"],["vowel","母音だけを見る"]],
      "exceptions":[["exception","規則で予想して、音で確かめる"],["always","見た目の規則は100%絶対"],["romaji","例外は全部ローマ字で読む"]]
    };return map[s.id]||[];
  }

  function startDiscovery(){if(completed())return showMap();currentStage=stage();screen="discover";hideCards();show(els.discover);els.stageCode.textContent=currentStage.code;els.stageTitle.textContent=currentStage.title;els.stageLead.textContent=currentStage.lead;els.stageCounter.textContent=`${currentStage.order+1} / ${B.stages.length}`;els.examples.innerHTML="";
    currentStage.examples.forEach(w=>{const b=document.createElement("button");b.type="button";b.className="phonics-word-card";b.innerHTML=`<span class="phonics-word-text">${highlight(w.word,w.focus)}</span><small>${esc(w.meaning)}</small><i>▶ 聞く</i>`;b.addEventListener("click",()=>speak(w.word));els.examples.appendChild(b);});
    els.guessOptions.innerHTML="";const choices=guessChoices(currentStage),correctId=choices[0][0];choices.sort(()=>Math.random()-.5).forEach(([id,label])=>{const b=document.createElement("button");b.type="button";b.className="phonics-guess-button";b.textContent=label;b.addEventListener("click",()=>revealDiscovery(id===correctId));els.guessOptions.appendChild(b);});refresh();scrollToTop();
  }

  function revealDiscovery(correct){screen="reveal";hideCards();show(els.reveal);probeHeard=false;els.revealNext.disabled=true;els.revealCode.textContent=currentStage.pattern;els.revealTitle.textContent=correct?"つながった。読みの手がかりを発見。":"予想したから、違いが見えた。ここが新しい手がかり。";
    const sound=currentStage.sound?`<div class="phonics-sound-result"><strong>${esc(currentStage.sound)}</strong><span>${esc(currentStage.kana)}</span></div>`:"";
    els.revealRule.innerHTML=`${sound}<p>${esc(currentStage.discover)}</p><small>${esc(currentStage.note)}</small>`;
    els.contrast.innerHTML="";(currentStage.contrast||[]).forEach(c=>{const row=document.createElement("div");row.className="phonics-contrast-row";row.innerHTML=`<button type="button" data-word="${esc(c.left)}">${esc(c.left)} <span>▶</span></button><b>→</b><button type="button" data-word="${esc(c.right)}">${esc(c.right)} <span>▶</span></button><small>${esc(c.caption)}</small>`;row.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>speak(b.dataset.word)));els.contrast.appendChild(row);});
    currentProbe=currentStage.probes[Math.floor(Math.random()*currentStage.probes.length)];els.probeWord.innerHTML=`<strong>${highlight(currentProbe.word,focusFor(currentStage,currentProbe))}</strong><small>${esc(currentProbe.meaning)}</small>`;els.probePrompt.textContent=currentProbe.prompt;els.probeAudio.onclick=()=>{speak(currentProbe.word);probeHeard=true;els.revealNext.disabled=false;els.probeAudio.classList.add("heard");els.probeAudio.querySelector("span:last-child").textContent="もう一度聞く";};
    els.revealNext.onclick=completeDiscovery;haptic(correct?"good":"tap");refresh();scrollToTop();
  }

  function completeDiscovery(){if(!probeHeard)return;state.stageIndex=Math.min(B.stages.length,state.stageIndex+1);save();toast("音の発見表に保存しました");if(completed())showMap();else showHome();}

  function isDiscovered(stageId){const st=B.stages.find(x=>x.id===stageId);return !!st&&st.order<state.stageIndex;}
  function tableMeta(stageId){return B.discoveryTableLabels?.[stageId]||{};}
  function tableExamples(stage){return (stage.examples||[]).slice(0,3).map(w=>w.word);}
  function hasExceptions(){return isDiscovered("exceptions");}
  function renderSoundTable(){
    const groups=B.discoveryTableGroups||[];
    const tableStages=groups.flatMap(g=>g.stageIds||[]);
    const found=tableStages.filter(isDiscovered).length;
    els.tableFound.textContent=found;els.tableTotal.textContent=tableStages.length;
    els.tableHint.textContent=found?"発見した行は、音を聞く・その規則だけ5問練習する、の2つが使えます。":"最初の発見をすると、ここに自分の表ができ始めます。";
    els.soundTable.innerHTML="";
    groups.forEach(group=>{
      const any=(group.stageIds||[]).some(isDiscovered);
      const section=document.createElement("section");section.className=`sound-table-group${any?" has-found":" locked-group"}`;
      const head=document.createElement("div");head.className="sound-table-group-head";head.innerHTML=`<div><span>${any?esc(group.title):"未発見"}</span><small>${any?esc(group.description):"ここには、まだ知らない音の手がかりがあります。"}</small></div><b>${(group.stageIds||[]).filter(isDiscovered).length}/${(group.stageIds||[]).length}</b>`;section.appendChild(head);
      const labels=document.createElement("div");labels.className="sound-table-columns";labels.innerHTML="<span>つづり</span><span>音</span><span>例</span><span>発見</span>";section.appendChild(labels);
      (group.stageIds||[]).forEach(stageId=>{
        const st=B.stages.find(x=>x.id===stageId),discovered=isDiscovered(stageId),meta=tableMeta(stageId),row=document.createElement("article");row.className=`sound-table-row${discovered?" discovered":" undiscovered"}`;
        if(!discovered){row.innerHTML='<div class="sound-table-mystery">?</div><div class="sound-table-mystery">?</div><div class="sound-table-mystery wide">まだ発見していない</div><div class="sound-table-mystery">—</div>';section.appendChild(row);return;}
        const examples=tableExamples(st),exception=B.exceptionLinks?.[stageId],exceptionHtml=exception&&hasExceptions()?`<div class="sound-table-exception"><span>別の読みも発見</span><b>${exception.words.map(esc).join(" / ")}</b><small>${esc(exception.note)}</small></div>`:"";
        row.innerHTML=`<div class="sound-table-pattern"><b>${esc(meta.pattern||st.pattern||st.short)}</b><small>${esc(st.pattern||"")}</small></div><div class="sound-table-sound"><strong>${esc(meta.sound||st.sound||"音")}</strong></div><div class="sound-table-example"><span>${examples.map(esc).join(" · ")}</span><small>${esc(st.kana||"")}</small></div><div class="sound-table-found"><b>#${String(st.order+1).padStart(2,"0")}</b><span>FOUND</span></div>${exceptionHtml}<div class="sound-table-actions"><button type="button" data-audio="${esc(examples[0]||st.examples?.[0]?.word||"")}">▶ 音を聞く</button>${stageId!=="sound-not-name"&&stageId!=="exceptions"?`<button type="button" data-practice="${esc(stageId)}">この音を5問</button>`:""}</div>`;
        row.querySelectorAll("[data-audio]").forEach(b=>b.addEventListener("click",()=>speak(b.dataset.audio)));
        row.querySelectorAll("[data-practice]").forEach(b=>b.addEventListener("click",()=>startPractice(b.dataset.practice)));
        section.appendChild(row);
      });
      els.soundTable.appendChild(section);
    });
  }

  function showMap(){screen="map";hideCards();show(els.map);renderSoundTable();els.mapList.innerHTML="";const found=B.stages.slice(0,Math.min(state.stageIndex,B.stages.length));if(!found.length)els.mapList.innerHTML='<p class="phonics-empty-mastery">まだ発見はありません。</p>';
    found.forEach(s=>{const item=document.createElement("article");item.className="phonics-map-item";const exception=B.exceptionLinks?.[s.id],exceptionHtml=exception&&hasExceptions()?`<div class="phonics-log-exception"><b>あとから見つけた別読み</b><span>${exception.words.map(esc).join(" / ")}</span><small>${esc(exception.note)}</small></div>`:"";item.innerHTML=`<div class="phonics-map-item-head"><span>FOUND #${String(s.order+1).padStart(2,"0")}</span><b>${esc(s.short)}</b>${s.sound?`<strong>${esc(s.sound)}</strong>`:""}</div><p>${esc(s.discover)}</p><div class="phonics-map-examples">${s.examples.slice(0,4).map(w=>`<button type="button" data-word="${esc(w.word)}">${esc(w.word)} <small>▶</small></button>`).join("")}</div>${exceptionHtml}<small class="phonics-map-note">${esc(s.note)}</small>${s.order>0&&s.id!=="exceptions"?`<button type="button" class="phonics-log-practice" data-practice="${esc(s.id)}">この発見だけを5問練習 →</button>`:""}`;item.querySelectorAll("[data-word]").forEach(b=>b.addEventListener("click",()=>speak(b.dataset.word)));item.querySelectorAll("[data-practice]").forEach(b=>b.addEventListener("click",()=>startPractice(b.dataset.practice)));els.mapList.appendChild(item);});refresh();scrollToTop();
  }

  function availablePracticeStages(){return B.stages.slice(1,Math.min(state.stageIndex,B.stages.length)).map(s=>s.id);}
  function startPractice(focusStageId=null){const ids=availablePracticeStages();if(!ids.length){toast("まず読み方を1つ発見すると練習できます");return;}if(focusStageId&&!ids.includes(focusStageId)){toast("この読み方はまだ練習できません");return;}lastPracticeFocus=focusStageId||null;practiceSession={index:0,correct:0,results:[],recent:[],focusStageId:lastPracticeFocus};nextPractice();}
  function nextPractice(){if(practiceSession.index>=PRACTICE_LENGTH)return showPracticeComplete();const ids=availablePracticeStages(),stageId=practiceSession.focusStageId||C.chooseStage(ids,state,practiceSession.recent),pool=B.practiceWords.filter(w=>w.stageId===stageId);practiceItem=pool[Math.floor(Math.random()*pool.length)];practiceSession.recent.push(stageId);selectedSound=null;screen="practice";hideCards();show(els.practice);renderPractice();refresh();scrollToTop();}
  function renderPractice(){const s=B.stages.find(x=>x.id===practiceItem.stageId);els.practiceCounter.textContent=`${practiceSession.index+1} / ${PRACTICE_LENGTH}`;els.practiceDots.innerHTML="";for(let i=0;i<PRACTICE_LENGTH;i++){const d=document.createElement("span");if(i<practiceSession.results.length)d.className=practiceSession.results[i].correct?"done good":"done miss";else if(i===practiceSession.index)d.className="now";d.textContent=i+1;els.practiceDots.appendChild(d);}els.practiceFocus.textContent=practiceSession.focusStageId?`${s.short} だけ練習`:"PATTERNを見て予想";els.practiceWord.innerHTML=highlight(practiceItem.word,focusFor(s,practiceItem));els.practiceMeaning.textContent=practiceItem.meaning;hide(els.practiceMeaning);els.meaningBtn.textContent="意味を見る";els.soundChoices.innerHTML="";const correctFamily=B.familyForWord(practiceItem),correctChoice=B.soundChoices.find(c=>c.id===correctFamily),distractors=B.soundChoices.filter(c=>c.id!==correctFamily).sort(()=>Math.random()-.5).slice(0,3),visible=[correctChoice,...distractors].filter(Boolean).sort(()=>Math.random()-.5);visible.forEach(c=>{const b=document.createElement("button");b.type="button";b.className="phonics-sound-choice";b.innerHTML=`<b>${esc(c.label)}</b><small>${esc(c.sub)}</small>`;b.addEventListener("click",()=>{selectedSound=c.id;els.soundChoices.querySelectorAll("button").forEach(x=>x.classList.toggle("selected",x===b));els.practiceCheck.disabled=false;});els.soundChoices.appendChild(b);});els.practiceCheck.disabled=true;}
  function submitPractice(){if(!selectedSound)return;const correct=B.familyForWord(practiceItem)===selectedSound;C.updateStat(state,practiceItem.stageId,correct);practiceSession.results.push({word:practiceItem.word,stageId:practiceItem.stageId,correct});if(correct)practiceSession.correct++;save();screen="feedback";hideCards();show(els.feedback);const s=B.stages.find(x=>x.id===practiceItem.stageId);els.feedbackKicker.textContent=correct?"CLEAR":"CHECK";els.feedbackMark.textContent=correct?"✓":"↺";els.feedbackTitle.textContent=correct?"つづりから音を予想できた。":"音を聞いて、パターンをもう一度つなぐ。";els.feedbackRule.innerHTML=`<div class="phonics-feedback-word">${highlight(practiceItem.word,focusFor(s,practiceItem))}</div><p><b>${esc(s.short)}</b>　${esc(s.discover)}</p><small>${esc(practiceItem.meaning)}</small>`;els.feedbackAudio.onclick=()=>speak(practiceItem.word);els.practiceNext.textContent=practiceSession.index===PRACTICE_LENGTH-1?"5問の結果を見る":"次の単語";haptic(correct?"good":"bad");refresh();scrollToTop();}
  function advancePractice(){practiceSession.index++;nextPractice();}
  function showPracticeComplete(){screen="practice-complete";hideCards();show(els.practiceComplete);els.practiceScore.textContent=practiceSession.correct;state.bestPractice=Math.max(state.bestPractice||0,practiceSession.correct);state.practiceRuns=(state.practiceRuns||0)+1;save();els.practiceMessage.textContent=practiceSession.focusStageId?(practiceSession.correct===5?"この読み方を5語とも使えた。発見表から、いつでも同じ音に戻れます。":"この読み方だけをもう一度練習できます。迷ったら発見表へ戻ろう。"):(practiceSession.correct===5?"5語とも、読みの手がかりを使って予想できた。":"迷ったパターンは、次回の5問で少し多めに出てきます。");els.practiceResults.innerHTML="";practiceSession.results.forEach((r,i)=>{const s=B.stages.find(x=>x.id===r.stageId),row=document.createElement("div");row.className=`practice-result ${r.correct?"is-good":"is-miss"}`;row.innerHTML=`<span class="result-no">${i+1}</span><b>${esc(r.word)}</b><span class="result-state">${r.correct?"できた":"もう一度"}</span><small>${esc(s.short)}</small>`;els.practiceResults.appendChild(row);});practiceSession=null;refresh();scrollToTop();}
  function vocabStat(word){return state.vocabStats[word]||{attempts:0,correct:0,wrong:0,lastSeen:0,lastResult:null};}
  function updateVocab(word,correct){const p=vocabStat(word);state.vocabStats[word]={attempts:(p.attempts||0)+1,correct:(p.correct||0)+(correct?1:0),wrong:(p.wrong||0)+(correct?0:1),lastSeen:Date.now(),lastResult:correct?"correct":"wrong"};}
  function chooseMemoryWord(pool){const recent=new Set((memorySession?.results||[]).map(r=>r.word));const candidates=pool.filter(w=>!recent.has(w.word));const source=candidates.length?candidates:pool;const weighted=source.map(w=>({w,weight:C.weight(vocabStat(w.word))}));const total=weighted.reduce((a,x)=>a+x.weight,0);let r=Math.random()*total;for(const x of weighted){r-=x.weight;if(r<=0)return x.w;}return weighted.at(-1).w;}
  function startMemory(){const ids=availablePracticeStages();if(!ids.length){toast("まず読み方を1つ発見すると単語暗記を始められます");return;}memorySession={index:0,correct:0,results:[]};nextMemory();}
  function nextMemory(){if(memorySession.index>=PRACTICE_LENGTH)return showMemoryComplete();const ids=new Set(availablePracticeStages()),rawPool=B.practiceWords.filter(w=>ids.has(w.stageId)),pool=[...new Map(rawPool.map(w=>[w.word,w])).values()];memoryItem=chooseMemoryWord(pool);memoryHeard=false;screen="memory";hideCards();show(els.memory);renderMemory();refresh();scrollToTop();}
  function renderMemory(){const s=B.stages.find(x=>x.id===memoryItem.stageId);els.memoryCounter.textContent=`${memorySession.index+1} / ${PRACTICE_LENGTH}`;els.memoryDots.innerHTML="";for(let i=0;i<PRACTICE_LENGTH;i++){const d=document.createElement("span");if(i<memorySession.results.length)d.className=memorySession.results[i].correct?"done good":"done miss";else if(i===memorySession.index)d.className="now";d.textContent=i+1;els.memoryDots.appendChild(d);}els.memoryPattern.textContent=`${s.short} を使って読む`;els.memoryWord.innerHTML=highlight(memoryItem.word,focusFor(s,memoryItem));hide(els.memoryMeaningArea);els.memoryOptions.innerHTML="";els.memoryAudio.querySelector("span:last-child").textContent="先に読んでから、音を聞く";els.memoryAudio.classList.remove("heard");els.memoryAudio.onclick=()=>{speak(memoryItem.word);memoryHeard=true;els.memoryAudio.classList.add("heard");els.memoryAudio.querySelector("span:last-child").textContent="もう一度聞く";renderMeaningOptions();};}
  function renderMeaningOptions(){if(!memoryHeard)return;show(els.memoryMeaningArea);const all=[...new Set(B.practiceWords.map(w=>w.meaning).filter(Boolean))].filter(x=>x!==memoryItem.meaning).sort(()=>Math.random()-.5).slice(0,3),opts=[memoryItem.meaning,...all].sort(()=>Math.random()-.5);els.memoryOptions.innerHTML="";opts.forEach(m=>{const b=document.createElement("button");b.type="button";b.className="phonics-memory-option";b.textContent=m;b.addEventListener("click",()=>submitMemory(m===memoryItem.meaning));els.memoryOptions.appendChild(b);});}
  function submitMemory(correct){updateVocab(memoryItem.word,correct);memorySession.results.push({word:memoryItem.word,meaning:memoryItem.meaning,stageId:memoryItem.stageId,correct});if(correct)memorySession.correct++;save();screen="memory-feedback";hideCards();show(els.memoryFeedback);const s=B.stages.find(x=>x.id===memoryItem.stageId);els.memoryFeedbackKicker.textContent=correct?"WORD LINK CLEAR":"WORD LINK CHECK";els.memoryFeedbackMark.textContent=correct?"✓":"↺";els.memoryFeedbackTitle.textContent=correct?"音と意味までつながった。":"読み方を手がかりに、意味ももう一度つなぐ。";els.memoryFeedbackBody.innerHTML=`<div class="phonics-feedback-word">${highlight(memoryItem.word,focusFor(s,memoryItem))}</div><p><b>${esc(memoryItem.meaning)}</b></p><small>${esc(s.short)} ｜ ${esc(s.discover)}</small>`;els.memoryNext.textContent=memorySession.index===PRACTICE_LENGTH-1?"5語の結果を見る":"次の単語";haptic(correct?"good":"bad");refresh();scrollToTop();}
  function advanceMemory(){memorySession.index++;nextMemory();}
  function showMemoryComplete(){screen="memory-complete";hideCards();show(els.memoryComplete);els.memoryScore.textContent=memorySession.correct;state.bestMemory=Math.max(state.bestMemory||0,memorySession.correct);state.memoryRuns=(state.memoryRuns||0)+1;save();els.memoryMessage.textContent=memorySession.correct===5?"5語とも、見た目・音・意味をセットで確認できた。":"間違えた単語ほど、次回は少し出やすくなります。";els.memoryResults.innerHTML="";memorySession.results.forEach((r,i)=>{const s=B.stages.find(x=>x.id===r.stageId),row=document.createElement("div");row.className=`practice-result ${r.correct?"is-good":"is-miss"}`;row.innerHTML=`<span class="result-no">${i+1}</span><b>${esc(r.word)}</b><span class="result-state">${r.correct?"つながった":"もう一度"}</span><small>${esc(r.meaning)} · ${esc(s.short)}</small>`;els.memoryResults.appendChild(row);});memorySession=null;refresh();scrollToTop();}

  function scrollToTop(){window.scrollTo({top:0,behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});}

  els.start.addEventListener("click",()=>{state.started=true;save();showHome();});els.homeBtn.addEventListener("click",showHome);els.discoverBtn.addEventListener("click",()=>completed()?showMap():startDiscovery());els.practiceBtn.addEventListener("click",()=>startPractice());els.memoryBtn.addEventListener("click",startMemory);els.mapBtn.addEventListener("click",showMap);els.mapHome.addEventListener("click",showHome);els.meaningBtn.addEventListener("click",()=>{const opening=els.practiceMeaning.classList.contains("hidden");els.practiceMeaning.classList.toggle("hidden");els.meaningBtn.textContent=opening?"意味を閉じる":"意味を見る";});els.practiceCheck.addEventListener("click",submitPractice);els.practiceNext.addEventListener("click",advancePractice);els.practiceAgain.addEventListener("click",()=>startPractice(lastPracticeFocus));els.practiceHome.addEventListener("click",()=>lastPracticeFocus?showMap():showHome());els.memoryNext.addEventListener("click",advanceMemory);els.memoryAgain.addEventListener("click",startMemory);els.memoryHome.addEventListener("click",showHome);
  if("speechSynthesis" in window)window.speechSynthesis.getVoices();
  if("serviceWorker" in navigator&&location.protocol!=="file:"){navigator.serviceWorker.register("./sw.js").catch(()=>{});}
  refresh();if(state.started)showHome();else{hideCards();show(els.intro);refresh();}
})();
