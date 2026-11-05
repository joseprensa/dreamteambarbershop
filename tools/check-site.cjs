const fs=require('node:fs');
const path=require('node:path');
const cp=require('node:child_process');
const assert=require('node:assert/strict');
const root=path.resolve('public');
const pages=JSON.parse(fs.readFileSync('content/pages.json','utf8'));
const business=JSON.parse(fs.readFileSync('content/business.json','utf8'));
const images=JSON.parse(fs.readFileSync('content/images.json','utf8'));
const editorial=JSON.parse(fs.readFileSync('content/editorial.json','utf8'));
const budgets=JSON.parse(fs.readFileSync('content/performance-budgets.json','utf8'));
const decode=s=>s.replace(/&amp;/g,'&').replace(/&#39;/g,"'").replace(/&quot;/g,'"');
const usedAssets=new Set(['robots.txt','ads.txt','sitemap.xml',...Object.keys(images)]);
function recordReference(value,file){
 const url=new URL(decode(value),'https://local/'+file);
 if(!['local','dreamteambarbershop.com'].includes(url.hostname))return;
 usedAssets.add(decodeURIComponent(url.pathname==='/'?'index.html':url.pathname.slice(1)));
}
function walk(directory){
 return fs.readdirSync(directory,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(path.join(directory,entry.name)):[path.join(directory,entry.name)]);
}
const documents=fs.readdirSync(root).filter(f=>f.endsWith('.html'));
const titles=new Set();let localReferences=0;let bookings=0;
const htmlSizes=[];
function existsCaseSensitive(file){
 if(!file.startsWith(root+path.sep))return false;
 let dir=root;
 for(const part of path.relative(root,file).split(path.sep)){
  if(!fs.existsSync(dir)||!fs.readdirSync(dir).includes(part))return false;
  dir=path.join(dir,part);
 }
 return fs.statSync(file).isFile();
}
for(const file of documents){
 const html=fs.readFileSync(path.join(root,file),'utf8');
 htmlSizes.push({file,bytes:Buffer.byteLength(html)});
 assert(Buffer.byteLength(html)<=budgets.htmlBytes,'HTML size budget exceeded in '+file);
 assert.equal((html.match(/<link\b[^>]*rel="stylesheet"/g)||[]).length,budgets.localStylesheetsPerPage,'Unexpected stylesheet count in '+file);
 assert.equal((html.match(/<script\b[^>]*src="\//g)||[]).length,budgets.localScriptsPerPage,'Unexpected local script count in '+file);
 usedAssets.add(file);
 for(const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g))recordReference(match[1],file);
 for(const match of html.matchAll(/\bsrcset="([^"]+)"/g))for(const variant of match[1].split(',')){
  const value=variant.trim().split(/\s+/)[0];recordReference(value,file);
  const target=path.join(root,new URL(decode(value),'https://local/'+file).pathname.slice(1));
  assert(existsCaseSensitive(target),'Missing responsive image '+value+' in '+file);
 }
 for(const match of html.matchAll(/https:\/\/dreamteambarbershop\.com[^"'<>\\\s]*/g))recordReference(match[0],file);
 const title=html.match(/<title>([^<]+)<\/title>/)?.[1];
 assert(title&&!titles.has(title),'Missing/duplicate title in '+file);titles.add(title);
 assert.equal((html.match(/<h1\b/g)||[]).length,1,'One H1 required in '+file);
 assert(html.includes('<main id="main"'),'Missing main landmark in '+file);
 assert(html.includes('<meta name="description" content="'),'Missing description in '+file);
 const canonical=html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
 assert.equal(canonical,'https://dreamteambarbershop.com'+(file==='index.html'?'/':'/'+file));
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(ids.length,new Set(ids).size,'Duplicate id in '+file);
 const isCommercial=file==='index.html'||pages.some(p=>p.file===file&&p.kind==='article');
 assert.equal((html.match(/src="https:\/\/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/g)||[]).length,isCommercial?1:0,'Unexpected ad loader count in '+file);
 assert.equal((html.match(/src="https:\/\/www\.googletagmanager\.com\/gtag\/js/g)||[]).length,file==='404.html'?0:1,'Unexpected GA loader count in '+file);
 assert(!/<(?:script|link)\b[^>]*(?:jquery|bootstrap|prettyPhoto|prettyphoto|animate\.min)/i.test(html),'Legacy dependency referenced in '+file);
 for(const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g))JSON.parse(m[1]);
 for(const m of html.matchAll(/<(?:a|link|script|img)\b[^>]*?\b(?:href|src)="([^"]+)"/g)){
  const value=decode(m[1]);
  if(/^(?:https?:|tel:|mailto:)/.test(value))continue;
  const u=new URL(value,'https://local/'+file);const pathname=decodeURIComponent(u.pathname);
  const target=path.join(root,pathname==='/'?'index.html':pathname.slice(1));
  assert(existsCaseSensitive(target),'Missing or wrong-case local reference '+value+' in '+file);localReferences++;
  if(u.hash&&target.endsWith('.html')){const text=fs.readFileSync(target,'utf8');assert(text.includes('id="'+decodeURIComponent(u.hash.slice(1))+'"'),'Broken fragment '+value+' in '+file);}
 }
 for(const m of html.matchAll(/<a\b[^>]*href="([^"]*booksy[^\"]*)"/g)){assert.equal(decode(m[1]),business.bookingUrl,'Booksy destination changed');bookings++;}
 for(const m of html.matchAll(/<img\b[^>]*>/g)){
  assert(/\bwidth="\d+"/.test(m[0])&&/\bheight="\d+"/.test(m[0]),'Image missing dimensions in '+file);
  assert(/\balt="/.test(m[0]),'Image missing alt in '+file);
 }
 const sourcePage=pages.find(p=>p.file===file);
 if(sourcePage?.kind==='article'){
  const topics=[...html.matchAll(/<h2 id="(topic-\d+)"/g)].map(m=>m[1]);
  assert.equal(topics.length,editorial[file].sections.length,'Missing article topic headings in '+file);
  for(const id of topics)assert(html.includes('href="#'+id+'"'),'Article topic missing from contents in '+file);
  assert(html.includes('href="barber-tips.html"'),'Article must link to guide hub: '+file);
 }
 if(file!=='404.html')assert(html.includes('action="'+business.formAction+'"'),'Form recipient changed in '+file);
}
assert.equal(documents.length,pages.length+3);
assert(bookings>0);
assert.equal(fs.readFileSync('public/ads.txt','utf8').trim(),'google.com, pub-4652560092630616, DIRECT, f08c47fec0942fa0');
assert.equal((fs.readFileSync('public/sitemap.xml','utf8').match(/<loc>/g)||[]).length,pages.length+2);
assert(fs.readFileSync('public/robots.txt','utf8').includes('Sitemap: https://dreamteambarbershop.com/sitemap.xml'));
for(const file of ['css/site.css','js/site.js']){
 for(const match of fs.readFileSync(path.join(root,file),'utf8').matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/g))recordReference(match[1],file);
}
const orphanAssets=walk(root).map(file=>path.relative(root,file).replace(/\\/g,'/')).filter(file=>!usedAssets.has(file));
assert.deepEqual(orphanAssets,[],'Unreferenced public files: remove them or declare their real source-image use.');
const cssBytes=fs.statSync(path.join(root,'css/site.css')).size;
const javascriptBytes=fs.statSync(path.join(root,'js/site.js')).size;
assert(cssBytes<=budgets.cssBytes,'CSS size budget exceeded');
assert(javascriptBytes<=budgets.javascriptBytes,'JavaScript size budget exceeded');
let largestOptimizedImageBytes=0;
for(const image of Object.values(images))for(const variant of image.variants){
 const actual=fs.statSync(path.join(root,variant.src)).size;
 assert.equal(actual,variant.bytes,'Image manifest byte count mismatch: '+variant.src);
 assert(actual<=budgets.optimizedImageBytes,'Optimized image size budget exceeded: '+variant.src);
 largestOptimizedImageBytes=Math.max(largestOptimizedImageBytes,actual);
}
for(const file of ['public/js/site.js',...fs.readdirSync('tools').filter(f=>f.endsWith('.cjs')).map(f=>'tools/'+f)])cp.execFileSync(process.execPath,['--check',file],{stdio:'pipe'});
console.log(JSON.stringify({status:'passed',documents:documents.length,uniqueTitles:titles.size,localReferences,bookingLinksChecked:bookings,publicFiles:walk(root).length,orphanAssets:orphanAssets.length,performance:{cssBytes,javascriptBytes,largestHtml:htmlSizes.sort((a,b)=>b.bytes-a.bytes)[0],largestOptimizedImageBytes,budgets},checks:'Case-sensitive assets and srcsets, no orphan assets, article contents/headings, size and dependency budgets, fragments, landmarks, dimensions, source destinations, script counts, schema JSON, sitemap, syntax.'},null,2));
