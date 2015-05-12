var path = require("path");
var fs = require("fs");

// INTERNAL FUNCTIONS AND PROPERTIES

_TEMPLATE_DIR = __dirname +'/files/';

function splitArgs(m, str) {
        str.split(' ').forEach(function(x){
                var arr = x.split('=');
                var a0 = arr[0];
                var a1 = arr[1];
                if (a1) {
                  arr[1] && (m[arr[0]] = arr[1]);
                };
        });
};

module.exports.genUploadSOAP = genUploadSOAP;

module.exports = {
  /**
   * Used to determine if filename is a binary file for upload
   *
   * @param  {String} filename
   * @return {Boolean}
   *
  **/
  isBinary: function(filename) {
    var ft ='';
    try {
      var ft = path.extname(filename);
      // this is just the beginning. Add more types as needed.
      switch (ft) {
        case '.png':
        case '.jpg':
        case '.zip':
        case '.tar':
        case '.mov':
        case '.m4v':
        case '.xls':
        case '.doc':
        case '.bin':
        case '.exe':
        case '.bmp':
        case '.gif':
          return true;
        default:
          return false;
      }
    } catch (e) {
      var ex  = 'isBinary exception: ' +e;
      console.log(ex);
      throw ex;
    }
  },
  /**
   * Used to parse name/value pair arguments from the MFT RunScript Callout
   *
   * @param  {String[]} internal
   * @return {object}
   *
  **/
  parseCalloutArgs: function(ar) {
    // array items may have more than 1 name/value pair
    // names with no values are ignored
    // example: 
    //   ar[0] = 'file=test.xml'
    //   ar[1] = 'outfile=out.xml outdir=/tmp/mft'
    //   ret = {file: 'test.xml', outfile: 'out.xml', outdir: '/mft/tmp'} 
    var ret = {};
    if (!ar) return ret;
    try {
      ar.forEach(function (val, index, array) {
        var linedata = index + ': ' + val;
        splitArgs(ret, linedata);
      });
    } catch (e) {
      var ex  = 'parseCalloutArgs exception: ' +e;
      console.log(ex);
      throw ex;
    }
    return ret;
  }
};

var isBinary = module.exports.isBinary;

/**
 * Used to parse name/value pair arguments from the MFT RunScript Callout
 *
 * @param  {String} filepath
 * @param  {String} maxfilesize
 * @return {Function}
             {String} error
             {String} filesize
             {String} soapbody  
 *
**/

// generate SOAP body for SOAP Upload
var genUploadSOAP = function(filepath, maxfilesize, type, cb) {
  //console.log('genUploadSOAP: '+filepath +' ' +maxfilesize);
  // cb(err, soapbody)
  var soaptype = type || "SOAP";

  //var tfiles = path.dirname(module.filename) +'/files/';
  var tfiles = _TEMPLATE_DIR; 
  var templates = {
    pre:     tfiles+ soaptype +'-PAYLOAD-PRE',
    post:    tfiles+ soaptype +'-PAYLOAD-POST'
  };

  var cache = {
    pre:      'placeholder',
    post:     'placeholder',
  };

  // validate file
  var filename =  path.basename(filepath);
  var fstats = fs.statSync(filepath);
  var filesize = fstats["size"];

  if (filesize > maxfilesize) {
    var e = 'generateUploadSOAP ERROR: ' +filename +' filesize ' +filesize + ' exceeds maximum supported size of ' +maxfilesize;
    return cb(e);
  }

  // get file body and adjust templates for binary payload
  if (isBinary(filename)) {
    templates.pre = templates.pre+'-BINARY';
    templates.post = templates.post+'-BINARY';
    filebody = fs.readFileSync(filepath).toString('base64');
  } else {
    filebody = fs.readFileSync(filepath, "utf8");
  };

  // get template files and set request body
  var str = fs.readFileSync(templates.pre, "utf8");
  str = str.replace(/%%FILENAME%%/g, filename);
  cache.pre = str.substring(0, str.length-1);
  str = fs.readFileSync(templates.post, "utf8");
  cache.post = str.substring(0, str.length-1);
  var bdy = cache.pre +filebody +cache.post;
  return cb(e, filesize, bdy);
};

module.exports.genUploadSOAP = genUploadSOAP;

