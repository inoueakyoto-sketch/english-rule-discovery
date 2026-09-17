const fs=require('fs');
const html=fs.readFileSync('phonics.html','utf8'),js=fs.readFileSync('phonics.js','utf8'),css=fs.readFileSync('styles.css','utf8'),sw=fs.readFileSync('sw.js','utf8');
const all=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]),ids=new Set(all);const dup=all.filter((x,i)=>all.indexOf(x)!==i);if(dup.length)throw new Error('duplicate ids '+[...new Set(dup)].join(','));
const refs=[...js.matchAll(/\$\("([^"]+)"\)/g)].map(x=>x[1]),missing=[...new Set(refs.filter(x=>!ids.has(x)))];if(missing.length)throw new Error('missing phonics ids '+missing.join(','));
if((css.match(/{/g)||[]).length!==(css.match(/}/g)||[]).length)throw new Error('CSS braces mismatch');
['phonics.html','phonics.js','phonics-core.js','data/phonics-bank.js'].forEach(a=>{if(!sw.includes(`./${a}`))throw new Error(`SW missing ${a}`);});
if(!html.includes('単語の読みを発見'))throw new Error('course title missing');
console.log(`PASS: ${new Set(refs).size} phonics UI ids resolved; service-worker assets present.`);
