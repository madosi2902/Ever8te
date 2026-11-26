(function(){
  // Newsletter: Double-Opt-In über Brevo (Netlify-Function /api/newsletter)
  document.querySelectorAll('form.signup').forEach(function(f){
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var btn=f.querySelector('button'),lab=btn.querySelector('span'),msg=f.querySelector('.signup-msg'),old=lab.textContent;
      btn.disabled=true;lab.textContent='Sende …';msg.textContent='';msg.className='signup-msg';
      var body=new URLSearchParams(new FormData(f)).toString(),hdr={'Content-Type':'application/x-www-form-urlencoded'};
      fetch('/api/newsletter',{method:'POST',headers:hdr,body:body})
      .then(function(r){return r.json().catch(function(){return {}}).then(function(d){
        // Solange Brevo nicht eingerichtet ist: Anmeldung wie bisher über Netlify Forms speichern
        if(d.error==='not_configured'||r.status===404){return fetch('/',{method:'POST',headers:hdr,body:body}).then(function(r2){if(!r2.ok){throw {}}return {ok:true,legacy:true}})}
        if(!r.ok||!d.ok){throw d}return d})})
      .then(function(d){f.classList.add('done');msg.textContent=d.legacy?'Danke! Dein Code kommt per E-Mail.':d.existing?'Du bist schon angemeldet. Schau in dein Postfach, dort liegt dein Code.':'Fast geschafft! Bitte bestätige deine Anmeldung über den Link in der E-Mail, die wir dir gerade geschickt haben. Danach kommt dein Code.';msg.className='signup-msg ok'})
      .catch(function(d){msg.textContent=d&&d.error==='invalid_email'?'Bitte prüfe deine E-Mail-Adresse.':'Das hat nicht geklappt. Bitte versuch es noch einmal.';msg.className='signup-msg err';btn.disabled=false;lab.textContent=old});
    });
  });
  // Mobiles Menü
  var t=document.querySelector('.nav-toggle'),nav=document.getElementById('mainnav');
  if(t&&nav){
    function set(o){t.setAttribute('aria-expanded',o?'true':'false');document.documentElement.classList.toggle('menu-open',o)}
    t.addEventListener('click',function(){set(t.getAttribute('aria-expanded')!=='true')});
    nav.addEventListener('click',function(e){if(e.target.closest('a')){set(false)}});
    addEventListener('keydown',function(e){if(e.key==='Escape'){set(false)}});
  }
})();
window.E8inf=function(root){
  if(!root){return {start:function(){}}}
  var K=1.15,P=2600,svg=root.querySelector('svg'),ball=svg.querySelector('.ball'),hits=svg.querySelectorAll('.hit'),tg=svg.querySelector('.trail');
  var ns='http://www.w3.org/2000/svg',trail=[],N=7,cnt=document.getElementById('rally'),rl=document.querySelector('.rally');
  for(var i=0;i<N;i++){var c=document.createElementNS(ns,'circle');c.setAttribute('r',(.075*(1-i/N)).toFixed(3));c.setAttribute('opacity',(.5*(1-i/N)).toFixed(2));c.style.opacity='0';tg.appendChild(c);trail.push(c)}
  function at(t){return [K*Math.sin(t)*Math.cos(t),Math.cos(t)]}
  function put(el,t){var p=at(t);el.setAttribute('cx',p[0].toFixed(4));el.setAttribute('cy',p[1].toFixed(4))}
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,run=false,vis=true,t=0,last=performance.now(),lastHit=0,n=0,raf=0;
  function pop(i){var h=hits[i];if(h.animate){h.animate([{transform:'scale(.5)',opacity:1},{transform:'scale(3.4)',opacity:0}],{duration:560,easing:'cubic-bezier(.2,.7,.3,1)'})}
    if(ball.animate){ball.animate([{transform:'scale(1.5,.7)'},{transform:'scale(1)'}],{duration:220,easing:'ease-out'})}
    n++;if(cnt){cnt.textContent=n}}
  function frame(now){
    var dt=Math.min(64,now-last);last=now;t+=dt/P*2*Math.PI;
    var h=Math.floor(t/Math.PI);if(h>lastHit){lastHit=h;pop(h%2)}
    put(ball,t);for(var i=0;i<N;i++){put(trail[i],t-(i+1)*.075)}
    raf=requestAnimationFrame(frame)}
  function go(){if(run&&vis&&!document.hidden&&!raf){last=performance.now();raf=requestAnimationFrame(frame)}}
  function stop(){if(raf){cancelAnimationFrame(raf);raf=0}}
  ball.style.transformBox='fill-box';ball.style.transformOrigin='center';
  if('IntersectionObserver' in window){new IntersectionObserver(function(e){vis=e[0].isIntersecting;vis?go():stop()}).observe(root)}
  document.addEventListener('visibilitychange',function(){document.hidden?stop():go()});
  var api={start:function(){if(reduce||run){return}run=true;trail.forEach(function(c){c.style.opacity=''});if(rl){rl.hidden=false}go()},
           hide:function(){if(!reduce){ball.style.opacity='0'}},
           show:function(){ball.style.opacity=''}};
  if(!reduce&&!window.gsap){api.start()}
  return api;
};
(function(){
  var pk=document.getElementById('picker');if(!pk){return}
  var base=parseFloat(pk.dataset.base),q=1,MAX=20;
  var qo=document.getElementById('qty'),tot=document.getElementById('tot'),sub=document.getElementById('totSub'),btn=document.getElementById('cartBtn'),lab=document.getElementById('cartLabel');
  var tiers=pk.querySelectorAll('.tier');
  function rate(n){return n>=6?.18:n>=3?.12:n>=2?.07:0}
  function eur(v){return v.toFixed(2).replace('.',',')+' €'}
  function render(){
    var unit=Math.round(base*(1-rate(q))*100)/100,t=Math.round(unit*q*100)/100;
    qo.textContent=q;tot.textContent=eur(t);
    sub.textContent=(rate(q)?'statt '+eur(base*q)+', ':'')+eur(t/(q*.5)).replace(' €',' €/kg')+', inkl. MwSt., zzgl. Versand';
    lab.textContent='In den Warenkorb · '+eur(t);
    btn.href=pk.dataset.cart+q+pk.dataset.utm;
    tiers.forEach(function(b){var m=+b.dataset.qty,nx=m==1?2:m==2?3:m==3?6:99;b.setAttribute('aria-pressed',q>=m&&q<nx?'true':'false')});
  }
  tiers.forEach(function(b){b.addEventListener('click',function(){q=+b.dataset.qty;render()})});
  pk.querySelectorAll('[data-step]').forEach(function(b){b.addEventListener('click',function(){q=Math.min(MAX,Math.max(1,q+(+b.dataset.step)));render()})});
  render();
})();
(function(){
  if(!document.querySelector('.page-hero')){return} // Startseite: eigenes Skript (home.js)
  var bar=document.getElementById('buybar'),buy=document.getElementById('kaufen');
  function tog(){if(!bar){return}var r=buy?buy.getBoundingClientRect():{top:1e9,bottom:1e9};bar.classList.toggle('on',scrollY>240&&(r.top>innerHeight||r.bottom<0))}
  addEventListener('scroll',tog,{passive:true});tog();
  var pInf=E8inf(document.querySelector('.page-hero .eight'));
  if(matchMedia('(prefers-reduced-motion: reduce)').matches||!window.gsap||!window.ScrollTrigger){pInf.start();return}
  pInf.hide();
  gsap.registerPlugin(ScrollTrigger);
  gsap.timeline({defaults:{ease:'expo.out'}})
    .from('.page-hero h1',{xPercent:-40,skewX:-20,opacity:0,duration:.9})
    .fromTo('.page-hero .inf-path',{strokeDasharray:1,strokeDashoffset:1},{strokeDashoffset:0,duration:.9,ease:'power2.inOut'},.05)
    .fromTo('.page-hero .inf-rot',{rotation:0},{rotation:90,duration:.95,ease:'back.out(1.5)'},.95)
    .add(function(){pInf.show();pInf.start()},1.6)
    .from('.page-hero .lede',{y:24,opacity:0,duration:.6},.45);
  gsap.to('.page-hero .eight',{scale:1.12,ease:'none',scrollTrigger:{trigger:'.page-hero',start:'top top',end:'bottom top',scrub:.5}});
  gsap.utils.toArray('h2.display').forEach(function(h){ScrollTrigger.create({trigger:h,start:'top 92%',once:true,onEnter:function(){gsap.from(h,{xPercent:-12,skewX:-14,duration:.7,ease:'expo.out'})}})});
  function once(sel,start,fn){if(document.querySelector(sel)){ScrollTrigger.create({trigger:sel,start:start,once:true,onEnter:fn})}}
  once('.ing','top 85%',function(){gsap.from('.ing li',{x:-50,duration:.5,stagger:.06,ease:'power3.out'})});
  once('.tablewrap','top 85%',function(){gsap.from('.ntable tbody tr',{x:40,duration:.4,stagger:.04,ease:'power3.out'})});
  once('.tiers','top 88%',function(){gsap.from('.tiers li',{y:50,rotation:-4,duration:.5,stagger:.08,ease:'back.out(1.6)'})});
  once('.quote blockquote','top 85%',function(){
    gsap.from('.quote .mark',{scale:0,rotation:-40,transformOrigin:'left bottom',duration:.6,ease:'back.out(2)'});
    gsap.from('.quote blockquote',{clipPath:'inset(0 100% 0 0)',duration:1.1,ease:'power3.out'});
  });
  gsap.utils.toArray('.frame').forEach(function(f){gsap.to(f,{y:-40,rotation:-6,ease:'none',scrollTrigger:{trigger:f,start:'top bottom',end:'bottom top',scrub:.6}})});
  gsap.utils.toArray('.court-line').forEach(function(l){gsap.fromTo(l,{scaleX:0},{scaleX:1,ease:'none',scrollTrigger:{trigger:l,start:'top 95%',end:'top 40%',scrub:.4}})});
  document.querySelectorAll('.faq details').forEach(function(d){d.addEventListener('toggle',function(){if(d.open){gsap.from(d.querySelector('.a'),{height:0,opacity:0,duration:.35,ease:'power2.out',clearProps:'height,opacity'})}})});
  addEventListener('load',function(){ScrollTrigger.refresh()});
})();
