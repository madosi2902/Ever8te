// Match-Rechner: Portionen pro Einheit, pro Woche und Beutel-Empfehlung mit Mengenrabatt.
// Rechengrundlage: 1 Portion (35 g, 525 ml) pro Stunde, Halle x0,8, Hitze x1,25, auf halbe Portionen gerundet.
(function(){
  var f=document.getElementById('calc');if(!f){return}
  var base=parseFloat(f.dataset.base),PER_BAG=14,ML=525,MAX_BAGS=99;
  function $(id){return document.getElementById(id)}
  function val(name){var c=f.querySelector('input[name="'+name+'"]:checked');return c?parseFloat(c.value):0}
  function num(v,d){return (Math.round(v*Math.pow(10,d||0))/Math.pow(10,d||0)).toString().replace('.',',')}
  function eur(v){return v.toLocaleString('de-DE',{minimumFractionDigits:2,maximumFractionDigits:2})+' €'}
  function rate(n){return n>=6?.18:n>=3?.12:n>=2?.07:0}
  function price(n){var unit=Math.round(base*(1-rate(n))*100)/100;return Math.round(unit*n*100)/100}
  function plural(n,one,many){return n===1?one:many}

  f.querySelectorAll('[data-step]').forEach(function(b){
    b.addEventListener('click',function(){
      var o=$(b.dataset.for),v=+o.textContent+(+b.dataset.step);
      o.textContent=Math.min(+o.dataset.max,Math.max(+o.dataset.min,v));render();
    });
  });
  f.addEventListener('change',render);

  function render(){
    var min=val('dauer'),k=val('wetter'),weeks=val('wochen'),perWeek=+$('woche').textContent,players=+$('spieler').textContent;
    var perSession=Math.max(.5,Math.round(min/60*k*2)/2);
    var weekly=perSession*perWeek;
    var lasts=PER_BAG/weekly;
    var bags=Math.min(MAX_BAGS,Math.max(1,Math.ceil(weekly*weeks*players/PER_BAG)));
    var total=price(bags),full=base*bags,r=rate(bags);

    $('r-head').textContent=players+' '+plural(players,'Spieler','Spieler');
    $('r-einheit').innerHTML=num(perSession,1)+' <em>Port.</em>';
    $('r-ml').textContent='ca. '+(Math.round(perSession*ML/10)*10).toLocaleString('de-DE')+' ml EVER8TE, dazu Wasser nach Durst';
    $('r-woche').innerHTML=num(weekly,1)+' <em>Port.</em>';
    $('r-woche-sub').textContent='bei '+perWeek+' '+plural(perWeek,'Einheit','Einheiten')+(players>1?', pro Spieler':'');
    $('r-reicht').innerHTML=(lasts<1?'&lt;1':lasts>=2?Math.floor(lasts):num(lasts,1))+' <em>Wo.</em>';
    $('r-beutel').textContent=bags+' '+plural(bags,'Beutel','Beutel');
    $('r-for').textContent=' für '+weeks+' Wochen'+(players>1?', '+players+' Spieler':'');
    $('r-preis').textContent=eur(total);
    $('r-preis-sub').textContent=(r?'statt '+eur(full)+', '+Math.round(r*100)+' % Mengenrabatt, ':'')+'inkl. MwSt., zzgl. Versand';

    // Hinweis auf die nächste Rabattstufe oder den Gratis-Versand
    var nudge=$('r-nudge'),msg='';
    var next=bags<2?2:bags<3?3:bags<6?6:0;
    if(next&&next-bags<=2){
      var extra=price(next)-total;
      msg='Tipp: Mit '+next+' Beuteln zahlst du nur '+eur(extra)+' mehr und bekommst '+Math.round(rate(next)*100)+' % Rabatt auf alle Beutel.';
    }else if(total<100&&price(bags+1)>=100){
      msg='Tipp: Mit '+(bags+1)+' Beuteln ist der Versand gratis.';
    }
    if(bags>=20){msg='Größere Menge für Verein, Center oder Shop? <a href="/partner">Frag ein Angebot an</a>.'}
    nudge.innerHTML=msg;nudge.hidden=!msg;

    var a=$('r-cart');
    a.href=f.dataset.cart+bags+f.dataset.utm;
    $('r-cart-label').textContent=bags+' '+plural(bags,'Beutel','Beutel')+' in den Warenkorb · '+eur(total);
  }
  render();
})();
