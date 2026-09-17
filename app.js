(function(){
  const C=window.EnglishDiscoveryCore;
  const STORAGE_KEY="english_rule_discovery_v012";
  const LEGACY_KEYS=["english_rule_discovery_v011","english_rule_discovery_v010"];
  const $=id=>document.getElementById(id);
  const els={
    notebookBtn:$("notebookBtn"),quickNotebookBtn:$("quickNotebookBtn"),notebookPanel:$("notebookPanel"),notebookBackdrop:$("notebookBackdrop"),notebookCloseBtn:$("notebookCloseBtn"),notebookReturnBtn:$("notebookReturnBtn"),notebookList:$("notebookList"),notebookCount:$("notebookCount"),
    settingsBtn:$("settingsBtn"),settingsPanel:$("settingsPanel"),settingsBackdrop:$("settingsBackdrop"),settingsCloseBtn:$("settingsCloseBtn"),
    gradeSelect:$("gradeSelect"),termSelect:$("termSelect"),hintToggle:$("hintToggle"),applySettingsBtn:$("applySettingsBtn"),resetProgressBtn:$("resetProgressBtn"),
    scopeText:$("scopeText"),discoveredText:$("discoveredText"),successCount:$("successCount"),streakCount:$("streakCount"),ruleMap:$("ruleMap"),
    introCard:$("introCard"),startBtn:$("startBtn"),gameCard:$("gameCard"),questionKicker:$("questionKicker"),questionTitle:$("questionTitle"),questionNumber:$("questionNumber"),questionMode:$("questionMode"),
    wordHintBtn:$("wordHintBtn"),hintBox:$("hintBox"),sentenceArea:$("sentenceArea"),rolePalette:$("rolePalette"),selectedRoleText:$("selectedRoleText"),
    clearBtn:$("clearBtn"),checkBtn:$("checkBtn"),feedbackCard:$("feedbackCard"),feedbackIcon:$("feedbackIcon"),feedbackKicker:$("feedbackKicker"),feedbackPattern:$("feedbackPattern"),feedbackTitle:$("feedbackTitle"),feedbackBody:$("feedbackBody"),
    answerStrip:$("answerStrip"),nextBtn:$("nextBtn"),completeCard:$("completeCard"),continueMixedBtn:$("continueMixedBtn"),toast:$("toast")
  };

  const defaultState=()=>({
    grade:1,term:1,hints:true,started:false,stageIndex:0,phase:"practice",
    currentPatternCorrect:0,successCount:0,attemptCount:0,streak:0,bestStreak:0,completed:false,mixedMode:false
  });

  let state=loadState(),sentence=null,assignments=[],selectedRole="S",nextAction="question",toastTimer=null;

  function loadState(){
    try{
      const raw=localStorage.getItem(STORAGE_KEY)||LEGACY_KEYS.map(k=>localStorage.getItem(k)).find(Boolean);
      return raw?{...defaultState(),...JSON.parse(raw)}:defaultState();
    }catch(e){return defaultState();}
  }
  function saveState(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}
  function scopeKey(){return C.levelKey(state.grade,state.term);}
  function discoveredLabels(){
    const max=state.completed?C.STAGES.length-1:state.stageIndex;
    return C.STAGES.slice(0,max+1).map(s=>s.label).join(" → ");
  }
  function currentStageMax(){return state.completed?C.STAGES.length-1:state.stageIndex;}
  function refreshHeader(){
    els.scopeText.textContent=`中${state.grade}・${state.term}学期まで`;
    els.discoveredText.textContent=discoveredLabels();
    els.successCount.textContent=state.successCount;
    els.streakCount.textContent=state.streak||0;
    els.gradeSelect.value=String(state.grade);els.termSelect.value=String(state.term);els.hintToggle.checked=!!state.hints;
    renderRuleMap();
  }
  function renderRuleMap(){
    const max=currentStageMax();
    els.ruleMap.innerHTML="";
    C.STAGES.forEach((stage,i)=>{
      const isDiscovered=state.completed||i<=max;
      const isDone=i<max||state.completed;
      const isCurrent=!state.completed&&i===max;
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
  function show(el){el.classList.remove("hidden");}
  function hide(el){el.classList.add("hidden");}
  function haptic(kind="tap"){
    if(!navigator.vibrate) return;
    const patterns={tap:8,good:12,bad:[22,30,22],discover:[12,40,18]};
    try{navigator.vibrate(patterns[kind]||8);}catch(e){}
  }
  function showToast(text){
    clearTimeout(toastTimer);els.toast.textContent=text;show(els.toast);
    toastTimer=setTimeout(()=>hide(els.toast),1700);
  }
  function openSettings(){closeNotebook(false);show(els.settingsBackdrop);show(els.settingsPanel);els.settingsBtn.setAttribute("aria-expanded","true");document.body.style.overflow="hidden";setTimeout(()=>els.settingsCloseBtn.focus(),30);}
  function closeSettings(){hide(els.settingsBackdrop);hide(els.settingsPanel);els.settingsBtn.setAttribute("aria-expanded","false");document.body.style.overflow="";}
  function noteKeyText(stage){
    const keys={SV:"S＝だれが・なにが ／ V＝どうする・どんな状態",SVC:"CはSの説明。『S ＝ C』に近いかを見る",SVO:"Oは動作の相手。ふつう『S ＝ O』にはならない",SVOO:"Oが2つ。『人に → ものを』の順で並ぶことがある",SVOC:"OのあとにC。『O ＝ C』になる",M:"Mは追加情報。外しても元の文型の骨組みが残る"};
    return keys[stage.key]||stage.explain;
  }
  function renderNotebook(focusIndex=null){
    const max=currentStageMax();
    const visible=C.STAGES.slice(0,max+1);
    els.notebookCount.textContent=`${visible.length} / ${C.STAGES.length}`;
    els.notebookList.innerHTML="";
    visible.forEach((stage,i)=>{
      const card=document.createElement("article");card.className="note-card"+(focusIndex===i?" is-focus":"");card.id=`note-stage-${i}`;
      const compare=stage.compare?`<div class="note-compare"><div class="note-example"><strong>例</strong> ${escapeHtml(stage.compare[0])}</div><div class="note-example"><strong>見方</strong> ${escapeHtml(stage.compare[1])}</div></div>`:"";
      card.innerHTML=`<div class="note-card-head"><span class="note-badge">${escapeHtml(stage.label)}</span><div><h3>${escapeHtml(stage.discoveryTitle)}</h3><p>DISCOVERED RULE</p></div></div><p class="note-explain">${escapeHtml(stage.explain)}</p><div class="note-key">${escapeHtml(noteKeyText(stage))}</div>${compare}<div class="note-saved">気づきノートに保存済み</div>`;
      els.notebookList.appendChild(card);
    });
  }
  function openNotebook(focusIndex=null){
    closeSettings();renderNotebook(focusIndex);show(els.notebookBackdrop);show(els.notebookPanel);els.notebookBtn.setAttribute("aria-expanded","true");document.body.style.overflow="hidden";
    setTimeout(()=>{
      if(focusIndex!==null){const target=$(`note-stage-${focusIndex}`);target?.scrollIntoView({block:"start",behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});}
      else els.notebookCloseBtn.focus();
    },50);
    haptic("tap");
  }
  function closeNotebook(restoreFocus=true){hide(els.notebookBackdrop);hide(els.notebookPanel);els.notebookBtn.setAttribute("aria-expanded","false");document.body.style.overflow="";if(restoreFocus) els.notebookBtn.focus();}

  function init(){
    refreshHeader();
    if(state.started){hide(els.introCard);if(state.completed&&!state.mixedMode) show(els.completeCard);else newQuestion();}
    registerEvents();
    if("serviceWorker" in navigator&&location.protocol!=="file:"){navigator.serviceWorker.register("./sw.js").catch(()=>{});}
  }

  function registerEvents(){
    els.notebookBtn.addEventListener("click",()=>openNotebook());els.quickNotebookBtn.addEventListener("click",()=>openNotebook(currentStageMax()));els.notebookCloseBtn.addEventListener("click",()=>closeNotebook());els.notebookReturnBtn.addEventListener("click",()=>closeNotebook());els.notebookBackdrop.addEventListener("click",()=>closeNotebook());
    els.settingsBtn.addEventListener("click",openSettings);els.settingsCloseBtn.addEventListener("click",closeSettings);els.settingsBackdrop.addEventListener("click",closeSettings);
    document.addEventListener("keydown",e=>{if(e.key==="Escape"){if(!els.notebookPanel.classList.contains("hidden")) closeNotebook();else if(!els.settingsPanel.classList.contains("hidden")) closeSettings();}});
    els.startBtn.addEventListener("click",()=>{haptic("tap");state.started=true;saveState();hide(els.introCard);newQuestion();scrollTopSoft();});
    els.applySettingsBtn.addEventListener("click",()=>{
      state.grade=Number(els.gradeSelect.value);state.term=Number(els.termSelect.value);state.hints=els.hintToggle.checked;saveState();refreshHeader();closeSettings();showToast("学習範囲を更新しました");
      if(state.started&&(!state.completed||state.mixedMode)) newQuestion();
    });
    els.resetProgressBtn.addEventListener("click",()=>{
      if(confirm("学習記録を最初からにしますか？ 学年・学期の設定は残します。")){
        const g=Number(els.gradeSelect.value),t=Number(els.termSelect.value),h=els.hintToggle.checked;
        state={...defaultState(),grade:g,term:t,hints:h};saveState();refreshHeader();closeSettings();hide(els.gameCard);hide(els.feedbackCard);hide(els.completeCard);show(els.introCard);scrollTopSoft();
      }
    });
    els.wordHintBtn.addEventListener("click",()=>{const opening=els.hintBox.classList.contains("hidden");els.hintBox.classList.toggle("hidden");els.wordHintBtn.setAttribute("aria-expanded",String(opening));haptic("tap");});
    els.clearBtn.addEventListener("click",()=>{assignments=Array(sentence.parts.length).fill(null);renderSentence();updateCheck();haptic("tap");});
    els.checkBtn.addEventListener("click",submitAnswer);
    els.nextBtn.addEventListener("click",()=>{haptic("tap");hide(els.feedbackCard);if(nextAction==="complete") showComplete();else newQuestion();scrollTopSoft();});
    els.continueMixedBtn.addEventListener("click",()=>{state.mixedMode=true;saveState();hide(els.completeCard);newQuestion();scrollTopSoft();});
  }

  function scrollTopSoft(){window.scrollTo({top:0,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});}
  function questionPattern(){
    if(state.mixedMode) return C.pick(["SV","SVC","SVO","SVOO","SVOC","M"]);
    if(state.phase==="discovery") return C.STAGES[state.stageIndex+1].key;
    const current=C.STAGES[state.stageIndex].key;
    if(state.stageIndex===0||Math.random()<0.72) return current;
    return C.pick(C.STAGES.slice(0,state.stageIndex).map(s=>s.key));
  }

  function newQuestion(){
    hide(els.feedbackCard);hide(els.completeCard);show(els.gameCard);
    const pattern=questionPattern(),discoveryBase=(state.phase==="discovery"&&pattern==="M")?"SVC":null;
    sentence=C.generateSentence(pattern,scopeKey(),Math.random,discoveryBase);assignments=Array(sentence.parts.length).fill(null);selectedRole="S";
    els.questionNumber.textContent=`Q ${String(state.attemptCount+1).padStart(2,"0")}`;
    els.questionMode.textContent=state.phase==="discovery"?"UNKNOWN":(sentence.pattern==="M"?(sentence.basePattern+" + ?"):sentence.pattern);
    els.questionTitle.textContent=state.phase==="discovery"?"いつも通り、分けてみる":"英文の役割を見つける";
    els.questionKicker.textContent=state.phase==="discovery"?"見慣れないところがあっても、今わかる範囲でOK。":"役割を選んで、英文のまとまりをタップ。";
    renderPalette();renderSentence();renderHints();updateCheck();
  }

  function currentKnownRoles(){
    if(state.mixedMode||state.completed) return C.knownRolesForStage(C.STAGES.length-1);
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
    hide(els.hintBox);els.wordHintBtn.setAttribute("aria-expanded","false");
    if(state.hints) show(els.wordHintBtn); else hide(els.wordHintBtn);
  }
  function updateCheck(){els.checkBtn.disabled=assignments.some(x=>!x);}

  function submitAnswer(){
    const isDiscovery=!state.mixedMode&&state.phase==="discovery",correct=C.correctAssignments(sentence,assignments);state.attemptCount+=1;
    if(isDiscovery){
      const nextIndex=state.stageIndex+1;state.stageIndex=nextIndex;state.phase="practice";state.currentPatternCorrect=0;state.streak=0;haptic("discover");showDiscoveryFeedback(C.STAGES[nextIndex]);
    }else{
      if(correct){
        state.successCount+=1;state.streak=(state.streak||0)+1;state.bestStreak=Math.max(state.bestStreak||0,state.streak);haptic("good");
        const target=C.STAGES[state.stageIndex]?.key;
        if(sentence.pattern===target&&!state.completed&&!state.mixedMode){state.currentPatternCorrect+=1;if(state.currentPatternCorrect>=3&&state.stageIndex<C.STAGES.length-1) state.phase="discovery";else if(state.currentPatternCorrect>=3&&state.stageIndex===C.STAGES.length-1){state.completed=true;state.mixedMode=false;nextAction="complete";}}
        showPracticeFeedback(true);
      }else{
        state.streak=0;haptic("bad");if(sentence.pattern===C.STAGES[state.stageIndex]?.key&&state.currentPatternCorrect>0) state.currentPatternCorrect-=1;showPracticeFeedback(false);
      }
    }
    saveState();refreshHeader();scrollTopSoft();
  }

  function showPracticeFeedback(correct){
    hide(els.gameCard);show(els.feedbackCard);els.feedbackCard.className="feedback-card"+(correct?"":" is-wrong");els.feedbackIcon.textContent=correct?"✓":"↺";
    els.feedbackKicker.textContent=correct?"CLEAR":"CHECK";els.feedbackPattern.textContent=sentence.pattern==="M"?(sentence.basePattern+" + M"):sentence.pattern;
    els.feedbackTitle.textContent=correct?(state.streak>=3?`${state.streak}問連続。見え方が安定してきた。`:"役割を見つけられた。 "):"違ったところだけ、確認する。";
    els.feedbackBody.innerHTML=correct
      ?`<p>この文の骨組みは <strong>${sentence.pattern==="M"?(sentence.basePattern+" ＋ M"):sentence.pattern}</strong>。今の見方で合っています。</p>`
      :`<p>全部をやり直す必要はありません。下の答えと比べて、<strong>違ったところだけ</strong>見て次へ進みます。</p>`;
    renderAnswerStrip();nextAction=state.completed&&!state.mixedMode?"complete":"question";
  }

  function showDiscoveryFeedback(stage){
    hide(els.gameCard);show(els.feedbackCard);els.feedbackCard.className="feedback-card is-discovery";els.feedbackIcon.textContent=stage.newRole||"＋";
    els.feedbackKicker.textContent="NEW RULE";els.feedbackPattern.textContent=stage.label;els.feedbackTitle.textContent="今までと少し違う。そこが新しいルール。";
    const roleNote=stage.newRole
      ?`<div class="discovery-box"><div class="unlock-line"><span class="unlock-role">${escapeHtml(stage.newRole)}</span><div class="unlock-copy"><b>${escapeHtml(C.roleLong[stage.newRole])} を発見</b><span>NEW ROLE UNLOCKED</span></div></div><div>${escapeHtml(stage.explain)}</div></div>`
      :`<div class="discovery-box"><div class="unlock-line"><span class="unlock-role">＋</span><div class="unlock-copy"><b>${escapeHtml(stage.discoveryTitle)}</b><span>NEW PATTERN FOUND</span></div></div><div>${escapeHtml(stage.explain)}</div></div>`;
    const compare=stage.compare?`<div class="compare-table"><div class="compare-cell">${escapeHtml(stage.compare[0])}</div><div class="compare-arrow">↓ 比べる</div><div class="compare-cell">${escapeHtml(stage.compare[1])}</div></div>`:"";
    els.feedbackBody.innerHTML=`<p>答えが合っていたかどうかより、<strong>「いつもと違う」部分に出会ったこと</strong>が今回のポイントです。</p>${roleNote}${compare}<div class="discovery-saved"><strong>気づきノートに保存しました。</strong> わからなくなったら、右上の「気づき」からいつでも戻れます。</div>`;
    renderAnswerStrip();nextAction="question";
  }

  function renderAnswerStrip(){els.answerStrip.innerHTML="";sentence.parts.forEach(p=>{const item=document.createElement("div");item.className="answer-item";item.innerHTML=`<span>${escapeHtml(p.text)}</span><strong>${p.role}</strong>`;els.answerStrip.appendChild(item);});}
  function showComplete(){hide(els.gameCard);hide(els.feedbackCard);show(els.completeCard);refreshHeader();scrollTopSoft();}
  function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]));}

  init();
})();
