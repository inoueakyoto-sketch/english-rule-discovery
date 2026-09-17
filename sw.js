const CACHE="discovery-english-v0.2.2";
const ASSETS=["./","./index.html","./phonics.html","./styles.css","./app.js","./core.js","./phonics.js","./phonics-core.js","./data/wordbank.js","./data/role-guide.js","./data/challenge-bank.js","./data/phonics-bank.js","./manifest.webmanifest","./icon.svg"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET") return;
  if(e.request.mode==="navigate"){
    e.respondWith(fetch(e.request).catch(()=>caches.match(e.request).then(hit=>hit||caches.match("./index.html"))));
    return;
  }
  e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request)));
});
