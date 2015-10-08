const React = require('react');
const ReactDOM = require('react-dom');
const mobservable = require('mobservable');
const reactiveComponent = require('mobservable-react').reactiveComponent;
const moment = require('moment');
const classnames = require('classnames');

const BlogItem = reactiveComponent(React.createClass({
  getInitialState: function () {
    return {
      isSelected: false
    }
  },
  componentDidMount: function didMount() {

  },
  formatDate: function (updatedAt) {
    var now = new Date();
    return moment(now).to(updatedAt)
  },
  handleClick: function mouseOver () {
    this.setState({ isSelected: !this.state.isSelected });
  },
	render() {
    return(
      <div onClick={ this.handleClick } className={ classnames('blog', 'list-item', { selected: this.state.isSelected }) }>
        <h2>{this.props.title}</h2>
        <time>Latest updated { this.formatDate(this.props.updatedAt) }</time>
      </div>
		);
	}
}));

module.exports = BlogItem;
