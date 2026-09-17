(function(){
  const C=window.EnglishDiscoveryCore;
  const STORAGE_KEY="english_rule_discovery_v013";
  const LEGACY_KEYS=["english_rule_discovery_v012","english_rule_discovery_v011","english_rule_discovery_v010"];
  const PRACTICE_LENGTH=5;
  const $=id=>document.getElementById(id);
  const els={
    homeBtn:$("homeBtn"),notebookBtn:$("notebookBtn"),quickNotebookBtn:$("quickNotebookBtn"),notebookPanel:$("notebookPanel"),notebookBackdrop:$("notebookBackdrop"),notebookCloseBtn:$("notebookCloseBtn"),notebookReturnBtn:$("notebookReturnBtn"),notebookList:$("notebookList"),notebookCount:$("notebookCount"),
    settingsBtn:$("settingsBtn"),settingsPanel:$("settingsPanel"),settingsBackdrop:$("settingsBackdrop"),settingsCloseBtn:$("settingsCloseBtn"),
    gradeSelect:$("gradeSelect"),termSelect:$("termSelect"),hintToggle:$("hintToggle"),applySettingsBtn:$("applySettingsBtn"),resetProgressBtn:$("resetProgressBtn"),
    scopeText:$("scopeText"),discoveredText:$("discoveredText"),successCount:$("successCount"),streakCount:$("streakCount"),ruleMap:$("ruleMap"),
    homeCard:$("homeCard"),discoveryModeBtn:$("discoveryModeBtn"),discoveryModeTitle:$("discoveryModeTitle"),discoveryModeText:$("discoveryModeText"),practiceModeBtn:$("practiceModeBtn"),homeNotebookBtn:$("homeNotebookBtn"),masteryList:$("masteryList"),
    introCard:$("introCard"),startBtn:$("startBtn"),gameCard:$("gameCard"),questionKicker:$("questionKicker"),questionTitle:$("questionTitle"),questionNumber:$("questionNumber"),questionMode:$("questionMode"),practiceProgress:$("practiceProgress"),
    wordHintBtn:$("wordHintBtn"),hintBox:$("hintBox"),sentenceArea:$("sentenceArea"),rolePalette:$("rolePalette"),selectedRoleText:$("selectedRoleText"),
    clearBtn:$("clearBtn"),checkBtn:$("checkBtn"),feedbackCard:$("feedbackCard"),feedbackIcon:$("feedbackIcon"),feedbackKicker:$("feedbackKicker"),feedbackPattern:$("feedbackPattern"),feedbackTitle:$("feedbackTitle"),feedbackBody:$("feedbackBody"),
    answerStrip:$("answerStrip"),reviewRetryBtn:$("reviewRetryBtn"),nextBtn:$("nextBtn"),completeCard:$("completeCard"),continueMixedBtn:$("continueMixedBtn"),
    practiceCompleteCard:$("practiceCompleteCard"),practiceScore:$("practiceScore"),practiceCompleteMessage:$("practiceCompleteMessage"),practiceResultList:$("practiceResultList"),practiceAgainBtn:$("practiceAgainBtn"),practiceNotebookBtn:$("practiceNotebookBtn"),practiceHomeBtn:$("practiceHomeBtn"),toast:$("toast")
  };

  const defaultState=()=>({
    grade:1,term:1,hints:true,started:false,stageIndex:0,phase:"practice",
    currentPatternCorrect:0,successCount:0,attemptCount:0,streak:0,bestStreak:0,completed:false,
    practiceStats:{}
  });

  let state=loadState();
  let screenMode=state.started?"home":"onboarding";
  let sentence=null,assignments=[],selectedRole="S",nextAction="question",toastTimer=null;
  let practiceSession=null,notebookReturnAction=null;

  function loadState(){
    try{
      const raw=localStorage.getItem(STORAGE_KEY)||LEGACY_KEYS.map(k=>localStorage.getItem(k)).find(Boolean);
      const parsed=raw?JSON.parse(raw):{};
      const merged={...defaultState(),...parsed};
      if(!merged.practiceStats||typeof merged.practiceStats!=="object") merged.practiceStats={};
      delete merged.mixedMode;
      return merged;
    }catch(e){return defaultState();}
  }
  function saveState(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}
  function scopeKey(){return C.levelKey(state.grade,state.term);}
  function currentStageMax(){return state.completed?C.STAGES.length-1:Math.max(0,state.stageIndex);}
  function discoveredStages(){return C.STAGES.slice(0,currentStageMax()+1);}
  function discoveredPatterns(){return discoveredStages().map(s=>s.key);}
  function discoveredLabels(){return discoveredStages().map(s=>s.label).join(" → ");}
  function statFor(pattern){return state.practiceStats[pattern]||{attempts:0,correct:0,wrong:0,lastSeen:0,lastResult:null};}
  function stageIndexForPattern(pattern){return C.STAGES.findIndex(s=>s.key===pattern);}

  function updateSkill(pattern,correct){
    const prev=statFor(pattern);
    state.practiceStats[pattern]={
      attempts:Number(prev.attempts||0)+1,
      correct:Number(prev.correct||0)+(correct?1:0),
      wrong:Number(prev.wrong||0)+(correct?0:1),
      lastSeen:Date.now(),lastResult:correct?"correct":"wrong"
    };
  }

  function refreshHeader(){
    els.scopeText.textContent=`中${state.grade}・${state.term}学期まで`;
    els.discoveredText.textContent=discoveredLabels();
    els.successCount.textContent=state.successCount;
    els.streakCount.textContent=state.streak||0;
    els.gradeSelect.value=String(state.grade);els.termSelect.value=String(state.term);els.hintToggle.checked=!!state.hints;
    els.homeBtn.classList.toggle("hidden",!state.started||screenMode==="home");
    renderRuleMap();
    if(screenMode==="home") renderHome();
  }

  function renderRuleMap(){
    const max=currentStageMax();
    els.ruleMap.innerHTML="";
    C.STAGES.forEach((stage,i)=>{
      const isDiscovered=state.started&&(state.completed||i<=max);
      const isDone=state.started&&(i<max||state.completed);
      const isCurrent=state.started&&!state.completed&&i===max;
      const item=document.createElement(isDiscovered?"button":"div");
      if(isDiscovered){item.type="button";item.setAttribute("aria-label",`${stage.label}の気づきを見る`);}
      item.className=`rule-node${isDone?" done":""}${isCurrent?" current":""}${isDiscovered?" can-review":" locked"}`;
      const dot=isDone?"✓":(isCurrent?String(i+1).padStart(2,"0"):"·");
      const label=isDiscovered?stage.label:"?";
      item.innerHTML=`<span class="rule-dot">${dot}</span><b>${escapeHtml(label)}</b>`;
      if(isDiscovered) item.addEventListener("click",()=>openNotebook(i));
      els.ruleMap.appendChild(item);
    });
  }

  function renderHome(){
    if(!state.started) return;
    if(state.completed){
      els.discoveryModeTitle.textContent="発見パートは完了";
      els.discoveryModeText.textContent="5文型＋Mまで発見済み。自分の気づきを見返せます。";
    }else{
      const stage=C.STAGES[state.stageIndex];
      els.discoveryModeTitle.textContent="発見をつづける";
      els.discoveryModeText.textContent=`今は ${stage.label} を使えるようにしているところ。次の「あれ？」へ進みます。`;
    }
    els.masteryList.innerHTML="";
    discoveredStages().forEach(stage=>{
      const level=C.masteryLevel(statFor(stage.key));
      const row=document.createElement("div");
      row.className=`mastery-row mastery-${level.key}`;
      row.innerHTML=`<b>${escapeHtml(stage.label)}</b><span>${escapeHtml(level.label)}</span>`;
      els.masteryList.appendChild(row);
    });
  }

  function show(el){el.classList.remove("hidden");}
  function hide(el){el.classList.add("hidden");}
  function hideMainCards(){[els.introCard,els.homeCard,els.gameCard,els.feedbackCard,els.completeCard,els.practiceCompleteCard].forEach(hide);}
  function haptic(kind="tap"){
    if(!navigator.vibrate) return;
    const patterns={tap:8,good:12,bad:[22,30,22],discover:[12,40,18]};
    try{navigator.vibrate(patterns[kind]||8);}catch(e){}
  }
  function showToast(text){clearTimeout(toastTimer);els.toast.textContent=text;show(els.toast);toastTimer=setTimeout(()=>hide(els.toast),1700);}
  function scrollTopSoft(){window.scrollTo({top:0,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});}

  function showHome(){
    if(!state.started){screenMode="onboarding";hideMainCards();show(els.introCard);refreshHeader();return;}
    screenMode="home";practiceSession=null;hideMainCards();show(els.homeCard);refreshHeader();scrollTopSoft();
  }

  function openSettings(){closeNotebook(false);show(els.settingsBackdrop);show(els.settingsPanel);els.settingsBtn.setAttribute("aria-expanded","true");document.body.style.overflow="hidden";setTimeout(()=>els.settingsCloseBtn.focus(),30);}
  function closeSettings(){hide(els.settingsBackdrop);hide(els.settingsPanel);els.settingsBtn.setAttribute("aria-expanded","false");document.body.style.overflow="";}

  function noteKeyText(stage){
    const keys={SV:"S＝だれが・なにが ／ V＝どうする・どんな状態",SVC:"CはSの説明。『S ＝ C』に近いかを見る",SVO:"Oは動作の相手。ふつう『S ＝ O』にはならない",SVOO:"Oが2つ。『人に → ものを』の順で並ぶことがある",SVOC:"OのあとにC。『O ＝ C』になる",M:"Mは追加情報。外しても元の文型の骨組みが残る"};
    return keys[stage.key]||stage.explain;
  }
  function renderNotebook(focusIndex=null){
    const visible=state.started?discoveredStages():[];
    els.notebookCount.textContent=`${visible.length} / ${C.STAGES.length}`;
    els.notebookList.innerHTML="";
    if(!visible.length){els.notebookList.innerHTML='<div class="empty-note">最初の発見をすると、ここに気づきが残ります。</div>';return;}
    visible.forEach((stage,i)=>{
      const card=document.createElement("article");card.className="note-card"+(focusIndex===i?" is-focus":"");card.id=`note-stage-${i}`;
      const compare=stage.compare?`<div class="note-compare"><div class="note-example"><strong>例</strong> ${escapeHtml(stage.compare[0])}</div><div class="note-example"><strong>見方</strong> ${escapeHtml(stage.compare[1])}</div></div>`:"";
      card.innerHTML=`<div class="note-card-head"><span class="note-badge">${escapeHtml(stage.label)}</span><div><h3>${escapeHtml(stage.discoveryTitle)}</h3><p>DISCOVERED RULE</p></div></div><p class="note-explain">${escapeHtml(stage.explain)}</p><div class="note-key">${escapeHtml(noteKeyText(stage))}</div>${compare}<div class="note-saved">気づきノートに保存済み</div>`;
      els.notebookList.appendChild(card);
    });
  }
  function openNotebook(focusIndex=null,returnAction=null){
    closeSettings();notebookReturnAction=returnAction;renderNotebook(focusIndex);show(els.notebookBackdrop);show(els.notebookPanel);els.notebookBtn.setAttribute("aria-expanded","true");document.body.style.overflow="hidden";
    els.notebookReturnBtn.textContent=returnAction==="retry"?"同じ問題に戻る":(screenMode==="home"?"閉じる":"問題に戻る");
    setTimeout(()=>{if(focusIndex!==null){const target=$(`note-stage-${focusIndex}`);target?.scrollIntoView({block:"start",behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});}else els.notebookCloseBtn.focus();},50);
    haptic("tap");
  }
  function closeNotebook(restoreFocus=true){
    const action=notebookReturnAction;notebookReturnAction=null;
    hide(els.notebookBackdrop);hide(els.notebookPanel);els.notebookBtn.setAttribute("aria-expanded","false");document.body.style.overflow="";
    if(action==="retry"){retryCurrentPracticeQuestion();return;}
    if(restoreFocus) els.notebookBtn.focus();
  }

  function init(){
    registerEvents();saveState();refreshHeader();
    if(state.started) showHome(); else {hideMainCards();show(els.introCard);screenMode="onboarding";refreshHeader();}
    if("serviceWorker" in navigator&&location.protocol!=="file:"){navigator.serviceWorker.register("./sw.js").catch(()=>{});}
  }

  function registerEvents(){
    els.homeBtn.addEventListener("click",()=>{haptic("tap");showHome();});
    els.notebookBtn.addEventListener("click",()=>openNotebook());els.quickNotebookBtn.addEventListener("click",()=>openNotebook(Math.min(currentStageMax(),stageIndexForPattern(sentence?.pattern||"SV"))));els.notebookCloseBtn.addEventListener("click",()=>closeNotebook());els.notebookReturnBtn.addEventListener("click",()=>closeNotebook());els.notebookBackdrop.addEventListener("click",()=>closeNotebook());
    els.settingsBtn.addEventListener("click",openSettings);els.settingsCloseBtn.addEventListener("click",closeSettings);els.settingsBackdrop.addEventListener("click",closeSettings);
    document.addEventListener("keydown",e=>{if(e.key==="Escape"){if(!els.notebookPanel.classList.contains("hidden")) closeNotebook();else if(!els.settingsPanel.classList.contains("hidden")) closeSettings();}});
    els.startBtn.addEventListener("click",()=>{haptic("tap");state.started=true;saveState();beginDiscovery();});
    els.discoveryModeBtn.addEventListener("click",()=>{haptic("tap");if(state.completed) openNotebook(currentStageMax());else beginDiscovery();});
    els.practiceModeBtn.addEventListener("click",()=>{haptic("tap");startPracticeSession();});
    els.homeNotebookBtn.addEventListener("click",()=>openNotebook());
    els.applySettingsBtn.addEventListener("click",()=>{
      state.grade=Number(els.gradeSelect.value);state.term=Number(els.termSelect.value);state.hints=els.hintToggle.checked;saveState();refreshHeader();closeSettings();showToast("学習範囲を更新しました");
      if(screenMode==="discovery") newDiscoveryQuestion(); else if(screenMode==="practice"&&practiceSession) newPracticeQuestion();
    });
    els.resetProgressBtn.addEventListener("click",()=>{
      if(confirm("学習記録を最初からにしますか？ 学年・学期の設定は残します。")){
        const g=Number(els.gradeSelect.value),t=Number(els.termSelect.value),h=els.hintToggle.checked;
        state={...defaultState(),grade:g,term:t,hints:h};practiceSession=null;saveState();closeSettings();showHome();
      }
    });
    els.wordHintBtn.addEventListener("click",()=>{const opening=els.hintBox.classList.contains("hidden");els.hintBox.classList.toggle("hidden");els.wordHintBtn.setAttribute("aria-expanded",String(opening));haptic("tap");});
    els.clearBtn.addEventListener("click",()=>{assignments=Array(sentence.parts.length).fill(null);renderSentence();updateCheck();haptic("tap");});
    els.checkBtn.addEventListener("click",submitAnswer);
    els.nextBtn.addEventListener("click",handleNext);
    els.reviewRetryBtn.addEventListener("click",()=>{const idx=Math.max(0,stageIndexForPattern(sentence.pattern));openNotebook(idx,"retry");});
    els.continueMixedBtn.addEventListener("click",()=>startPracticeSession());
    els.practiceAgainBtn.addEventListener("click",()=>startPracticeSession());
    els.practiceNotebookBtn.addEventListener("click",()=>openNotebook());
    els.practiceHomeBtn.addEventListener("click",showHome);
  }

  function beginDiscovery(){
    screenMode="discovery";practiceSession=null;hideMainCards();
    if(state.completed){showComplete();return;}
    newDiscoveryQuestion();scrollTopSoft();
  }

  function questionPatternDiscovery(){
    if(state.phase==="discovery"&&state.stageIndex<C.STAGES.length-1) return C.STAGES[state.stageIndex+1].key;
    const current=C.STAGES[state.stageIndex].key;
    if(state.stageIndex===0||Math.random()<0.72) return current;
    return C.pick(C.STAGES.slice(0,state.stageIndex).map(s=>s.key));
  }

  function newDiscoveryQuestion(){
    hideMainCards();show(els.gameCard);screenMode="discovery";
    const pattern=questionPatternDiscovery(),discoveryBase=(state.phase==="discovery"&&pattern==="M")?"SVC":null;
    sentence=C.generateSentence(pattern,scopeKey(),Math.random,discoveryBase);assignments=Array(sentence.parts.length).fill(null);selectedRole="S";
    renderQuestion(false);renderPalette();renderSentence();renderHints();updateCheck();refreshHeader();
  }

  function startPracticeSession(){
    if(!state.started) return;
    screenMode="practice";
    practiceSession={results:[],correct:0,usedPatterns:[],lastSentenceKey:null,retrying:false};
    state.streak=0;saveState();newPracticeQuestion();scrollTopSoft();
  }

  function sentenceKey(s){return s.parts.map(p=>p.text).join("|")+"::"+s.pattern;}
  function newPracticeQuestion(){
    if(!practiceSession) return startPracticeSession();
    if(practiceSession.results.length>=PRACTICE_LENGTH){showPracticeSummary();return;}
    hideMainCards();show(els.gameCard);screenMode="practice";practiceSession.retrying=false;
    const patterns=discoveredPatterns();
    const pattern=C.choosePracticePattern(patterns,state.practiceStats,practiceSession.usedPatterns,Math.random,Date.now())||patterns[0];
    let candidate=null;
    for(let i=0;i<6;i++){candidate=C.generateSentence(pattern,scopeKey(),Math.random);if(sentenceKey(candidate)!==practiceSession.lastSentenceKey) break;}
    sentence=candidate;practiceSession.lastSentenceKey=sentenceKey(sentence);assignments=Array(sentence.parts.length).fill(null);selectedRole="S";
    renderQuestion(false);renderPalette();renderSentence();renderHints();updateCheck();refreshHeader();
  }

  function renderQuestion(retry=false){
    if(screenMode==="practice"){
      const number=retry?Math.max(1,practiceSession.results.length):Math.min(PRACTICE_LENGTH,practiceSession.results.length+1);
      els.questionNumber.textContent=`Q ${number} / ${PRACTICE_LENGTH}`;els.questionMode.textContent=retry?"RETRY":"PRACTICE";
      els.questionTitle.textContent=retry?"同じ文を、もう一度見る":"見つけた規則を使ってみる";
      els.questionKicker.textContent=retry?"気づきを見たあとなら、見え方が変わっているかも。":"5問だけ。苦手な規則は少し多めに出ます。";
      renderPracticeProgress(retry);show(els.practiceProgress);
    }else{
      hide(els.practiceProgress);
      els.questionNumber.textContent=`Q ${String(state.attemptCount+1).padStart(2,"0")}`;
      els.questionMode.textContent=state.phase==="discovery"?"UNKNOWN":(sentence.pattern==="M"?(sentence.basePattern+" + ?"):sentence.pattern);
      els.questionTitle.textContent=state.phase==="discovery"?"いつも通り、分けてみる":"英文の役割を見つける";
      els.questionKicker.textContent=state.phase==="discovery"?"見慣れないところがあっても、今わかる範囲でOK。":"役割を選んで、英文のまとまりをタップ。";
    }
  }

  function renderPracticeProgress(retry=false){
    els.practiceProgress.innerHTML="";
    const retryIndex=retry?Math.max(0,practiceSession.results.length-1):-1;
    for(let i=0;i<PRACTICE_LENGTH;i++){
      const dot=document.createElement("span");
      if(i===retryIndex) dot.className="now retry";
      else if(i<practiceSession.results.length) dot.className=practiceSession.results[i].correct?"done good":"done miss";
      else if(!retry&&i===practiceSession.results.length) dot.className="now";
      dot.textContent=String(i+1);els.practiceProgress.appendChild(dot);
    }
  }

  function currentKnownRoles(){
    if(screenMode==="practice") return C.knownRolesForStage(currentStageMax());
    if(state.phase==="discovery") return C.discoveryRolesBefore(state.stageIndex+1);
    return C.knownRolesForStage(state.stageIndex);
  }
  function roleLabel(role){const labels={S:["S","主語"],V:["V","動詞"],O:["O","目的語"],C:["C","補語"],M:["M","修飾語"],"?":["?","まだ不明"]};return labels[role]||[role,""];}
  function renderPalette(){
    const roles=[...currentKnownRoles(),"?"];if(!roles.includes(selectedRole)) selectedRole=roles[0];els.rolePalette.innerHTML="";
    roles.forEach(role=>{
      const [main,sub]=roleLabel(role),b=document.createElement("button");b.type="button";b.className="role-button"+(role===selectedRole?" active":"");b.dataset.role=role;
      b.innerHTML=`<span class="role-main">${main}</span><span class="role-sub">${sub}</span>`;
      b.addEventListener("click",()=>{selectedRole=role;renderPalette();haptic("tap");});els.rolePalette.appendChild(b);
    });
    const [main,sub]=roleLabel(selectedRole);els.selectedRoleText.textContent=`${main} ${sub}`;
  }
  function renderSentence(){
    els.sentenceArea.innerHTML="";
    sentence.parts.forEach((p,i)=>{
      const b=document.createElement("button");b.type="button";b.className="chunk";b.dataset.index=String(i);if(assignments[i]) b.dataset.role=assignments[i];
      b.innerHTML=`<span class="assigned">${assignments[i]||""}</span><span>${escapeHtml(p.text)}</span>`;
      b.addEventListener("click",()=>{assignments[i]=selectedRole;renderSentence();updateCheck();haptic("tap");});els.sentenceArea.appendChild(b);
    });
  }
  function renderHints(){
    els.hintBox.innerHTML=sentence.parts.map(p=>`<div><strong>${escapeHtml(p.text)}</strong> ${escapeHtml(p.ja)}</div>`).join("");
    hide(els.hintBox);els.wordHintBtn.setAttribute("aria-expanded","false");if(state.hints) show(els.wordHintBtn);else hide(els.wordHintBtn);
  }
  function updateCheck(){els.checkBtn.disabled=assignments.some(x=>!x);}

  function submitAnswer(){
    const correct=C.correctAssignments(sentence,assignments);
    if(screenMode==="practice") submitPracticeAnswer(correct); else submitDiscoveryAnswer(correct);
    saveState();refreshHeader();scrollTopSoft();
  }

  function submitDiscoveryAnswer(correct){
    const isDiscovery=state.phase==="discovery";state.attemptCount+=1;
    if(isDiscovery){
      const nextIndex=state.stageIndex+1;state.stageIndex=nextIndex;state.phase="practice";state.currentPatternCorrect=0;state.streak=0;haptic("discover");showDiscoveryFeedback(C.STAGES[nextIndex]);
      return;
    }
    updateSkill(sentence.pattern,correct);
    if(correct){
      state.successCount+=1;state.streak=(state.streak||0)+1;state.bestStreak=Math.max(state.bestStreak||0,state.streak);haptic("good");
      const target=C.STAGES[state.stageIndex]?.key;
      if(sentence.pattern===target&&!state.completed){
        state.currentPatternCorrect+=1;
        if(state.currentPatternCorrect>=3&&state.stageIndex<C.STAGES.length-1) state.phase="discovery";
        else if(state.currentPatternCorrect>=3&&state.stageIndex===C.STAGES.length-1){state.completed=true;nextAction="complete";}
      }
      showPracticeFeedback(true,{practiceSession:false});
    }else{
      state.streak=0;haptic("bad");if(sentence.pattern===C.STAGES[state.stageIndex]?.key&&state.currentPatternCorrect>0) state.currentPatternCorrect-=1;showPracticeFeedback(false,{practiceSession:false});
    }
  }

  function submitPracticeAnswer(correct){
    if(!practiceSession) return;
    if(practiceSession.retrying){
      haptic(correct?"good":"bad");showPracticeFeedback(correct,{practiceSession:true,retry:true});return;
    }
    state.attemptCount+=1;updateSkill(sentence.pattern,correct);
    practiceSession.results.push({pattern:sentence.pattern,label:sentence.pattern==="M"?(sentence.basePattern+" + M"):sentence.pattern,correct});
    practiceSession.usedPatterns.push(sentence.pattern);
    if(correct){practiceSession.correct+=1;state.successCount+=1;state.streak=(state.streak||0)+1;state.bestStreak=Math.max(state.bestStreak||0,state.streak);haptic("good");}
    else{state.streak=0;haptic("bad");}
    showPracticeFeedback(correct,{practiceSession:true,retry:false});
  }

  function showPracticeFeedback(correct,opts={}){
    hideMainCards();show(els.feedbackCard);els.feedbackCard.className="feedback-card"+(correct?"":" is-wrong");els.feedbackIcon.textContent=correct?"✓":"↺";
    els.feedbackKicker.textContent=opts.retry?(correct?"RETRY CLEAR":"ONE MORE LOOK"):(correct?"CLEAR":"CHECK");
    els.feedbackPattern.textContent=sentence.pattern==="M"?(sentence.basePattern+" + M"):sentence.pattern;
    if(opts.retry){
      els.feedbackTitle.textContent=correct?"気づきを見て、もう一度できた。":"まだ迷ってOK。見方をもう一度使ってみる。";
      els.feedbackBody.innerHTML=correct?"<p>同じ文でも、ルールを確認してから見ると整理できます。この問題はここでOK。</p>":"<p>答えを比べてから、必要ならもう一度「気づき」に戻れます。</p>";
    }else{
      els.feedbackTitle.textContent=correct?(state.streak>=3?`${state.streak}問連続。見え方が安定してきた。`:"役割を見つけられた。"):"違ったところだけ、確認する。";
      els.feedbackBody.innerHTML=correct
        ?`<p>この文の骨組みは <strong>${sentence.pattern==="M"?(sentence.basePattern+" ＋ M"):sentence.pattern}</strong>。今の見方で合っています。</p>`
        :`<p>全部をやり直す必要はありません。下の答えと比べて、<strong>違ったところだけ</strong>確認できます。</p>`;
    }
    renderAnswerStrip();
    const canRetry=opts.practiceSession&&!correct;
    els.reviewRetryBtn.classList.toggle("hidden",!canRetry);
    els.nextBtn.querySelector("span").textContent=opts.practiceSession?(practiceSession.results.length>=PRACTICE_LENGTH?"5問の結果を見る":"次の問題"):(state.completed?"まとめへ":"次へ");
    nextAction=opts.practiceSession?"practiceNext":(state.completed?"complete":"question");
  }

  function showDiscoveryFeedback(stage){
    hideMainCards();show(els.feedbackCard);els.feedbackCard.className="feedback-card is-discovery";els.feedbackIcon.textContent=stage.newRole||"＋";
    els.feedbackKicker.textContent="NEW RULE";els.feedbackPattern.textContent=stage.label;els.feedbackTitle.textContent="今までと少し違う。そこが新しいルール。";
    const roleNote=stage.newRole
      ?`<div class="discovery-box"><div class="unlock-line"><span class="unlock-role">${escapeHtml(stage.newRole)}</span><div class="unlock-copy"><b>${escapeHtml(C.roleLong[stage.newRole])} を発見</b><span>NEW ROLE UNLOCKED</span></div></div><div>${escapeHtml(stage.explain)}</div></div>`
      :`<div class="discovery-box"><div class="unlock-line"><span class="unlock-role">＋</span><div class="unlock-copy"><b>${escapeHtml(stage.discoveryTitle)}</b><span>NEW PATTERN FOUND</span></div></div><div>${escapeHtml(stage.explain)}</div></div>`;
    const compare=stage.compare?`<div class="compare-table"><div class="compare-cell">${escapeHtml(stage.compare[0])}</div><div class="compare-arrow">↓ 比べる</div><div class="compare-cell">${escapeHtml(stage.compare[1])}</div></div>`:"";
    els.feedbackBody.innerHTML=`<p>答えが合っていたかどうかより、<strong>「いつもと違う」部分に出会ったこと</strong>が今回のポイントです。</p>${roleNote}${compare}<div class="discovery-saved"><strong>気づきノートに保存しました。</strong> わからなくなったら、いつでも戻れます。</div>`;
    renderAnswerStrip();hide(els.reviewRetryBtn);els.nextBtn.querySelector("span").textContent="次へ";nextAction="question";
  }

  function handleNext(){
    haptic("tap");
    if(nextAction==="practiceNext"){
      if(practiceSession&&practiceSession.results.length>=PRACTICE_LENGTH) showPracticeSummary();else newPracticeQuestion();
    }else if(nextAction==="complete") showComplete();else newDiscoveryQuestion();
    scrollTopSoft();
  }

  function retryCurrentPracticeQuestion(){
    if(screenMode!=="practice"||!practiceSession||!sentence) return;
    practiceSession.retrying=true;assignments=Array(sentence.parts.length).fill(null);selectedRole="S";hideMainCards();show(els.gameCard);renderQuestion(true);renderPalette();renderSentence();renderHints();updateCheck();refreshHeader();scrollTopSoft();
  }

  function renderAnswerStrip(){els.answerStrip.innerHTML="";sentence.parts.forEach(p=>{const item=document.createElement("div");item.className="answer-item";item.innerHTML=`<span>${escapeHtml(p.text)}</span><strong>${p.role}</strong>`;els.answerStrip.appendChild(item);});}

  function showPracticeSummary(){
    if(!practiceSession) return;
    hideMainCards();show(els.practiceCompleteCard);screenMode="practice-summary";
    els.practiceScore.innerHTML=`${practiceSession.correct}<span>/${PRACTICE_LENGTH}</span>`;
    const c=practiceSession.correct;
    els.practiceCompleteMessage.textContent=c===5?"5問とも、自分で見分けられた。今日の練習はここで十分。":c>=3?"できた規則が増えている。迷ったところだけ、次の練習でまた出てきます。":"5問やったことで、次に練習する場所が見えた。わからないところは気づきに戻れます。";
    els.practiceResultList.innerHTML="";
    practiceSession.results.forEach((r,i)=>{
      const row=document.createElement("div");row.className=`practice-result ${r.correct?"is-good":"is-miss"}`;
      const level=C.masteryLevel(statFor(r.pattern));
      row.innerHTML=`<span class="result-no">${i+1}</span><b>${escapeHtml(r.label)}</b><span class="result-state">${r.correct?"できた":"もう一度"}</span><small>${escapeHtml(level.label)}</small>`;
      els.practiceResultList.appendChild(row);
    });
    practiceSession=null;refreshHeader();scrollTopSoft();
  }

  function showComplete(){hideMainCards();show(els.completeCard);screenMode="complete";refreshHeader();scrollTopSoft();}
  function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]));}

  init();
})();
