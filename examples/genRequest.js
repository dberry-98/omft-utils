// type = "SOAP
var outils = require('..');
var fs = require("fs");
var path = require("path");

var type = "SOAP" // or "FORM" or "WSA"

var opts = {
  "type":          "SOAP",
  "ctype":         "binary",
  "file":          process.argv[1],
  "maxsize":       26214400,
  "templatedir":   path.join(__dirname, '../files')
};

outils.genUploadRequest(opts, function(er, fsz, bdy) {
  if (er) {
    console.log('genRequestTest SOAP: error ' +er);
    process.exit(1);
  }
  console.log('SUCCESS: filesize is ' +fsz);
  console.log('file is   ' +opts.file);
  console.log('type is    ' +opts.type);
  console.log('ctype is   ' +opts.ctype);
  console.log('maxsize is   ' +opts.maxsize);
  console.log('templatedir is   ' +opts.templatedir);
  console.log('Body is   ' +bdy);
});
