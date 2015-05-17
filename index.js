var path = require("path");
var fs = require("fs");

// INTERNAL FUNCTIONS AND PROPERTIES

_TEMPLATE_DIR = path.join(__dirname, '/files/');
_ISBINARY = false;
_REQUIRE_TEMPLATES_DEAFULT = true;

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

// convenience method to get the templates files
// returns an error or the file
function getTemplate(fp, req) {
  var ret, str;
  //console.log('getTemplate:' +fp +' ' +req);
  try {
    // normal path
    str = fs.readFileSync(fp, "utf8");
    ret = str.substring(0, str.length-1);
  } catch (e) {
    if (req) {
      // pass the error upstream
      throw e;
    } else {
      //console.log('getTemplate read template error ignored:' +e);
      return '';
    };
  };
  return ret;
};

module.exports = {
  /**
   * Used to determine if filename is a binary file for upload
   *
   * @param  {String} filename
   * @return {Boolean}
   *
  **/
  isBinary: function(filename) {
    var retval;

    // validate file exists
    var fstats = fs.statSync(filename);

    require('istextorbinary').isBinary(filename, '', function(err, result){
      if (err) {
        var ex  = 'isBinary exception: ' +err;
        console.log(ex);
        return undefined;
      } else {
        //console.log("file " +filename +" is binary " +result);
        retval = result;
      }
    });
    return retval;
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

/*
var _options = {
  "type":          "SOAP",
  "ctype":         "binary", // || TEXT // binary==base64 encoding text==utf8
  "file":          "",
  "maxsize":       26214400,
  "templatedir":   ""
};
*/

// wrapper function for genUploadSOAP and others
var genUploadRequest = function(opts, cb) {
  var type = opts.type;
  var ctype = opts.ctype;            
  if (ctype) ctype=ctype.toUpperCase();
  var file = opts.file;
  var maxsize = opts.maxsize 
  var templatedir = opts.templatedir;
  var subvals = {};
  var ts = new Date().toISOString();
  var filebody = '';
  var gettxt = false;
  var getbin = false;
  var getbody = true;
  var reqtemps = (opts.reqtemps == false ? false : _REQUIRE_TEMPLATES_DEAFULT);

  //console.log("_ISBINARY: " +_ISBINARY);
  //console.log("templatedir: " +templatedir +" " +_TEMPLATE_DIR);

  // validate file
  var fstats = fs.statSync(file);
  var filesize = fstats["size"];

  if (filesize > maxsize) {
    var e = 'generateUploadSOAP ERROR: ' +filename +' filesize ' +filesize + ' exceeds maximum supported size of ' +maxsize;
    return cb(e);
  }

  var tdir = templatedir || _TEMPLATE_DIR;
  var tfiles = {
    pre:     path.join(tdir, type +'-PAYLOAD-PRE'),
    post:    path.join(tdir, type +'-PAYLOAD-POST')
  };

  var cache = {
    pre:      'placeholder',
    post:     'placeholder',
  };


  if (type === 'WSA') getbody= false;

  //console.log("Ctype: " +ctype);
  switch (ctype) {
    case 'TEXT':
      getbody ? getbody = ctype : false;
      //console.log("TEXT Getbody: " +getbody +ctype);
      break;
    case 'BINARY':
      getbody ? getbody = ctype : false;
      //console.log("BINARY Getbody: " +getbody) +ctype;
      break;
    default: 
      //console.log("DEFAULT Getbody: " +getbody) +ctype;
      if (getbody) {
        if (isBinary(file)) 
          getbody = 'BINARY'
        else
          getbody = 'TEXT';
      };
  };

  //console.log("Getbody: " +getbody);

  // this is SOAP inline case
  if (getbody == 'TEXT') { 
    // assign the templates case
    filebody = fs.readFileSync(file, "utf8");
    tfiles.pre = tfiles.pre+'-TEXT';
    tfiles.post = tfiles.post+'-TEXT';
  }
  // this is SOAP Binary
  if (getbody == 'BINARY')
    filebody = fs.readFileSync(file).toString('base64');


  // create subvals which can be used on PRE template or body if !templates
  // sub in credentials for WSSE case
  subvals.FILENAME = file;
  if (opts.user)
    subvals.USERNAME = opts.user;
  if (opts.pass)
    subvals.PASSWORD = opts.pass;

  // now read the templates
  var str, bdy;

  // get template files and set request body
  str = getTemplate(tfiles.pre, reqtemps);
  cache.pre = varSub(str, subvals);
  str = getTemplate(tfiles.post, reqtemps);
  cache.post = varSub(str, subvals);

  bdy = cache.pre +filebody +cache.post;

  return cb(e, filesize, bdy);

};

module.exports.genUploadRequest = genUploadRequest;

// generate SOAP body for SOAP Upload
var genUploadSOAP = function(filepath, maxfilesize, type, cb) {
  //console.log('genUploadSOAP: '+filepath +' ' +maxfilesize);
  // cb(err, soapbody)
  var soaptype = type || "SOAP";

  var tdir = _TEMPLATE_DIR; 
  var tfiles = {
    pre:     path.join(tdir, soaptype +'-PAYLOAD-PRE'),
    post:    path.join(tdir, soaptype +'-PAYLOAD-POST')
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

  // a bit of a hack to support WSA which doens't want the body inserted here.
  if (type === 'WSA')
    filebody = "";
  else 
  // get file body and adjust templates for binary payload
  if (_ISBINARY || isBinary(filepath)) {
    filebody = fs.readFileSync(filepath).toString('base64');
  } else {
    tfiles.pre = tfiles.pre+'-TEXT';
    tfiles.post = tfiles.post+'-TEXT';
    filebody = fs.readFileSync(filepath, "utf8");
  };

  // get template files and set request body
  var str = fs.readFileSync(tfiles.pre, "utf8");
  str = str.replace(/%%FILENAME%%/g, filename);
  cache.pre = str.substring(0, str.length-1);
  str = fs.readFileSync(tfiles.post, "utf8");
  cache.post = str.substring(0, str.length-1);
  var bdy = cache.pre +filebody +cache.post;
  return cb(e, filesize, bdy);
};

module.exports.genUploadSOAP = genUploadSOAP;

// function do paramterised substistutions
String.prototype.myRep = function (replaceThis, withThis) {
   var re = new RegExp(replaceThis,"g");
   return this.replace(re, withThis);
};
module.exports.myRep = String.prototype.myRep;

// function to do Templatized substitution
var varSub = function(data, vals, delim) {
// data = "Hello %%NAME%% it is now %%ISOTIME%%"
// nvp = {"nAmE": 'dave", "isotime": ""};

  if (!delim) delim = '%%';

// data is field that gets changed
// nvp is list of sub names and values

  for (var key in vals) {
    if (vals.hasOwnProperty(key)) {
      //console.log(key + " -> " + vals[key]);
      var n1 =  key;
      var v1 = vals[n1]
      var sn = n1.toUpperCase();
      var sn = delim +sn +delim;
      //console.log(n1 + " -> " + v1);
      data = data.myRep(sn, v1);
    };
  };
  return data;
};
module.exports.varSub = varSub;

/*
  for (var key in vals) {
    if (vals.hasOwnProperty(key)) {
      //console.log(key + " -> " + vals[key]);
      var n1 =  key.toUpperCase();
      n1 = delim +n1 +delim;
      var v1 = vals[key]
      data = data.myRep(n1, v1);
    };
  };

*/
