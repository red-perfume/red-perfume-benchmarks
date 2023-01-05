'use strict';

const fs = require('fs');

const gzipSize = require('gzip-size');
const sass = require('sass');

const NA = 'N/A';

let redPerfumeCss = function () {
  return {
    atomizedCss: '',
    styleErrors: []
  };
};

if (fs.existsSync('../red-perfume-css/index.js')) {
  redPerfumeCss = require('../red-perfume-css/index.js');
}

function getSavings (a, b) {
  return Math.round(((a / b * 10000) - 10000) * -1) / 100 + '%';
}
function localize (num) {
  return num.toLocaleString() + ' bytes';
}

function runBenchmark (input, atomizer) {
  // Defaults
  input = input || '';
  atomizer = atomizer || redPerfumeCss;

  // Settings
  const uglify = true;
  const style = 'compressed';
  const styleErrors = [];
  const customLogger = function (message) {
    styleErrors.push(message);
  }

  // Input
  const inputMinified = sass.compileString(input, { style }).css;
  const inputMinifiedLength = inputMinified.length;
  const inputGzip = gzipSize.sync(inputMinified);

  // Atomized
  const atomized = redPerfumeCss({ uglify, input, customLogger });
  const atomizedCss = atomized.atomizedCss;
  const atomizedErrors = atomized.styleErrors?.length || styleErrors?.length;
  const atomizedMinified = sass.compileString(atomizedCss, { style }).css;
  const atomizedMinifiedLength = atomizedMinified.length;
  const atomizedGzip = gzipSize.sync(atomizedMinified);

  const results = {
    atomizedErrors,
    input: localize(inputMinifiedLength),
    atomized: localize(atomizedMinifiedLength),
    savings: getSavings(atomizedMinifiedLength, inputMinifiedLength),
    inputGzip: localize(inputGzip),
    atomizedGzip: localize(atomizedGzip),
    gzipSavings: getSavings(atomizedGzip, inputGzip)
  };

  if (atomizedErrors && !atomizedMinifiedLength) {
    results.atomized = NA;
    results.savings = NA;
    results.atomizedGzip = NA;
    results.gzipSavings = NA;
  }

  return results;
}

module.exports = runBenchmark;
