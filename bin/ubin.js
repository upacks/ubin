#!/usr/bin/env node
const fs = require('fs');
console.log(process.argv);
console.log(__dirname);
const pkg = JSON.parse(fs.readFileSync(__dirname + '/../package.json'));
console.log(pkg);
//# sourceMappingURL=ubin.js.map