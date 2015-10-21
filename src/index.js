'use strict';
var repeatString = require('repeat-string');
var objectAssign = require('object-assign');
var arrify = require('arrify');

module.exports = function toCss(object, opts) {
	opts = objectAssign({
		indent: '',
		property: identity,
		value: identity
	}, opts);

	if (typeof opts.indent === 'number') {
		opts.indent = repeatString(' ', opts.indent);
	}

	function values(val, prop) {
		return arrify(val).map(function (v) {
			return opts.value(v, prop);
		});
	}

	function _toCss(obj, level) {
		var str = '';
		Object.keys(obj).forEach(function (sel) {
			var value = obj[sel];
			if (isLastLevel(value)) {
				str += rule(opts.property(sel, value), values(value, sel), opts.indent, level - 1);
				return;
			} else if (Array.isArray(value)) {
				value.forEach(function (val) {
					str += _toCss(nest(sel, val), level + 1);
				});
				return;
			}
			str += start(sel, opts.indent, level);
			Object.keys(value).forEach(function (prop) {
				var value = obj[sel][prop];
				if (oneMoreLevelExists(value)) {
					str += _toCss(nest(prop, value), level + 1);
				} else {
					str += rule(opts.property(prop, value), values(value, prop), opts.indent, level);
				}
			});
			str += end(opts.indent, level);
		});
		return str;
	}

	return arrify(object)
		.map(function (o) {
			return _toCss(o, 0);
		})
		.join(opts.indent ? '\n' : '');
};

function nest(prop, val) {
	var tmp = {};
	tmp[prop] = val;
	return tmp;
}

function isLastLevel(val) {
	return typeof val === 'string' || Array.isArray(val) && val.length && typeof val[0] !== 'object';
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
	return repeatString(indent, level) + sel + ' {\n';
}

function end(indent, level) {
	if (!indent) {
		return '}';
	}
	return repeatString(indent, level) + '}\n';
}

function rule(prop, val, indent, level) {
	if (!indent) {
		return val.map(function (v) {
			return prop + (isAtRule(prop) ? ' ' : ':') + v + ';';
		}).join('');
	}
	return val.map(function (v) {
		return repeatString(indent, level + 1) + prop + (isAtRule(prop) ? ' ' : ': ') + v + ';\n';
	}).join('');
}

function isAtRule(prop) {
	return prop.indexOf('@') === 0;
}
