# to-css

[![Build status][travis-image]][travis-url] [![NPM version][npm-image]][npm-url] [![js-xo-style][codestyle-image]][codestyle-url]

> Generate CSS from a JavaScript Object

This module does not convert property names to their dasherized counterparts, this is just a plain object to CSS stringification, though see [`property`](#optionsproperty) and [`value`](#optionsvalue) options below.


## Installation

Install `to-css` using [npm](https://www.npmjs.com/):

```bash
npm install --save to-css
```

## Usage

### Module usage

```javascript
var toCss = require('to-css');

toCss({body: {'font-size': '10px'}}, {indent: '  '});
/**
 * body {
 *   font-size: 10px;
 * }
 */
```

#### Array values - When you want to set a property multiple times

Sometimes you want to have a CSS declaration with the same property specified multiple times with different values, for fallback values. You can use arrays for that, e.g:

```javascript
var toCss = require('to-css');

toCss({body: {color: ['rgba(0,0,0,.5)', 'black']}}, {indent: '  '});
/**
 * body {
 *   color: rgba(0,0,0,.5);
 *   color: black;
 * }
 */
```

#### Array declarations - E.g. for `@font-face`

Defining multiple `@font-face`'s can be done using arrays like this:

```javascript
var toCss = require('to-css');

toCss({
	'@font-face': [
		{'font-family': '"MyWebFont"', src: 'url("myfont.woff2") format("woff2"), url("myfont.woff") format("woff")'},
		{'font-family': 'MyOtherFont', src: 'url("otherfont.woff2") format("woff2"), url("otherfont.woff") format("woff")'}
	]
});
/**
 * @font-face {
 *   font-family: "MyWebFont";
 *   src: url("myfont.woff2") format("woff2"), url("myfont.woff") format("woff");
 * }
 * @font-face {
 *   font-family: "MyOtherFont";
 *   src: url("otherfont.woff2") format("woff2"), url("otherfont.woff") format("woff");
 * }
 */
```

Or like this:

```javascript
var toCss = require('to-css');

toCss([
	{
		'@font-face': {
			'font-family': '"MyWebFont"',
			src: 'url("myfont.woff2") format("woff2"), url("myfont.woff") format("woff")'
		}
	},
	{
		'@font-face': {
			'font-family': 'MyOtherFont',
			src: 'url("otherfont.woff2") format("woff2"), url("otherfont.woff") format("woff")'
		}
	}
]);
/**
 * @font-face {
 *   font-family: "MyWebFont";
 *   src: url("myfont.woff2") format("woff2"), url("myfont.woff") format("woff");
 * }
 * @font-face {
 *   font-family: "MyOtherFont";
 *   src: url("otherfont.woff2") format("woff2"), url("otherfont.woff") format("woff");
 * }
 */
```

## API

### `toCss(object [, options])`

| Name | Type | Description |
|------|------|-------------|
| object | `Object|Array` | Object or array to generate a CSS string from |
| options | `Object` | Options |

Returns: `String`, the generated CSS string.

#### `options.indent`

Type: `String|Number`  
Default: `""`

Works like [JSON.stringify's space parameter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify). I.e. if it's a number it indicates the number of spaces to use as white space, and if it's a string the string itself is used as white space. When empty (or `NULL`) no white space is used.


#### `options.value`

Type: `Function`  
Default: `NOOP`

A transform function for property values, gets called for each CSS rule with value and property as params: `options.value(value, property)`. Can return a `String` or an array of strings!


#### `options.property`

Type: `Function`  
Default: `NOOP`

A transform function for property names, gets called for each CSS rule with property and value as params: `options.property(property, value)`. Can return a `String` or an array of strings!


#### `options.selector`

Type: `Function`  
Default: `NOOP`

A transform function for selectors, gets called for each CSS declaration with selector and declaration object as params: `options.selector(selector, declaration)`. Can return a `String` or an array of strings!

## License

MIT © Joakim Carlstein

[npm-url]: https://npmjs.org/package/to-css
[npm-image]: https://badge.fury.io/js/to-css.svg
[travis-url]: https://travis-ci.org/joakimbeng/to-css
[travis-image]: https://travis-ci.org/joakimbeng/to-css.svg?branch=master
[codestyle-url]: https://github.com/sindresorhus/xo
[codestyle-image]: https://img.shields.io/badge/code%20style-xo-brightgreen.svg?style=flat
