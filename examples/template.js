var outils = require('..');
var fs = require("fs");
var path = require("path");

// Shows how to override the template file to make substutution happen

var opts = {
  "type":          "SOAP",
  "ctype":         "TEXT",
  "template":      __dirname+'/../test/template.data',
  "file":         __dirname+'/../test/binfile'
};

outils.genUploadRequest(opts, function(er, fsz, bdy) {
  if (er) {
    console.log('genRequestTest SOAP: error ' +er);
    process.exit(1);
  }
  console.log('SUCCESS: filesize is ' +fsz);
  console.log('overriden template is   ' +opts.template);
  console.log('file is   ' +opts.file);
  console.log('type is    ' +opts.type);
  console.log('ctype is    ' +opts.ctype);
  console.log('Body is:' +"\n" +bdy);
});

