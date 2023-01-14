'use strict';

const fs = require('fs');
const path = require('path');

const gzipSize = require('gzip-size');
const sass = require('sass');

const helpers = require('./helpers.js');

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
  let inputMinified = '';
  let inputGzip = 0;
  try {
    inputMinified = sass.compileString(input, { style }).css;
  } catch (error1) {
    helpers.throwError('Error minifying input via Sass compile', error1);
  }
  const inputMinifiedLength = inputMinified?.length || 0;
  try {
    inputGzip = gzipSize.sync(inputMinified);
  } catch (error2) {
    helpers.throwError('Error gzipping input CSS', error2);
  }

  // Atomized
  let atomized = {};
  let atomizedMinified = '';
  let atomizedGzip = 0;
  const start = new Date();
  try {
    atomized = atomizer({ uglify, input, customLogger });
  } catch (error3) {
    helpers.throwError('Error atomizing input', error3);
  }
  const end = new Date();
  const atomizedCss = atomized.atomizedCss;
  const atomizedErrors = atomized.styleErrors?.length || styleErrors?.length || 0;
  try {
    atomizedMinified = sass.compileString(atomizedCss, { style }).css;
  } catch (error4) {
    helpers.throwError('Error minifying output via Sass compile', error4);
  }
  const atomizedMinifiedLength = atomizedMinified.length || 0;
  try {
    atomizedGzip = gzipSize.sync(atomizedMinified);
  } catch (error5) {
    helpers.throwError('Error gzipping output', error5);
  }

  const results = {
    atomizedErrors,
    timeToAtomizeMs: end - start,
    inputBytes: inputMinifiedLength,
    atomizedBytes: atomizedMinifiedLength,
    savings: getSavings(atomizedMinifiedLength, inputMinifiedLength),
    inputGzipBytes: inputGzip,
    atomizedGzipBytes: atomizedGzip,
    gzipSavings: getSavings(atomizedGzip, inputGzip),
    atomizedCss
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
