const CACHE="discovery-english-v1.0.10";
const ASSETS=[
  "./","./index.html","./phonics.html","./styles.css","./app.js","./core.js","./phonics.js","./phonics-core.js",
  "./data/wordbank.js","./data/role-guide.js","./data/challenge-bank.js","./data/phonics-bank.js","./data/school-vocab.js",
  "./manifest.webmanifest",
  "./assets/app-icon-192.png","./assets/app-icon-512.png","./assets/app-icon-1024.png","./assets/qd-icons.svg",
  "./assets/home-hero.webp","./assets/course-grammar.webp","./assets/course-phonics.webp","./assets/challenge.webp",
  "./assets/practice-bg.webp","./assets/discovery-log.webp","./assets/splash-bg.webp","./assets/completion.webp",
  "./assets/grammar-map.webp","./assets/phonics-map.webp","./assets/discovered-bg.webp","./assets/footer-landscape.webp",
  "./assets/badge-first.webp","./assets/badge-notebook.webp","./assets/badge-sentence.webp","./assets/badge-sound.webp","./assets/badge-streak.webp","./assets/badge-summit.webp"
];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET") return;
  if(e.request.mode==="navigate"){
    e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{});return r;}).catch(()=>caches.match(e.request).then(hit=>hit||caches.match("./index.html"))));
    return;
  }
  e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{if(r&&r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{});}return r;})));
});
