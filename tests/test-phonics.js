const fs=require('fs');const vm=require('vm');global.window=global;
vm.runInThisContext(fs.readFileSync('data/phonics-bank.js','utf8'),{filename:'phonics-bank.js'});
vm.runInThisContext(fs.readFileSync('phonics-core.js','utf8'),{filename:'phonics-core.js'});
const B=global.ED_PHONICS_BANK,C=global.ED_PHONICS_CORE;
if(!B||!C) throw new Error('phonics modules missing');
if(B.stages.length<12) throw new Error('phonics course is too small');
B.stages.forEach((s,i)=>{
  if(s.order!==i) throw new Error(`stage order mismatch ${s.id}: ${s.order} != ${i}`);
  if(!s.id||!s.title||!s.discover||!s.examples?.length||!s.probes?.length) throw new Error(`missing stage data ${s.id}`);
  s.examples.forEach(w=>{if(!w.word||!w.meaning)throw new Error(`bad example ${s.id}`);});
});
const required=['short-a','short-i','short-e','short-o','short-u','a-e','i-e','o-e','ee','ea','ai-ay','oa','sh-ch','exceptions'];
required.forEach(id=>{if(!B.stages.some(s=>s.id===id))throw new Error(`missing required pattern ${id}`);});
const expected={'short-a':'short-a','short-i':'short-i','short-e':'short-e','short-o':'short-o','short-u':'short-u','a-e':'long-a','ai-ay':'long-a','i-e':'long-i','o-e':'long-o','oa':'long-o','ee':'long-e','ea':'long-e','sh-ch':'other','exceptions':'other'};
Object.entries(expected).forEach(([id,f])=>{if(B.familyFor(id)!==f)throw new Error(`family mismatch ${id}`);});

const wordFamilies={bread:"short-e",great:"long-a",have:"short-a",give:"short-i",ship:"sh",chair:"ch"};
for(const [word,fam] of Object.entries(wordFamilies)){const item=B.practiceWords.find(w=>w.word===word);if(!item)throw new Error(`practice word missing ${word}`);if(B.familyForWord(item)!==fam)throw new Error(`word family mismatch ${word}: ${B.familyForWord(item)} != ${fam}`);}
let state=C.defaultState();state.stageIndex=8;const ids=C.unlockedStageIds(state);if(ids.length!==9)throw new Error('unlock count mismatch');
for(const id of ids.slice(1)){const st=C.statFor(state,id);if(C.weight(st)<=0)throw new Error('invalid weight');}
console.log(`PASS: ${B.stages.length} phonics discovery stages, ${B.practiceWords.length} practice words, families validated.`);
