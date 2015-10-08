const _ = require('lodash');
const mobservable = require('mobservable');
const reactiveComponent = require('mobservable-react').reactiveComponent;
const ReactDOM = require('react-dom');
const React = require('react');

const riverian = {
	ajax: require('aja'),
	component: function component (name, obj) {
			return riverian.components[name] = reactiveComponent(React.createClass(obj));
	},
	components: {},
	run: function run() {

		_.forEach(riverian.components, function (reactClass, key) {

			var tags = document.getElementsByTagName(key);
			for (var i = 0; i < tags.length; i++) {
				ReactDOM.render(React.createElement(reactClass), tags[i]);
			}
		});
		// var listviews = document.getElementsByTagName('list-view');
		// for (var i = 0; i < listviews.length; i++) {
		// 	ReactDOM.render(<ListView />, listviews[i]);
		// }
	}
};

exports = module.exports = riverian;
