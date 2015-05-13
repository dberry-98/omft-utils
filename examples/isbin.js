var outils = require('..');

// simple example
var f1 = process.argv[1];
var f2 = './test/binfile';
var f3 = 'NOFILE';
var result,s;

try {
  console.log(outils.isBinary(f1));
  console.log(outils.isBinary(f2));
  console.log(outils.isBinary(f3));

} catch (e) {
  console.log(e);
};

