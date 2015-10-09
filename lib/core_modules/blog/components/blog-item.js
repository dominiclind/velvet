const React = require('react');
const classnames = require('classnames');

class BlogItem extends React.Component {

  constructor (props) {
    super(props);
  }

  componentDidMount () {

  }

  handleSelect (ev) {

    // do something to mark it as selected

    // tell the parents about the selection
    this.props.selectBlogPost(ev, this.props.post);

  }

	render() {
    console.log("Render blog item");
    return(
      <div className="blog-item" onClick={ this.handleSelect.bind(this) }>
        <h2>{this.props.post.title}</h2>
      </div>
		);
	}
};

module.exports = BlogItem;
