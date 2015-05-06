var outils = require('..');
var fs = require("fs");

// simple example
var f1 = process.argv[1];

console.log('Generating SOAP Upload Body for file ' +f1);

var MAX_FILE_SIZE = 25*1024*1024;

// generate the SOAP upload payload
outils.genUploadSOAP(f1, MAX_FILE_SIZE, function(er, fs, bdy) {
  if (er) {
    console.log(err);
    process.exit(1);
  }
  console.log('SUCCESS: filesize is ' +fs);
  console.log('SOAP Body is ' +bdy);
});

