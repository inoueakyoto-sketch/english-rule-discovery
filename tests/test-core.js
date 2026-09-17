const fs=require("fs");
const vm=require("vm");
global.window=global;
vm.runInThisContext(fs.readFileSync("data/wordbank.js","utf8"),{filename:"wordbank.js"});
vm.runInThisContext(fs.readFileSync("core.js","utf8"),{filename:"core.js"});
const C=global.EnglishDiscoveryCore;
const levels=["j1t1","j1t2","j1t3","j2t1","j2t2","j2t3"];
const patterns=["SV","SVC","SVO","SVOO","SVOC","M"];
let count=0;
for(const level of levels){
  for(const pattern of patterns){
    for(let i=0;i<200;i++){
      const s=C.generateSentence(pattern,level,Math.random);
      if(!C.validateSentence(s)){console.error("INVALID",level,pattern,s);process.exit(1);}
      if(s.parts.some(p=>!p.text||!p.role||!p.ja)){console.error("MISSING PART DATA",level,pattern,s);process.exit(1);}
      count++;
    }
  }
}
console.log(`PASS: ${count} generated sentences validated.`);
