// Miraz TV v2.3 — resilient PWA install and offline shell.
const CACHE='miraz-tv-pwa-install-v2-3-20261107';
const SHELL=['./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-maskable-512.png'];
self.addEventListener('install', event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(
    keys.filter(key=>key.startsWith('miraz-tv-')&&key!==CACHE).map(key=>caches.delete(key))
  )).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', event=>{
  const req=event.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin)return;
  if(url.pathname.endsWith('/content.json')){
    // Always fetch the latest catalog; do not cache older Series/Movies.
    event.respondWith(fetch(req,{cache:'no-store'}).catch(()=>caches.match(req).then(r=>r||Response.error())));
    return;
  }
  if(req.mode==='navigate'){
    event.respondWith(fetch(req).then(response=>{
      if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put('./index.html',copy));}
      return response;
    }).catch(()=>caches.match('./index.html').then(r=>r||Response.error())));
    return;
  }
  // Keep the manifest/icons fresh; if offline, use the cached shell.
  event.respondWith(fetch(req).then(response=>{
    if(response.ok&&SHELL.some(path=>url.pathname.endsWith(path.replace('./','/')))){
      const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(req,copy));
    }
    return response;
  }).catch(()=>caches.match(req).then(r=>r||Response.error())));
});
