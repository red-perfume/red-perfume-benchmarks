'use strict';

const fs = require('fs');
const path = require('path');

const gzipSize = require('gzip-size');
const sass = require('sass');

const NA = 'N/A';

let redPerfumeCss = function () {
  return {
    atomizedCss: '',
    styleErrors: []
  };
};

const relativeAtomizer = path.resolve(__dirname, '..', 'red-perfume-css', 'index.js');

if (fs.existsSync(relativeAtomizer)) {
  redPerfumeCss = require(relativeAtomizer);
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
  const atomized = atomizer({ uglify, input, customLogger });
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
