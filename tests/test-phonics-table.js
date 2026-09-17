const fs=require('fs');const vm=require('vm');global.window=global;
vm.runInThisContext(fs.readFileSync('data/phonics-bank.js','utf8'));
const B=global.ED_PHONICS_BANK;
if(!B.discoveryTableGroups?.length)throw new Error('discovery table groups missing');
const ids=B.discoveryTableGroups.flatMap(g=>g.stageIds||[]);
if(new Set(ids).size!==ids.length)throw new Error('duplicate stage in discovery table');
for(const id of ids){if(!B.stages.some(s=>s.id===id))throw new Error('table stage missing '+id);if(!B.discoveryTableLabels[id])throw new Error('table label missing '+id);}
for(const [id,x] of Object.entries(B.exceptionLinks||{})){if(!ids.includes(id))throw new Error('exception link target missing '+id);if(!x.words?.length||!x.note)throw new Error('bad exception link '+id);}
const html=fs.readFileSync('phonics.html','utf8'),js=fs.readFileSync('phonics.js','utf8');
['phonicsSoundTable','phonicsTableFound','phonicsTableTotal','phonicsTableHint'].forEach(id=>{if(!html.includes(`id="${id}"`))throw new Error('missing html id '+id);if(!js.includes(`$("${id}")`))throw new Error('missing js ref '+id);});
if(!js.includes('startPractice(b.dataset.practice)'))throw new Error('table practice launch missing');
if(js.includes('practiceBtn.addEventListener("click",startPractice)'))throw new Error('practice button would pass MouseEvent as focus id');
console.log(`PASS: ${ids.length} discovery-table slots, exception links, focused practice launch validated.`);
