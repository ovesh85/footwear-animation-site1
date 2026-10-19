/* =========================================================
   STRYDA — app.js  (GSAP 3.12 + ScrollTrigger + Lenis)
   Edit SLIDES / PRODUCTS / FLUX below to change content.
   ========================================================= */
(() => {
'use strict';
gsap.registerPlugin(ScrollTrigger);
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const isMobile = () => matchMedia('(max-width:820px)').matches;
const finePointer = matchMedia('(pointer:fine)').matches;
const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
const INR = n => '₹' + n.toLocaleString('en-IN');

/* ---------------- DATA ---------------- */
const SLIDES = [
  { name:'Cloudstomp',  price:6499,  l1:'STEP INTO',  l2:'Your Vibe',  pa:'#7b2ff7', pb:'#c8ff2e', soft:'#ecd8ff', btn:'#7b2ff7', sc1:'#7b2ff7', sc2:'#d63cff' },
  { name:'Bubble Drift',price:7299,  l1:'OWN YOUR',   l2:'Edge Now',   pa:'#ff2d87', pb:'#ff7a1a', soft:'#ffd6e8', btn:'#f0167a', sc1:'#ff2d87', sc2:'#ff7a1a' },
  { name:'Trail Riot',  price:7999,  l1:'MAKE EVERY', l2:'Step Count', pa:'#a6e600', pb:'#7b2ff7', soft:'#e9ffc2', btn:'#5b21b6', sc1:'#78b800', sc2:'#5b21b6' },
  { name:'Dad Fizz',    price:8999,  l1:'FRESH FIT',  l2:'Fresh Kick', pa:'#e5007e', pb:'#ffc414', soft:'#ffe0ef', btn:'#d4006f', sc1:'#e5007e', sc2:'#ff8a00' },
  { name:'Hi-Volt Air', price:10499, l1:'BUILT TO',   l2:'Bounce Back',pa:'#1f4bff', pb:'#ff7a1a', soft:'#dbe3ff', btn:'#1f4bff', sc1:'#1f4bff', sc2:'#ff6a00' },
];
const PRODUCTS = [
  { id:'cloudstomp', name:'Cloudstomp',   type:'sandals',   cat:'Platform sandal', price:6499,  img:'shoe-1.webp', bg:'#f3e8ff', bl:'#d9b8ff', tag:'Bestseller', dots:['#f9b9a5','#efe7da','#c8ff2e'] },
  { id:'bubble',     name:'Bubble Drift', type:'sandals',   cat:'Sport sandal',    price:7299,  img:'shoe-2.webp', bg:'#ffe4ef', bl:'#ffb3d1', tag:'New',        dots:['#f1ece4','#ff7a1a','#ff2d87'] },
  { id:'riot',       name:'Trail Riot',   type:'sandals',   cat:'Lug-sole sandal', price:7999,  img:'shoe-3.webp', bg:'#efffd1', bl:'#d4ff70', tag:'Drop 05',    dots:['#151515','#c8ff2e','#ff2d87'] },
  { id:'fizz',       name:'Dad Fizz',     type:'sneakers',  cat:'Chunky sneaker',  price:8999,  img:'shoe-4.webp', bg:'#fff0d6', bl:'#ffc8a6', tag:'Hot',        dots:['#ff2d87','#ff7a1a','#f6efe4'] },
  { id:'hivolt',     name:'Hi-Volt Air',  type:'sneakers',  cat:'High-top',        price:10499, img:'shoe-5.webp', bg:'#e2e8ff', bl:'#b5c4ff', tag:'Limited',    dots:['#1f4bff','#ff7a1a','#ffffff'] },
  { id:'flux',       name:'Flux 01',      type:'sneakers',  cat:'Runner',          price:11999, img:'shoe-6.webp', bg:'#ffe6f3', bl:'#e3c4ff', tag:'Signature',  dots:['#ff2d87','#b6f000','#1f4bff'] },
  { id:'lilac',      name:'Lilac Stomp',  type:'platforms', cat:'Platform clog',   price:5999,  img:'shoe-7.webp', bg:'#f1ffd9', bl:'#e3d2ff', tag:'New',        dots:['#c7a8f0','#b6f000'] },
  { id:'wave',       name:'Wave Knit',    type:'platforms', cat:'Sock sneaker',    price:6999,  img:'shoe-8.webp', bg:'#fff1e3', bl:'#ffc0dc', tag:'Drop 05',    dots:['#ff2d87','#ff7a1a','#f3eadb'] },
];
const FLUX = [
  { name:'Candy Riot',    fc1:'#ff2d87', fc2:'#7b2ff7', fbg:'#ffe1ef' },
  { name:'Lime Voltage',  fc1:'#9ad600', fc2:'#5b21b6', fbg:'#efffd0' },
  { name:'Cobalt Sunset', fc1:'#1f4bff', fc2:'#ff7a1a', fbg:'#dfe6ff' },
];

/* ---------------- BAG / TOAST ---------------- */
const bag = []; let wish = 0;
function updateBag(){
  const n = bag.reduce((a,b)=>a+b.qty,0);
  const badge = $('[data-bag]'); badge.textContent = n; badge.classList.toggle('has', n>0);
  badge.classList.remove('bump'); void badge.offsetWidth; badge.classList.add('bump');
  $('[data-list]').innerHTML = bag.length ? bag.map((it,i)=>`<div class="line-item"><img src="assets/img/${it.img}" alt=""><div><h4>${it.name}</h4><small>${it.meta} · Qty ${it.qty}</small></div><div style="text-align:right"><b>${INR(it.price*it.qty)}</b><br><button data-rm="${i}">Remove</button></div></div>`).join('') : '<p class="empty">Your bag is empty. Go get loud.</p>';
  $('[data-total]').textContent = INR(bag.reduce((a,b)=>a+b.price*b.qty,0));
}
function addToBag(p, meta, fromEl){
  const ex = bag.find(b=>b.id===p.id && b.meta===meta);
  ex ? ex.qty++ : bag.push({ id:p.id, name:p.name, price:p.price, img:p.img, meta, qty:1 });
  if (fromEl) flyTo(fromEl, $('.bag-btn'), p.img);
  setTimeout(updateBag, fromEl ? 700 : 0);
  toast(`${p.name} added to your bag`);
}
function flyTo(from, to, img){
  const a = from.getBoundingClientRect(), b = to.getBoundingClientRect();
  const f = document.createElement('img'); f.src = 'assets/img/'+img; f.className='flyer'; document.body.appendChild(f);
  gsap.set(f,{ left:a.left + a.width/2 - 45, top:a.top + a.height/2 - 45 });
  gsap.to(f,{ duration:.75, ease:'power2.in', left:b.left + b.width/2 - 45, top:b.top + b.height/2 - 45, scale:.2, rotate:-40, onComplete:()=>f.remove() });
}
let toastT;
function toast(msg){ const t=$('.toast'); t.textContent=msg; t.classList.add('on'); clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove('on'),2400); }
document.addEventListener('click', e => {
  const tb = e.target.closest('[data-toast]'); if (tb) toast(tb.dataset.toast);
  const rm = e.target.closest('[data-rm]'); if (rm){ bag.splice(+rm.dataset.rm,1); updateBag(); }
});
const drawer = $('.drawer'), scrim = $('.scrim');
const openBag = o => { drawer.classList.toggle('open',o); scrim.classList.toggle('on',o); drawer.setAttribute('aria-hidden',!o); };
$('.bag-btn').addEventListener('click',()=>openBag(true));
$('.drawer-x').addEventListener('click',()=>openBag(false));
scrim.addEventListener('click',()=>openBag(false));
$('.wish-btn').addEventListener('click',()=>toast(wish ? `${wish} pair${wish>1?'s':''} on your wishlist` : 'Tap ♡ on any pair to save it'));
const mm = $('.mmenu');
$('.menu-btn').addEventListener('click',()=>{ const o=mm.classList.toggle('open'); mm.setAttribute('aria-hidden',!o); });
$$('.mmenu a').forEach(a=>a.addEventListener('click',()=>mm.classList.remove('open')));
document.addEventListener('keydown',e=>{ if(e.key==='Escape'){ openBag(false); mm.classList.remove('open'); }});

/* ---------------- SMOOTH SCROLL ---------------- */
let lenis = null;
if (!reduce && window.Lenis){
  lenis = new Lenis({ duration:1.15, smoothWheel:true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t*1000));
  gsap.ticker.lagSmoothing(0);
  lenis.stop();
}
$$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
  const id=a.getAttribute('href'); if(id.length<2) return; const el=$(id); if(!el) return;
  e.preventDefault(); lenis ? lenis.scrollTo(el,{ offset:0, duration:1.6 }) : el.scrollIntoView({behavior:'smooth'});
}));

/* ---------------- SPLIT TEXT ---------------- */
function splitChars(el, text){
  el.innerHTML = '';
  text.split(' ').forEach((w,wi,arr)=>{
    const ws=document.createElement('span'); ws.style.display='inline-block'; ws.style.whiteSpace='nowrap';
    [...w].forEach(c=>{ const s=document.createElement('span'); s.className='ch'; s.textContent=c; ws.appendChild(s); });
    void 0;
    el.appendChild(ws); if (wi<arr.length-1) el.appendChild(document.createTextNode(' '));
  });
  const chs=$$('.ch', el); chs.forEach((c,i)=>c.style.setProperty('--t', chs.length>1 ? (i/(chs.length-1)).toFixed(3) : 0));
  return chs;
}

/* =========================================================
   HERO SLIDER
   ========================================================= */
const hero = $('.hero');
const models = $$('.model'), thumbs = $$('.thumb');
const l1 = $('.h-l1-in'), l2 = $('.h-l2-in');
let cur = 0, busy = false, auto;
const AUTOPLAY = 6.5;
const setTheme = (s, dur=1) => gsap.to(document.documentElement, { duration:dur, ease:'power2.inOut', '--pa':s.pa, '--pb':s.pb, '--soft':s.soft, '--btn':s.btn, '--sc1':s.sc1, '--sc2':s.sc2 });
splitChars(l1, SLIDES[0].l1); splitChars(l2, SLIDES[0].l2);
models[0].classList.add('is-on');
const railLine = i => { $('.rail-line i').style.transform = `translateY(${i*100}%)`; };

function go(i, dir = 1){
  if (busy || i === cur) return;
  busy = true;
  const s = SLIDES[i], prev = models[cur], nxt = models[i];
  thumbs.forEach((t,k)=>t.classList.toggle('is-active',k===i)); railLine(i);
  const IR = { immediateRender:false };
  const tl = gsap.timeline({ onComplete:()=>{ busy=false; } });
  tl.to($$('.ch', l1), { yPercent:-110, duration:.45, stagger:.012, ease:'power3.in' }, 0)
    .to($$('.ch', l2), { yPercent:-110, opacity:0, duration:.45, stagger:.012, ease:'power3.in' }, .05)
    .to('.giant-num span', { yPercent:-100, duration:.5, ease:'power3.in' }, 0)
    .to('.paint', { clipPath:'inset(0% 0% 0% 100%)', duration:.55, ease:'power3.in', stagger:.05 }, 0)
    .to(prev, { xPercent:14*dir, scale:1.06, opacity:0, filter:'blur(12px)', duration:.6, ease:'power3.in' }, 0)
    .add(()=>{
      setTheme(s, .8);
      splitChars(l1, s.l1); splitChars(l2, s.l2);
      gsap.set($$('.ch', l1).concat($$('.ch', l2)), { yPercent:110 });
      $('[data-hname]').textContent = s.name; $('[data-hprice]').textContent = INR(s.price);
      $('[data-hidx]').textContent = String(i+1).padStart(2,'0');
      $('.giant-num span').textContent = String(i+1).padStart(2,'0');
      cur = i;
    }, .5)
    .add(()=>{ prev.classList.remove('is-on'); gsap.set(prev,{clearProps:'all'}); nxt.classList.add('is-on'); }, .6)
    .fromTo('.paint', { clipPath:'inset(0% 100% 0% 0%)' }, { clipPath:'inset(0% 0% 0% 0%)', duration:1, ease:'expo.out', stagger:.08, ...IR }, .62)
    .fromTo('.paint-a', { rotate:-14, scale:.92 }, { rotate:-8, scale:1, duration:1.4, ease:'expo.out', ...IR }, .62)
    .fromTo(nxt, { xPercent:-10*dir, yPercent:6, scale:.9, rotate:-3*dir, opacity:0, filter:'blur(10px)' },
                 { xPercent:0, yPercent:0, scale:1, rotate:0, opacity:1, filter:'blur(0px)', duration:1.2, ease:'expo.out', clearProps:'filter', ...IR }, .62)
    .fromTo('.giant-num span', { yPercent:100 }, { yPercent:0, duration:1, ease:'expo.out', ...IR }, .7)
    .add(()=>{
      gsap.to($$('.ch', l1), { yPercent:0, duration:.9, stagger:.025, ease:'expo.out' });
      gsap.fromTo($$('.ch', l2), { yPercent:110, opacity:0, rotate:8 }, { yPercent:0, opacity:1, rotate:0, duration:1, stagger:.03, ease:'expo.out', delay:.1 });
    }, .62)
    .fromTo('.spin-badge', { scale:.4, rotate:-90 }, { scale:1, rotate:0, duration:1, ease:'back.out(2)', ...IR }, .7);
  restartAuto();
}
const next = () => go((cur+1)%SLIDES.length, 1);
const prevS = () => go((cur-1+SLIDES.length)%SLIDES.length, -1);
function restartAuto(){
  if (auto) auto.kill();
  auto = gsap.fromTo('.hm-bar i', { scaleX:0 }, { scaleX:1, duration:AUTOPLAY, ease:'none', onComplete:next });
}
thumbs.forEach(t => t.addEventListener('click', () => { const i=+t.dataset.go; go(i, i>cur?1:-1); }));
$$('.arrow').forEach(a => a.addEventListener('click', () => (+a.dataset.dir>0 ? next() : prevS())));
document.addEventListener('keydown', e => {
  if (hero.getBoundingClientRect().bottom < innerHeight*.4) return;
  if (e.key==='ArrowRight') next(); if (e.key==='ArrowLeft') prevS();
});
(() => { // swipe / drag
  let sx=null, sy=0;
  $('.hero-stage').addEventListener('pointerdown', e => { sx=e.clientX; sy=e.clientY; });
  addEventListener('pointerup', e => { if (sx===null) return; const dx=e.clientX-sx, dy=e.clientY-sy; sx=null; if (Math.abs(dx)>50 && Math.abs(dx)>Math.abs(dy)) dx<0?next():prevS(); });
})();
ScrollTrigger.create({ trigger:hero, start:'top top', end:'bottom 20%', onLeave:()=>auto&&auto.pause(), onEnterBack:()=>auto&&auto.resume() });
addEventListener('load', () => models.forEach(m => { const im=new Image(); im.src=m.currentSrc||m.src; }));

if (finePointer && !reduce){
  const qs = [
    ['.stage-inner',1.2,18],['.paint-a',1.6,-30],['.paint-b',1.4,26],['.giant-num',2,-40],['.dots-1',2,40],['.globe',2,24]
  ].map(([sel,d,a])=>[gsap.quickTo(sel,'x',{duration:d,ease:'power3'}), gsap.quickTo(sel,'y',{duration:d,ease:'power3'}), a]);
  hero.addEventListener('mousemove', e => {
    const nx = e.clientX/innerWidth - .5, ny = e.clientY/innerHeight - .5;
    qs.forEach(([qx,qy,a]) => { qx(nx*a); qy(ny*a); });
  });
}
if (!reduce) gsap.to('.stage-inner', { yPercent:-1.6, duration:3.2, ease:'sine.inOut', yoyo:true, repeat:-1 });
gsap.to('.hero-stage', { yPercent:12, scale:.94, ease:'none', scrollTrigger:{ trigger:hero, start:'top top', end:'bottom top', scrub:true } });
gsap.to('.hero-copy', { y:-80, opacity:0, ease:'none', scrollTrigger:{ trigger:hero, start:'top top', end:'bottom 30%', scrub:true } });

/* ---------------- PAINT TRAIL (desktop hero) ---------------- */
(() => {
  if (!finePointer || reduce) return;
  const c = $('.trail'), x = c.getContext('2d'); let w,h; const dpr=Math.min(devicePixelRatio,1.5); const pts=[];
  const rs=()=>{ w=c.width=innerWidth*dpr; h=c.height=innerHeight*dpr; }; rs(); addEventListener('resize',rs);
  let last=null, inHero=true;
  ScrollTrigger.create({ trigger:hero, start:'top top', end:'bottom top', onToggle:s=>inHero=s.isActive });
  addEventListener('mousemove', e => {
    if (!inHero || e.target.closest('.rail,.cta,.nav,.hero-arrows')) { last=null; return; }
    const p={x:e.clientX*dpr,y:e.clientY*dpr};
    if (last){ const d=Math.hypot(p.x-last.x,p.y-last.y); const n=Math.min(8,Math.floor(d/(6*dpr)));
      for(let i=0;i<n;i++) pts.push({ x:last.x+(p.x-last.x)*i/n, y:last.y+(p.y-last.y)*i/n, r:(9+Math.random()*9)*dpr, a:.32, c:i%3===0?1:0 }); }
    last=p;
  });
  const css=getComputedStyle(document.documentElement);
  let dirty=false;
  gsap.ticker.add(()=>{
    if (!pts.length){ if(dirty){ x.clearRect(0,0,w,h); dirty=false; } return; }
    x.clearRect(0,0,w,h); dirty=true;
    const col=[css.getPropertyValue('--pa').trim(), css.getPropertyValue('--pb').trim()];
    for (let i=pts.length-1;i>=0;i--){ const p=pts[i]; p.a-=.011; p.r*=.985; if(p.a<=0){pts.splice(i,1);continue;}
      x.globalAlpha=p.a; x.fillStyle=col[p.c]; x.beginPath(); x.arc(p.x,p.y,p.r,0,6.2832); x.fill(); }
  });
})();

/* ---------------- CURSOR + MAGNETIC ---------------- */
if (finePointer){
  const cur$ = $('.cursor'), dot=$('.cursor-dot'), ring=$('.cursor-ring');
  const dx=gsap.quickTo(dot,'x',{duration:.08}), dy=gsap.quickTo(dot,'y',{duration:.08});
  const rx=gsap.quickTo(ring,'x',{duration:.45,ease:'power3'}), ry=gsap.quickTo(ring,'y',{duration:.45,ease:'power3'});
  $('.cursor-ring em').textContent='Swipe';
  addEventListener('mousemove', e => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
    const t=e.target;
    cur$.classList.toggle('is-hover', !!t.closest('a,button,.mood,.card'));
    cur$.classList.toggle('is-drag', !!t.closest('.hero-stage'));
    cur$.classList.toggle('on-dark', !!t.closest('[data-hdr="dark"],.loud'));
  });
  $$('.magnetic').forEach(b=>{
    const qx=gsap.quickTo(b,'x',{duration:.6,ease:'elastic.out(1,.4)'}), qy=gsap.quickTo(b,'y',{duration:.6,ease:'elastic.out(1,.4)'});
    b.addEventListener('mousemove',e=>{ const r=b.getBoundingClientRect(); qx((e.clientX-r.left-r.width/2)*.3); qy((e.clientY-r.top-r.height/2)*.4); });
    b.addEventListener('mouseleave',()=>{ qx(0); qy(0); });
  });
}

/* ---------------- HEADER ---------------- */
(() => {
  const nav=$('.nav'); let lastY=0;
  const darkSecs=$$('[data-hdr="dark"]');
  const links=$$('.nav-links a');
  const secs=links.map(a=>$(a.getAttribute('href')));
  const onScroll=()=>{
    const y=scrollY;
    nav.classList.toggle('is-hidden', y>lastY+2 && y>innerHeight*.8 && !drawer.classList.contains('open'));
    if (y<lastY-2) nav.classList.remove('is-hidden');
    lastY=y;
    nav.classList.toggle('dark', darkSecs.some(s=>{ const r=s.getBoundingClientRect(); return r.top<=40 && r.bottom>40; }));
    let act=0; secs.forEach((s,i)=>{ if(s && s.getBoundingClientRect().top<innerHeight*.4) act=i; });
    links.forEach((l,i)=>l.classList.toggle('active',i===act));
  };
  lenis ? lenis.on('scroll',onScroll) : addEventListener('scroll',onScroll,{passive:true});
})();

/* ---------------- MARQUEES ---------------- */
$$('.marquee').forEach((m,k)=>{
  const tr=$('.track',m); tr.innerHTML+=tr.innerHTML;
  const tw=gsap.fromTo(tr,{ xPercent:k?-50:0 },{ xPercent:k?0:-50, duration:k?40:30, ease:'none', repeat:-1 });
  ScrollTrigger.create({ trigger:'.marquee-wrap', start:'top bottom', end:'bottom top', onUpdate:s=>{
    const v=1+Math.min(4,Math.abs(s.getVelocity())/500);
    gsap.timeline({overwrite:true}).to(tw,{timeScale:v,duration:.2}).to(tw,{timeScale:1,duration:1});
  }});
});

/* =========================================================
   SEQUENCE FILM (canvas image sequence, coarse→fine loading)
   ========================================================= */
class SeqFilm{
  constructor(canvas, onDraw){
    this.c=canvas; this.x=canvas.getContext('2d'); this.onDraw=onDraw;
    this.n=+canvas.dataset.count; this.mob=isMobile();
    this.base=canvas.dataset.seq+'/'+(this.mob?'m':'d')+'/';
    this.frames=new Array(this.n); this.loaded=new Uint8Array(this.n); this.p=0; this.last=-1;
    this.resize(); addEventListener('resize',()=>{ this.resize(); this.draw(true); });
  }
  url(i){ return this.base+String(i+1).padStart(4,'0')+'.webp'; }
  load(){
    const order=[]; const seen=new Set();
    for (const step of [16,8,4,2,1]) for (let i=0;i<this.n;i+=step) if(!seen.has(i)){ seen.add(i); order.push(i); }
    let k=0, active=0; let res; const first=new Promise(r=>res=r);
    const pump=()=>{ while(active<6 && k<order.length){ const i=order[k++]; active++;
      const im=new Image(); im.decoding='async'; im.src=this.url(i);
      im.onload=()=>{ this.frames[i]=im; this.loaded[i]=1; active--; if(i===0){ this.draw(true); res(); } else this.draw(); pump(); };
      im.onerror=()=>{ active--; if(i===0) res(); pump(); }; } };
    pump(); return first;
  }
  resize(){ const d=Math.min(devicePixelRatio,1.5); const r=this.c.getBoundingClientRect(); this.cw=r.width; this.ch=r.height; this.c.width=Math.round(r.width*d); this.c.height=Math.round(r.height*d); this.d=d; this.last=-1; }
  nearest(i){ if(this.loaded[i]) return i; for(let o=1;o<this.n;o++){ if(i-o>=0&&this.loaded[i-o]) return i-o; if(i+o<this.n&&this.loaded[i+o]) return i+o; } return -1; }
  geom(im){
    const {cw,ch}=this, iw=im.naturalWidth, ih=im.naturalHeight;
    let s, ox, oy;
    if (this.mob){ s=(cw*1.5)/iw; ox=cw/2-iw*s*0.49; oy=ch*0.42-ih*s/2; }
    else { s=Math.max(cw/iw,ch/ih); ox=(cw-iw*s)/2; oy=(ch-ih*s)/2; }
    return { s, ox, oy, iw, ih };
  }
  set(p){ this.p=p; this.draw(); }
  draw(force){
    const i=this.nearest(Math.round(this.p*(this.n-1))); if(i<0) return;
    if(!force && i===this.last) return; this.last=i;
    const im=this.frames[i], g=this.geom(im), x=this.x, d=this.d;
    x.setTransform(d,0,0,d,0,0);
    x.fillStyle='#1b0638'; x.fillRect(0,0,this.cw,this.ch);
    x.drawImage(im,g.ox,g.oy,g.iw*g.s,g.ih*g.s);
    if (this.mob){
      const h=g.ih*g.s, f=h*.3;
      let gr=x.createLinearGradient(0,g.oy,0,g.oy+f); gr.addColorStop(0,'#1b0638'); gr.addColorStop(1,'rgba(27,6,56,0)'); x.fillStyle=gr; x.fillRect(0,g.oy-1,this.cw,f);
      gr=x.createLinearGradient(0,g.oy+h-f,0,g.oy+h); gr.addColorStop(0,'rgba(27,6,56,0)'); gr.addColorStop(1,'#1b0638'); x.fillStyle=gr; x.fillRect(0,g.oy+h-f,this.cw,f+1);
    }
    this.g=g; this.onDraw && this.onDraw(g);
  }
}

/* ---------------- ANATOMY ---------------- */
const anatCanvas=$('.anat-canvas');
const labels=$$('.al');
const placeLabels=g=>{
  if(!g) return;
  if(isMobile()){ labels.forEach(l=>{ l.style.left=l.style.right=l.style.top=''; l.style.transform=''; }); return; }
  labels.forEach(l=>{
    const X=g.ox+(+l.dataset.fx)*g.iw*g.s, Y=g.oy+(+l.dataset.fy)*g.ih*g.s, lead=60;
    l.style.top=Y+'px'; l.style.transform='translateY(-50%)';
    if(l.dataset.side==='r'){ l.style.left=(X+lead)+'px'; l.style.right='auto'; }
    else { l.style.right=(anatCanvas.clientWidth-X+lead)+'px'; l.style.left='auto'; }
  });
};
const anat=new SeqFilm(anatCanvas, placeLabels);
let anatLoading=null;
const loadAnat=()=> anatLoading || (anatLoading=anat.load());
ScrollTrigger.create({ trigger:'.anatomy', start:'top 300%', once:true, onEnter:loadAnat });
ScrollTrigger.create({
  trigger:'.anatomy', start:'top top', end:'bottom bottom', scrub:true,
  onUpdate:s=>{
    const p=s.progress;
    anat.set(gsap.utils.clamp(0,1,(p-.06)/.48));
    $('.anat-progress i').style.transform=`scaleX(${p})`;
    labels.forEach(l=>{ const o=gsap.utils.clamp(0,1,(p-(+l.dataset.at))/.05); l.style.opacity=o; l.style.translate=(l.dataset.side==='r'?(1-o)*24:-(1-o)*24)+'px 0'; });
    const ho=1-gsap.utils.clamp(0,1,(p-.46)/.1);
    $('.anat-head').style.opacity=ho; $('.anat-stats').style.opacity=ho;
  }
});
gsap.from('.anat-head > *',{ y:60, opacity:0, stagger:.12, duration:1, ease:'expo.out', scrollTrigger:{ trigger:'.anatomy', start:'top 60%' } });
$$('[data-count-to]').forEach(el=>{
  const o={v:0};
  gsap.to(o,{ v:+el.dataset.countTo, duration:1.6, ease:'power2.out', onUpdate:()=>el.textContent=Math.round(o.v), scrollTrigger:{ trigger:'.anatomy', start:'top 30%' } });
});

/* ---------------- FLUX COLORWAY ---------------- */
(() => {
  const sec=$('.flux'), sws=$$('.sw'), fxs=$$('.fx'); let fi=0, fbusy=false;
  sws.forEach(sw=>sw.addEventListener('click',()=>{
    const i=+sw.dataset.c; if(i===fi||fbusy) return; fbusy=true;
    const f=FLUX[i], r=sw.getBoundingClientRect(), sr=sec.getBoundingClientRect();
    sws.forEach(s=>{ s.classList.toggle('is-active',s===sw); s.setAttribute('aria-checked',s===sw); });
    const base=sec.querySelector('.flux-flood');
    const flood=document.createElement('div'); flood.className='flux-flood'; flood.style.background=f.fbg;
    base.after(flood);
    const cx=r.left+r.width/2-sr.left, cy=r.top+r.height/2-sr.top;
    gsap.fromTo(flood,{ clipPath:`circle(0px at ${cx}px ${cy}px)` },{ clipPath:`circle(${Math.hypot(sr.width,sr.height)}px at ${cx}px ${cy}px)`, duration:1.1, ease:'power3.inOut', onComplete:()=>{ sec.style.setProperty('--fbg',f.fbg); base.remove(); flood.style.background=''; } });
    const out=fxs[fi], inn=fxs[i];
    gsap.timeline({ onComplete:()=>{ fbusy=false; } })
      .to(out,{ xPercent:-60, rotate:-18, opacity:0, duration:.6, ease:'power3.in' })
      .add(()=>{ out.classList.remove('is-on'); gsap.set(out,{clearProps:'transform,opacity'}); sec.style.setProperty('--fc1',f.fc1); sec.style.setProperty('--fc2',f.fc2); $('[data-fname]').textContent=f.name; })
      .fromTo(inn,{ xPercent:60, rotate:20, opacity:0, yPercent:-50 },{ xPercent:0, rotate:0, opacity:1, yPercent:-50, duration:1.1, ease:'expo.out', onStart:()=>inn.classList.add('is-on') })
      .fromTo('.flux-name',{ yPercent:60, opacity:0 },{ yPercent:0, opacity:1, duration:.6, ease:'expo.out' },'<');
    fi=i;
  }));
  $$('.sz:not(.out)').forEach(b=>b.addEventListener('click',()=>{ $$('.sz').forEach(x=>x.classList.remove('is-active')); b.classList.add('is-active'); }));
  $('.add-flux').addEventListener('click',()=>{
    const p={...PRODUCTS.find(p=>p.id==='flux')}; p.img=['flux-1.webp','flux-2.webp','flux-3.webp'][fi]; p.id='flux-'+fi;
    addToBag(p, `${FLUX[fi].name} · UK ${$('.sz.is-active').textContent}`, $('.fx.is-on'));
  });
  if(!reduce) gsap.to('.flux-shoes',{ y:-18, rotate:-2, duration:2.6, ease:'sine.inOut', yoyo:true, repeat:-1 });
  if (finePointer){
    const st=$('.flux-stage'); gsap.set(st,{transformPerspective:900});
    const rx=gsap.quickTo(st,'rotationY',{duration:.8}), ry=gsap.quickTo(st,'rotationX',{duration:.8});
    st.addEventListener('mousemove',e=>{ const r=st.getBoundingClientRect(); rx(((e.clientX-r.left)/r.width-.5)*16); ry(-((e.clientY-r.top)/r.height-.5)*12); });
    st.addEventListener('mouseleave',()=>{ rx(0); ry(0); });
  }
  gsap.fromTo('.flux-word',{ xPercent:0 },{ xPercent:-30, ease:'none', scrollTrigger:{ trigger:sec, start:'top bottom', end:'bottom top', scrub:true } });
  gsap.from('.flux-shoes',{ scale:.6, rotate:-16, xPercent:30, opacity:0, duration:1.4, ease:'expo.out', scrollTrigger:{ trigger:sec, start:'top 65%' } });
  gsap.from('.flux-ring',{ scale:.3, opacity:0, duration:1.4, ease:'expo.out', scrollTrigger:{ trigger:sec, start:'top 65%' } });
  gsap.from('.flux-info > *',{ y:40, opacity:0, stagger:.07, duration:1, ease:'expo.out', scrollTrigger:{ trigger:sec, start:'top 60%' } });
})();

/* ---------------- SHOP GRID ---------------- */
(() => {
  const grid=$('[data-grid]');
  grid.innerHTML=PRODUCTS.map(p=>`
    <article class="card" data-type="${p.type}" style="--cbg:${p.bg};--cbl:${p.bl}">
      <div class="card-art"><img src="assets/img/${p.img}" alt="${p.name} — ${p.cat}" loading="lazy"></div>
      <span class="card-tag">${p.tag}</span>
      <button class="card-wish" aria-label="Save ${p.name}"><svg viewBox="0 0 24 24"><path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/></svg></button>
      <button class="card-add" aria-label="Add ${p.name} to bag" data-id="${p.id}">+</button>
      <div class="card-body"><div><h3>${p.name}</h3><p>${p.cat}</p><div class="card-dots">${p.dots.map(d=>`<i style="--d:${d}"></i>`).join('')}</div></div><b>${INR(p.price)}</b></div>
    </article>`).join('');
  $$('.card-add',grid).forEach(b=>b.addEventListener('click',()=>{ const p=PRODUCTS.find(x=>x.id===b.dataset.id); addToBag(p,'UK 7',b.closest('.card').querySelector('img')); }));
  $$('.card-wish',grid).forEach(b=>b.addEventListener('click',()=>{ b.classList.toggle('on'); wish+=b.classList.contains('on')?1:-1; const w=$('[data-wish]'); w.textContent=wish; w.classList.toggle('has',wish>0); }));
  if(finePointer) $$('.card',grid).forEach(c=>{
    gsap.set(c,{transformPerspective:800});
    const rx=gsap.quickTo(c,'rotationY',{duration:.6}), ry=gsap.quickTo(c,'rotationX',{duration:.6});
    c.addEventListener('mousemove',e=>{ const r=c.getBoundingClientRect(); rx(((e.clientX-r.left)/r.width-.5)*10); ry(-((e.clientY-r.top)/r.height-.5)*10); });
    c.addEventListener('mouseleave',()=>{ rx(0); ry(0); });
  });
  gsap.set($$('.card',grid),{ y:80, opacity:0 });
  ScrollTrigger.batch($$('.card',grid),{ start:'top 92%', once:true, onEnter:b=>gsap.to(b,{ y:0, opacity:1, stagger:.08, duration:1.1, ease:'expo.out' }) });
  $$('.flt').forEach(f=>f.addEventListener('click',()=>{
    $$('.flt').forEach(x=>x.classList.toggle('is-active',x===f));
    const t=f.dataset.f, cards=$$('.card',grid);
    gsap.to(cards,{ opacity:0, scale:.92, duration:.25, ease:'power2.in', onComplete:()=>{
      cards.forEach(c=>c.classList.toggle('is-hidden', t!=='all' && c.dataset.type!==t));
      gsap.fromTo(cards.filter(c=>!c.classList.contains('is-hidden')),{ opacity:0, y:30, scale:.95 },{ opacity:1, y:0, scale:1, stagger:.05, duration:.6, ease:'expo.out' });
      ScrollTrigger.refresh();
    }});
  }));
})();

$$('.sec-head h2').forEach(h=> gsap.from(h,{ yPercent:40, opacity:0, duration:1.2, ease:'expo.out', scrollTrigger:{ trigger:h, start:'top 88%' } }));

/* ---------------- VIDEO helper ---------------- */
const vSrc = v => v.dataset.src + (isMobile() ? '-m.mp4' : '.mp4');
const ensureSrc = v => { if(!v.getAttribute('src')) v.src=vSrc(v); };
const vio=new IntersectionObserver(es=>es.forEach(e=>{
  const v=e.target;
  if(e.isIntersecting){ ensureSrc(v); if(!v.closest('.mood')||v.closest('.mood.is-open')) v.play().catch(()=>{}); }
  else v.pause();
}),{ rootMargin:'300px' });
$$('video[data-src]').forEach(v=>vio.observe(v));

/* ---------------- MOODS ---------------- */
(() => {
  const ms=$$('.mood');
  const open=m=>{ ms.forEach(x=>{ const on=x===m; x.classList.toggle('is-open',on); const v=$('video',x); if(on){ ensureSrc(v); v.play().catch(()=>{}); } else v.pause(); }); };
  ms.forEach(m=>{ m.addEventListener('click',()=>open(m)); if(finePointer) m.addEventListener('mouseenter',()=>open(m)); });
  gsap.from(ms,{ y:100, opacity:0, stagger:.12, duration:1.2, ease:'expo.out', scrollTrigger:{ trigger:'.mood-row', start:'top 85%' } });
})();

/* ---------------- MOVE LOUD ---------------- */
(() => {
  const tl=gsap.timeline({ scrollTrigger:{ trigger:'.loud', start:'top top', end:'bottom bottom', scrub:true } });
  tl.fromTo('.loud-mask',{ scale:1 },{ scale:()=>isMobile()?26:34, ease:'power2.in', duration:1 })
    .to('.loud-mask',{ opacity:0, duration:.15 },'-=.12')
    .to('.loud-shade',{ opacity:1, duration:.2 },'-=.1')
    .fromTo('.loud-copy',{ opacity:0, y:60 },{ opacity:1, y:0, duration:.35, ease:'power2.out' },'-=.05')
    .to({}, { duration:.2 });
})();

/* ---------------- COUNTDOWN / DROP ---------------- */
(() => {
  let target=new Date('2026-11-01T19:00:00+05:30').getTime();
  while(target<Date.now()) target+=7*864e5;
  const el={d:$('[data-d]'),h:$('[data-h]'),m:$('[data-m]'),s:$('[data-s]')};
  const pad=n=>String(n).padStart(2,'0');
  const tick=()=>{ let t=Math.max(0,target-Date.now())/1000; el.d.textContent=pad(Math.floor(t/86400)); t%=86400; el.h.textContent=pad(Math.floor(t/3600)); t%=3600; el.m.textContent=pad(Math.floor(t/60)); el.s.textContent=pad(Math.floor(t%60)); };
  tick(); setInterval(tick,1000);
  $('.drop-form').addEventListener('submit',e=>{ e.preventDefault(); const i=$('input',e.target); if(!/^\S+@\S+\.\S+$/.test(i.value)){ toast('Enter a valid email'); i.focus(); return; } toast("You're on the list. See you on drop day ✺"); i.value=''; });
  gsap.from('.drop-card',{ y:80, opacity:0, scale:.96, duration:1.2, ease:'expo.out', scrollTrigger:{ trigger:'.drop', start:'top 80%' } });
  gsap.from('.drop-shoe',{ xPercent:40, rotate:25, opacity:0, duration:1.4, ease:'expo.out', scrollTrigger:{ trigger:'.drop', start:'top 70%' } });
})();
gsap.from('.foot-word',{ yPercent:40, opacity:0, duration:1.4, ease:'expo.out', scrollTrigger:{ trigger:'.foot', start:'top 80%' } });

/* =========================================================
   PRELOADER + INTRO
   ========================================================= */
(() => {
  const need=['assets/img/model-1.webp','assets/img/brush-1.webp','assets/img/brush-2.webp','assets/img/brush-3.webp','assets/img/shoe-1.webp'];
  const all=[...need.map(src=>new Promise(r=>{ const i=new Image(); i.onload=i.onerror=r; i.src=src; })), document.fonts ? document.fonts.ready : Promise.resolve()];
  const cnt={v:0}, numEl=$('.loader-count b'); let real=0; all.forEach(p=>p.then(()=>real++));
  gsap.fromTo('.loader-word span',{ yPercent:110 },{ yPercent:0, duration:.9, stagger:.06, ease:'expo.out', delay:.1 });
  gsap.to('.loader-word span',{ backgroundPosition:'100% 0', duration:2.4, ease:'none', repeat:-1, yoyo:true });
  const prog=gsap.to(cnt,{ v:92, duration:2.2, ease:'power1.out', onUpdate:()=>numEl.textContent=Math.round(Math.min(cnt.v, 30+real/all.length*62)) });
  const done=Promise.all([...all, new Promise(r=>setTimeout(r,1500))]);
  Promise.race([done, new Promise(r=>setTimeout(r,7000))]).then(()=>{
    prog.kill(); cnt.v=+numEl.textContent;
    gsap.to(cnt,{ v:100, duration:.45, onUpdate:()=>numEl.textContent=Math.round(cnt.v), onComplete:exit });
  });
  function exit(){
    const tl=gsap.timeline({ onComplete:()=>{ $('.loader').remove(); document.body.classList.remove('is-loading'); lenis&&lenis.start(); ScrollTrigger.refresh(); restartAuto(); } });
    tl.to('.loader-word span',{ yPercent:-120, duration:.5, stagger:.04, ease:'power3.in' })
      .to('.loader-count, .loader-tag',{ opacity:0, duration:.3 },'<')
      .to('.loader-paint i',{ yPercent:-101, duration:.01 },'>')
      .fromTo('.loader-paint i',{ yPercent:101 },{ yPercent:0, duration:.55, stagger:.08, ease:'power3.inOut' },'<')
      .set('.loader',{ backgroundColor:'transparent' })
      .to('.loader-paint i',{ yPercent:-101, duration:.6, stagger:-.08, ease:'power3.inOut' })
      .add(intro,'-=.45');
  }
  function intro(){
    gsap.from('.nav',{ yPercent:-150, duration:1, ease:'expo.out' });
    gsap.from('.paint',{ clipPath:'inset(0% 100% 0% 0%)', duration:1.4, stagger:.12, ease:'expo.out' });
    gsap.from('.blob',{ scale:.4, opacity:0, duration:1.6, ease:'expo.out' });
    gsap.from(models[0],{ yPercent:12, scale:.86, opacity:0, duration:1.4, ease:'expo.out', delay:.1 });
    gsap.from($$('.ch',l1),{ yPercent:110, duration:1, stagger:.03, ease:'expo.out', delay:.15 });
    gsap.from($$('.ch',l2),{ yPercent:110, rotate:8, opacity:0, duration:1.1, stagger:.035, ease:'expo.out', delay:.3 });
    gsap.from('.hero-copy .eyebrow, .lede, .cta, .hero-meta',{ y:30, opacity:0, stagger:.08, duration:1, ease:'expo.out', delay:.4 });
    gsap.from('.thumb',{ x:isMobile()?0:80, y:isMobile()?60:0, opacity:0, stagger:.07, duration:1, ease:'expo.out', delay:.35, clearProps:'transform' });
    gsap.from('.spin-badge, .globe, .squiggle, .dots, .giant-num, .hero-arrows, .scroll-cue',{ opacity:0, scale:.6, stagger:.05, duration:1, ease:'back.out(1.6)', delay:.5 });
  }
})();

let rT; addEventListener('resize',()=>{ clearTimeout(rT); rT=setTimeout(()=>ScrollTrigger.refresh(),200); });
})();
