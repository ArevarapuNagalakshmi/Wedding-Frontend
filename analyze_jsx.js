const fs = require('fs');
const path = 'src/components/customer/ServiceList.jsx';
const out = 'analysis.txt';
try{
  const text = fs.readFileSync(path,'utf8');
  const lines = text.split(/\r?\n/);
  const totalLines = lines.length;
  const snippetStart = Math.max(0, 200);
  const snippet = lines.slice(snippetStart, snippetStart+40).map((l,i)=>`${snippetStart+i+1}: ${JSON.stringify(l)}`).join('\n');
  const lt = (text.match(/</g)||[]).length;
  const gt = (text.match(/>/g)||[]).length;
  const openTags = (text.match(/<[^\/!][^>]*>/g)||[]).length;
  const selfClose = (text.match(/<[^>]+\/>/g)||[]).length;
  const fragmentOpen = (text.match(/<>/g)||[]).length;
  const fragmentClose = (text.match(/<\/>/g)||[]).length;
  const result = `lines=${totalLines}\nlt=${lt} gt=${gt}\nopenTags=${openTags} selfClose=${selfClose}\nfragmentOpen=${fragmentOpen} fragmentClose=${fragmentClose}\n\nSNIPPET:\n${snippet}`;
  fs.writeFileSync(out,result);
}catch(e){fs.writeFileSync(out,'ERROR:'+e.message)}
