#!/usr/bin/env node

'use strict';

const brkn         = require('brkn'),
      chalk        = require('chalk'),
      yargs        = require('yargs'),
      isWebUri     = require('valid-url').isWebUri,
      eventEmitter = require('brkn/event_emitter');

const util         = require('./util'),
      packageJSON  = require('./package.json');

const argv = yargs
  .command({
    command: ['[url|file...]', '*'],
    desc: false,
    handler: argv => {
      let sources = argv._;

      if(!argv.verbose) {
        util.startTimer();
      }

      if(isWebUri(sources[0])) {
        try {
          brkn(sources, argv.attr, util.parseBaseUrl(sources[0]), {verbose: argv.verbose});
        } catch(e) {
          setImmediate(() => {
            eventEmitter.emit('error', e.message);
          });
        }
      } else {
        try {
          brkn(sources, argv.attr, argv.base, {verbose: argv.verbose});
        } catch(e) {
          setImmediate(() => {
            eventEmitter.emit('error', e.message);
          });
        }
      }
    }
  })
  .option('attr', {
    alias: 'a',
    default: ['href', 'src'],
    describe: 'The attributes to search for (space separated if more than one)',
    type: 'array'
  })
  .option('base', {
    alias: 'b',
    describe: 'The base URL (needed to resolve relative URLs; files only)',
    type: 'string'
  })
  .option('verbose', {
    alias: 'v',
    describe: 'Run in verbose mode',
    type: 'boolean'
  })
  .usage('Usage: \x0A\u00A0\u00A0$ brkn <url|file...> [--attr [html attribute...]] [--base <hostname (w/ protocol)>] [--verbose]')
  .example('$ brkn https://httpbin.org')
  .example('$ brkn ./fixtures/page1.html ./fixtures/page2.html --base "https://mywebsite.com"')
  .example('$ brkn ./fixtures/*.html --base "https://mywebsite.com" --verbose')
  .help('help', 'Show this screen')
  .epilog('MIT \u00A9 Gabriel Mangiurea')
  .version(packageJSON.version)
  .argv;

eventEmitter.on('error', error => {
  util.stopTimer();

  if(error.payload) {
    util.printError(error.payload)
  } else {
    util.printError(error);
  }
});

eventEmitter.on('item', item => {
  if(item.broken) {
    util.consoleLog(
      chalk.cyan.bold('Scanned URL:'),
      chalk.red(item.url),
      chalk.red(item.statusCode),
      item.source ? `[${item.source}]` : ''
    );
  } else {
    util.consoleLog(
      chalk.cyan('Scanned URL:'),
      item.url,
      chalk.green(item.statusCode),
      item.source ? `[${item.source}]` : ''
    );
  }
});

eventEmitter.on('source', source => {
  const brokenUrls = source.brokenUrls;

  if(brokenUrls.length) {
    util.consoleLog(
      chalk.yellow(
        'Found',
        chalk.bold(brokenUrls.length),
        `broken link${brokenUrls.length > 1 ? 's' : ''} in ${chalk.bold(source.source)}`
      )
    )
  }
});

eventEmitter.on('end', brokenUrls => {
  if(util.timerId) {
    util.stopTimer();
  }

  util.consoleLog(
    chalk.cyan.bold('Scanning completed!')
  );

  if(brokenUrls.length) {
    util.consoleLog(
      'The following',
      chalk.bold(brokenUrls.length),
      `URL${brokenUrls.length > 1 ? 's were' : ' was'} broken or could not accept GET requests:`
    );

    for(let idx in brokenUrls) {
      util.consoleLog(
        `${~~idx + 1}:`,
        `${brokenUrls[idx]}`
      );
    }

    if(!argv.verbose) {
      util.consoleLog(
        `${chalk.cyan('Hint:')} use ${chalk.bold('--verbose (-v)')} for additional details during the scan`
      );
    }
  } else {
    util.consoleLog('There were no broken URLs.')
  }
});
