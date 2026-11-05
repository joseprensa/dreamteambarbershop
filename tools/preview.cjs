// Owner review uses a separate copy without real advertising or Analytics loaders.
const cp=require('node:child_process');
const path=require('node:path');
cp.execFileSync(process.execPath,['tools/prepare-preview.cjs'],{stdio:'inherit'});
process.env.SITE_ROOT=path.resolve('.preview/public');
process.env.PORT=process.env.PORT||'4175';
require('./serve.cjs');
