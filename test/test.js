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

test('value option', function (assert) {
	assert.plan(1);
	function toUpper(val) {
		return val.toUpperCase();
	}
	var actual = toCss({body: {color: 'black'}}, {value: toUpper});
	var expected = 'body{color:BLACK;}';
	assert.is(actual, expected);
});

test('at-rules without body', function (assert) {
	assert.plan(1);
	var actual = toCss({'@charset': '"UTF-8"', '@import': '"file.css"'});
	var expected = '@charset "UTF-8";@import "file.css";';
	assert.is(actual, expected);
});
