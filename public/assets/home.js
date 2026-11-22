(function(){
  var bar=document.getElementById('buybar'), hero=document.getElementById('hero'), buy=document.getElementById('kaufen');
  if('IntersectionObserver' in window){
    var seen={hero:true,buy:false};
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){seen[e.target===hero?'hero':'buy']=e.isIntersecting});
      bar.classList.toggle('on',!seen.hero&&!seen.buy);
    });
    io.observe(hero);io.observe(buy);
  }
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce||!window.gsap||!window.ScrollTrigger){E8inf(document.querySelector('.hero .eight')).start();return}
  gsap.registerPlugin(ScrollTrigger);

  // Auftakt
  var heroInf=E8inf(document.querySelector('.hero .eight'));heroInf.hide();
  var intro=gsap.timeline({defaults:{ease:'expo.out'}});
  intro.from('.hero h1 .ln',{xPercent:-60,skewX:-22,opacity:0,duration:.9,stagger:.09})
       .fromTo('.hero .inf-path',{strokeDasharray:1,strokeDashoffset:1},{strokeDashoffset:0,duration:.9,ease:'power2.inOut'},.05)
       .fromTo('.hero .inf-rot',{rotation:0},{rotation:90,duration:.95,ease:'back.out(1.5)'},.95)
       .add(function(){heroInf.show();heroInf.start()},1.6)
       .from('.bag',{y:-140,rotation:16,opacity:0,duration:1,ease:'back.out(1.3)'},.25)
       .from('.hero .lede, .price-line',{y:26,opacity:0,duration:.6,stagger:.08},.55);

  // Die 8 kippt zur liegenden Acht
  var mm=gsap.matchMedia();
  mm.add('(min-width: 821px)',function(){
    gsap.timeline({scrollTrigger:{trigger:'#hero',start:'top top',end:'+=85%',pin:true,scrub:.5,anticipatePin:1}})
      .to('.eight',{scale:1.16,ease:'none'},0)
      .to('.bag',{rotation:-7,y:-18,scale:1.06,ease:'none'},0)
      .to('.hero h1 .ln:first-child',{x:-30,ease:'none'},0)
      .to('.hero h1 .ln:last-child',{x:50,ease:'none'},0);
    // Beutel folgt der Maus
    var bag=document.querySelector('.bag'), stage=document.querySelector('.stage');
    var rx=gsap.quickTo(bag,'rotationY',{duration:.5,ease:'power3'}), ry=gsap.quickTo(bag,'rotationX',{duration:.5,ease:'power3'});
    gsap.set(bag,{transformPerspective:900});
    function move(e){var r=stage.getBoundingClientRect();rx(((e.clientX-r.left)/r.width-.5)*26);ry(-((e.clientY-r.top)/r.height-.5)*18)}
    function out(){rx(0);ry(0)}
    hero.addEventListener('pointermove',move);hero.addEventListener('pointerleave',out);
    return function(){hero.removeEventListener('pointermove',move);hero.removeEventListener('pointerleave',out)};
  });
  mm.add('(max-width: 820px)',function(){
    gsap.timeline({scrollTrigger:{trigger:'.stage',start:'top 55%',end:'bottom top',scrub:.5}})
      .to('.eight',{scale:1.08,ease:'none'},0)
      .to('.bag',{rotation:-6,scale:1.05,ease:'none'},0);
  });

  // Sandplatz: Linie wird gezogen, Fotos schieben sich
  gsap.fromTo('#courtLine',{scaleX:0},{scaleX:1,ease:'none',scrollTrigger:{trigger:'.clay',start:'top 85%',end:'top 25%',scrub:.4}});
  gsap.to('.clay-photos img:first-child',{y:-50,ease:'none',scrollTrigger:{trigger:'.clay',start:'top bottom',end:'bottom top',scrub:.6}});
  gsap.to('.clay-photos img:last-child',{y:50,ease:'none',scrollTrigger:{trigger:'.clay',start:'top bottom',end:'bottom top',scrub:.6}});

  // Überschriften rutschen schräg ins Bild
  gsap.utils.toArray('h2.display').forEach(function(h){
    ScrollTrigger.create({trigger:h,start:'top 92%',once:true,onEnter:function(){
      gsap.from(h,{xPercent:-12,skewX:-14,duration:.7,ease:'expo.out'});
    }});
  });

  // Scoreboard zählt hoch
  var fmt=function(v,d){return v.toFixed(d).replace('.',',')};
  ScrollTrigger.create({trigger:'.board',start:'top 80%',once:true,onEnter:function(){
    gsap.from('.board .row',{x:60,duration:.5,stagger:.07,ease:'power3.out'});
    document.querySelectorAll('.board .num').forEach(function(el,i){
      var end=parseFloat(el.dataset.val), d=parseInt(el.dataset.dec||'0',10), o={v:0};
      gsap.to(o,{v:end,duration:1.1,delay:i*.07,ease:'power2.out',onUpdate:function(){el.textContent=fmt(o.v,d)},onComplete:function(){el.textContent=fmt(end,d)}});
    });
  }});

  // Carb-Matrix baut sich auf
  ScrollTrigger.create({trigger:'#bar',start:'top 85%',once:true,onEnter:function(){
    gsap.from('#bar .seg',{scaleX:0,duration:.7,stagger:.12,ease:'expo.out'});
  }});

  // Flasche füllt sich
  gsap.fromTo('#liquid',{scaleY:.06},{scaleY:1,ease:'none',scrollTrigger:{trigger:'.mix',start:'top 75%',end:'center 45%',scrub:.5}});

  gsap.to('.frame',{y:-40,rotation:-6,ease:'none',scrollTrigger:{trigger:'.story',start:'top bottom',end:'bottom top',scrub:.6}});

  // Story-Zeilen
  ScrollTrigger.create({trigger:'.story h2',start:'top 85%',once:true,onEnter:function(){
    gsap.from('.story h2 span',{xPercent:40,skewX:18,duration:.7,stagger:.12,ease:'expo.out'});
    gsap.from('.facts li',{scale:0,duration:.4,stagger:.06,delay:.4,ease:'back.out(2)'});
  }});

  // Kaufbereich: Linie und Beutel
  ScrollTrigger.create({trigger:'.tiers',start:'top 88%',once:true,onEnter:function(){gsap.from('.tiers li',{y:50,rotation:-4,duration:.5,stagger:.08,ease:'back.out(1.6)'})}});
  ScrollTrigger.create({trigger:'.quote blockquote',start:'top 85%',once:true,onEnter:function(){
    gsap.from('.quote .mark',{scale:0,rotation:-40,transformOrigin:'left bottom',duration:.6,ease:'back.out(2)'});
    gsap.from('.quote blockquote',{clipPath:'inset(0 100% 0 0)',duration:1.1,ease:'power3.out'});
    gsap.from('.pledge',{xPercent:-8,skewX:-10,duration:.6,delay:.5,ease:'expo.out'});
  }});
  gsap.fromTo('.buy-bag',{rotation:-10,y:80},{rotation:8,y:0,ease:'none',scrollTrigger:{trigger:'.buy',start:'top bottom',end:'center center',scrub:.6}});

  window.addEventListener('load',function(){ScrollTrigger.refresh()});
})();
(function(){if(!window.gsap||!window.ScrollTrigger||matchMedia('(prefers-reduced-motion: reduce)').matches){return}
  ScrollTrigger.create({trigger:'.rv-list',start:'top 85%',once:true,onEnter:function(){gsap.from('.rv-list li',{y:50,rotation:-3,duration:.5,stagger:.1,ease:'back.out(1.6)'})}});
})();
