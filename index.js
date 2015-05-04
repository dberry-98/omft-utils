var path = require("path");

module.exports = {
  /**
   * Used to determine if filename is a binary file for upload
   *
   * @param  {String} filename
   * @return {Boolean}
   *
  **/
  isBinary: function(filename) {
    var ft = path.extname(filename);
    // this is just the beginning. Add more types as needed.
    switch (ft) {
      case '.png':
      case '.jpg':
      case '.zip':
      case '.tar':
      case '.mov':
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
    ar.forEach(function (val, index, array) {
      var linedata = index + ': ' + val;
      splitArgs(ret, linedata);
    });
    return ret;
  }
};

// INTERNAL FUNCTIONS
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
