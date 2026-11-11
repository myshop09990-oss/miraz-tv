(()=>{'use strict';
const API=String(window.MIRAZ_PREMIUM_API_URL||'').trim();

const configured = /^https:\/\/[a-z0-9-]+\.supabase\.co\/functions\/v1\/miraz-premium-v2\/?$/i.test(API);

const $=id=>document.getElementById(id);
const KEY='miraz-premium-session-v1';
let token='';
const notice=(element,text,type='error')=>{
  element.textContent=text;
  element.className='notice '+type;
};
const hide=(id,yes)=>$(id).classList.toggle('hidden',yes);
async function call(action,extra={}){
  if(!configured)throw new Error('Premium Backend এখনো কনফিগার করা হয়নি।');
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),15000);
  try{
    const res=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify(action === 'login'
  ? {action:'login',phone:extra.phone,pin:extra.pin}
  : {action,...extra}
    const data=await res.json();
    if(!res.ok||data?.ok!==true)throw new Error(data?.error||'সার্ভারের সঙ্গে যোগাযোগ করা যাচ্ছে না।');
    return data;
  }finally{clearTimeout(timeout)}
}
function dateText(s){const d=new Date(s);return Number.isNaN(d.getTime())?'—':new Intl.DateTimeFormat('bn-BD',{dateStyle:'medium'}).format(d)}
function clearSession(){token='';try{sessionStorage.removeItem(KEY)}catch{}const video=$('player');video.pause();video.removeAttribute('src');video.load();hide('playerSection',true);hide('memberSection',true);hide('loginSection',false)}
function setMember(info){$('memberName').textContent=String(info.name||'Premium Member').slice(0,100);$('expiry').textContent=dateText(info.paid_until);hide('loginSection',true);hide('memberSection',false)}
function makeItem(i){
  const item=document.createElement('div');item.className='item';
  if(typeof i.cover_url==='string'&&i.cover_url.startsWith('https://')){
    const img=document.createElement('img');img.src=i.cover_url;img.alt='';img.loading='lazy';item.append(img);
  }else{const art=document.createElement('span');art.className='placeholder';art.textContent='🎬';item.append(art)}
  const info=document.createElement('div');info.className='item-info';
  const title=document.createElement('h3');title.textContent=String(i.title||'ভিডিও');info.append(title);
  const p=document.createElement('p');p.textContent=String(i.description||'').slice(0,300);info.append(p);
  const btn=document.createElement('button');btn.type='button';btn.textContent='▶ Play';
  btn.addEventListener('click',async()=>{
    btn.disabled=true;btn.textContent='লোড হচ্ছে…';
    try{
      const d=await call('play',{token,id:i.id});
      const video=$('player');$('playerTitle').textContent=d.title||i.title;
      video.src=d.url;hide('playerSection',false);
      video.scrollIntoView({behavior:'smooth',block:'center'});
      try{await video.play()}catch{};
      hide('memberMessage',true);
    }catch(e){notice($('memberMessage'),e.message||'Play failed');if(/লগইন|মেয়াদ/.test(e.message||''))clearSession()}
    finally{btn.disabled=false;btn.textContent='▶ Play'}
  });info.append(btn);item.append(info);return item;
}
async function catalog(){
  const d=await call('catalog',{token});setMember(d);
  const node=$('catalog');node.replaceChildren();
  if(!Array.isArray(d.items)||!d.items.length){
    const p=document.createElement('p');p.className='notice';p.textContent='Premium সদস্যপদ সক্রিয়। তবে এখনো কোনো অনুমোদিত ভিডিও যোগ করা হয়নি।';node.append(p);return;
  }
  d.items.forEach(i=>node.append(makeItem(i)));
}
if(!configured){hide('setupNotice',false);$('loginButton').disabled=true}
$('loginForm').addEventListener('submit',async(e)=>{
  e.preventDefault();const phone=$('phone').value.trim(),pin=$('pin').value;
  if(!/^01\d{9}$/.test(phone)||!/^\d{4}$/.test(pin)){notice($('loginMessage'),'১১ সংখ্যার মোবাইল নম্বর ও ৪ সংখ্যার PIN দিন।');return}
  if(!$('adult').checked){notice($('loginMessage'),'আপনি ১৮ বা তার বেশি বয়সী না হলে এই বিভাগে প্রবেশ করতে পারবেন না।');return}
  const b=$('loginButton');b.disabled=true;b.textContent='যাচাই হচ্ছে…';
  try{
    const d=await call('login',{phone,pin,adultConfirmed:true});
    $('pin').value='';token=d.token;
    try{sessionStorage.setItem(KEY,token)}catch{}
    await catalog();hide('loginMessage',true);
  }catch(err){$('pin').value='';notice($('loginMessage'),err.name==='AbortError'?'সার্ভারে সংযোগের সময় শেষ হয়েছে।':err.message||'লগইন ব্যর্থ');clearSession()}
  finally{b.disabled=false;b.textContent='Unlock Premium Zone'}
});
$('logoutButton').addEventListener('click',async()=>{const t=token;clearSession();try{await call('logout',{token:t})}catch{}});
if(configured){
  (async()=>{
    try{token=sessionStorage.getItem(KEY)||''}catch{token=''}
    if(!/^/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(token)){clearSession();return}
    try{const s=await call('check',{token});setMember(s);await catalog()}
    catch{clearSession()}
  })();
}
})();
