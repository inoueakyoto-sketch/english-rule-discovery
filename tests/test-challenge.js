const fs=require('fs');
const vm=require('vm');
global.window=global;
vm.runInThisContext(fs.readFileSync('data/challenge-bank.js','utf8'),{filename:'challenge-bank.js'});
const H=global.ED_CHALLENGE_BANK;
function assert(cond,msg){if(!cond){console.error('FAIL:',msg);process.exit(1);}}
assert(H&&H.structure&&H.gap&&H.order,'challenge bank exists');
assert(H.structure.length>=5,'enough structure challenges');
assert(H.gap.length>=5,'enough gap challenges');
assert(H.order.length>=5,'enough order challenges');
for(const item of H.structure){
  assert(item.sentence&&item.translation&&item.pattern&&item.insight,`${item.id} structure copy`);
  assert(item.parts.length>=3,`${item.id} structure parts`);
  assert(item.parts.some(p=>p.role==='S')&&item.parts.some(p=>p.role==='V'),`${item.id} has S and V`);
  for(const p of item.parts) assert(p.text&&p.role&&p.ja&&p.pos,`${item.id} part metadata`);
  for(const v of item.vocab) assert(v.en&&v.ja&&v.pos,`${item.id} vocab metadata`);
}
for(const item of H.gap){
  assert(item.options.length===4,`${item.id} has four gap options`);
  assert(new Set(item.options).size===4,`${item.id} unique gap options`);
  assert(item.options.filter(x=>x===item.answer).length===1,`${item.id} one exact answer`);
  assert(item.translation&&item.insight&&item.pattern,`${item.id} gap explanation`);
}
for(const item of H.order){
  assert(item.answer.length>=3,`${item.id} reorder chunks`);
  assert(new Set(item.answer).size===item.answer.length,`${item.id} reorder chunks unique`);
  assert(item.translation&&item.insight&&item.pattern,`${item.id} order explanation`);
}
for(let i=0;i<100;i++){
  const sess=H.buildSession(Math.random);
  assert(sess.length===5,'challenge session length');
  const types=new Set(sess.map(x=>x.type));
  assert(types.has('structure')&&types.has('gap')&&types.has('order'),'session covers all three transfer tasks');
  assert(new Set(sess.map(x=>x.id)).size===5,'session has no duplicate item');
}
console.log('PASS: challenge bank, vocabulary support, answer uniqueness, and mixed five-question sessions validated.');
