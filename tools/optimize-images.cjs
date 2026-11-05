const fs=require('node:fs/promises');
const path=require('node:path');
const {createHash}=require('node:crypto');
const sharp=require(process.env.AUDIT_SHARP_MODULE||'sharp');
(async()=>{
 const files=['images/banner/billar.jpg','images/about.jpg','images/team/04.jpg',...Array.from({length:8},(_,i)=>`images/portfolio/${String(i+1).padStart(2,'0')}.jpg`),...['beardgrowth.jpg','beardhealth.jpg','hairroot&tip.jpg','hairtype.png','healthyscalp.jpg','itchyscalp.jpg'].map(x=>'images/articulo/'+x)];
 await fs.mkdir('public/images/optimized',{recursive:true});
 const manifest={};
 for(const file of files){
  const input=await fs.readFile(path.join('public',file));const meta=await sharp(input).metadata();
  const widths=[...new Set([320,640,960,1440,meta.width].filter(w=>w<=meta.width))].sort((a,b)=>a-b);
  const variants=[];
  for(const width of widths){
   const bytes=await sharp(input).rotate().resize({width,withoutEnlargement:true}).webp({quality:80,effort:5}).toBuffer();
   const hash=createHash('sha256').update(bytes).digest('hex').slice(0,10);
   const name=file.replace(/^images\//,'').replace(/\.[^.]+$/,'').replace(/[^a-zA-Z0-9]+/g,'-')+`-${width}-${hash}.webp`;
   await fs.writeFile('public/images/optimized/'+name,bytes);
   variants.push({width,src:'images/optimized/'+name,bytes:bytes.length});
  }
  manifest[file]={width:meta.width,height:meta.height,originalBytes:input.length,variants};
 }
 await fs.writeFile('content/images.json',JSON.stringify(manifest,null,2)+'\n');
 console.log(JSON.stringify({images:files.length,originalBytes:Object.values(manifest).reduce((n,i)=>n+i.originalBytes,0),largestWebpBytes:Object.values(manifest).reduce((n,i)=>n+i.variants.at(-1).bytes,0)},null,2));
})().catch(e=>{console.error(e.message);process.exitCode=1;});
