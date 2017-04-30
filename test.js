'use strict';

const execa = require('execa');
const test = require('ava');

test('success: item scanned (item event)', async t => {
	await execa.stdout('node', ['./cli.js', 'https://httpbin.org', '--verbose'])
	.then(response => t.true(/Scanned URL/.test(response)));
});

test('success: source completed (source event)', async t => {
	await execa.stdout('node', ['./cli.js', './fixtures/page1.html', './fixtures/page2.html', '--base', 'https://httpbin.org', '--verbose'])
	.then(response => t.true(/Found \d+ broken/.test(response)));
});

test('success: scanning completed (end event)', async t => {
	await execa.stdout('node', ['./cli.js', 'https://httpbin.org'])
	.then(response => t.true(/Scanning completed/.test(response)));
});

test('failure: not specifying any URLs/files to check', async t => {
	await execa.stdout('node', ['./cli.js'])
	.then(response => t.true(/Sources argument must be an array with at least 1 element/.test(response)));
});

test('failure: not specifying base URL when scanning files', async t => {
	await execa.stdout('node', ['./cli.js', './fixtures/page1.html'])
	.then(response => t.true(/Base URL argument must be a valid URL/.test(response)));
});
