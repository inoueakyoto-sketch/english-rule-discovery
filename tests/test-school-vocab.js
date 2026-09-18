const fs=require('fs'),vm=require('vm');global.window=global;
vm.runInThisContext(fs.readFileSync('data/phonics-bank.js','utf8'),{filename:'phonics-bank.js'});
vm.runInThisContext(fs.readFileSync('data/school-vocab.js','utf8'),{filename:'school-vocab.js'});
const B=ED_PHONICS_BANK,S=ED_SCHOOL_VOCAB;
function assert(cond,msg){if(!cond){console.error('FAIL:',msg);process.exit(1);}}
const words=B.practiceWords.map(x=>x.word.toLowerCase());
assert(words.length>=80,'practice word bank is substantial');
const missing=words.filter(w=>!(w in S.rankByWord));
assert(!missing.length,`all practice words have school scope: ${missing.join(',')}`);
const counts=[];for(const g of [1,2])for(const t of [1,2,3])counts.push(words.filter(w=>S.allowed(w,g,t)).length);
for(let i=1;i<counts.length;i++)assert(counts[i]>=counts[i-1],'school scope grows monotonically');
assert(counts[0]<counts[counts.length-1],'term selection changes available vocabulary');
assert(S.label(1,1).includes('中1')&&S.label(2,3).includes('中2'),'labels cover grades/terms');
console.log(`PASS: school vocabulary scope maps ${words.length} words; term pools ${counts.join(' -> ')}.`);
