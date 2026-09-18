(function(){
  const C=window.EnglishDiscoveryCore;
  const G=window.ED_ROLE_GUIDE;
  const H=window.ED_CHALLENGE_BANK;
  if(!G) throw new Error("ED_ROLE_GUIDE is required");
  if(!H) throw new Error("ED_CHALLENGE_BANK is required");
  const STORAGE_KEY="english_rule_discovery_v020";
  const LEGACY_KEYS=["english_rule_discovery_v016","english_rule_discovery_v015","english_rule_discovery_v014","english_rule_discovery_v013","english_rule_discovery_v012","english_rule_discovery_v011","english_rule_discovery_v010"];
  const PRACTICE_LENGTH=5;
  const $=id=>document.getElementById(id);
  const els={
    homeBtn:$("homeBtn"),notebookBtn:$("notebookBtn"),quickNotebookBtn:$("quickNotebookBtn"),notebookPanel:$("notebookPanel"),notebookBackdrop:$("notebookBackdrop"),notebookCloseBtn:$("notebookCloseBtn"),notebookReturnBtn:$("notebookReturnBtn"),notebookList:$("notebookList"),notebookCount:$("notebookCount"),
    settingsBtn:$("settingsBtn"),settingsPanel:$("settingsPanel"),settingsBackdrop:$("settingsBackdrop"),settingsCloseBtn:$("settingsCloseBtn"),
    gradeSelect:$("gradeSelect"),termSelect:$("termSelect"),hintToggle:$("hintToggle"),applySettingsBtn:$("applySettingsBtn"),resetProgressBtn:$("resetProgressBtn"),
    scopeText:$("scopeText"),discoveredText:$("discoveredText"),successCount:$("successCount"),streakCount:$("streakCount"),ruleMap:$("ruleMap"),
    homeCard:$("homeCard"),discoveryModeBtn:$("discoveryModeBtn"),discoveryModeTitle:$("discoveryModeTitle"),discoveryModeText:$("discoveryModeText"),practiceModeBtn:$("practiceModeBtn"),learningModeBtn:$("learningModeBtn"),challengeModeBtn:$("challengeModeBtn"),challengeModeText:$("challengeModeText"),challengeModeArrow:$("challengeModeArrow"),homeNotebookBtn:$("homeNotebookBtn"),masteryList:$("masteryList"),
    learningCard:$("learningCard"),learningSummary:$("learningSummary"),learningRoleTabs:$("learningRoleTabs"),learningRolePanel:$("learningRolePanel"),comparisonIntro:$("comparisonIntro"),comparisonRows:$("comparisonRows"),comparisonConclusion:$("comparisonConclusion"),
    challengeIntroCard:$("challengeIntroCard"),challengeStartBtn:$("challengeStartBtn"),challengePlayCard:$("challengePlayCard"),challengeTypeLabel:$("challengeTypeLabel"),challengeQuestionTitle:$("challengeQuestionTitle"),challengeQuestionLead:$("challengeQuestionLead"),challengeHintBtn:$("challengeHintBtn"),challengeHintBox:$("challengeHintBox"),challengeProgress:$("challengeProgress"),challengePrompt:$("challengePrompt"),challengeWork:$("challengeWork"),challengeControls:$("challengeControls"),challengeCheckBtn:$("challengeCheckBtn"),challengeFeedbackCard:$("challengeFeedbackCard"),challengeFeedbackKicker:$("challengeFeedbackKicker"),challengeFeedbackPattern:$("challengeFeedbackPattern"),challengeFeedbackMark:$("challengeFeedbackMark"),challengeFeedbackTitle:$("challengeFeedbackTitle"),challengeFeedbackAnswer:$("challengeFeedbackAnswer"),challengeFeedbackInsight:$("challengeFeedbackInsight"),challengeNextBtn:$("challengeNextBtn"),challengeCompleteCard:$("challengeCompleteCard"),challengeScore:$("challengeScore"),challengeCompleteTitle:$("challengeCompleteTitle"),challengeCompleteMessage:$("challengeCompleteMessage"),challengeResultList:$("challengeResultList"),challengeAgainBtn:$("challengeAgainBtn"),challengeHomeBtn:$("challengeHomeBtn"),
    introCard:$("introCard"),startBtn:$("startBtn"),gameCard:$("gameCard"),questionKicker:$("questionKicker"),questionTitle:$("questionTitle"),questionNumber:$("questionNumber"),practiceProgress:$("practiceProgress"),discoveryStepBar:$("discoveryStepBar"),discoveryStepFill:$("discoveryStepFill"),discoveryStepText:$("discoveryStepText"),practiceInsight:$("practiceInsight"),
    wordHintBtn:$("wordHintBtn"),hintBox:$("hintBox"),sentenceArea:$("sentenceArea"),rolePalette:$("rolePalette"),selectedRoleText:$("selectedRoleText"),
    clearBtn:$("clearBtn"),checkBtn:$("checkBtn"),feedbackCard:$("feedbackCard"),feedbackIcon:$("feedbackIcon"),feedbackKicker:$("feedbackKicker"),feedbackPattern:$("feedbackPattern"),feedbackTitle:$("feedbackTitle"),feedbackBody:$("feedbackBody"),
    answerStrip:$("answerStrip"),reviewRetryBtn:$("reviewRetryBtn"),nextBtn:$("nextBtn"),completeCard:$("completeCard"),challengeFromCompleteBtn:$("challengeFromCompleteBtn"),continueMixedBtn:$("continueMixedBtn"),
    practiceCompleteCard:$("practiceCompleteCard"),practiceScore:$("practiceScore"),practiceCompleteMessage:$("practiceCompleteMessage"),practiceResultList:$("practiceResultList"),practiceAgainBtn:$("practiceAgainBtn"),practiceNotebookBtn:$("practiceNotebookBtn"),practiceHomeBtn:$("practiceHomeBtn"),toast:$("toast")
  };

  const defaultState=()=>({
    grade:1,term:1,hints:true,started:false,stageIndex:0,phase:"practice",
    currentPatternCorrect:0,successCount:0,attemptCount:0,streak:0,bestStreak:0,completed:false,
    practiceStats:{},challengeBest:0,challengeRuns:0,studyDays:[]
  });

  let state=loadState();
  let screenMode=state.started?"home":"onboarding";
  let sentence=null,assignments=[],selectedRole="S",nextAction="question",toastTimer=null;
  let practiceSession=null,notebookReturnAction=null,learningRole="S";
  let challengeSession=null,challengeSelection=null,challengeAssignments=[],challengeSelectedRole="S",challengeOrder=[],challengeOrderPool=[];

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
  function saveState(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}catch(e){}}
  function dayKey(ts=Date.now()){const d=new Date(ts);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;}
  function recordStudyDay(){const days=new Set(Array.isArray(state.studyDays)?state.studyDays:[]);days.add(dayKey());state.studyDays=[...days].sort().slice(-60);}
  function dayStreak(){const days=new Set(Array.isArray(state.studyDays)?state.studyDays:[]);let n=0,d=new Date();for(;;){const k=dayKey(d.getTime());if(days.has(k)){n++;d.setDate(d.getDate()-1);continue;}if(n===0){d.setDate(d.getDate()-1);const y=dayKey(d.getTime());if(days.has(y)){n++;d.setDate(d.getDate()-1);continue;}}break;}return n;}
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
    const header=document.querySelector(".header-message");
    if(header){
      const small=header.querySelector("small"),strong=header.querySelector("strong");
      const labels={
        home:["今日も、","ことばの中に発見を。"],onboarding:["今日も、","ことばの中に発見を。"],
        discovery:["DISCOVERY 01","文のしくみを見つけよう"],practice:["PRACTICE","5問だけ練習する"],
        learning:["DISCOVERY LAB","S・V・O・C・Mを学ぶ"],
        challenge:["CHALLENGE","難問にチャレンジ"],"challenge-intro":["CHALLENGE","難問にチャレンジ"],
        "challenge-feedback":["CHALLENGE","見つけたしくみを確認"],"challenge-summary":["CHALLENGE","結果を振り返る"],
        complete:["DISCOVERED","見つけたしくみをつなぐ"],"practice-summary":["PRACTICE","今日の5問を振り返る"]
      };
      const pair=labels[screenMode]||["QUIET DISCOVERY","英語のしくみ発見"];
      if(small) small.textContent=pair[0]; if(strong) strong.textContent=pair[1];
    }
    els.scopeText.textContent=`中${state.grade}・${state.term}学期まで`;
    els.discoveredText.textContent=discoveredLabels();
    els.successCount.textContent=state.successCount;
    els.streakCount.textContent=screenMode==="home"?dayStreak():(state.streak||0);
    els.gradeSelect.value=String(state.grade);els.termSelect.value=String(state.term);els.hintToggle.checked=!!state.hints;
    els.homeBtn.classList.toggle("hidden",!state.started||screenMode==="home");
    els.settingsBtn.classList.toggle("hidden",screenMode!=="home"&&screenMode!=="onboarding");
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
    const challengeOpen=!!state.completed;
    els.challengeModeBtn.classList.toggle("is-locked",!challengeOpen);
    els.challengeModeBtn.setAttribute("aria-disabled",String(!challengeOpen));
    if(challengeOpen){
      els.challengeModeText.textContent=state.challengeBest>0?`高校・大学レベルに挑戦。BEST ${state.challengeBest}/5。`:`高校・大学レベルの英文を、中学で学んだ見方で攻略する。`;
      els.challengeModeArrow.textContent="→";
    }else{
      els.challengeModeText.textContent="5文型＋Mまで見つけるとOPEN。学んだ意味を試す場所。";
      els.challengeModeArrow.textContent="LOCK";
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
  function hideMainCards(){[els.introCard,els.homeCard,els.learningCard,els.gameCard,els.feedbackCard,els.completeCard,els.practiceCompleteCard,els.challengeIntroCard,els.challengePlayCard,els.challengeFeedbackCard,els.challengeCompleteCard].forEach(hide);}
  function haptic(kind="tap"){
    if(!navigator.vibrate) return;
    const patterns={tap:8,good:12,bad:[22,30,22],discover:[12,40,18]};
    try{navigator.vibrate(patterns[kind]||8);}catch(e){}
  }
  function showToast(text){clearTimeout(toastTimer);els.toast.textContent=text;show(els.toast);toastTimer=setTimeout(()=>hide(els.toast),1700);}
  function scrollTopSoft(){window.scrollTo({top:0,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});}

  function roleCss(role){return `role-${String(role).toLowerCase()}`;}

  function highlightFocus(sentence,focus){
    const safeSentence=escapeHtml(sentence),safeFocus=escapeHtml(focus);
    const idx=safeSentence.indexOf(safeFocus);
    if(idx<0) return safeSentence;
    return `${safeSentence.slice(0,idx)}<mark>${safeFocus}</mark>${safeSentence.slice(idx+safeFocus.length)}`;
  }

  function renderLearningSummary(){
    els.learningSummary.innerHTML="";
    G.summary.forEach(item=>{
      const card=document.createElement("button");card.type="button";card.className=`learning-summary-card ${roleCss(item.role)}`;
      card.setAttribute("aria-label",`${item.role} ${item.name}を詳しく見る`);
      card.innerHTML=`<span class="summary-role">${escapeHtml(item.role)}</span><div><b>${escapeHtml(item.formula)}</b><small>${escapeHtml(item.question)}</small></div>`;
      card.addEventListener("click",()=>{learningRole=item.role;renderLearningRole();els.learningRoleTabs.scrollIntoView({block:"start",behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});haptic("tap");});
      els.learningSummary.appendChild(card);
    });
  }

  function renderLearningTabs(){
    els.learningRoleTabs.innerHTML="";
    ["S","V","O","C","M"].forEach(role=>{
      const data=G.roles[role],b=document.createElement("button");b.type="button";b.role="tab";b.className=`learning-tab ${roleCss(role)}${role===learningRole?" active":""}`;
      b.setAttribute("aria-selected",String(role===learningRole));b.innerHTML=`<strong>${role}</strong><span>${escapeHtml(data.name)}</span>`;
      b.addEventListener("click",()=>{learningRole=role;renderLearningRole();haptic("tap");});els.learningRoleTabs.appendChild(b);
    });
  }

  function renderLearningRole(){
    renderLearningTabs();
    const data=G.roles[learningRole];
    const patterns=data.patterns.map((p,i)=>{
      const examples=p.examples.map(x=>`<span>${escapeHtml(x)}</span>`).join("");
      return `<section class="role-pattern-item"><div class="pattern-top"><span class="pattern-number">${String(i+1).padStart(2,"0")}</span><div><div class="pattern-label-line"><h3>${escapeHtml(p.label)}</h3><em class="pattern-level ${p.level==="基本"?"is-basic":"is-later"}">${escapeHtml(p.level)}</em></div><div class="pattern-chips">${examples}</div></div></div><div class="pattern-example"><span>EXAMPLE</span><p>${highlightFocus(p.sentence,p.focus)}</p></div><p class="pattern-note">${escapeHtml(p.note)}</p></section>`;
    }).join("");
    els.learningRolePanel.className=`learning-role-panel ${roleCss(learningRole)}`;
    els.learningRolePanel.innerHTML=`<header class="learning-role-head"><div class="role-big">${learningRole}</div><div><span>${escapeHtml(data.english)}</span><h2>${escapeHtml(data.name)} <small>${escapeHtml(data.question)}</small></h2></div></header><h3 class="role-headline">${escapeHtml(data.headline)}</h3><p class="role-description">${escapeHtml(data.description)}</p><div class="role-pattern-list">${patterns}</div><div class="role-tip"><span>LOOK</span><p>${escapeHtml(data.tip)}</p></div>`;
  }

  function renderLearningComparison(){
    const comp=G.comparison;els.comparisonIntro.textContent=comp.intro;els.comparisonRows.innerHTML="";
    comp.rows.forEach(row=>{
      const item=document.createElement("div");item.className=`comparison-role-row ${roleCss(row.role)}`;
      item.innerHTML=`<span class="comparison-role-badge">${escapeHtml(row.role)}</span><div><p>${highlightFocus(row.sentence,row.focus)}</p><small>${escapeHtml(row.reason)}</small></div>`;els.comparisonRows.appendChild(item);
    });
    els.comparisonConclusion.textContent=comp.conclusion;
  }

  function showLearning(){
    if(!state.started) return;
    screenMode="learning";practiceSession=null;hideMainCards();show(els.learningCard);renderLearningSummary();renderLearningRole();renderLearningComparison();refreshHeader();scrollTopSoft();
  }

  function showHome(){
    if(!state.started){screenMode="onboarding";hideMainCards();show(els.introCard);refreshHeader();return;}
    screenMode="home";practiceSession=null;challengeSession=null;hideMainCards();show(els.homeCard);refreshHeader();scrollTopSoft();
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
      card.innerHTML=`<div class="note-card-head"><span class="note-badge">${escapeHtml(stage.label)}</span><div><h3>${escapeHtml(stage.discoveryTitle)}</h3><p>DISCOVERED RULE</p></div></div><p class="note-explain">${escapeHtml(stage.explain)}</p><div class="note-key">${escapeHtml(noteKeyText(stage))}</div>${compare}<div class="note-saved">発見ログに保存済み</div>`;
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

  function applyLocalQAScenario(){
    const host=location.hostname,forced=window.__QA_SCENARIO||"";
    if(!forced&&location.protocol!=="file:"&&host!=="localhost"&&host!=="127.0.0.1") return false;
    const qa=forced||new URLSearchParams(location.search).get("qa");
    if(!qa) return false;
    state={...defaultState(),...state,started:true,grade:1,term:2,hints:true,successCount:12,attemptCount:18,studyDays:[dayKey()]};
    if(qa==="home"){state.stageIndex=3;state.phase="practice";showHome();return true;}
    if(qa==="grammar"){
      state.stageIndex=2;state.phase="practice";screenMode="discovery";hideMainCards();show(els.gameCard);
      sentence=C.generateSentence("SVC",scopeKey(),()=>0);assignments=Array(sentence.parts.length).fill(null);selectedRole="S";
      renderQuestion(false);renderPalette();renderSentence();renderHints();show(els.hintBox);els.wordHintBtn.setAttribute("aria-expanded","true");updateCheck();refreshHeader();scrollTopSoft();return true;
    }
    if(qa==="practice"){
      state.stageIndex=5;state.completed=true;screenMode="practice";practiceSession={results:[{pattern:"SV",label:"SV",correct:true},{pattern:"SVC",label:"SVC",correct:true}],correct:2,usedPatterns:["SV","SVC"],lastSentenceKey:null,retrying:false};
      hideMainCards();show(els.gameCard);sentence=C.generateSentence("SVO",scopeKey(),()=>0);assignments=Array(sentence.parts.length).fill(null);selectedRole="S";
      renderQuestion(false);renderPalette();renderSentence();renderHints();updateCheck();refreshHeader();scrollTopSoft();return true;
    }
    if(qa==="discovered"){
      state.stageIndex=0;state.phase="practice";screenMode="discovery";sentence=C.generateSentence("SVC",scopeKey(),()=>0);assignments=sentence.parts.map(p=>p.role);
      showDiscoveryFeedback(C.STAGES[1]);refreshHeader();scrollTopSoft();return true;
    }
    if(qa==="learning"){state.stageIndex=5;state.completed=true;showLearning();return true;}
    if(qa==="challenge"){state.stageIndex=5;state.completed=true;showChallengeIntro();return true;}
    return false;
  }

  function init(){
    registerEvents();saveState();refreshHeader();
    if(!applyLocalQAScenario()){
      if(state.started) showHome(); else {hideMainCards();show(els.introCard);screenMode="onboarding";refreshHeader();}
    }
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
    els.learningModeBtn.addEventListener("click",()=>{haptic("tap");showLearning();});
    els.challengeModeBtn.addEventListener("click",()=>{haptic("tap");if(!state.completed){showToast("5文型＋Mまで発見すると開きます");return;}showChallengeIntro();});
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
    els.challengeFromCompleteBtn.addEventListener("click",()=>showChallengeIntro());
    els.continueMixedBtn.addEventListener("click",()=>startPracticeSession());
    els.practiceAgainBtn.addEventListener("click",()=>startPracticeSession());
    els.practiceNotebookBtn.addEventListener("click",()=>openNotebook());
    els.practiceHomeBtn.addEventListener("click",showHome);
    els.challengeStartBtn.addEventListener("click",startChallengeSession);
    els.challengeHintBtn.addEventListener("click",()=>{const opening=els.challengeHintBox.classList.contains("hidden");els.challengeHintBox.classList.toggle("hidden");els.challengeHintBtn.setAttribute("aria-expanded",String(opening));haptic("tap");});
    els.challengeCheckBtn.addEventListener("click",submitChallengeAnswer);
    els.challengeNextBtn.addEventListener("click",()=>{if(!challengeSession)return;if(challengeSession.index>=challengeSession.items.length-1)showChallengeSummary();else{challengeSession.index+=1;renderChallengeQuestion();}});
    els.challengeAgainBtn.addEventListener("click",startChallengeSession);
    els.challengeHomeBtn.addEventListener("click",showHome);
  }


  function showChallengeIntro(){
    if(!state.completed){showToast("5文型＋Mまで発見すると開きます");return;}
    screenMode="challenge-intro";practiceSession=null;challengeSession=null;hideMainCards();show(els.challengeIntroCard);refreshHeader();scrollTopSoft();
  }

  function currentChallengeItem(){return challengeSession?.items?.[challengeSession.index]||null;}
  function challengeTypeName(type){return type==="structure"?"文型を見抜く":type==="gap"?"穴埋め":"並び替え";}
  function challengeTypeCode(type){return type==="structure"?"STRUCTURE":type==="gap"?"GAP FILL":"WORD ORDER";}
  function challengeTransferText(type){
    if(type==="structure") return "長い文でもS・V・O・C・Mを大きく分ける力は、長文読解の土台になります。";
    if(type==="gap") return "空欄の役割が分かると、『名詞か・形容詞か・動詞か』で選択肢を減らせます。";
    return "S→V→O/Cの順番が見えると、単語を全部訳せなくても並び替えの軸を作れます。";
  }

  function startChallengeSession(){
    if(!state.completed) return showChallengeIntro();
    challengeSession={items:H.buildSession(Math.random),index:0,results:[],correct:0};
    screenMode="challenge";renderChallengeQuestion();scrollTopSoft();
  }

  function renderChallengeProgress(){
    if(!challengeSession) return;
    els.challengeProgress.innerHTML="";
    challengeSession.items.forEach((_,i)=>{
      const dot=document.createElement("span");
      if(i<challengeSession.results.length) dot.className=challengeSession.results[i].correct?"done good":"done miss";
      else if(i===challengeSession.index) dot.className="now";
      dot.textContent=String(i+1);els.challengeProgress.appendChild(dot);
    });
  }

  function renderChallengeHints(item){
    const whole=`<div class="challenge-whole-meaning"><b>文全体</b><span>${escapeHtml(item.translation||"")}</span></div>`;
    const vocab=(item.vocab||[]).map(v=>`<div class="hint-row"><div class="hint-wordline"><strong>${escapeHtml(v.en)}</strong><span class="pos-badge">品詞：${escapeHtml(v.pos||"—")}</span></div><span class="hint-ja">${escapeHtml(v.ja)}</span></div>`).join("");
    els.challengeHintBox.innerHTML=whole+vocab;hide(els.challengeHintBox);els.challengeHintBtn.setAttribute("aria-expanded","false");
  }

  function renderChallengeQuestion(){
    const item=currentChallengeItem();if(!item) return;
    hideMainCards();show(els.challengePlayCard);screenMode="challenge";
    challengeSelection=null;challengeAssignments=[];challengeSelectedRole="S";challengeOrder=[];challengeOrderPool=[];
    els.challengeTypeLabel.textContent=challengeTypeCode(item.type);
    els.challengeQuestionTitle.textContent=challengeTypeName(item.type);
    els.challengeQuestionLead.textContent=item.type==="structure"?"知らない語は『単語』で確認。英文の大きなかたまりをS・V・O・C・Mに分けます。":item.type==="gap"?"空欄が文の中で何の役割かを考えて、最も合う語を選びます。":"日本語と文の骨組みを手がかりに、英語のかたまりを正しい順に並べます。";
    renderChallengeProgress();renderChallengeHints(item);renderChallengeTask(item);refreshHeader();scrollTopSoft();
  }

  function renderChallengeTask(item){
    els.challengePrompt.innerHTML="";els.challengeWork.innerHTML="";els.challengeControls.innerHTML="";els.challengeCheckBtn.disabled=true;
    const meta=document.createElement("div");meta.className="challenge-question-meta";meta.innerHTML=`<span>Q ${challengeSession.index+1} / ${challengeSession.items.length}</span><b>${escapeHtml(item.level)}</b>`;els.challengePrompt.appendChild(meta);
    if(item.type==="structure") renderChallengeStructure(item);
    else if(item.type==="gap") renderChallengeGap(item);
    else renderChallengeOrder(item);
  }

  function renderChallengeStructure(item){
    const sentence=document.createElement("div");sentence.className="challenge-sentence-stage";
    const area=document.createElement("div");area.className="challenge-sentence-area";
    if(!challengeAssignments.length) challengeAssignments=Array(item.parts.length).fill(null);
    item.parts.forEach((part,i)=>{
      const b=document.createElement("button");b.type="button";b.className="challenge-chunk"+(challengeAssignments[i]?` has-role ${roleCss(challengeAssignments[i])}`:"");
      b.innerHTML=`<span class="challenge-assigned">${challengeAssignments[i]||""}</span><span>${escapeHtml(part.text)}</span>`;
      b.addEventListener("click",()=>{challengeAssignments[i]=challengeSelectedRole;renderChallengeStructureOnly(item);haptic("tap");});area.appendChild(b);
    });
    sentence.appendChild(area);els.challengeWork.appendChild(sentence);
    const roleLine=document.createElement("div");roleLine.className="challenge-role-line";roleLine.innerHTML=`<span>SELECT</span><b>${challengeSelectedRole} ${escapeHtml(roleLabel(challengeSelectedRole)[1])}</b><small>英文のかたまりをタップ</small>`;els.challengeWork.appendChild(roleLine);
    const palette=document.createElement("div");palette.className="challenge-role-palette";
    ["S","V","O","C","M"].forEach(role=>{const b=document.createElement("button");b.type="button";b.className=`challenge-role-button ${roleCss(role)}${role===challengeSelectedRole?" active":""}`;b.textContent=role;b.addEventListener("click",()=>{challengeSelectedRole=role;renderChallengeStructureOnly(item);haptic("tap");});palette.appendChild(b);});
    els.challengeControls.appendChild(palette);
    const clear=document.createElement("button");clear.type="button";clear.className="challenge-clear-button";clear.textContent="クリア";clear.addEventListener("click",()=>{challengeAssignments=Array(item.parts.length).fill(null);renderChallengeStructureOnly(item);});els.challengeControls.appendChild(clear);
    els.challengeCheckBtn.disabled=challengeAssignments.some(x=>!x);
  }

  function renderChallengeStructureOnly(item){
    els.challengeWork.innerHTML="";els.challengeControls.innerHTML="";renderChallengeStructure(item);
  }

  function renderChallengeGap(item){
    const line=document.createElement("div");line.className="challenge-gap-sentence";line.innerHTML=`${escapeHtml(item.sentenceBefore)}<mark>□□□□</mark>${escapeHtml(item.sentenceAfter)}`;els.challengeWork.appendChild(line);
    const ja=document.createElement("p");ja.className="challenge-translation";ja.textContent=item.translation;els.challengeWork.appendChild(ja);
    const options=document.createElement("div");options.className="challenge-options";
    H.shuffled(item.options,()=>0.314159).forEach(option=>{const b=document.createElement("button");b.type="button";b.className="challenge-option"+(challengeSelection===option?" selected":"");b.textContent=option;b.addEventListener("click",()=>{challengeSelection=option;renderChallengeGapOnly(item);haptic("tap");});options.appendChild(b);});els.challengeControls.appendChild(options);
    els.challengeCheckBtn.disabled=!challengeSelection;
  }

  function renderChallengeGapOnly(item){els.challengeWork.innerHTML="";els.challengeControls.innerHTML="";renderChallengeGap(item);}

  function renderChallengeOrder(item){
    if(!challengeOrderPool.length) challengeOrderPool=H.shuffled(item.answer,Math.random);
    const ja=document.createElement("div");ja.className="challenge-order-translation";ja.innerHTML=`<span>JAPANESE</span><p>${escapeHtml(item.translation)}</p>`;els.challengeWork.appendChild(ja);
    const answer=document.createElement("div");answer.className="challenge-order-answer";
    if(!challengeOrder.length) answer.innerHTML='<span class="order-placeholder">英語のかたまりを順にタップ</span>';
    else challengeOrder.forEach((token,i)=>{const chip=document.createElement("button");chip.type="button";chip.className="order-selected-chip";chip.innerHTML=`<small>${i+1}</small>${escapeHtml(token)}`;chip.addEventListener("click",()=>{challengeOrder.splice(i,1);renderChallengeOrderOnly(item);});answer.appendChild(chip);});
    els.challengeWork.appendChild(answer);
    const pool=document.createElement("div");pool.className="challenge-order-pool";
    challengeOrderPool.forEach(token=>{const used=challengeOrder.includes(token),b=document.createElement("button");b.type="button";b.className="order-pool-chip"+(used?" used":"");b.disabled=used;b.textContent=token;b.addEventListener("click",()=>{challengeOrder.push(token);renderChallengeOrderOnly(item);haptic("tap");});pool.appendChild(b);});els.challengeControls.appendChild(pool);
    const clear=document.createElement("button");clear.type="button";clear.className="challenge-clear-button";clear.textContent="並びをクリア";clear.addEventListener("click",()=>{challengeOrder=[];renderChallengeOrderOnly(item);});els.challengeControls.appendChild(clear);
    els.challengeCheckBtn.disabled=challengeOrder.length!==item.answer.length;
  }

  function renderChallengeOrderOnly(item){els.challengeWork.innerHTML="";els.challengeControls.innerHTML="";renderChallengeOrder(item);}

  function submitChallengeAnswer(){
    recordStudyDay();
    const item=currentChallengeItem();if(!item||!challengeSession) return;
    let correct=false;
    if(item.type==="structure") correct=item.parts.every((p,i)=>challengeAssignments[i]===p.role);
    else if(item.type==="gap") correct=challengeSelection===item.answer;
    else correct=challengeOrder.join("\u241f")===item.answer.join("\u241f");
    challengeSession.results.push({id:item.id,type:item.type,correct,pattern:item.pattern});if(correct) challengeSession.correct+=1;
    haptic(correct?"good":"bad");showChallengeFeedback(item,correct);
  }

  function challengeCorrectAnswerHtml(item){
    if(item.type==="structure") return `<div class="challenge-structure-answer">${item.parts.map(p=>`<span><b>${escapeHtml(p.role)}</b>${escapeHtml(p.text)}</span>`).join("")}</div>`;
    if(item.type==="gap") return `<div class="challenge-gap-answer">${escapeHtml(item.sentenceBefore)}<strong>${escapeHtml(item.answer)}</strong>${escapeHtml(item.sentenceAfter)}</div>`;
    return `<div class="challenge-order-correct">${item.answer.map((x,i)=>`<span><small>${i+1}</small>${escapeHtml(x)}</span>`).join("")}</div>`;
  }

  function showChallengeFeedback(item,correct){
    hideMainCards();show(els.challengeFeedbackCard);screenMode="challenge-feedback";
    els.challengeFeedbackCard.classList.toggle("is-wrong",!correct);els.challengeFeedbackMark.textContent=correct?"✓":"↺";
    els.challengeFeedbackKicker.textContent=correct?"CHALLENGE CLEAR":"STRUCTURE CHECK";els.challengeFeedbackPattern.textContent=item.pattern;
    els.challengeFeedbackTitle.textContent=correct?"難しい英文でも、見方が通用した。":"単語が難しくても、骨組みに戻ればいい。";
    els.challengeFeedbackAnswer.innerHTML=challengeCorrectAnswerHtml(item);
    els.challengeFeedbackInsight.innerHTML=`<span>中学の見方が効くポイント</span><p>${escapeHtml(item.insight)}</p><div>${escapeHtml(challengeTransferText(item.type))}</div>`;
    els.challengeNextBtn.innerHTML=challengeSession.index>=challengeSession.items.length-1?'結果を見る <span>→</span>':'次の難問へ <span>→</span>';
    refreshHeader();scrollTopSoft();
  }

  function showChallengeSummary(){
    if(!challengeSession) return;
    hideMainCards();show(els.challengeCompleteCard);screenMode="challenge-summary";
    const score=challengeSession.correct;state.challengeRuns=Number(state.challengeRuns||0)+1;state.challengeBest=Math.max(Number(state.challengeBest||0),score);saveState();
    els.challengeScore.textContent=String(score);
    els.challengeCompleteTitle.textContent=score===5?"高校・大学レベルでも、骨組みを使えた。":score>=3?"難しい英文でも、見方は通用した。":"難しい英文にも、戻れる場所がある。";
    els.challengeCompleteMessage.textContent=score===5?"単語や文法が難しくなっても、S・V・O・C・Mの見方はそのまま使えます。":score>=3?"全部の単語を知らなくても、文の役割を使って考えられています。迷った問題は次回また別の形で挑戦できます。":"これは単語テストではありません。意味の補助を使いながら、S・V・O・C・Mに戻ること自体が攻略法です。";
    els.challengeResultList.innerHTML="";
    challengeSession.results.forEach((r,i)=>{const row=document.createElement("div");row.className=`challenge-result-row ${r.correct?"is-good":"is-miss"}`;row.innerHTML=`<span>${i+1}</span><b>${escapeHtml(challengeTypeName(r.type))}</b><small>${escapeHtml(r.pattern)}</small><em>${r.correct?"CLEAR":"REVIEW"}</em>`;els.challengeResultList.appendChild(row);});
    refreshHeader();scrollTopSoft();
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
      hide(els.discoveryStepBar);
      const number=retry?Math.max(1,practiceSession.results.length):Math.min(PRACTICE_LENGTH,practiceSession.results.length+1);
      els.questionNumber.textContent=`Q ${number} / ${PRACTICE_LENGTH}`;
      els.questionTitle.textContent=retry?"同じ文を、もう一度見る":"見つけた規則を使ってみる";
      els.questionKicker.textContent=retry?"気づきを見たあとなら、見え方が変わっているかも。":"5問だけ。苦手な規則は少し多めに出ます。";
      renderPracticeProgress(retry);show(els.practiceProgress);
      if(practiceSession.correct>=2)show(els.practiceInsight);else hide(els.practiceInsight);
    }else{
      hide(els.practiceProgress);hide(els.practiceInsight);show(els.discoveryStepBar);
      const step=state.phase==="discovery"?3:Math.min(3,Math.max(1,Number(state.currentPatternCorrect||0)+1));
      els.discoveryStepText.textContent=`${step} / 3`;
      els.discoveryStepFill.style.width=`${Math.round(step/3*100)}%`;
      els.questionNumber.textContent=`Q ${String(state.attemptCount+1).padStart(2,"0")}`;
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
    const known=screenMode==="practice"?C.knownRolesForStage(currentStageMax()):(state.phase==="discovery"?C.discoveryRolesBefore(state.stageIndex+1):C.knownRolesForStage(state.stageIndex));
    const set=new Set(known);return ["S","V","O","C","M"].filter(r=>set.has(r));
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
    const start=Math.max(0,sentence.parts.findIndex(p=>p.role==="C"));
    els.hintBox.innerHTML=`<div class="word-lookup-tabs" aria-label="意味を見る単語">${sentence.parts.map((p,i)=>`<button type="button" data-lookup="${i}" class="${i===start?"active":""}">${escapeHtml(p.text)}</button>`).join("")}</div><div class="word-lookup-detail" id="wordLookupDetail"></div>`;
    const detail=els.hintBox.querySelector("#wordLookupDetail");
    const select=i=>{const p=sentence.parts[i];els.hintBox.querySelectorAll("[data-lookup]").forEach(b=>b.classList.toggle("active",Number(b.dataset.lookup)===i));detail.innerHTML=`<div><strong>${escapeHtml(p.text)}</strong><button type="button" class="lookup-audio" aria-label="${escapeHtml(p.text)}の音を聞く">◖)))</button></div><b>${escapeHtml(p.ja)}</b><span class="pos-badge">品詞：${escapeHtml(p.pos||"—")}</span>`;detail.querySelector(".lookup-audio")?.addEventListener("click",()=>{if("speechSynthesis" in window){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(p.text);u.lang="en-US";u.rate=.78;speechSynthesis.speak(u);}haptic("tap");});};
    els.hintBox.querySelectorAll("[data-lookup]").forEach(b=>b.addEventListener("click",()=>select(Number(b.dataset.lookup))));select(start);
    hide(els.hintBox);els.wordHintBtn.setAttribute("aria-expanded","false");if(state.hints) show(els.wordHintBtn);else hide(els.wordHintBtn);
  }
  function updateCheck(){els.checkBtn.disabled=assignments.some(x=>!x);}

  function submitAnswer(){
    recordStudyDay();
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
    els.feedbackKicker.textContent=opts.retry?(correct?"FOUND AGAIN":"ONE MORE LOOK"):(correct?"FOUND":"CHECK");
    els.feedbackPattern.textContent=sentence.pattern==="M"?(sentence.basePattern+" + M"):sentence.pattern;
    if(opts.retry){
      els.feedbackTitle.textContent=correct?"気づきを見て、もう一度できた。":"まだ迷ってOK。見方をもう一度使ってみる。";
      els.feedbackBody.innerHTML=correct?"<p>同じ文でも、ルールを確認してから見ると整理できます。この問題はここでOK。</p>":"<p>答えを比べてから、必要ならもう一度「気づき」に戻れます。</p>";
    }else{
      els.feedbackTitle.textContent=correct?(state.streak>=3?`${state.streak}回、同じしくみを見抜けた。`:"見つけた。今の見方で合っている。"):"違ったところだけ、確認する。";
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
    els.feedbackKicker.textContent="DISCOVERED";els.feedbackPattern.textContent=stage.label;els.feedbackTitle.textContent="つながった。新しいしくみを発見。";
    const roleNote=stage.newRole
      ?`<div class="discovery-box"><div class="unlock-line"><span class="unlock-role">${escapeHtml(stage.newRole)}</span><div class="unlock-copy"><b>${escapeHtml(C.roleLong[stage.newRole])} を発見</b><span>NEW CLUE CONNECTED</span></div></div><div>${escapeHtml(stage.explain)}</div></div>`
      :`<div class="discovery-box"><div class="unlock-line"><span class="unlock-role">＋</span><div class="unlock-copy"><b>${escapeHtml(stage.discoveryTitle)}</b><span>NEW CLUE CONNECTED</span></div></div><div>${escapeHtml(stage.explain)}</div></div>`;
    const compare=stage.compare?`<div class="compare-table"><div class="compare-cell">${escapeHtml(stage.compare[0])}</div><div class="compare-arrow">↓ 比べる</div><div class="compare-cell">${escapeHtml(stage.compare[1])}</div></div>`:"";
    els.feedbackBody.innerHTML=`<p>正解だったかより、<strong>「今までと違う」と気づけたこと</strong>が今回の発見です。</p>${roleNote}${compare}<div class="discovery-saved"><strong>発見ログに保存しました。</strong> わからなくなったら、いつでもこの気づきに戻れます。</div>`;
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
