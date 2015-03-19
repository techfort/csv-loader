var loader = require('./index'),
  filename = __dirname + '/plot_v2.csv',
  loki = require('lokijs'),
  records = new loki.Collection('records');

loader.loadCsv(filename, {
  withHeaders: true,
  intoObjects: true
}, function (data) {
  data.data.shift();
  var years = ['2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014'];

  function parseValues(el) {
    el['Average'] = parseInt(el['Average'], 10) || 0;
    //el['2002'] = parseInt(el['2002'], 10) > 0 ? parseInt(el['2002'], 10) : el['Average'];
    el['2003'] = parseInt(el['2003'], 10) | 0 > 0 ? parseInt(el['2003'], 10) | 0 : el['2000\'s Average'];
    el['2004'] = parseInt(el['2004'], 10) | 0 > 0 ? parseInt(el['2004'], 10) | 0 : el['2000\'s Average'];
    el['2005'] = parseInt(el['2005'], 10) | 0 > 0 ? parseInt(el['2005'], 10) | 0 : el['2000\'s Average'];
    el['2006'] = parseInt(el['2006'], 10) | 0 > 0 ? parseInt(el['2006'], 10) | 0 : el['2000\'s Average'];
    el['2007'] = parseInt(el['2007'], 10) | 0 > 0 ? parseInt(el['2007'], 10) | 0 : el['2000\'s Average'];
    el['2008'] = parseInt(el['2008'], 10) | 0 > 0 ? parseInt(el['2008'], 10) | 0 : el['2000\'s Average'];
    el['2009'] = parseInt(el['2009'], 10) | 0 > 0 ? parseInt(el['2009'], 10) | 0 : el['2000\'s Average'];
    el['2010'] = parseInt(el['2010'], 10) | 0 > 0 ? parseInt(el['2010'], 10) | 0 : el['2000\'s Average'];
    el['2011'] = parseInt(el['2011'], 10) | 0 > 0 ? parseInt(el['2011'], 10) | 0 : el['2000\'s Average'];
    el['2012'] = parseInt(el['2012'], 10) | 0 > 0 ? parseInt(el['2012'], 10) | 0 : el['2000\'s Average'];
    el['2013'] = parseInt(el['2013'], 10) | 0 > 0 ? parseInt(el['2013'], 10) | 0 : el['2000\'s Average'];
    el['2014'] = parseInt(el['2014'], 10) | 0 > 0 ? parseInt(el['2014'], 10) | 0 : el['2000\'s Average'];
    //el['2015'] = parseInt(el['2015'], 10) > 0 ? parseInt(el['2015'], 10) : el['Average'];
    delete el['2002'];
    delete el['2015'];
    years.forEach(function (val) {
      if (el[val] === -9999) {
        el[val] = el['2000\'s Average'];
      }
    });
    return el;
  }

  data.data.forEach(function (el) {
    records.insert(parseValues(el));
  });

  function sortBy(property) {
    return function (a, b) {
      return a[property] < b[property] ? -1 : (a[property] === b[property] ? 0 : 1);
    };
  }

  function sep() {
    console.log('-------------------------------\n');
  }

  var sortByValue = sortBy('value');

  var maxima = years.map(function (obj) {
    return records.maxRecord(obj);
  }).sort(sortByValue);
  console.log('Maxima:\n', maxima);
  sep();

  var alltimeMax = records.get(maxima[maxima.length - 1].index);
  console.log('All time maximum: ', alltimeMax);

  var yearsData = years.map(function (o) {
    return alltimeMax[o];
  }).sort();
  console.log('Max extension 2003-2014: ', yearsData[yearsData.length - 1]);

  var minima = years.map(function (obj) {
    return records.minRecord(obj);
  }).sort(sortByValue);

  console.log('All minimum value:\n', minima);
  var alltimeMin = records.get(minima[0].index);
  var minYearsData = years.map(function (o) {
    return alltimeMin[o];
  }).sort();
  console.log(alltimeMin);
  console.log(minYearsData[0]);

  console.log(years.map(function (year) {
    return {
      year: year,
      stdDev: records.stdDev(year)
    };
  }).sort(sortBy('stdDev')));

  console.log(years.map(function (year) {
    return {
      year: year,
      average: records.avg(year)
    }
  }).sort(sortBy('average')));

});
