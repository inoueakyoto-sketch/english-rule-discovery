const fs=require("fs");
const vm=require("vm");
global.window=global;
vm.runInThisContext(fs.readFileSync("data/wordbank.js","utf8"),{filename:"wordbank.js"});
vm.runInThisContext(fs.readFileSync("core.js","utf8"),{filename:"core.js"});
const C=global.EnglishDiscoveryCore;
const levels=["j1t1","j1t2","j1t3","j2t1","j2t2","j2t3"];
const patterns=["SV","SVC","SVO","SVOO","SVOC","M"];
let count=0;
for(const level of levels){for(const pattern of patterns){for(let i=0;i<100;i++){
  const s=C.generateSentence(pattern,level,Math.random);
  for(const p of s.parts){if(!p.pos){console.error("FAIL missing pos",level,pattern,p,s);process.exit(1);} count++;}
}}}
const html=fs.readFileSync("index.html","utf8");
const app=fs.readFileSync("app.js","utf8");
if(/id="questionMode"/.test(html)||/questionMode/.test(app)){console.error("FAIL pattern hint UI still present");process.exit(1);}
if(/UNKNOWN/.test(app)){console.error("FAIL UNKNOWN hint still present");process.exit(1);}
if(!/品詞：/.test(app)){console.error("FAIL POS label not rendered in word hint");process.exit(1);}
console.log(`PASS: ${count} generated parts have POS labels; pattern/UNKNOWN hints removed; word hint renders POS.`);
