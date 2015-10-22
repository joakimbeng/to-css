'use strict';
var repeatString = require('repeat-string');
var objectAssign = require('object-assign');
var arrify = require('arrify');

module.exports = function toCss(object, opts) {
	opts = objectAssign({
		indent: '',
		property: identity,
		value: identity,
		selector: identity
	}, opts);

	if (typeof opts.indent === 'number') {
		opts.indent = repeatString(' ', opts.indent);
	}

	function props(prop, val) {
		return arrify(prop).reduce(function (props, p) {
			return props.concat(opts.property(p, val));
		}, []);
	}

	function values(val, prop) {
		return arrify(val).reduce(function (vals, v) {
			return vals.concat(opts.value(v, prop));
		}, []);
	}

	function selectors(sel, value) {
		return arrify(sel).reduce(function (sels, s) {
			return sels.concat(opts.selector(s, value));
		}, []);
	}

	function _toCss(obj, level) {
		var str = '';
		Object.keys(obj).forEach(function (sel) {
			var value = obj[sel];
			if (isLastLevel(value)) {
				str += rule(props(sel, value), values(value, sel), opts.indent, level - 1);
				return;
			} else if (Array.isArray(value)) {
				value.forEach(function (val) {
					str += _toCss(nest(sel, val), level);
				});
				return;
			}
			selectors(sel, value).forEach(function (selector) {
				str += start(selector, opts.indent, level);
				Object.keys(value).forEach(function (prop) {
					var value = obj[sel][prop];
					if (oneMoreLevelExists(value)) {
						str += _toCss(nest(prop, value), level + 1);
					} else {
						str += rule(props(prop, value), values(value, prop), opts.indent, level);
					}
				});
				str += end(opts.indent, level);
			});
		});
		return str;
	}

	return arrify(object)
		.map(function (o) {
			return _toCss(o, 0);
		})
		.join(lineEnd(opts.indent));
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

function lineStart(indent, level) {
	return indent ? repeatString(indent, level) : '';
}

function space(indent) {
	return indent ? ' ' : '';
}

function lineEnd(indent) {
	return indent ? '\n' : '';
}

function start(sel, indent, level) {
	return lineStart(indent, level) + sel + space(indent) + '{' + lineEnd(indent);
}

function end(indent, level) {
	return lineStart(indent, level) + '}' + lineEnd(indent);
}

function rule(props, values, indent, level) {
	var linestart = lineStart(indent, level + 1);
	var lineend = lineEnd(indent);
	var s = space(indent);

	var str = '';

	for (var i = 0, propLength = props.length; i < propLength; i++) {
		for (var j = 0, valueLength = values.length; j < valueLength; j++) {
			str += linestart + props[i] + (isAtRule(props[i]) ? ' ' : ':') + s + values[j] + ';' + lineend;
		}
	}

	return str;
}

function isAtRule(prop) {
	return prop.indexOf('@') === 0;
}
