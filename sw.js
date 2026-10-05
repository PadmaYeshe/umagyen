/* Change CACHE (for example to umagyen-as) whenever index.html is replaced. */
var CACHE="umagyen-ar";
var CORE=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","icon-180.png"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(CORE);}).then(function(){return self.skipWaiting();}));});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));});
function keep(req,res){
  if(res&&(res.ok||res.type==="opaque")){var copy=res.clone();caches.open(CACHE).then(function(c){c.put(req,copy);}).catch(function(){});}
  return res;
}
self.addEventListener("fetch",function(e){
  if(e.request.method!=="GET")return;
  var url=e.request.url.split("?")[0];
  /* The optional file of official English verses: always try the network first. */
  if(/verses-en\.txt$/.test(url)){
    e.respondWith(fetch(e.request).then(function(res){return keep(e.request,res);}).catch(function(){
      return caches.match(e.request).then(function(hit){return hit||new Response("",{status:404});});
    }));
    return;
  }
  e.respondWith(caches.match(e.request).then(function(hit){
    if(hit)return hit;
    return fetch(e.request).then(function(res){return keep(e.request,res);}).catch(function(){return caches.match("index.html");});
  }));
});
