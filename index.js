var path = require("path");
var fs = require("fs");

// INTERNAL FUNCTIONS AND PROPERTIES

_TEMPLATE_DIR = path.join(__dirname, '/files/');
_ISBINARY = false;
_REQUIRE_TEMPLATES_DEFAULT = true;
_RETBODY_DEFAULT = true;

function splitArgs(retm, str) {
        // need to support 'a=1' OR 'b=2 c=3' OR 'd=4 5' OR 'e=5 f=6 7'
        // str='A=a1 B=b2 C=c3 c4 c5'
        var i = 0;
        var l;
        var n, v, si, x1, x2, l, ln, lo;
        var sa1 = str.split(' ');
        //console.log('SPLITARGS str:' +str);
        str.split('=').forEach(function(x1){
                //console.log('SPLITARGS OUTER:', x1);
                l = x1.length;
                si = x1.lastIndexOf(' ');
                i++;
                if (i === 1) {
                        n = x1.toLowerCase();
                        //console.log('SPLITARGS    INNER FIRST NAME: ' +n);
                } else {
                        v = (x1.substr(0, si)).trim();
                        //console.log('SPLITARGS    INNER NAME/VALUE: ' +n +'/' +v);
			if (n && v) {
			  n = n.toLowerCase();
                          retm[n] = v;
			}
                        ln = n;
                        n = (x1.substr(si)).trim();
                        lo = x1
                };

        });
	if (lo) {
          v = lo;
          retm[ln] = v;
        };
        //console.log('SPLITARGS RETURNING: ', retm, "\n");
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
  isBinary: function(filename, buffer) {
    var retval;

    // validate file exists
    if (filename) var fstats = fs.statSync(filename);

    require('istextorbinary').isBinary(filename, buffer, function(err, result){
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
        splitArgs(ret, val);
      });
    } catch (e) {
      var ex  = 'parseCalloutArgs exception: ' +e;
      console.log(ex);
      throw ex;
    }

    // support out of box RunScript arguments
    if (!ret.file && (ret.filename && ret.dir)) {
      ret.file = path.join(ret.dir, ret.filename);
    };
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
  "template":      ""
};
*/

// function do template substitution
var genUploadRequest = function(opts, cb) {
  var ts = new Date().toISOString();
  var filebody = '';
  var subvals = {};
  var gettxt = false;
  var getbin = false;

// opts
  var type = opts.type;
  var ctype = opts.ctype;            
  if (ctype) ctype=ctype.toUpperCase();
  var file = opts.file;
  var maxsize = opts.maxsize 
  var templatedir = opts.templatedir;
  var template = opts.template;
  var retbody = (opts.retbody == false ? false : _RETBODY_DEFAULT);
  var reqtemps = (opts.reqtemps == false ? false : _REQUIRE_TEMPLATES_DEFAULT);
  var tvars = opts.templatevars;

  // keep this in for backward compatibility for now
  type === 'WSA' ? retbody = false : false;

  //console.log("_ISBINARY: " +_ISBINARY);
  //console.log("templatedir: " +templatedir +" " +_TEMPLATE_DIR);
  //console.log("template: " +template);

  // validate file
  var fstats = fs.statSync(file);
  var filesize = fstats["size"];

  if (filesize > maxsize) {
    var e = 'generateUploadRequest ERROR: ' +file +' filesize ' +filesize + ' exceeds maximum supported size of ' +maxsize;
    return cb(e);
  }

  var tdir = templatedir || _TEMPLATE_DIR;
  var tfile = path.join(tdir, type +'-PAYLOAD');
  if (template && templatedir) {
    var e = 'generateUploadRequest ERROR: template and templatedir cannot be used together:' +template +' ' +templatedir;
    return cb(e);
  }
  if (template) tfile=template;

  // get ctype dynamically if not provided
  if (!ctype) {
    if (isBinary(file)) 
      ctype = 'BINARY'
    else
      ctype = 'TEXT';
  };

  // this is SOAP TextInline case
  if (ctype == 'TEXT') { 
    // file being uploaded will be UTF8
    if (retbody) { // get body if requested
      filebody = fs.readFileSync(file, "utf8");
      if (!template) tfile = tfile +'-TEXT';
    };
  };
  // this is SOAP BinaryInline case
  if (retbody && ctype == 'BINARY') {
    // file being uploaded will be BASE64 encoded
    filebody = fs.readFileSync(file).toString('base64');
  };

  // create subvals which can be used on the template or body if !templates
  // sub in credentials for WSSE case

  var fi = path.parse(file);
  subvals.FILEBASE = fi.base;  // foo.bar
  subvals.FILENAME = fi.name;  // foo
  subvals.FILEEXT =  fi.ext;   // bar
  subvals.FILEDIR =  fi.dir;   // bar
  subvals.FILEPATH = path.resolve(fi.dir);

  subvals.ISOTIME = ts;
  if (opts.user)
    subvals.USERNAME = opts.user;
  if (opts.pass)
    subvals.PASSWORD = opts.pass;
  if (opts.docid) 
    subvals.DOCID= opts.docid;
  if (opts.searchfile) 
    subvals.SEARCHFILE = opts.searchfile;

  //console.log('SUBVALS:', subvals);

  // now read the templates
  var str, bdy;

  // merge in tvars if provided 
  if (tvars) {
    //console.log("Adding tvars: " +tvars);  
    tvars = upperNames(tvars);
    //console.log(tvars);
    subvals = mergeObjs(subvals, tvars);
  };

  // get template files and set request body
  str = getTemplate(tfile, reqtemps);
  var tdata = varSub(str, subvals);

  // have to do subs on body if no templates being used. WSA, ODI and HCM notify use casess
  if (filebody && !reqtemps) {
    filebody = varSub(filebody, subvals);
  };

  // support %%FILEBODY%% in the template
  if (filebody && tdata) {
    var fbstr = '%%FILEBODY%%';
    var ba = tdata.split(fbstr);

    // kind of a hack but should work
    if (ba && ba.length == 2) {
      tdata = ba[0] +filebody +ba[1];
      filebody = '';
    };
  };

  bdy = tdata +filebody;

  return cb(e, filesize, bdy);

};

module.exports.genUploadRequest = genUploadRequest;

// function do paramterised substistutions
String.prototype.myRep = function (replaceThis, withThis) {
   var re = new RegExp(replaceThis,"g");
   return this.replace(re, withThis);
};
module.exports.myRep = String.prototype.myRep;

// function to do Templatized substitution
var varSub = function(data, vals, delim) {
  // data = "Hello %%NAME%% it is now %%ISOTIME%%"
  // vals = {"nAmE": 'dave", "isotime": ""};

  // support external substitution delimeters
  if (!delim) delim = '%%';

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

// function to uppercase NAMES in ob n/v pairs
var upperNames = function(obj) {
  // vals = {"nAmE": 'dave", "country": "Mx"};
  // vals = {"NAME": 'dave", "COUNTRY": "Mx"};
  var retobj = {};
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      var v1 = obj[key]
      var N1 =  key.toUpperCase();;
      retobj[N1] = v1 
    };
  };
  //console.log('upperNames:" +retobj);
  return retobj;
};

// function to merge variables from obj1 and obj2
// does not override existing objects already in obj2
// function returns updated obj2 ans obj3
var mergeObjs = function(obj1, obj2) {
  // Example
  // obj1 = {"name": 'dave", "sex": "m", "country": "USA"};
  // obj2 = {"name": 'jean", "sex": "f", "areacode": 212};
  // returns
  // obj3 = {"name": 'jean", "sex": "f", "areacode": 212, "country": "USA"};

  var obj3 = obj2;

  // data is field that gets changed
  // nvp is list of sub names and values

  // iterate thru obj1 and add to obj2 if not already present
  for (var key in obj1) {
    if (obj1.hasOwnProperty(key)) {
      //console.log(key + " -> " + obj1[key]);
      var n1 =  key;
      var v1 = obj1[n1]
      var v2 = obj2[n1]
      //console.log(n1 + " -> " + v1 +' ' +v2);
      if (!v2) {
        //obj3.n1 = v1;
        obj3[n1] = v1;
        //console.log("  ADDING:" +n1 +' ' +v1);
      } else {
        //console.log("  EXITS:" +n1 +' ' +v1);
      };
    };
  };
  return obj3;
};


