const fs=require('fs');
const vm=require('vm');
global.window=global;
vm.runInThisContext(fs.readFileSync('data/wordbank.js','utf8'));
vm.runInThisContext(fs.readFileSync('core.js','utf8'));
const C=global.EnglishDiscoveryCore;
function assert(cond,msg){if(!cond){console.error('FAIL:',msg);process.exit(1);}}
const now=Date.now();
const weak={attempts:5,correct:1,wrong:4,lastSeen:now-2*86400000,lastResult:'wrong'};
const strong={attempts:12,correct:11,wrong:1,lastSeen:now,lastResult:'correct'};
assert(C.practiceWeight(weak,now)>C.practiceWeight(strong,now),'weak rule should receive higher practice weight');
assert(C.masteryLevel({attempts:0}).key==='new','zero-attempt mastery');
assert(C.masteryLevel({attempts:10,correct:9,lastResult:'correct'}).key==='stable','stable mastery');
assert(C.masteryLevel({attempts:6,correct:2,lastResult:'wrong'}).key==='review','review mastery');
const allowed=['SV','SVC','SVO'];
for(let i=0;i<200;i++){
  const p=C.choosePracticePattern(allowed,{SV:strong,SVC:weak,SVO:{}},[],Math.random,now);
  assert(allowed.includes(p),'practice chooser must stay inside discovered patterns');
}
const only=C.choosePracticePattern(['SV'],{},[],()=>0.5,now);
assert(only==='SV','single discovered pattern must always be selected');
console.log('PASS: adaptive practice weighting and mastery labels validated.');
