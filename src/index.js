'use strict';
var repeat = require('repeat-string');
var assign = require('object-assign');
var arrify = require('arrify');

module.exports = function toCss(object, opts) {
	opts = assign({
		indent: '',
		property: identity,
		value: identity
	}, opts);

	if (typeof opts.indent === 'number') {
		opts.indent = repeat(' ', opts.indent);
	}

	function values(val, prop) {
		return arrify(val).map(function (v) {
			return opts.value(v, prop);
		});
	}

	return (function _toCss(obj, level) {
		var str = '';
		Object.keys(obj).forEach(function (sel) {
			var value = obj[sel];
			if (isLastLevel(value)) {
				str += rule(opts.property(sel, value), values(value, sel), opts.indent, level - 1);
				return;
			}
			str += start(sel, opts.indent, level);
			Object.keys(obj[sel]).forEach(function (prop) {
				var value = obj[sel][prop];
				if (oneMoreLevelExists(value)) {
					var tmp = {};
					tmp[prop] = value;
					str += _toCss(tmp, level + 1);
				} else {
					str += rule(opts.property(prop, value), values(value, prop), opts.indent, level);
				}
			});
			str += end(opts.indent, level);
		});
		return str;
	})(object, 0);
};

function isLastLevel(val) {
	return typeof val === 'string' || Array.isArray(val);
}

function oneMoreLevelExists(val) {
	return typeof val === 'object' && !Array.isArray(val);
}

function identity(v) {
	return v;
}

function start(sel, indent, level) {
	if (!indent) {
		return sel + '{';
	}
	return repeat(indent, level) + sel + ' {\n';
}

function end(indent, level) {
	if (!indent) {
		return '}';
	}
	return repeat(indent, level) + '}\n';
}

function rule(prop, val, indent, level) {
	if (!indent) {
		return val.map(function (v) {
			return prop + (isAtRule(prop) ? ' ' : ':') + v + ';';
		}).join('');
	}
	return val.map(function (v) {
		return repeat(indent, level + 1) + prop + (isAtRule(prop) ? ' ' : ': ') + v + ';\n';
	}).join('');
}

function isAtRule(prop) {
	return prop.indexOf('@') === 0;
}
