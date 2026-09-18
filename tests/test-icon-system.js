const fs=require('fs');
function fail(msg){console.error('FAIL:',msg);process.exit(1)}
const sprite=fs.readFileSync('assets/qd-icons.svg','utf8');
const required=['arrow-left','menu','notebook','spark','route','mountain','chevron-right','arrow-right','bulb','check','retry','speaker','headphones','book','home','close','settings','medal','flame','map','info'];
for(const id of required){if(!sprite.includes(`id="icon-${id}"`)) fail(`missing sprite symbol: ${id}`)}
const active=['index.html','phonics.html','app.js','phonics.js','styles.css','sw.js'].map(f=>fs.readFileSync(f,'utf8')).join('\n');
if(!active.includes('qd-icons.svg')) fail('unified icon sprite not referenced');
const legacy=['icon-spark.svg','icon-book.svg','icon-route.svg','icon-challenge.svg','icon-headphones.svg','icon-volume.svg','ui-home.png','ui-book.png','ui-spark.png','ui-route.png','ui-headphones.png','ui-challenge.png','ui-notebook.png','ui-medal.png','ui-back.png','ui-settings.png','ui-info.png','ui-close.png'];
for(const ref of legacy){if(active.includes(ref)) fail(`legacy icon reference remains: ${ref}`)}
const html=fs.readFileSync('index.html','utf8')+fs.readFileSync('phonics.html','utf8');
for(const glyph of ['>◇<','>△<','>◌<','>▶<']){if(html.includes(glyph)) fail(`legacy glyph icon remains: ${glyph}`)}
console.log(`PASS: unified icon sprite contains ${required.length} symbols; no active legacy icon references or placeholder glyph icons.`);
