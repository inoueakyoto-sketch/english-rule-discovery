const fs=require('fs'),path=require('path');
function assert(cond,msg){if(!cond){console.error('FAIL:',msg);process.exit(1);}}
const html=fs.readFileSync('index.html','utf8'),ph=fs.readFileSync('phonics.html','utf8'),sw=fs.readFileSync('sw.js','utf8'),manifest=JSON.parse(fs.readFileSync('manifest.webmanifest','utf8'));
assert(html.includes('v1.0.0')&&ph.includes('v1.0.0'),'visible version is v1.0.0');
assert(sw.includes('discovery-english-v1.0.0'),'service worker cache version is v1.0.0');
assert(sw.includes('./data/school-vocab.js'),'school vocabulary data is cached');
assert(ph.includes('./data/school-vocab.js'),'phonics page loads school vocabulary data');
assert(html.includes('S・V・O・C・Mを学ぶ'),'role lab includes M');
assert(manifest.orientation==='portrait-primary','manifest is portrait-first');
const required=['app-icon-192.png','app-icon-512.png','home-hero.webp','course-grammar.webp','course-phonics.webp','challenge.webp','practice-bg.webp','discovery-log.webp','completion.webp','role-s.png','role-v.png','role-o.png','role-c.png','role-m.png','ui-home.png','ui-book.png','ui-headphones.png','ui-settings.png'];
required.forEach(f=>{assert(fs.existsSync(path.join('assets',f)),`asset exists: ${f}`);assert(sw.includes(`./assets/${f}`),`asset cached: ${f}`);});
assert(fs.existsSync('design/VISUAL_SOURCE_OF_TRUTH.png'),'visual source of truth is packaged');
console.log(`PASS: v1.0.0 release contract and ${required.length} critical visual assets validated.`);
