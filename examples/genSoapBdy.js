// type = "SOAP|FORM"
var outils = require('..');
var fs = require("fs");
var f1 = process.argv[1];
var type = "SOAP" // or "FORM"
var MAX_FILE_SIZE = 25*1024*1024;
outils.genUploadSOAP(f1, MAX_FILE_SIZE, type, function(er, fsz, bdy) {
  if (er) {
    console.log(err);
    process.exit(1);
  }
  console.log('SUCCESS: filesize is ' +fsz);
  console.log('type is ' +type);
  console.log('Body is ' +bdy);
});
