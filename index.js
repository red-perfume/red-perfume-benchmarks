'use strict';

const fs = require('fs');

const runBenchmark = require('./tool.js');

function read (file) {
  return String(fs.readFileSync(file));
}

let errors = 0;

// Inputs
const inputs = {
  bootstrap1: read('./libraries/bootstrap-1.1.1.css'),
  bootstrap2: read('./libraries/bootstrap-2.3.2.css'),
  bootstrap3: read('./node_modules/bootstrap3/dist/css/bootstrap.css'),
  bootstrap4: read('./node_modules/bootstrap4/dist/css/bootstrap.css'),
  bootstrap5: read('./node_modules/bootstrap5/dist/css/bootstrap.css'),
  bsds: read('./libraries/bsds-0.3.0.css'),
  bulma0: read('./libraries/bulma-0.9.4.css'),
  foundation5: read('./libraries/foundation-5.5.3.css'),
  foundation6: read('./node_modules/foundation6/dist/css/foundation.css'),
  milligram1: read('./libraries/milligram-1.4.1.css'),
  normalize8: read('./libraries/normalize-8.0.1.css'),
  skeleton2: read('./libraries/skeleton-2.0.4.css'),
  tailwind2: read('./libraries/tailwind-2.2.19.css'),
  water2: read('./libraries/water-2.1.1.css'),
  wwt: read('./libraries/wwt.css')
};

// Results
const outputs = {};
for (const name in inputs) {
  let outcome = runBenchmark(inputs[name])
  if (outcome.atomizedErrors) {
    errors = errors + 1;
  } else {
    outputs[name] = outcome;
  }
}
console.log(outputs);
console.log(errors + ' files failed to atomize');
