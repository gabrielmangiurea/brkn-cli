# brkn-cli [![Build Status](https://travis-ci.org/GabrielMangiurea/brkn-cli.svg?branch=master)](https://travis-ci.org/GabrielMangiurea/brkn-cli)

> Yet another broken link checker CLI.


## Install

```
$ npm install --global brkn-cli
```


## Usage

```
$ brkn <url|file...> [--attr [html attribute...]] [--base <hostname (w/ protocol)>] [--verbose]
```


## Options
```
--attr, -a     The attributes to search for (space separated if more than one) (default: href src)
--base, -b     The base URL (needed to resolve relative URLs; files only)
--verbose, -v  Run in verbose mode
--help         Show the help screen
--version      Show version number

```


## Examples
```
$ brkn https://httpbin.org
$ brkn https://mywebsite.com https://otherwebsite.org --verbose
$ brkn ./fixtures/*.html --base "https://mywebsite.com" --verbose

```


## Related

- [brkn](https://www.npmjs.com/package/brkn) - API for this module


## License

MIT &copy; [Gabriel Mangiurea](https://gabrielmangiurea.github.io)
