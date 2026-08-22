gsap.registerPlugin(ScrollTrigger);
const scenes=[
 ['THE VAULT OPENS','Not Just A Stone.<br><em>A Story Frozen In Light.</em>','Every gem begins in the dark.'],
 ['THE CUT','Cut for Character,<br><em>Not Convenience.</em>','Precision is not about perfection. It is about revealing what was already there.'],
 ['FIRST LIGHT','Watch It<br><em>Breathe Light.</em>','The first beam reveals a spectrum hidden inside the stone.'],
 ['THE ORIGIN','From the Earth<br><em>to the Hand.</em>','Every exceptional stone has an origin worth tracing.'],
 ['THE MARKS',"Nature Doesn't Apologize<br><em>for Its Marks.</em>",'Inclusions, zoning and subtle imperfections are part of the evidence.'],
 ['THE COLLECTION','A Collection,<br><em>Not a Catalog.</em>','Sapphires, emeralds, rubies, opals and more—selected for character.'],
 ['THE PORTFOLIO','Meet the<br><em>Extraordinary.</em>','Five stones. Five origins. Five stories waiting to be continued.'],
 ['THE FINAL HOLD','Some Things Are<br><em>Worth Waiting For.</em>','Tell us what you are searching for. We will tell you when we find it.']
];
const gem=document.querySelector('#heroGem'), title=document.querySelector('#sceneTitle'), num=document.querySelector('#sceneNum'), body=document.querySelector('#sceneBody'), dots=document.querySelector('#dots');
scenes.forEach((_,i)=>{const s=document.createElement('span');if(!i)s.classList.add('active');dots.appendChild(s)}); const dotEls=[...dots.children];
const colors=['#b8b0a1','#d9c8a8','#164fbd','#16395e','#6c35a4','#174eac','#b36e28','#164a8b'];
let current=0;
function setScene(i){if(i===current)return;current=i; num.textContent=`0${i+1} / ${scenes[i][0]}`;title.innerHTML=scenes[i][1];body.textContent=scenes[i][2];dotEls.forEach((d,j)=>d.classList.toggle('active',j===i));gsap.to(gem,{duration:.7,scale:1+(i===4?.15:0),rotationY:i*120,rotationX:i*8,ease:'power2.out'});gsap.to('.gem-core',{duration:.5,opacity:i>=2?.9:0});gsap.to('.spotlight',{duration:.7,x:(i-3)*40,y:(i-2)*25,scale:1+i*.05});gsap.to('.story',{duration:.5,background:i===2?'radial-gradient(circle at 50% 48%,#102a55 0,#050b12 35%,#03070d 70%)':i===5?'radial-gradient(circle at 50% 48%,#101d28 0,#050b12 38%,#03070d 72%)':''});}
gsap.timeline({scrollTrigger:{trigger:'.story',start:'top top',end:'bottom bottom',scrub:1.2,onUpdate:self=>{const i=Math.min(7,Math.floor(self.progress*8));setScene(i)}}}).to(gem,{rotationY:1440,rotationX:80,scale:1.25,ease:'none'},0).to('.gem-halo',{scale:2.5,rotation:180,ease:'none'},0).to('.gem-facet',{rotation:500,xPercent:60,ease:'none'},0);
gsap.utils.toArray('.trust article,.quote-grid blockquote,.stone-card').forEach(el=>gsap.from(el,{y:40,opacity:0,duration:.8,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 85%'}}));
gsap.from('.manifesto h2',{y:80,opacity:0,duration:1,scrollTrigger:{trigger:'.manifesto',start:'top 70%'}});
gsap.from('.map',{scale:.9,opacity:0,duration:1,scrollTrigger:{trigger:'.origin',start:'top 70%'}});
gsap.to('.final-gem',{rotation:360,scale:1.2,duration:18,repeat:-1,ease:'none'});
const stones=[['Royal Ceylon Sapphire','12.84 ct','Sri Lanka','Certified','24,800'],['Muzo Emerald','8.52 ct','Colombia','GIA Certified','18,600'],['Mogok Pigeon Ruby','6.21 ct','Myanmar','GIA Certified','32,400'],['Imperial Topaz','14.37 ct','Brazil','IGI Certified','16,900'],['Welo Fire Opal','9.11 ct','Ethiopia','GIA Certified','8,750']];
document.querySelector('#vaultGrid').innerHTML=stones.map((s,i)=>`<article class="stone-card"><div class="stone-image"><div class="stone-shape"></div></div><h3>${s[0]}</h3><div class="meta">${s[1]} · ${s[2]}<br>${s[3]}</div><div class="price">$ ${s[4]}</div></article>`).join('');
window.addEventListener('pointermove',e=>{gsap.to('.cursor-glow',{x:e.clientX,y:e.clientY,duration:.35,ease:'power2.out'});const x=(e.clientX/innerWidth-.5)*10,y=(e.clientY/innerHeight-.5)*10;gsap.to(gem,{rotationX:y,rotationY:current*120+x,duration:.7,overwrite:'auto'})});
window.addEventListener('load',()=>{gsap.from('.nav',{y:-30,opacity:0,duration:1});gsap.from('.story-copy > *',{y:25,opacity:0,stagger:.12,duration:1,ease:'power3.out'})});
