/**
 * Used to determine if filename is a binary file for upload
 *
 * @param  {String} filename
 * @return {Boolean}
 */
module.exports = {
  isBinary: function(filename) {
    var path = require("path");
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
  }
};

