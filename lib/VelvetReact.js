const ReactDOM = require('react-dom');
const React = require('react');
const _ = require('lodash');
const mobservable = require('mobservable');
const reactiveComponent = require('mobservable-react').reactiveComponent;


const velvet = {
	ajax: require('aja'),
	tag: function component (name, obj) {
			return velvet.tags[name] = obj;
	},
	tags: {},
	run: function run() {

		_.forEach(velvet.tags, function (reactClass, key) {
			var tags = document.getElementsByTagName(key);
			for (var i = 0; i < tags.length; i++) {
				ReactDOM.render(React.createElement(reactClass), tags[i]);
			}

		});

	}
};

exports = module.exports = velvet;
