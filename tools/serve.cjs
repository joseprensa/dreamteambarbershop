// Local Firebase-like static server; no SPA fallback. Never contacts external accounts.
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(process.env.SITE_ROOT||'public');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.txt':'text/plain; charset=utf-8','.xml':'application/xml','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png','.ico':'image/x-icon'};
http.createServer((req,res)=>{
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
 let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);res.end();return;}
 const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
 if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
 const found=fs.existsSync(file)&&fs.statSync(file).isFile();
 const target=found?file:path.join(root,'404.html');
 res.writeHead(found?200:404,{'Content-Type':types[path.extname(target)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':'no-cache'});
 if(req.method==='HEAD')res.end();else fs.createReadStream(target).pipe(res);
}).listen(Number(process.env.PORT||4173),'127.0.0.1',()=>console.log(`Dream Team preview: http://127.0.0.1:${process.env.PORT||4173}`));
