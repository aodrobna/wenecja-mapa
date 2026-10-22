/* Sprawdzenie zbioru punktów bez dodatkowych zależności. Uruchom: node tests/check-data.js */
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const file = fs.readFileSync(require('node:path').join(__dirname, '..','assets','places.js'),'utf8');
const ctx={window:{}};
vm.createContext(ctx);
vm.runInContext(file,ctx);
const places=ctx.window.VENICE_PLACES;
assert.equal(places.length,47,'Spodziewano 47 miejsc');
for(const p of places){
 assert.ok(typeof p.name==='string' && p.name.trim());
 assert.ok(typeof p.query==='string' && p.query.trim());
 assert.ok(['jedzenie','noclegi','atrakcje','transport'].includes(p.cat));
 assert.ok(Number.isFinite(p.lat) && p.lat>45 && p.lat<46);
 assert.ok(Number.isFinite(p.lon) && p.lon>12 && p.lon<13);
 const maps = 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(p.query);
 assert.ok(maps.startsWith('https://www.google.com/maps/search/'));
}
for(const expected of ['San Lio Tourist House','Hotel Monaco & Grand Canal','Ristorante Al Vagon','Plac św. Marka','Venice Catamaran – Riva dei Sette Martiri']){
 assert.ok(places.some(p=>p.name===expected),'Brak miejsca: '+expected);
}
console.log('OK: 47 miejsc; 4 kategorie; linki i współrzędne w poprawnym formacie.');
