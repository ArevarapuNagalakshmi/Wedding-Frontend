const fs = require('fs');
const parser = require('@babel/parser');
const code = fs.readFileSync('src/components/customer/ServiceList.jsx', 'utf8');
try {
  parser.parse(code, { sourceType: 'module', plugins: ['jsx'] });
  fs.writeFileSync('parse_result.txt', 'PARSE_OK');
} catch (e) {
  fs.writeFileSync('parse_result.txt', 'PARSE_ERROR: ' + e.message);
  process.exit(1);
}
