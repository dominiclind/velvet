const React = require('react');
const ReactDOM = require('react-dom');
const velvet = require('velvet-react');
const mobservable = require('mobservable');
const ListView = require('./list-view.js');
const _ = require('lodash');
const BlogApp = velvet.component('blog-app', {
  getInitialState: function initState() {
    return {
      items: mobservable([])
    }
  },
  componentWillMount: function shouldMount() {
    console.log("I SHOULD MOUNT");
  },
  componentDidMount: function didMount() {
    var self = this;
    velvet.ajax()
          .url('/api/blog/posts.json')
          .cache(false)
          .on('success', function (data) {
            _.merge(self.state.items, data);
          })
          .on('error', function (err) {
            console.log(err);
          })
          .go();
  },
	render() {
    return(
      <div id="blog-app">
  			<ListView items={ this.state.items }>
        </ListView>
      </div>
		)
	}
});
