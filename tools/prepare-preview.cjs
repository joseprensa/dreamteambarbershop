const fs=require('node:fs');
const path=require('node:path');
const projectRoot=fs.realpathSync('.');
const previewRoot=path.join(projectRoot,'.preview');
const previewPublic=path.join(previewRoot,'public');
fs.mkdirSync(previewRoot,{recursive:true});
if(path.relative(projectRoot,fs.realpathSync(previewRoot))!=='.preview')throw Error('Preview directory must stay inside this repository.');
if(fs.existsSync(previewPublic)&&path.relative(projectRoot,fs.realpathSync(previewPublic))!==path.join('.preview','public'))throw Error('Refusing to replace a redirected preview directory.');
// Only this verified, generated directory is replaced; stale assets must not survive a rebuild.
fs.rmSync(previewPublic,{recursive:true,force:true});
fs.cpSync(path.join(projectRoot,'public'),previewPublic,{recursive:true});
for(const file of fs.readdirSync('.preview/public').filter(f=>f.endsWith('.html'))){
 const target=path.join('.preview/public',file);
 let html=fs.readFileSync(target,'utf8');
 html=html.replace(/<script\b[^>]*src="https:\/\/(?:www\.googletagmanager\.com|pagead2\.googlesyndication\.com)[^>]*><\/script>/g,'');
 html=html.replace(/<script>window\.dataLayer=[\s\S]*?<\/script>/g,'');
 fs.writeFileSync(target,html);
}
const config=JSON.parse(fs.readFileSync('firebase.json','utf8'));
config.hosting.headers=[...(config.hosting.headers||[]),{source:'**',headers:[{key:'X-Robots-Tag',value:'noindex, noarchive'}]}];
fs.writeFileSync('.preview/firebase.json',JSON.stringify(config,null,2)+'\n');
console.log('Prepared isolated preview with X-Robots-Tag noindex and no AdSense/GA4 loaders. Production files unchanged.');
