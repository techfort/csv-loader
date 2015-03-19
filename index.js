module.exports = (function () {
  var fs = require('fs');

  function objectLoader(headers, data) {
    var obj = {},
      c = 0,
      len = headers.length;
    for (c; c < len; c += 1) {
      obj[headers[c]] = data[c];
    }
    return obj;
  }

  function loadWithHeaders(headers) {
    return function (data) {
      return objectLoader(headers, data);
    };
  }

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
          csv = {},
          localLoader;

        opts.withHeaders = opts.withHeaders || true;
        opts.intoObjects = opts.intoObjects || true;

        if (opts.withHeaders === true) {
          csv.headers = rows[0].split(',');
          // skip headers row in parsing
          i = 1;
        }

        var loader = opts.intoObjects ? loadWithHeaders(csv.headers) : function (data) {
          return data;
        };

        for (i; i < len; i += 1) {
          rows[i] = loader(rows[i].split(','));
        }

        csv.data = rows;

        callback(csv);
      });
    }
  };
})();
