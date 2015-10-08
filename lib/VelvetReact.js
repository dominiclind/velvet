const ReactDOM = require('react-dom');
const React = require('react');
const _ = require('lodash');
const mobservable = require('mobservable');
const reactiveComponent = require('mobservable-react').reactiveComponent;


const velvet = {
	ajax: require('aja'),
	component: function component (name, obj) {
			return velvet.components[name] = reactiveComponent(React.createClass(obj));
	},
	components: {},
	run: function run() {

		_.forEach(velvet.components, function (reactClass, key) {
			var tags = document.getElementsByTagName(key);
			for (var i = 0; i < tags.length; i++) {
				console.log(velvet);
				ReactDOM.render(React.createElement(reactClass), tags[i]);
			}

		});

	}
};

exports = module.exports = velvet;
