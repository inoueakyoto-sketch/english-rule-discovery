const fs=require('fs');
const vm=require('vm');
global.window=global;
vm.runInThisContext(fs.readFileSync('data/role-guide.js','utf8'),{filename:'role-guide.js'});
const G=global.ED_ROLE_GUIDE;
function assert(cond,msg){if(!cond){console.error('FAIL:',msg);process.exit(1);}}
assert(G&&G.roles,'guide exists');
assert(G.summary.map(x=>x.role).join(',')==='S,V,O,C','summary order is S,V,O,C');
for(const role of ['S','V','O','C']){
  const r=G.roles[role];
  assert(r&&r.name&&r.headline&&r.description&&r.tip,`${role} core copy`);
  assert(Array.isArray(r.patterns)&&r.patterns.length>=4,`${role} has pattern groups`);
  for(const p of r.patterns){
    assert(p.label&&p.level&&p.examples?.length&&p.sentence&&p.focus&&p.note,`${role}/${p.label||'?'} complete pattern`);
    assert(p.sentence.includes(p.focus),`${role}/${p.label} focus is visible in sentence`);
  }
}
assert(G.roles.S.patterns.some(p=>p.label.includes('代名詞')),'S includes pronoun');
assert(G.roles.V.patterns.some(p=>p.label.includes('be動詞')),'V includes be verb');
assert(G.roles.O.patterns.some(p=>p.label.includes('目的格')),'O includes objective pronoun');
assert(G.roles.C.patterns.some(p=>p.label.includes('形容詞')),'C includes adjective');
assert(G.comparison.rows.map(x=>x.role).join(',')==='S,O,C','same noun comparison covers S/O/C');
console.log('PASS: S/V/O/C role guide structure and examples validated.');
