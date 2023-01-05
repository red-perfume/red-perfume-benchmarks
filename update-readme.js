const fs = require('fs');

const runBenchmarks = require('./index.js');

const { results } = runBenchmarks();

function localize (input) {
  if (typeof(input) === 'number') {
    return input.toLocaleString();
  }
  return input
}

const tableRows = results.map(function (result) {
  let savings = result.gzipSavings + '-' + result.savings;
  if (savings.startsWith('N')) {
    savings = 'N/A';
  }

  const rowData = [
    result.library + ' ' + result.version,
    localize(result.inputBytes),
    localize(result.atomizedBytes),
    localize(result.inputGzipBytes),
    localize(result.atomizedGzipBytes),
    savings,
    result.timeToAtomizeMs,
    result.atomizedErrors
  ].join(' | ');
  return rowData;
});

const readme = [
  '# red-perfume-benchmarks',
  '',
  'Benchmarking Red Perfume against real-world CSS files.',
  '',
  '',
  '* * *',
  '',
  '',
  'Library | Input (bytes) | Atomized (bytes) | Input GZipped (bytes) | Atomized GZipped (bytes) | Savings | Time (ms) | Errors',
  ':--     | :--           | :--              | :--                   | :--                      | :--     | :--       | :--',
  ...tableRows,
  ''
].join('\n');

fs.writeFileSync('./README.md', readme);
