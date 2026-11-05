'use strict';
document.documentElement.dataset.js='true';
const menuButton=document.querySelector('.menu-toggle');
const navigation=document.getElementById('site-nav');
function closeMenu(returnFocus=false){
 navigation?.classList.remove('is-open');
 menuButton?.setAttribute('aria-expanded','false');
 if(returnFocus)menuButton?.focus();
}
menuButton?.addEventListener('click',()=>{
 const open=menuButton.getAttribute('aria-expanded')!=='true';
 menuButton.setAttribute('aria-expanded',String(open));
 navigation?.classList.toggle('is-open',open);
});
navigation?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>closeMenu()));
document.addEventListener('keydown',event=>{
 if(event.key!=='Escape')return;
 const openTip=document.querySelector('.tips-menu[open]');
 if(openTip){openTip.removeAttribute('open');openTip.querySelector('summary').focus();return;}
 if(menuButton?.getAttribute('aria-expanded')==='true')closeMenu(true);
});
document.addEventListener('click',event=>{
 const details=document.querySelector('.tips-menu[open]');
 if(details&&!details.contains(event.target))details.removeAttribute('open');
});

// Local interaction hook. No network event unless a verified consent integration opts in.
document.querySelectorAll('[data-booking-placement]').forEach(link=>{
 link.addEventListener('click',()=>{
  const canonical=document.querySelector('link[rel="canonical"]');
  const detail={page_path:canonical?new URL(canonical.href).pathname:'/',placement:link.dataset.bookingPlacement,destination_host:'booksy.com'};
  document.dispatchEvent(new CustomEvent('dreamteam:booking-click',{detail}));
  if(window.dreamTeamAnalyticsConsent===true&&typeof window.gtag==='function')window.gtag('event','booking_click',detail);
 });
});

const gallery=[...document.querySelectorAll('a[data-gallery]')];
if(gallery.length&&typeof HTMLDialogElement!=='undefined'){
 const dialog=document.createElement('dialog');
 dialog.className='lightbox';dialog.setAttribute('aria-label','Dream Team haircut gallery');
 dialog.innerHTML='<button type="button" class="lightbox-close" aria-label="Close photo">×</button><img alt=""><div class="lightbox-controls"><button type="button" data-previous aria-label="Previous photo">←</button><p class="lightbox-caption" aria-live="polite"></p><button type="button" data-next aria-label="Next photo">→</button></div>';
 document.body.append(dialog);
 const photo=dialog.querySelector('img');const caption=dialog.querySelector('.lightbox-caption');
 let index=0;let opener=null;
 function show(next){
  index=(next+gallery.length)%gallery.length;
  photo.src=gallery[index].href;
  photo.alt=gallery[index].querySelector('img').alt;
  caption.textContent=`Photo ${index+1} of ${gallery.length}`;
 }
 gallery.forEach((link,i)=>link.addEventListener('click',event=>{
  if(event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
  event.preventDefault();opener=link;show(i);dialog.showModal();
 }));
 dialog.querySelector('.lightbox-close').addEventListener('click',()=>dialog.close());
 dialog.querySelector('[data-previous]').addEventListener('click',()=>show(index-1));
 dialog.querySelector('[data-next]').addEventListener('click',()=>show(index+1));
 dialog.addEventListener('keydown',event=>{
  if(event.key==='ArrowLeft'){event.preventDefault();show(index-1);}
  if(event.key==='ArrowRight'){event.preventDefault();show(index+1);}
 });
 dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
 dialog.addEventListener('close',()=>{photo.removeAttribute('src');opener?.focus();});
}
