const fs=require('node:fs');
const dir='docs/evidence/2026-11-03/implementation/';
const records=[];
for(const profile of ['mobile','desktop'])for(const version of ['baseline','candidate']){
 const r=JSON.parse(fs.readFileSync(dir+`local-${version}-${profile}.report.json`,'utf8'));
 const trackers=r.audits['network-requests'].details.items.filter(i=>/googlesyndication|doubleclick|googleadservices|googletagservices|google-analytics|googletagmanager/.test(i.url));
 records.push({version,profile,fetchTime:r.fetchTime,lighthouseVersion:r.lighthouseVersion,categories:Object.fromEntries(Object.entries(r.categories).map(([k,v])=>[k,Math.round(v.score*100)])),metrics:Object.fromEntries(['largest-contentful-paint','first-contentful-paint','total-blocking-time','cumulative-layout-shift','total-byte-weight'].map(k=>[k,r.audits[k].numericValue])),errors:r.runtimeError||null,warnings:r.runWarnings,screen:r.configSettings.screenEmulation,throttling:r.configSettings.throttling,blockedPatterns:r.configSettings.blockedUrlPatterns,adAnalyticsBlocked:trackers.length===2&&trackers.every(i=>i.statusCode===-1&&i.transferSize===0),accessibilityFindings:r.categories.accessibility.auditRefs.map(a=>r.audits[a.id]).filter(a=>a.score!==null&&a.score<1).map(a=>({id:a.id,title:a.title}))});
}
fs.writeFileSync(dir+'comparison.json',JSON.stringify({scope:'One sequential baseline navigation per profile; candidate remeasured after fixing initial mobile CLS. Both versions served locally by the same HTTP server with identical no-cache policy. Ads/Analytics deliberately blocked. Not production performance, revenue, INP or field CWV. Baseline localhost HTTP can behave differently from HTTPS for legacy font requests.',records},null,2)+'\n');
console.log(JSON.stringify(records.map(({version,profile,categories,metrics,adAnalyticsBlocked,accessibilityFindings})=>({version,profile,categories,metrics,adAnalyticsBlocked,accessibilityFindings})),null,2));
