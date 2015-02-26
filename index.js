module.exports = (function () {
  var fs = require('fs');

  return {
    loadCsv: function (file, options, callback) {
      fs.readFile(file, function (err, data) {
        if (err) {
          throw err;
        }
        var rows = data.toString().split('\n'),
          i = 0,
          len = rows.length,
          opts = options || {},
          csv = {};
        if (opts.withHeaders) {
          csv.headers = rows[0].split(',');
          // skip headers row in parsing
          i = 1;
        }
        
        function objectLoader(headers, data) {
          var obj = {},
            c = 0,
            len = headers.length;
          for (c; c < len; c += 1) {
            obj[headers[c]] = data[c];
          }
          return obj;
        }

        var loader = opts.intoObjects ? objectLoader : function (headers, data) {
          return data;
        }

        for (i; i < len; i += 1) {
          rows[i] = loader(csv.headers, rows[i].split(','));
        }

        csv.data = rows;

        callback(csv);
      });
    }
  };
})();