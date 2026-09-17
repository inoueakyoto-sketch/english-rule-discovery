const fs=require('fs');
const html=fs.readFileSync('index.html','utf8');
const app=fs.readFileSync('app.js','utf8');
const styles=fs.readFileSync('styles.css','utf8');
const allIds=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
const ids=new Set(allIds);
const duplicates=allIds.filter((id,i)=>allIds.indexOf(id)!==i);
if(duplicates.length){console.error('FAIL: duplicate HTML ids:',[...new Set(duplicates)].join(', '));process.exit(1);}
const refs=[...app.matchAll(/\$\("([^"]+)"\)/g)].map(m=>m[1]);
const missing=[...new Set(refs.filter(id=>!ids.has(id)))];
if(missing.length){console.error('FAIL: missing HTML ids used by app.js:',missing.join(', '));process.exit(1);}
const opens=(styles.match(/{/g)||[]).length, closes=(styles.match(/}/g)||[]).length;
if(opens!==closes){console.error(`FAIL: CSS brace mismatch ${opens} != ${closes}`);process.exit(1);}
console.log(`PASS: ${new Set(refs).size} static UI ids resolved; no duplicate ids; CSS braces balanced.`);
