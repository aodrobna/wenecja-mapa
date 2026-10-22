/* Vanilla JS. Brak API key, frameworka, backendu i fetch() danych – działa też przy otwarciu lokalnym. */
(() => {
  'use strict';
  const points = Array.isArray(window.VENICE_PLACES) ? window.VENICE_PLACES : [];
  const palette = {atrakcje: '#1f7874', jedzenie:'#ab6846', noclegi:'#83667e', transport:'#4a789c'};
  const labels = {atrakcje:'Atrakcje', jedzenie:'Jedzenie', noclegi:'Noclegi', transport:'Transport'};
  const byId = id => document.getElementById(id);
  const list = byId('places-list');
  const search = byId('search');
  const note = byId('map-note');
  let activeCategory = 'wszystkie';
  let query = '';
  let map = null;
  let circles = [];
  let mapIsAvailable = false;
  const centre = [45.4382, 12.3375];
  const normalized = value => String(value||'').toLocaleLowerCase('pl').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const google = p => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(p.query || `${p.name}, Venezia Italia`);
  const filtered = () => points.filter(p => (activeCategory === 'wszystkie' || p.cat === activeCategory) && (!query || normalized(`${p.name} ${p.info} ${p.cat}`).includes(normalized(query))));
  const node = (tag, cls, text) => {const el = document.createElement(tag); if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el;};
  function openLocation(p){window.open(google(p), '_blank','noopener,noreferrer');}
  function resetView(){if(mapIsAvailable){map.setView(centre,13);}else{const pane=byId('fallback'); pane.scrollIntoView({behavior:'smooth',block:'nearest'});}}
  function focus(p){
    if(mapIsAvailable){map.setView([p.lat,p.lon],Math.max(15,map.getZoom()),{animate:true});let found=circles.find(e=>e.item===p);if(found)found.circle.openPopup();}
    else{const selected=byId('fallback').querySelector(`[data-point="${points.indexOf(p)}"]`);if(selected)selected.focus();}
    if(window.innerWidth <= 900)(mapIsAvailable?byId('map'):byId('fallback')).scrollIntoView({behavior:'smooth',block:'center'});
  }
  function renderList(data){
    list.replaceChildren();byId('count').textContent=`${data.length} miejsc`;
    if(!data.length){list.append(node('p','empty','Brak wyników – spróbuj innego hasła lub kategorii.'));return;}
    const frag=document.createDocumentFragment();
    for(const p of data){
      const article=node('article','place');
      article.append(node('h3','',p.name));
      const cat=node('div','category',labels[p.cat]||p.cat);cat.style.color=palette[p.cat]||'#333';article.append(cat);
      article.append(node('p','',p.info||''));
      const actions=node('div','actions');
      const link=node('a','','Google Maps ↗');link.href=google(p);link.target='_blank';link.rel='noopener noreferrer';link.setAttribute('aria-label','Otwórz w Google Maps: '+p.name);actions.append(link);
      const btn=node('button','','Pokaż na mapie');btn.type='button';btn.addEventListener('click',()=>focus(p));actions.append(btn);
      article.append(actions);frag.append(article);
    }
    list.append(frag);
  }
  function refreshMap(data){
    if(mapIsAvailable){for(const entry of circles)map.removeLayer(entry.circle);circles=[];
      for(const p of data){
        const circle=window.L.circleMarker([p.lat,p.lon],{radius:8,color:'#fff',weight:2,fillColor:palette[p.cat]||'#777',fillOpacity:1}).addTo(map);
        const box=node('div','place-popup');box.append(node('h3','',p.name),node('p','',p.info));
        const link=node('a','','Otwórz w Google Maps ↗');link.target='_blank';link.rel='noopener noreferrer';link.href=google(p);box.append(link);
        circle.bindPopup(box);circles.push({item:p,circle});
      }
    } else renderFallback(data);
  }
  function refresh(){const data=filtered();renderList(data);refreshMap(data);}
  function addSvg(name,attrs,parent,content){const el=document.createElementNS('http://www.w3.org/2000/svg',name);for(const [key,value] of Object.entries(attrs||{}))el.setAttribute(key,String(value));if(content!==undefined)el.textContent=content;parent.appendChild(el);return el;}
  function renderFallback(data){
    const pane=byId('fallback');pane.hidden=false;pane.replaceChildren();
    const svg=addSvg('svg',{viewBox:'0 0 1000 620',role:'img','aria-label':'Poglądowy schemat miejsc w okolicy Wenecji. Kliknij punkt, aby otworzyć Google Maps.'},pane);
    addSvg('rect',{width:1000,height:620,fill:'#dfe9e9'},svg);
    addSvg('path',{d:'M16 375 C100 325 161 341 246 281 S413 278 480 208 S653 161 726 206 S836 233 980 178 L980 524 C858 511 781 465 702 485 S524 513 437 462 S291 492 209 470 S98 522 16 475Z',fill:'#f7f4eb',stroke:'#c1d5cf','stroke-width':3},svg);
    addSvg('path',{d:'M30 360 C175 310 215 385 350 345 S585 311 710 374 S893 352 984 330',stroke:'#96b9c4','stroke-width':28,fill:'none','stroke-linecap':'round'},svg);
    addSvg('path',{d:'M30 360 C175 310 215 385 350 345 S585 311 710 374 S893 352 984 330',stroke:'#dfe9e9','stroke-width':2,fill:'none'},svg);
    addSvg('text',{x:25,y:54,'font-size':26,'font-family':'Georgia, serif',fill:'#283c3c'},svg,'WENECJA · mapa poglądowa');
    addSvg('text',{x:25,y:78,'font-size':15,'font-family':'Arial',fill:'#536970'},svg,'Podkład mapowy jest niedostępny. Punkty otwierają Google Maps.');
    const lonMin=12.30,lonMax=12.445,latMin=45.405,latMax=45.498;
    let outside=0;
    for(const p of data){
      const x=35+(p.lon-lonMin)/(lonMax-lonMin)*930;
      const y=112+(latMax-p.lat)/(latMax-latMin)*460;
      if(x<10||x>990||y<95||y>610){outside++;continue;}
      const dot=addSvg('circle',{cx:x,cy:y,r:9,fill:palette[p.cat]||'#777',stroke:'#fff','stroke-width':3,tabindex:0,role:'button','aria-label':p.name,'data-point':points.indexOf(p),class:'fallback-marker'},svg);
      addSvg('title',{},dot,p.name+' – kliknij, aby otworzyć Google Maps');
      dot.addEventListener('click',()=>openLocation(p));
      dot.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openLocation(p)}});
    }
    const info=node('div','fallback-info',`Schemat lokalizacji ma charakter orientacyjny.${outside?' Punkty poza tym widokiem: '+outside+'.':''} Wybierz miejsce z listy, aby otworzyć jego lokalizację w Google Maps.`);pane.append(info);
  }
  function initMap(){
    if(!window.L){byId('map').hidden=true;note.innerHTML='<span class="map-warning">Nie udało się pobrać biblioteki mapy.</span> Lista i poglądowy schemat poniżej działają bez niej.';return;}
    try{
      map=window.L.map('map',{scrollWheelZoom:false,preferCanvas:true}).setView(centre,13);
      const tiles=window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap contributors'});
      tiles.on('tileerror',()=>{note.textContent='Nie udało się załadować podkładu mapy. Pinezki i linki do Google Maps nadal działają.';});
      tiles.addTo(map);mapIsAvailable=true;
      setTimeout(()=>map.invalidateSize(),100);
    }catch(error){console.error('Mapa niedostępna, przełączam na widok zapasowy',error);mapIsAvailable=false;byId('map').hidden=true;note.textContent='Nie można wyświetlić podkładu mapy. Możesz używać poglądowego schematu oraz linków do Google Maps.';}
  }
  document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{
    activeCategory=button.dataset.category;
    document.querySelectorAll('.filter').forEach(b=>{const selected=b===button;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected));});
    refresh();
  }));
  search.addEventListener('input',()=>{query=search.value.trim();refresh();});
  byId('reset-map').addEventListener('click',resetView);
  initMap();refresh();
})();
