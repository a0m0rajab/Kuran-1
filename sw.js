"use strict";
const PREF ='iqra', CACHE = PREF+'4'
const FILES = [
  '/Kuran/index.html',
  '/Kuran/data/words.txt',
  '/Kuran/data/refs.txt',
  '/Kuran/image/sura.png',
  '/Kuran/image/icon.png',
  '/Kuran/image/iconF.png',
  '/Kuran/image/me_quran.ttf',
  '/Kuran/manifest.json'
]

function installCB(e) {  //CB means call-back
  console.log("installing "+CACHE);
  e.waitUntil(
    caches.open(CACHE)
    .then(cache => cache.addAll(FILES))
    .catch(console.log)
  )
}
addEventListener('install', installCB)

function save(req, resp) {
  // console.log("save "+req.url);
  if (!req.url.includes("okuyun"))
     return resp;
  return caches.open(CACHE)
  .then(cache => { // save request
    cache.put(req, resp.clone());
    return resp;
  }) 
  .catch(console.err)
}
function report(req) {
  console.log(CACHE+' matches '+req.url)
  return req
}
function fetchCB(e) { //fetch first
  let req = e.request
  e.respondWith(
    fetch(req).then(r2 => save(req, r2))
    .catch(() => caches.match(req).then(report))
  )
}
addEventListener('fetch', fetchCB)

function removeOld(L) {
  return Promise.all(L.map(key => {
    if (!key.startsWith(PREF) || key == CACHE)
       return null;
    console.log(key+" is deleted")
    return caches.delete(key)
  }))
}
function activateCB(e) {
  console.log(CACHE+" is activated");
  e.waitUntil(
    caches.keys().then(removeOld)
  )
}
addEventListener('activate', activateCB);

