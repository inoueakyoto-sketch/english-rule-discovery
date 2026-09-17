const fs=require("fs");
const vm=require("vm");
global.window=global;
vm.runInThisContext(fs.readFileSync("data/wordbank.js","utf8"));
vm.runInThisContext(fs.readFileSync("core.js","utf8"));
const C=global.EnglishDiscoveryCore;
function assert(cond,msg){if(!cond){console.error("FAIL:",msg);process.exit(1);}}
assert(C.knownRolesForStage(0).join(",")==="S,V","SV stage roles");
assert(C.discoveryRolesBefore(1).join(",")==="S,V","before SVC");
assert(C.knownRolesForStage(1).includes("C"),"C unlocked");
assert(!C.discoveryRolesBefore(2).includes("O"),"O hidden before SVO");
assert(C.knownRolesForStage(2).includes("O"),"O unlocked");
assert(!C.discoveryRolesBefore(5).includes("M"),"M hidden before modifier discovery");
assert(C.knownRolesForStage(5).includes("M"),"M unlocked");
for(let i=0;i<50;i++){
  const s=C.generateSentence("M","j1t1",Math.random,"SVC");
  const core=s.parts.filter(p=>p.role!=="M").map(p=>p.role).join("");
  assert(core==="SVC","M discovery keeps SVC core");
}
console.log("PASS: discovery flow and SVC+M discovery validated.");
