(function(){
window.KX_READY=true;
var d=document,h=d.documentElement,reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function clamp(v,a,b){return Math.min(b,Math.max(a,v))}
function ease(t){return 1-Math.pow(1-t,3)}

/* boot */
var boot=d.getElementById('boot');
function finishBoot(){if(h.classList.contains('booted'))return;boot.classList.add('done');h.classList.add('booted');setTimeout(function(){boot.style.display='none'},950)}
if(reduce||!boot){h.classList.add('booted');if(boot)boot.style.display='none'}
else{
  var lines=['KESTREX OS // BUILD 7.4','> frame integrity ............ OK','> plate alignment ............ OK','> neural link handshake ...... OK','> core temperature ........... STABLE','> ALL SYSTEMS ONLINE'];
  var seen=false;try{seen=sessionStorage.getItem('kx_boot')==='1';sessionStorage.setItem('kx_boot','1')}catch(e){}
  var dur=seen?900:2600,t0=performance.now(),log=d.getElementById('bootLog'),pct=d.getElementById('bootPct'),arc=d.getElementById('bootArc');
  d.getElementById('bootSkip').addEventListener('click',finishBoot);
  (function tick(now){var p=clamp((now-t0)/dur,0,1);pct.textContent=String(Math.round(p*100)).padStart(2,'0');arc.style.strokeDashoffset=327*(1-p);
    log.textContent=lines.slice(0,Math.ceil(p*lines.length)).join('\n');
    if(p<1&&!h.classList.contains('booted'))requestAnimationFrame(tick);else setTimeout(finishBoot,seen?150:450)})(t0);
}

/* mobile menu */
var mb=d.getElementById('menuBtn'),mm=d.getElementById('mmenu');
function setMenu(o){h.classList.toggle('menu-open',o);mm.hidden=!o;mb.setAttribute('aria-expanded',o);mb.setAttribute('aria-label',o?'Close menu':'Open menu')}
if(mb&&mm){mb.addEventListener('click',function(){setMenu(mm.hidden)});mm.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){setMenu(false)})});d.addEventListener('keydown',function(e){if(e.key==='Escape')setMenu(false)})}
/* reveals */
var rv=d.querySelectorAll('.rv');
if('IntersectionObserver' in window&&!reduce){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.15,rootMargin:'0px 0px -5% 0px'});rv.forEach(function(el,i){el.style.transitionDelay=(i%4)*90+'ms';io.observe(el)})}
else rv.forEach(function(el){el.classList.add('in')});

/* statement words */
var words=d.getElementById('words'),ws=[];
if(words&&!reduce){var hot=/^(fire|storm|life)/i;words.innerHTML=words.textContent.split(' ').map(function(w){return '<span class="w'+(hot.test(w)?' hot-w':'')+'">'+w+'</span>'}).join(' ');ws=[].slice.call(words.querySelectorAll('.w'))}

/* assembly */
var asSec=d.getElementById('assembly'),suit=d.querySelector('.suit-assemble'),items=d.querySelectorAll('#asList li'),pctEl=d.getElementById('asPct'),bar=d.getElementById('asBar'),now=d.getElementById('asNow'),stage=d.querySelector('.as-stage');
var parts=[
 {el:suit.querySelector('.p-legs'),L:[-70,320,0],R:[70,320,0],name:'LEG FRAMES',y:.82},
 {el:suit.querySelector('.p-pelvis'),o:[0,260,0,.6],name:'PELVIS GUARD',y:.52},
 {el:suit.querySelector('.p-torso'),o:[0,-40,0,1.7],name:'CHEST SHELL',y:.34},
 {el:suit.querySelector('.p-arms'),L:[-260,-30,-25],R:[260,-30,25],name:'ARM GAUNTLETS',y:.45},
 {el:suit.querySelector('.p-helmet'),o:[0,-300,0,1],name:'HELMET AND VISOR',y:.1},
 {el:suit.querySelector('.p-core'),o:[0,0,0,0],name:'CORE IGNITION',y:.28}];
function tf(x,y,r,s){return 'translate('+x+'px,'+y+'px) rotate('+(r||0)+'deg) scale('+(s==null?1:s)+')'}
function setPart(pt,t){var e=ease(t),k=1-e,el=pt.el;el.style.opacity=t<=0?0:clamp(t*2.2,0,1);
  if(pt.L){el.querySelector('.sL').style.transform=tf(pt.L[0]*k,pt.L[1]*k,pt.L[2]*k);el.querySelector('.sR').style.transform=tf(pt.R[0]*k,pt.R[1]*k,pt.R[2]*k)}
  else{var s=pt.o[3]==null?1:pt.o[3];el.style.transform=tf(pt.o[0]*k,pt.o[1]*k,0,s+(1-s)*e)}}
var lastStep=-2;
function assembly(){
  if(reduce)return;
  var r=asSec.getBoundingClientRect(),total=asSec.offsetHeight-window.innerHeight,p=clamp(-r.top/total,0,1),step=-1;
  var span=.13,start=.04;
  parts.forEach(function(pt,i){var t=clamp((p-start-i*span)/span,0,1);setPart(pt,t);if(t>0)step=i});
  var done=clamp((p-start)/(span*6),0,1);
  pctEl.textContent=Math.round(done*100)+'%';bar.style.transform='scaleX('+done+')';
  if(step!==lastStep){lastStep=step;items.forEach(function(li,i){li.classList.toggle('on',i<=step)});now.textContent=done>=1?'ALL SYSTEMS ONLINE':(step<0?'AWAITING FRAME':'LOCKING '+parts[Math.max(0,step)].name)}
  var cur=parts[Math.max(0,step)];stage.style.setProperty('--scan',(cur?cur.y*100:50)+'%');stage.style.setProperty('--scanop',done>0&&done<1?1:0);
  suit.classList.toggle('lit',done>=1);
}
/* hero parallax */
var hero=d.getElementById('hero'),stageH=d.querySelector('.hero-stage'),copy=d.querySelector('.hero-copy'),mx=0,my=0,cx=0,cy=0,deps=d.querySelectorAll('.hero [data-depth]');
if(!reduce&&window.matchMedia('(pointer:fine)').matches){window.addEventListener('mousemove',function(e){mx=(e.clientX/window.innerWidth-.5);my=(e.clientY/window.innerHeight-.5)},{passive:true})}
function heroFx(){var y=window.scrollY,hh=hero.offsetHeight;if(y>hh)return;cx+=(mx-cx)*.06;cy+=(my-cy)*.06;
  deps.forEach(function(el){var dp=+el.dataset.depth;if(el===stageH){el.style.translate='0 '+(y*dp)+'px'}else{el.style.transform='translate('+(cx*dp*-80)+'px,'+(cy*dp*-60)+'px)'}});
  copy.style.transform='translateY('+(y*-.12)+'px)';copy.style.opacity=clamp(1-y/(hh*.8),0,1);}
function words_(){if(!ws.length)return;var r=words.getBoundingClientRect(),vh=window.innerHeight,p=clamp((vh*.85-r.top)/(r.height+vh*.35),0,1),n=Math.round(p*ws.length);
  ws.forEach(function(w,i){var on=i<n;w.classList.toggle('on',on);w.classList.toggle('hot',on&&w.classList.contains('hot-w'))})}
var ticking=false;function loop(){heroFx();ticking=false}
function onScroll(){assembly();words_();if(!ticking){ticking=true;requestAnimationFrame(loop)}}
window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll);
(function raf(){if(!reduce&&(Math.abs(mx-cx)>.001||Math.abs(my-cy)>.001))heroFx();requestAnimationFrame(raf)})();
onScroll();

/* embers */
var cv=d.getElementById('embers');
if(cv&&!reduce&&cv.getContext){var c=cv.getContext('2d'),W,H,dpr=Math.min(window.devicePixelRatio||1,2),ps=[],vis=true,N=window.innerWidth<700?45:110;
  function size(){W=cv.clientWidth;H=cv.clientHeight;cv.width=W*dpr;cv.height=H*dpr;c.setTransform(dpr,0,0,dpr,0,0)}
  function mk(init){return{x:W*(.35+Math.random()*.65),y:init?Math.random()*H:H+10,v:.3+Math.random()*1.1,r:.6+Math.random()*2.2,a:.3+Math.random()*.7,w:Math.random()*6.28,hue:Math.random()<.6?'255,140,40':'255,50,40'}}
  size();for(var i=0;i<N;i++)ps.push(mk(true));window.addEventListener('resize',size);
  if('IntersectionObserver' in window)new IntersectionObserver(function(e){vis=e[0].isIntersecting}).observe(hero);
  (function draw(){requestAnimationFrame(draw);if(!vis)return;c.clearRect(0,0,W,H);c.globalCompositeOperation='lighter';
    for(var i=0;i<ps.length;i++){var p=ps[i];p.y-=p.v;p.w+=.02;p.x+=Math.sin(p.w)*.4;if(p.y<-10)ps[i]=p=mk(false);
      var g=p.a*clamp(p.y/H*1.4,0,1);c.fillStyle='rgba('+p.hue+','+g+')';c.beginPath();c.arc(p.x,p.y,p.r,0,6.283);c.fill();
      c.fillStyle='rgba('+p.hue+','+g*.15+')';c.beginPath();c.arc(p.x,p.y,p.r*4,0,6.283);c.fill()}
    c.globalCompositeOperation='source-over'})();
}
})();