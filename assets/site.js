(function(){
  /* Langue de la page (attribut lang de <html>) et textes générés par JavaScript */
  var LANG=(document.documentElement.lang||'fr').slice(0,2)==='en'?'en':'fr', OTHER=LANG==='fr'?'en':'fr';
  var TXT=window.I18N[LANG];

  /* Thème */
  var root=document.documentElement, btn=document.getElementById('themeBtn');
  btn.addEventListener('click',function(){
    var cur=root.getAttribute('data-theme');
    if(!cur){cur=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}
    var next=cur==='dark'?'light':'dark';
    root.setAttribute('data-theme',next);
    try{localStorage.setItem('theme',next);}catch(e){}
  });

  /* Pages : mêmes identifiants internes dans les deux langues, adresses traduites.
     Les deux jeux d'adresses sont acceptés partout, pour que d'anciens liens continuent de marcher. */
  var SLUGS={accueil:{fr:'',en:''},projets:{fr:'projets',en:'projects'},stack:{fr:'stack',en:'stack'},parcours:{fr:'parcours',en:'background'}};
  var slugToKey=Object.create(null);
  Object.keys(SLUGS).forEach(function(k){slugToKey[SLUGS[k].fr]=k; slugToKey[SLUGS[k].en]=k;});
  var langLink=document.getElementById('langLink');
  var pages=document.querySelectorAll('.page'), navLinks=document.querySelectorAll('[data-nav]');
  var current='accueil', firstRoute=true;
  function route(){
    var h=location.hash;
    if(h && h.indexOf('#/')!==0) return; /* ancre interne, ex. #contact */
    var name=slugToKey[(h||'#/').slice(2)]||'accueil';
    pages.forEach(function(pg){
      var on=pg.dataset.page===name; pg.hidden=!on;
      if(on) document.title=pg.dataset.title;
    });
    navLinks.forEach(function(a){ if(a.dataset.nav===name) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current'); });
    if(name!==current){
      window.scrollTo(0,0);
      /* Après une navigation, le focus va au titre de la page : les lecteurs d'écran l'annoncent
         et le clavier repart du haut. Pas au chargement, pour ne pas sauter le lien d'évitement. */
      if(!firstRoute){
        var h1=document.querySelector('.page:not([hidden]) h1');
        if(h1){h1.tabIndex=-1; h1.focus({preventScroll:true});}
      }
    }
    firstRoute=false;
    current=name;
    /* Le lien de langue mène à la même page dans l'autre langue */
    if(langLink){ var o=SLUGS[name][OTHER]; langLink.href=(OTHER==='en'?'/en/':'/')+(o?'#/'+o:''); }
  }
  window.addEventListener('hashchange',route); route();

  /* Lien d'évitement : on met le focus sur le contenu sans changer l'adresse (le hash sert au routage) */
  document.getElementById('skip').addEventListener('click',function(e){
    e.preventDefault();
    var m=document.getElementById('top'); m.focus({preventScroll:true}); m.scrollIntoView();
  });

  /* Stack */
  var groups=[
    {id:'infra',items:[['proxmox',1,'proxmox'],['debian',1,'debian'],['winserver',0,'windows'],['lxc',0,'linuxcontainers'],['lvm',0,'storage'],['samba',0,'samba'],['net',0,'net']]},
    {id:'secu',items:[['ssh',1,'ssh'],['ufw',0,'firewall'],['fail2ban',0,'shield']]},
    {id:'devops',items:[['gitlab',1,'gitlab'],['gitlabci',1,'gitlab'],['ota',0,'update']]},
    {id:'data',items:[['influxdb',1,'influxdb'],['telegraf',1,'telegraf'],['grafana',1,'grafana']]},
    {id:'iot',items:[['mqtt',1,'mqtt'],['mosquitto',0,'eclipsemosquitto'],['zigbee',0,'zigbee2mqtt'],['ntfy',0,'ntfy'],['micropython',1,'micropython'],['opencv',0,'opencv']]},
    {id:'dev',items:[['flask',1,'flask'],['python',1,'python'],['php',0,'php'],['csharp',0,'csharp'],['react',0,'react'],['typescript',0,'typescript'],['jest',0,'jest']]},
    {id:'hw',items:[['rpi5',1,'raspberrypi'],['pico',1,'raspberrypi'],['pizero',0,'raspberrypi'],['esp32',0,'espressif'],['cam',0,'raspberrypi'],['shelly',0,'shelly'],['hitachi',0,'hitachi']]},
    {id:'home',items:[['homeassistant',0,'homeassistant'],['plex',0,'plex'],['nextcloud',0,'nextcloud']]}
  ];
  var sg=document.getElementById('stackGrid'), sf=document.querySelector('.sfilters');
  sg.insertAdjacentHTML('beforebegin','<p class="legend"><i aria-hidden="true"></i>'+TXT.legend+'</p>');
  groups.forEach(function(gr){
    var b=document.createElement('button');b.type='button';b.dataset.g=gr.id;b.setAttribute('aria-pressed','false');b.textContent=TXT.groups[gr.id];sf.appendChild(b);
    var html='<div class="sgroup" data-g="'+gr.id+'"><div class="sgroup-head reveal"><h3 aria-level="2">'+TXT.groups[gr.id]+'</h3></div><ul class="sgrid">';
    gr.items.forEach(function(it,idx){
      var delay=60+Math.min(idx,6)*45, tool=TXT.tools[it[0]];
      html+='<li class="tcard reveal'+(it[1]?' key':'')+'" style="transition-delay:'+delay+'ms"><span class="logo"><img src="/assets/logos/'+it[2]+'.svg" alt="" width="24" height="24" loading="lazy"></span><span><b>'+tool[0]+'</b><small>'+tool[1]+'</small></span></li>';
    });
    sg.insertAdjacentHTML('beforeend',html+'</ul></div>');
  });
  var sbtns=sf.querySelectorAll('button');
  sbtns.forEach(function(b){b.addEventListener('click',function(){
    sbtns.forEach(function(x){x.setAttribute('aria-pressed','false')});b.setAttribute('aria-pressed','true');
    sg.querySelectorAll('.sgroup').forEach(function(d){d.hidden=!(b.dataset.g==='all'||d.dataset.g===b.dataset.g)});
    b.scrollIntoView({block:'nearest',inline:'center'});
    /* Si la barre est collée en haut, on remonte au début de la liste pour ne pas laisser l'utilisateur en bas d'une page raccourcie */
    var bar=document.querySelector('.sbar'), navH=document.querySelector('.nav').offsetHeight;
    if(bar.getBoundingClientRect().top<=navH+1){
      window.scrollTo({top:Math.max(0,window.scrollY+sg.getBoundingClientRect().top-navH-bar.offsetHeight-16)});
    }
  })});

  /* Révélation au défilement : chaque bloc s'anime à chaque passage à l'écran, dans les deux sens */
  (function(){
    var els=document.querySelectorAll('.reveal');
    if(!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches){
      els.forEach(function(el){el.classList.add('in')}); return;
    }
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){ e.target.classList.toggle('in',e.isIntersecting); });
    },{rootMargin:'0px 0px -8% 0px',threshold:.12});
    els.forEach(function(el){io.observe(el)});
  })();

  /* Topologie animée. Deux dispositions : large, et verticale quand la carte est étroite. */
  var NS='http://www.w3.org/2000/svg', svg=document.getElementById('topoSvg'), log=document.getElementById('log'), fig=svg.parentNode;
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nodes=[
    {id:'pico',t:'Pico 2W',s:TXT.nodes.pico},
    {id:'zero',t:'Pi Zero 2W',s:TXT.nodes.zero},
    {id:'shelly',t:'Shelly',s:TXT.nodes.shelly},
    {id:'mqtt',t:'Mosquitto',s:TXT.nodes.mqtt,broker:1},
    {id:'telegraf',t:'Telegraf',s:TXT.nodes.telegraf},
    {id:'influx',t:'InfluxDB',s:TXT.nodes.influx},
    {id:'flask',t:'API Flask',s:TXT.nodes.flask},
    {id:'ntfy',t:'ntfy',s:TXT.nodes.ntfy}
  ];
  var layouts={
    wide:{vb:'0 0 600 420',
      pos:{pico:[20,57,130,46],zero:[20,187,130,46],shelly:[20,317,130,46],mqtt:[225,182,150,56],telegraf:[435,47,130,46],influx:[435,147,130,46],flask:[435,247,130,46],ntfy:[435,337,130,46]},
      wires:{w1:'M150 80 C 190 80, 190 200, 225 205',w2:'M150 210 L 225 210',w3:'M150 340 C 190 340, 190 220, 225 215',w4:'M375 205 C 405 205, 405 70, 435 70',w5:'M500 93 L 500 147',w6:'M375 215 C 405 215, 405 270, 435 270',w7:'M500 293 L 500 337'}},
    tall:{vb:'0 0 320 412',
      pos:{pico:[2,10,100,46],zero:[110,10,100,46],shelly:[218,10,100,46],mqtt:[60,130,200,56],telegraf:[2,250,152,46],influx:[2,356,152,46],flask:[166,250,152,46],ntfy:[166,356,152,46]},
      wires:{w1:'M52 56 C 52 95, 110 95, 110 130',w2:'M160 56 L 160 130',w3:'M268 56 C 268 95, 210 95, 210 130',w4:'M110 186 C 110 220, 78 220, 78 250',w5:'M78 296 L 78 356',w6:'M210 186 C 210 220, 242 220, 242 250',w7:'M242 296 L 242 356'}}
  };
  var mode='';
  var nav=document.querySelector('.nav'), hero=document.querySelector('.hero');
  function measureNav(){root.style.setProperty('--nav-h',nav.offsetHeight+'px');}
  function draw(){
    if(!fig.clientWidth) return; /* page masquée : on redessine quand elle s'affiche */
    /* Espace disponible pour le schéma : sur grand écran il doit tenir dans le premier écran */
    var cs=getComputedStyle(fig), w=fig.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight), h=Infinity;
    if(innerWidth>900){
      var hs=getComputedStyle(hero), chrome=fig.offsetHeight-svg.getBoundingClientRect().height;
      h=Math.max(220,innerHeight-nav.offsetHeight-parseFloat(hs.paddingTop)-parseFloat(hs.paddingBottom)-chrome);
    }
    svg.style.maxHeight=h===Infinity?'':Math.floor(h)+'px';
    /* On garde la disposition large sauf si la verticale donne un texte nettement plus grand */
    var sw=Math.min(w/600,h/420), st=Math.min(Math.min(w,360)/320,h/412);
    var m=14.5*st>13*sw*1.25?'tall':'wide';
    if(m===mode) return; mode=m;
    var L=layouts[m], h='';
    fig.classList.toggle('tall',m==='tall');
    svg.setAttribute('viewBox',L.vb);
    Object.keys(L.wires).forEach(function(k){h+='<path id="'+k+'" class="wire" d="'+L.wires[k]+'"/>';});
    nodes.forEach(function(n){
      var p=L.pos[n.id], cx=p[0]+p[2]/2, ty=p[1]+(n.broker?24:20), sy=p[1]+(n.broker?41:35);
      h+='<g class="n'+(n.broker?' broker':'')+'"><rect x="'+p[0]+'" y="'+p[1]+'" width="'+p[2]+'" height="'+p[3]+'" rx="'+(n.broker?8:6)+'"/>'+
         '<text x="'+cx+'" y="'+ty+'">'+n.t+'</text><text class="sub" x="'+cx+'" y="'+sy+'">'+n.s+'</text></g>';
    });
    svg.innerHTML=h+'<g id="pkts"></g>';
  }
  measureNav(); draw();
  if('ResizeObserver' in window) new ResizeObserver(draw).observe(fig);
  window.addEventListener('resize',function(){measureNav(); draw();});

  function rnd(a,b,d){return (a+Math.random()*(b-a)).toFixed(d)}
  var msgs=[
    {r:['w1','w4','w5'],topic:'domo/salon/lux',val:function(){return rnd(120,480,0)+' lx'}},
    {r:['w2','w6','w7'],topic:'domo/entree/pir',val:function(){return TXT.motion}},
    {r:['w3','w4','w5'],topic:'shellies/prise-bureau/power',val:function(){return rnd(18,65,1)+' W'}},
    {r:['w1','w4','w5'],topic:'domo/cave/eau',val:function(){return TXT.dry}},
    {r:['w1','w4','w5'],topic:'domo/salon/son',val:function(){return rnd(32,58,0)+' dB'}}
  ];
  function addLog(m){
    var t=new Date(), hh=('0'+t.getHours()).slice(-2)+':'+('0'+t.getMinutes()).slice(-2)+':'+('0'+t.getSeconds()).slice(-2);
    var row=document.createElement('div');
    row.innerHTML='<span class="ts">'+hh+'</span><span class="t">'+m.topic+'</span><span class="v">'+m.val()+'</span>';
    log.appendChild(row); while(log.children.length>3) log.removeChild(log.firstChild);
  }
  if(!reduce){
    var send=function(m){
      var g=document.getElementById('pkts'); if(!g) return;
      var c=document.createElementNS(NS,'circle'); c.setAttribute('r','5'); c.setAttribute('class','pkt');
      g.appendChild(c);
      var i=0;
      function leg(){
        if(i>=m.r.length){c.remove();return;}
        var p=document.getElementById(m.r[i]), L=p.getTotalLength(), dur=Math.max(350,L*6), t0=null;
        if(i===1){c.setAttribute('class','pkt ok'); addLog(m);}
        function step(ts){
          if(!t0)t0=ts; var k=Math.min((ts-t0)/dur,1), e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2, pt=p.getPointAtLength(e*L);
          c.setAttribute('cx',pt.x); c.setAttribute('cy',pt.y);
          if(k<1) requestAnimationFrame(step); else {i++; leg();}
        }
        requestAnimationFrame(step);
      }
      leg();
    };
    var n=0;
    (function loop(){ if(!document.hidden && current==='accueil') send(msgs[n++%msgs.length]); setTimeout(loop,1600); })();
  } else {
    msgs.slice(0,3).forEach(addLog);
  }

  /* Splash : fermeture au clic ou à la touche. Sinon il se ferme seul (animation CSS). */
  var sp=document.getElementById('splash'), htm=document.documentElement;
  if(sp && htm.classList.contains('has-splash')){
    var skip=function(){sp.classList.add('skip');};
    window.addEventListener('pointerdown',skip,{once:true});
    window.addEventListener('keydown',skip,{once:true});
    sp.addEventListener('animationend',function(e){
      if(e.animationName==='sp-out'||e.animationName==='sp-skip'){sp.remove(); htm.classList.remove('has-splash');}
    });
  }
})();
