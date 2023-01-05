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
  const start = new Date();
  const atomized = redPerfumeCss({ uglify, input, customLogger });
  const end = new Date();
  const atomizedCss = atomized.atomizedCss;
  const atomizedErrors = atomized.styleErrors?.length || styleErrors?.length;
  const atomizedMinified = sass.compileString(atomizedCss, { style }).css;
  const atomizedMinifiedLength = atomizedMinified.length;
  const atomizedGzip = gzipSize.sync(atomizedMinified);

  const results = {
    atomizedErrors,
    timeToAtomizeMs: end - start,
    inputBytes: inputMinifiedLength,
    atomizedBytes: atomizedMinifiedLength,
    savings: getSavings(atomizedMinifiedLength, inputMinifiedLength),
    inputGzipBytes: inputGzip,
    atomizedGzipBytes: atomizedGzip,
    gzipSavings: getSavings(atomizedGzip, inputGzip)
  };

  if (atomizedErrors && !atomizedMinifiedLength) {
    results.atomizedBytes = NA;
    results.savings = NA;
    results.atomizedGzipBytes = NA;
    results.gzipSavings = NA;
  }

  return results;
}

module.exports = runBenchmark;
