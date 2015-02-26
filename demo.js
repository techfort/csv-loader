var loader = require('./index'),
  filename = __dirname + '/plot_v2.csv';

loader.loadCsv(filename, { withHeaders: true, intoObjects: true }, function (data) {
  
  var filtered = data.data.filter(function (obj) {
    return obj['1980\'s Average'] > 12812275;
  });
  console.log(data.data)
  console.log(filtered.length);
});