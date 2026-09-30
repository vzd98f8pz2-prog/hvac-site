(function(){
  'use strict';
  var PHONE='966569926284';
  var $=function(s,c){return (c||document).querySelector(s)};
  var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
  var wa=function(t){return 'https://wa.me/'+PHONE+'?text='+encodeURIComponent(t)};

  /* ----- WhatsApp links ----- */
  var MSG={
    general:'السلام عليكم، أرغب في الاستفسار عن خدماتكم.',
    area:'السلام عليكم، هل تخدمون منطقتي؟ المنطقة: '
  };
  $$('[data-wa]').forEach(function(a){
    var k=a.getAttribute('data-wa'),t;
    if(k.indexOf('svc:')===0){t='السلام عليكم، أحتاج خدمة: '+k.slice(4)+'.'}
    else{t=MSG[k]||MSG.general}
    a.href=wa(t);a.target='_blank';a.rel='noopener';
  });

  /* ----- call buttons ----- */
  $$('[data-call]').forEach(function(a){
    a.addEventListener('click',function(e){
      e.preventDefault();
      window.location.href = "tel:+966569926284";
    });
  });

  /* ----- mobile sheet ----- */
  var burger=$('#burger'),sheet=$('#sheet');
  function setSheet(open){
    sheet.classList.toggle('open',open);
    burger.setAttribute('aria-expanded',open?'true':'false');
    burger.setAttribute('aria-label',open?'إغلاق القائمة':'فتح القائمة');
    document.body.classList.toggle('lock',open);
  }
  burger.addEventListener('click',function(){setSheet(!sheet.classList.contains('open'))});
  $$('a',sheet).forEach(function(a){a.addEventListener('click',function(){setSheet(false)})});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')setSheet(false)});
  window.addEventListener('resize',function(){if(innerWidth>=1000)setSheet(false)});

  /* ----- accordions ----- */
  function bindAcc(root,single){
    $$('.abtn',root).forEach(function(btn){
      btn.addEventListener('click',function(){
        var item=btn.closest('.slat,.q');
        var willOpen=!item.classList.contains('open');
        if(single&&willOpen){
          $$('.slat.open,.q.open',root).forEach(function(o){
            if(o!==item){o.classList.remove('open');$('.abtn',o).setAttribute('aria-expanded','false')}
          });
        }
        item.classList.toggle('open',willOpen);
        btn.setAttribute('aria-expanded',willOpen?'true':'false');
      });
    });
  }
  bindAcc($('#slats'),false);
  bindAcc($('#faqList'),true);

  /* ----- thermostat (الهواء يتحرك بضع ثوانٍ ثم يهدأ، ويتحرك من جديد عند تغيير الدرجة) ----- */
  var t=24,disp=$('#acTemp'),svg=$('#acSvg'),stage=$('#stage'),say=$('#tSay'),air=$('#airflow');
  function restartAir(){
    air.classList.remove('go');
    void air.getBoundingClientRect();
    air.classList.add('go');
  }
  function setT(n){
    t=Math.min(30,Math.max(16,n));
    disp.textContent=t+'°';
    svg.setAttribute('data-band',t<=25?'cold':(t<=27?'mild':'warm'));
    stage.style.setProperty('--air',(0.45+0.55*(30-t)/14).toFixed(2));
    say.textContent='الدرجة '+t;
    restartAir();
  }
  $('#tDown').addEventListener('click',function(){setT(t-1)});
  $('#tUp').addEventListener('click',function(){setT(t+1)});

  /* ----- active nav ----- */
  var links=$$('#navInline a');
  if('IntersectionObserver' in window){
    var nio=new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(e.isIntersecting){
          var id='#'+e.target.id;
          links.forEach(function(l){l.setAttribute('aria-current',l.getAttribute('href')===id?'true':'false')});
        }
      });
    },{rootMargin:'-45% 0px -50% 0px'});
    $$('main section[id]').forEach(function(s){nio.observe(s)});
  }

  /* ----- scroll: header border ----- */
  var hdr=$('#hdr'),ticking=false;
  function frame(){
    var y=window.scrollY||0;
    hdr.classList.toggle('scrolled',y>8);
    ticking=false;
  }
  function onScroll(){if(!ticking){ticking=true;requestAnimationFrame(frame)}}
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',onScroll);
  frame();

  /* ----- contact composer ----- */
  var send=$('#sendWa'),msg=$('#msg');
  function buildMsg(){
    var s=$('input[name="svc"]:checked'),parts=['السلام عليكم، أحتاج خدمة'+(s?': '+s.value:'')+'.'];
    if(msg.value.trim())parts.push('المشكلة: '+msg.value.trim());
    send.href=wa(parts.join('\n'));
  }
  $$('input[name="svc"]').forEach(function(r){r.addEventListener('change',buildMsg)});
  msg.addEventListener('input',buildMsg);
  send.addEventListener('click',buildMsg);
  buildMsg();
})();
