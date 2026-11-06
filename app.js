(function(){
  'use strict';
  var d=document;

  // menu mobilne
  var burger=d.querySelector('.burger'), menu=d.getElementById('menu');
  function zamknij(){menu.hidden=true;burger.setAttribute('aria-expanded','false');burger.setAttribute('aria-label','Otwórz menu');d.body.style.overflow='';}
  burger.addEventListener('click',function(){
    var otw=menu.hidden;
    menu.hidden=!otw;
    burger.setAttribute('aria-expanded',otw?'true':'false');
    burger.setAttribute('aria-label',otw?'Zamknij menu':'Otwórz menu');
    d.body.style.overflow=otw?'hidden':'';
  });
  menu.addEventListener('click',function(e){if(e.target.closest('a'))zamknij();});
  d.addEventListener('keydown',function(e){if(e.key==='Escape'&&!menu.hidden){zamknij();burger.focus();}});
  window.addEventListener('resize',function(){if(window.innerWidth>1180&&!menu.hidden)zamknij();});

  // galerie w kartach: palec, mysz, strzalki, klawiatura
  d.querySelectorAll('[data-gal]').forEach(function(g){
    var tor=g.querySelector('.gal-tor'), imgs=tor.querySelectorAll('img'), n=imgs.length;
    var licz=g.querySelector('.gal-licz'), bp=g.querySelector('.gal-p'), bn=g.querySelector('.gal-n');
    function idx(){return Math.round(tor.scrollLeft/Math.max(1,tor.clientWidth));}
    function odswiez(){var i=idx();licz.textContent=(i+1)+'/'+n;bp.disabled=i<=0;bn.disabled=i>=n-1;}
    function idz(i){i=Math.max(0,Math.min(n-1,i));tor.scrollTo({left:i*tor.clientWidth,behavior:'smooth'});}
    bp.addEventListener('click',function(){idz(idx()-1);});
    bn.addEventListener('click',function(){idz(idx()+1);});
    tor.addEventListener('scroll',function(){window.requestAnimationFrame(odswiez);},{passive:true});
    tor.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){e.preventDefault();idz(idx()+1);}if(e.key==='ArrowLeft'){e.preventDefault();idz(idx()-1);}});
    // przeciaganie mysza
    var start=0,sl=0,ciagnie=false,ruch=0;
    tor.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;ciagnie=true;ruch=0;start=e.clientX;sl=tor.scrollLeft;tor.classList.add('ciagnie');tor.setPointerCapture(e.pointerId);});
    tor.addEventListener('pointermove',function(e){if(!ciagnie)return;var dx=e.clientX-start;ruch=Math.max(ruch,Math.abs(dx));tor.scrollLeft=sl-dx;});
    function koniec(e){if(!ciagnie)return;ciagnie=false;tor.classList.remove('ciagnie');var dx=e.clientX-start;var i=Math.round(sl/tor.clientWidth);if(dx<-40)i++;else if(dx>40)i--;idz(i);}
    tor.addEventListener('pointerup',koniec);tor.addEventListener('pointercancel',koniec);
    tor.addEventListener('click',function(e){if(ruch>6){e.preventDefault();e.stopPropagation();}},true);
    odswiez();
  });

  // filtr i "pokaz wszystkie"
  var karty=[].slice.call(d.querySelectorAll('.pies')), btnW=d.getElementById('pokaz-psy');
  var filtr='wszystkie', rozwin=false;
  function limit(){return window.matchMedia('(max-width:560px)').matches?4:8;}
  function pokaz(){
    var lim=limit(), k=0;
    karty.forEach(function(c){
      var ok=filtr==='wszystkie'||(filtr==='maly'?c.dataset.maly==='1':c.dataset.plec===filtr);
      var widac=ok&&(filtr!=='wszystkie'||rozwin||k<lim);
      if(ok)k++;
      c.hidden=!widac;
    });
    btnW.hidden=(filtr!=='wszystkie'||rozwin||karty.length<=lim);
  }
  d.querySelectorAll('.filtr button').forEach(function(b){
    b.addEventListener('click',function(){
      d.querySelectorAll('.filtr button').forEach(function(x){x.classList.remove('on');x.setAttribute('aria-pressed','false');});
      b.classList.add('on');b.setAttribute('aria-pressed','true');filtr=b.dataset.f;pokaz();
    });
  });
  btnW.addEventListener('click',function(){rozwin=true;pokaz();var nast=karty.filter(function(c){return !c.hidden;})[limit()];if(nast){var a=nast.querySelector('.gal-tor');if(a)a.focus({preventScroll:true});}});
  pokaz();
  window.addEventListener('resize',function(){if(!rozwin)pokaz();});

  // "Umow spacer z ..." wybiera psa w formularzu
  var pole=d.getElementById('pole-pies');
  d.querySelectorAll('[data-pies]').forEach(function(a){
    a.addEventListener('click',function(){var v=a.dataset.pies;[].forEach.call(pole.options,function(o){if(o.text===v)pole.value=o.value||o.text;});});
  });

  // formularz pokazowy (bez wysylki)
  var form=d.getElementById('form'), ok=form.querySelector('.form-ok');
  form.addEventListener('submit',function(e){
    e.preventDefault();
    if(!form.checkValidity()){form.reportValidity();return;}
    ok.textContent='Dziękujemy. W gotowej stronie zgłoszenie trafi na adres schronisko@pukciechanow.pl, a schronisko oddzwoni.';
  });

  // kopiowanie numeru konta
  var kop=d.querySelector('.kopiuj');
  if(kop)kop.addEventListener('click',function(){
    var t=kop.dataset.kopiuj;
    function gotowe(){kop.textContent='Skopiowano';setTimeout(function(){kop.textContent='Kopiuj';},2200);}
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(gotowe,function(){});}
  });

  // dolny pasek na telefonie dopiero po przewinieciu za przycisk w hero
  var mob=d.querySelector('.mob'), cel=d.querySelector('.hero-akcje .btn');
  if(mob&&cel&&'IntersectionObserver' in window){
    new IntersectionObserver(function(w){
      var za=!w[0].isIntersecting&&w[0].boundingClientRect.top<0;
      mob.classList.toggle('widac',za);
      mob.setAttribute('aria-hidden',za?'false':'true');
      mob.querySelectorAll('a').forEach(function(a){a.tabIndex=za?0:-1;});
    }).observe(cel);
  }
})();
