const React = require('react');
const ReactDOM = require('react-dom');
const mobservable = require('mobservable');
const reactiveComponent = require('mobservable-react').reactiveComponent;
const BlogItem = require('./blog-item');

const ListView = reactiveComponent(React.createClass({
  getInitialState: function () {
    return {}
  },
  componentWillMount: function willMount() {

      console.log(this.state);

  },
  componentDidMount: function didMount() {

  },
	render() {
    return(
      <div className="blog list-view">
        {this.props.items.map(item =>
          <BlogItem
            key={ item.id }
            title={ item.title }
            content={ item.content }
            createdAt={ item.createdAt }
            updatedAt={ item.updatedAt }
          />
        )}
      </div>
		);
	}
}));

module.exports = ListView;
