const runBenchmarks = require('./index.js');

const { outputs, errors } = runBenchmarks();

console.log(outputs);
console.log(errors + ' files failed to atomize');
