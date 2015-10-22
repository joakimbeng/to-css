'use strict';
var test = require('ava');
var toCss = require('../src');

test('no indentation', function (assert) {
	assert.plan(1);
	var actual = toCss({body: {'font-size': '10px'}});
	var expected = 'body{font-size:10px;}';
	assert.is(actual, expected);
});

test('with indentation', function (assert) {
	assert.plan(1);
	var actual = toCss({body: {'font-size': '10px'}}, {indent: '\t'});
	var expected = 'body {\n\tfont-size: 10px;\n}\n';
	assert.is(actual, expected);
});

test('nested object', function (assert) {
	assert.plan(1);
	var actual = toCss({'.small': {li: {'font-size': '10px'}}});
	var expected = '.small{li{font-size:10px;}}';
	assert.is(actual, expected);
});

test('nested object with indentation', function (assert) {
	assert.plan(1);
	var actual = toCss({'.small': {li: {'font-size': '10px'}}}, {indent: '\t'});
	var expected = '.small {\n\tli {\n\t\tfont-size: 10px;\n\t}\n}\n';
	assert.is(actual, expected);
});

test('mixed nesting', function (assert) {
	assert.plan(1);
	var actual = toCss({'.small': {li: {'font-size': '10px'}, margin: 0}}, {indent: '\t'});
	var expected = '.small {\n\tli {\n\t\tfont-size: 10px;\n\t}\n\tmargin: 0;\n}\n';
	assert.is(actual, expected);
});

test('mixed nesting reversed', function (assert) {
	assert.plan(1);
	var actual = toCss({'.small': {margin: '10px', li: {'font-size': '10px'}}}, {indent: '\t'});
	var expected = '.small {\n\tmargin: 10px;\n\tli {\n\t\tfont-size: 10px;\n\t}\n}\n';
	assert.is(actual, expected);
});

test('indent as a number', function (assert) {
	assert.plan(1);
	var actual = toCss({'.small': {li: {'font-size': '10px'}, margin: 0}}, {indent: 2});
	var expected = '.small {\n  li {\n    font-size: 10px;\n  }\n  margin: 0;\n}\n';
	assert.is(actual, expected);
});

test('property option', function (assert) {
	assert.plan(1);
	function toUpper(val) {
		return val.toUpperCase();
	}
	var actual = toCss({body: {margin: 0}}, {property: toUpper});
	var expected = 'body{MARGIN:0;}';
	assert.is(actual, expected);
});

test('property option returns array', function (assert) {
	assert.plan(1);
	function prefix(prop) {
		if (prop === 'flex') {
			return ['-webkit-box-flex', '-webkit-flex', '-ms-flex', prop];
		}
		return prop;
	}
	var actual = toCss({body: {flex: 1}}, {property: prefix});
	var expected = 'body{-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1;}';
	assert.is(actual, expected);
});

test('value option', function (assert) {
	assert.plan(1);
	function toUpper(val) {
		return val.toUpperCase();
	}
	var actual = toCss({body: {color: 'black'}}, {value: toUpper});
	var expected = 'body{color:BLACK;}';
	assert.is(actual, expected);
});

test('value option returns array', function (assert) {
	assert.plan(1);
	function prefix(val, prop) {
		if (prop === 'display' && val === 'flex') {
			return ['-webkit-box', '-ms-flexbox', '-webkit-flex', val];
		}
		return val;
	}
	var actual = toCss({body: {display: 'flex'}}, {value: prefix});
	var expected = 'body{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex;}';
	assert.is(actual, expected);
});

test('selector option', function (assert) {
	assert.plan(1);
	function classify(selector) {
		return '.' + selector;
	}
	var actual = toCss({body: {color: 'black'}}, {selector: classify});
	var expected = '.body{color:black;}';
	assert.is(actual, expected);
});

test('selector option returns array', function (assert) {
	assert.plan(1);
	function prefix(selector) {
		if (selector.indexOf('@keyframes') === 0) {
			return ['@-webkit-' + selector.slice(1), selector];
		}
		return selector;
	}
	var actual = toCss({'@keyframes test': {from: {opacity: 0}, to: {opacity: 1}}}, {selector: prefix});
	var expected = '@-webkit-keyframes test{from{opacity:0;}to{opacity:1;}}@keyframes test{from{opacity:0;}to{opacity:1;}}';
	assert.is(actual, expected);
});

test('at-rules without body', function (assert) {
	assert.plan(1);
	var actual = toCss({'@charset': '"UTF-8"', '@import': '"file.css"'});
	var expected = '@charset "UTF-8";@import "file.css";';
	assert.is(actual, expected);
});

test('array', function (assert) {
	assert.plan(1);
	var actual = toCss([
		{body: {color: 'white'}},
		{body: {color: 'rgba(255, 255, 255, .95)'}}
	]);
	var expected = 'body{color:white;}body{color:rgba(255, 255, 255, .95);}';
	assert.is(actual, expected);
});

test('array values', function (assert) {
	assert.plan(1);
	var actual = toCss({div: {color: ['rgba(0, 0, 0, .5)', 'black']}});
	var expected = 'div{color:rgba(0, 0, 0, .5);color:black;}';
	assert.is(actual, expected);
});

test('array declarations', function (assert) {
	assert.plan(1);
	var actual = toCss({
		'@font-face': [
			{'font-family': 'MyFont', 'src': 'url(my-font.ttf)'},
			{'font-family': 'OtherFont', 'src': 'url(other-font.ttf)'}
		]
	});
	var expected = '@font-face{font-family:MyFont;src:url(my-font.ttf);}@font-face{font-family:OtherFont;src:url(other-font.ttf);}';
	assert.is(actual, expected);
});

test('array declarations with indentation', function (assert) {
	assert.plan(1);
	var actual = toCss({
		'@font-face': [
			{'font-family': 'MyFont', 'src': 'url(my-font.ttf)'},
			{'font-family': 'OtherFont', 'src': 'url(other-font.ttf)'}
		]
	}, {
		indent: '\t'
	});
	var expected = '@font-face {\n\tfont-family: MyFont;\n\tsrc: url(my-font.ttf);\n}\n@font-face {\n\tfont-family: OtherFont;\n\tsrc: url(other-font.ttf);\n}\n';
	assert.is(actual, expected);
});
