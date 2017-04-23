'use strict';

const chalk            = require('chalk'),
      urllib           = require('url'),
      loadingIndicator = require('loading-indicator'),
      loadingPresets   = require('loading-indicator/presets');

const packageJSON  = require('./package.json');

const util = {
  timerId: null, // placeholder for the loading indicator

  startTimer: () => {
    util.timerId = loadingIndicator.start('Scanning...', {
      frames: loadingPresets.dots
    });
  },

  stopTimer: timerId => {
    loadingIndicator.stop(util.timerId);
    util.timerId = null;
  },

  parseBaseUrl: urlString => {
    let url = urllib.parse(urlString);
    return `${url.protocol}${url.slashes ? '//' : null}${url.hostname}`
  },

  consoleLog: (...args) => {
    // prefix every console.log message with the package name
    console.log.apply(console, [
      chalk.bgBlack(`${packageJSON.name}`),
      ...args
    ]);
  },

  printError: error => {
    util.consoleLog(
      chalk.bgRed('ERR'),
      chalk.red(error)
    );

    return false;
  }
}

module.exports = util;
