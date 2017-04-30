'use strict';

const urllib = require('url');
const chalk = require('chalk');
const loadingIndicator = require('loading-indicator');
const loadingPresets = require('loading-indicator/presets');

const packageJSON = require('./package.json');

const util = {
	timerId: null,

	startTimer: () => {
		util.timerId = loadingIndicator.start('Scanning...', {
			frames: loadingPresets.dots
		});
	},

	stopTimer: () => {
		loadingIndicator.stop(util.timerId);
		util.timerId = null;
	},

	parseBaseUrl: urlString => {
		const url = urllib.parse(urlString);
		return `${url.protocol}${url.slashes ? '//' : null}${url.hostname}`;
	},

	consoleLog: (...args) => {
		// Prefix every console.log message with the package name
		console.log(
			chalk.bgBlack(`${packageJSON.name}`),
			...args
		);
	},

	printError: error => {
		util.consoleLog(
			chalk.bgRed('ERR'),
			chalk.red(error)
		);

		return false;
	}
};

module.exports = util;
