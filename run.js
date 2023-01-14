const runBenchmarks = require('./index.js');

const { results, errors } = runBenchmarks();

console.log(results);
console.log(errors + ' files failed to atomize');
