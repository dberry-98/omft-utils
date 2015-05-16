var outils = require('..');

// simple examples
var data =  'Hello %%NAME%% it is now %%ISOTIME%%';
var data2 = 'Hello ##NAME## it is now ##ISOTIME##';
var ts = new Date().toISOString();
var vals = {'NAME': 'dave', 'ISOTIME': ts};
var val2 = {'nAmE': 'Dave', 'isotime': ts};

try {
  console.log(outils.varSub(data, vals));

  console.log(outils.varSub(data, val2));
  console.log(outils.varSub(data, val2, '%%'));

  console.log(outils.varSub(data2, val2, '##'));

} catch (e) {
  console.log(e);
};


