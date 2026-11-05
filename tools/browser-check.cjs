const fs=require('node:fs/promises');
const assert=require('node:assert/strict');
const path=require('node:path');
const {chromium}=require(process.env.AUDIT_PLAYWRIGHT_MODULE||'playwright');
const base=process.env.AUDIT_BASE_URL||'http://127.0.0.1:4173';
const auditDate=new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York'}).format(new Date());
const output=process.env.AUDIT_OUTPUT_DIR||`docs/evidence/${auditDate}/performance`;
(async()=>{
 await fs.mkdir(output,{recursive:true});
 const browser=await chromium.launch({executablePath:process.env.AUDIT_CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const results=[];const errors=[];const httpErrors=[];
 try{
  const context=await browser.newContext();
  await context.route('**/*',route=>{const url=new URL(route.request().url());return url.origin!==new URL(base).origin||route.request().method()!=='GET'?route.abort('blockedbyclient'):route.continue();});
  const page=await context.newPage();
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('/404.html')&&!r.url().includes('/missing-audit-route'))httpErrors.push({url:r.url(),status:r.status()});});
  const pages=JSON.parse(await fs.readFile('content/pages.json','utf8'));
  const editorial=JSON.parse(await fs.readFile('content/editorial.json','utf8'));
  const manifest=JSON.parse(await fs.readFile('content/images.json','utf8'));
  for(const file of ['index.html','barber-tips.html',...pages.map(p=>p.file),'404.html']){
   await page.goto(base+'/'+file,{waitUntil:'load'});assert.equal(await page.locator('h1').count(),1);
   const data=await page.evaluate(()=>({main:document.querySelectorAll('main').length,unlabelled:[...document.querySelectorAll('input:not([type=hidden]),textarea')].filter(i=>!i.labels.length).length,ids:[...document.querySelectorAll('[id]')].map(e=>e.id)}));
   assert.equal(data.main,1);assert.equal(data.unlabelled,0);assert.equal(data.ids.length,new Set(data.ids).size);
   const source=pages.find(p=>p.file===file);
   if(source){const preserved=await page.evaluate(html=>{const d=new DOMParser().parseFromString(html,'text/html');const current=document.querySelector('article.article-content').cloneNode(true);current.querySelector('.article-heading').remove();current.querySelectorAll('[data-reader-tools]').forEach(e=>e.remove());const clean=s=>s.replace(/\s+/g,' ').trim();return clean(d.body.textContent)===clean(current.textContent);},source.html);assert(preserved,'Existing article/policy text changed or lost: '+file);}
   if(source?.kind==='article'){
    const sourceImage=manifest[source.image.replace(/^\.\//,'')];
    const displayedWidth=await page.locator('.article-content img').evaluate(img=>img.getBoundingClientRect().width);
    assert(displayedWidth<=sourceImage.width+1,'Article image enlarged beyond original pixels in '+file);
    assert.equal(await page.locator('.article-toc a').count(),editorial[file].sections.length);
    await page.locator('.article-toc summary').click();
    const topic=page.locator('.article-toc a').first();const target=await topic.getAttribute('href');await topic.click();
    assert.equal(new URL(page.url()).hash,target);
    await page.waitForFunction(id=>{const box=document.querySelector(id).getBoundingClientRect();return box.bottom>0&&box.top<innerHeight&&box.width>0;},target);
    const related=await page.locator('.guides-section .guide-card').first().getAttribute('href');assert.equal(editorial[related].category,editorial[file].category,'First related guide should match the topic');
   }
   results.push({page:file,status:'passed',checks:'One H1/main, labels, IDs; full original article/policy text preserved.'});
  }
  for(const file of ['barber-tips.html',...pages.filter(p=>p.kind==='article').map(p=>p.file)])for(const width of [320,390,768,1440]){
   await page.setViewportSize({width,height:900});await page.goto(base+'/'+file,{waitUntil:'load'});
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'Horizontal overflow in '+file+' at '+width);
  }
  await page.setViewportSize({width:390,height:844});await page.goto(base+'/barber-tips.html',{waitUntil:'load'});
  assert.equal(await page.locator('.guide-category .guide-card').count(),6);
  const guideImage=page.locator('.guide-category .guide-card img').first();await guideImage.scrollIntoViewIfNeeded();await page.waitForFunction(()=>document.querySelector('.guide-category .guide-card img').naturalWidth>0);
  const mobileCard=await guideImage.evaluate(img=>({renderedWidth:img.getBoundingClientRect().width,sourceWidth:img.naturalWidth,currentSrc:img.currentSrc}));
  const selectedVariant=Object.values(manifest).flatMap(i=>i.variants).find(v=>new URL(mobileCard.currentSrc).pathname.endsWith('/'+v.src));
  assert(selectedVariant&&selectedVariant.width<=320,'Mobile guide cards should use small responsive image variants');
  assert(mobileCard.renderedWidth<=121);
  results.push({feature:'editorial navigation',status:'passed',checks:'Six categorized guides, topic anchors, same-category related guides, all seven editorial pages at 320/390/768/1440 without overflow.',mobileCard});
  for(const width of [320,390,768,1440]){
   await page.setViewportSize({width,height:900});await page.goto(base+'/',{waitUntil:'load'});
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'Horizontal overflow at '+width);
   if(width<=800){const button=page.getByRole('button',{name:/Menu/});await button.click();assert.equal(await button.getAttribute('aria-expanded'),'true');await page.keyboard.press('Escape');assert.equal(await button.getAttribute('aria-expanded'),'false');assert(await button.evaluate(e=>e===document.activeElement));await button.click();await page.locator('#site-nav a[href="#services"]').click();assert.equal(await button.getAttribute('aria-expanded'),'false');}
   results.push({viewport:width,status:'passed',checks:'No horizontal overflow; mobile menu, Escape/focus and service link where applicable.'});
  }
  await page.setViewportSize({width:1440,height:1000});await page.goto(base+'/',{waitUntil:'load'});
  await page.locator('.tips-menu summary').click();await page.keyboard.press('Escape');assert.equal(await page.locator('.tips-menu').getAttribute('open'),null);
  const first=page.locator('a[data-gallery]').first();await first.click();await page.waitForFunction(()=>document.querySelector('.lightbox img').naturalWidth>0);
  assert(await page.locator('dialog').isVisible());await page.keyboard.press('ArrowRight');assert.equal(await page.locator('.lightbox-caption').textContent(),'Photo 2 of 8');await page.keyboard.press('Escape');assert.equal(await page.locator('dialog').isVisible(),false);assert(await first.evaluate(e=>e===document.activeElement));
  results.push({feature:'gallery',status:'passed',checks:'Image opens; next photo by keyboard; Escape closes and restores opener focus.'});
  await page.getByLabel('Email',{exact:true}).fill('invalid-address');assert.equal(await page.getByLabel('Email',{exact:true}).evaluate(e=>e.checkValidity()),false);await page.getByLabel('Email',{exact:true}).fill('');
  await page.evaluate(()=>{window.testBookingCalls=[];window.gtag=(...args)=>window.testBookingCalls.push(args);document.addEventListener('click',e=>{if(e.target.closest('[data-booking-placement]'))e.preventDefault();},true);});
  await page.locator('[data-booking-placement="hero"]').click();assert.equal(await page.evaluate(()=>window.testBookingCalls.length),0);
  await page.evaluate(()=>{window.dreamTeamAnalyticsConsent=true;history.replaceState(null,'','/untrusted-path?token=test-value#fragment');});await page.locator('[data-booking-placement="hero"]').click();
  const calls=await page.evaluate(()=>window.testBookingCalls);assert.equal(calls.length,1);assert.equal(calls[0][1],'booking_click');assert.equal(calls[0][2].page_path,'/');assert.deepEqual(Object.keys(calls[0][2]).sort(),['destination_host','page_path','placement']);
  await page.evaluate(()=>{window.dreamTeamAnalyticsConsent=false;});await page.locator('[data-booking-placement="hero"]').click();assert.equal(await page.evaluate(()=>window.testBookingCalls.length),1);
  results.push({feature:'booking measurement',status:'passed',checks:'No network event by default; one stubbed event on explicit consent; stops after revocation. No outbound booking requests.'});
  assert.equal((await page.request.get(base+'/missing-audit-route')).status(),404);
  for(const name of ['robots.txt','sitemap.xml','ads.txt'])assert.equal((await page.request.get(base+'/'+name)).status(),200);
  if(process.env.AUDIT_CAPTURE_HOME==='true')for(const width of [390,1440]){
   await page.setViewportSize({width,height:width===390?844:1000});await page.goto(base+'/',{waitUntil:'load'});const height=await page.evaluate(()=>document.documentElement.scrollHeight);
   for(let y=0;y<height;y+=700){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(80);}
   await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(250);
   await page.screenshot({path:output+`/${width===390?'mobile':'desktop'}-after.png`,fullPage:true,animations:'disabled'});
   if(width===1440)await page.screenshot({path:output+'/desktop-hero-after.png',fullPage:false,animations:'disabled'});
  }
  for(const file of ['barber-tips.html','beardgrowth.html']){
   await page.setViewportSize({width:390,height:844});await page.goto(base+'/'+file,{waitUntil:'load'});
   const height=await page.evaluate(()=>document.documentElement.scrollHeight);
   for(let y=0;y<height;y+=700){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(80);}
   await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(output,file.replace('.html','')+'-mobile.png'),fullPage:true,animations:'disabled'});
  }
  const noJs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});await noJs.route('**/*',r=>new URL(r.request().url()).origin!==new URL(base).origin?r.abort():r.continue());const fallback=await noJs.newPage();await fallback.goto(base);assert(await fallback.locator('#site-nav').isVisible());assert(await fallback.locator('[data-booking-placement="hero"]').isVisible());await noJs.close();
  results.push({feature:'progressive enhancement',status:'passed',checks:'Navigation and booking links remain available with JavaScript disabled.'});
  assert.deepEqual(errors,[],'Unexpected browser errors');assert.deepEqual(httpErrors,[],'Unexpected resource failures');
  const report={date:auditDate,measuredAtUtc:new Date().toISOString(),browser:browser.version(),base,results,errors,httpErrors,status:'passed',scope:'Local preview only. All external requests blocked. No forms, appointments, ad impressions or real analytics events generated.'};
  await fs.writeFile(output+'/browser-check.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));await context.close();
 }finally{await browser.close();}
})().catch(e=>{console.error(e.stack);process.exitCode=1;});
