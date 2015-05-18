var outils = require('..');
var fs = require("fs");
var path = require("path");

var type = 'SOAP';
var tdirs = 'FORCE_NO_TEMPLATES';

var opts = {
  "type":          type,
  "ctype":         "TEXT",
  "file":          "test/template.data",
  "reqtemps":      false,
  "templatedir":   tdirs,
  "user":     "SCOTTISH",
  "pass":      "LIONS"
};

outils.genUploadRequest(opts, function(er, fsz, bdy) {
  if (er) {
    console.log('genRequestTest SOAP: error ' +er);
    process.exit(1);
  }
  console.log('SUCCESS: filesize is ' +fsz);
  console.log('file is   ' +opts.file);
  console.log('type is    ' +opts.type);
  console.log('ctype is    ' +opts.ctype);
  console.log('Username is    ' +opts.USERNAME);
  console.log('Password is    ' +opts.PASSWORD);
  console.log('Body is:' +"\n" +bdy);
});
