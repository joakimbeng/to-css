'use strict';
var repeat = require('repeat-string');
var assign = require('object-assign');

module.exports = function toCss(object, opts) {
	opts = assign({
		indent: '',
		property: identity,
		value: identity
	}, opts);

	if (typeof opts.indent === 'number') {
		opts.indent = repeat(' ', opts.indent);
	}

	return (function _toCss(obj, level) {
		var str = '';
		Object.keys(obj).forEach(function (sel) {
			if (typeof obj[sel] === 'string') {
				str += rule(opts.property(sel, obj[sel]), opts.value(obj[sel], sel), opts.indent, level - 1);
				return;
			}
			str += start(sel, opts.indent, level);
			Object.keys(obj[sel]).forEach(function (prop) {
				if (typeof obj[sel][prop] === 'object') {
					var tmp = {};
					tmp[prop] = obj[sel][prop];
					str += _toCss(tmp, level + 1);
				} else {
					str += rule(opts.property(prop, obj[sel][prop]), opts.value(obj[sel][prop], prop), opts.indent, level);
				}
			});
			str += end(opts.indent, level);
		});
		return str;
	})(object, 0);
};

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
		return prop + (isAtRule(prop) ? ' ' : ':') + val + ';';
	}
	return repeat(indent, level + 1) + prop + (isAtRule(prop) ? ' ' : ': ') + val + ';\n';
}

function isAtRule(prop) {
	return prop.indexOf('@') === 0;
}
