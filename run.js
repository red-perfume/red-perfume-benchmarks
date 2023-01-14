const fs = require('fs');
const path = require('path');

const runBenchmarks = require('./index.js');

const { results, errors } = runBenchmarks();

const atomizedFolder = path.resolve(__dirname, 'atomized');

if (!fs.existsSync(atomizedFolder)) {
  fs.mkdirSync(atomizedFolder);
}

const cleaned = results.map(function (result) {
  const output = { ...result };

  if (typeof(result.inputBytes) === 'number') {
    output.inputBytes = result.inputBytes.toLocaleString();
  }
  if (typeof(result.atomizedBytes) === 'number') {
    output.atomizedBytes = result.atomizedBytes.toLocaleString();
  }
  if (typeof(result.inputGzipBytes) === 'number') {
    output.inputGzipBytes = result.inputGzipBytes.toLocaleString();
  }
  if (typeof(result.atomizedGzipBytes) === 'number') {
    output.atomizedGzipBytes = result.atomizedGzipBytes.toLocaleString();
  }

  const atomizedFile = path.resolve(atomizedFolder, result.library + '-' + result.version + '.css');
  fs.writeFileSync(atomizedFile, result.atomizedCss);
  delete output.atomizedCss;

  return output;
});

console.log(cleaned);
console.log(errors + ' files failed to atomize');
