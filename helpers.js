'use strict';

/**
 * @file    Shared helper functions used in multiple files
 * @author  TheJaredWilcurt
 */

const helpers = {
  /**
   * Takes a string and replaces spaces with returns if
   * they are the last space on a console line (108 chars).
   *
   * @param  {string} message  Human readable warning/error
   * @return {string}          Message with returns added
   */
  insertReturns: function (message) {
    message = message || '';
    const maxLineLength = 108;
    let words = message.split(' ');
    let line = '';
    let lines = [];
    words.forEach(function (word) {
      let potentialLine = line + ' ' + word;
      if (potentialLine.length < maxLineLength) {
        line = potentialLine;
      } else {
        lines.push(line);
        line = word;
      }
    });
    lines.push(line.trim());
    return lines.join('\n').trim();
  },
  /**
   * console.error when errors occur.
   *
   * @param {string} message  Human readable warning/error
   * @param {any}    [error]  Caught error object
   */
  throwError: function (message, error) {
    const line = '_______________________\n';
    const name = 'Red-Perfume-Benchmarks:\n';
    if (error) {
      console.error(line + name + message, error);
    } else {
      console.error(line + name + message);
    }
  }
};

module.exports = helpers;
