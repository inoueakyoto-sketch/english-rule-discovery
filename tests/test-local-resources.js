const fs=require('fs'),path=require('path');
function assert(c,m){if(!c){console.error('FAIL:',m);process.exit(1);}}
for(const file of ['index.html','phonics.html']){
  const text=fs.readFileSync(file,'utf8');
  const refs=[...text.matchAll(/(?:src|href)=["'](\.\/[^"'#?]+)["']/g)].map(m=>m[1]);
  for(const ref of refs){const p=ref.slice(2);assert(fs.existsSync(p),`${file} resource exists: ${ref}`);}
}
const sw=fs.readFileSync('sw.js','utf8');
const refs=[...sw.matchAll(/["'](\.\/[^"']+)["']/g)].map(m=>m[1]);
for(const ref of refs){if(ref==='./')continue;assert(fs.existsSync(ref.slice(2)),`SW resource exists: ${ref}`);}
console.log(`PASS: ${refs.length} service-worker resources and HTML local references exist.`);
