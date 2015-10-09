import React, { Component } from  'react';
import BlogItem from './blog-item';

class ListView extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
          items: []
      }
    }

    componentDidMount() {
      this.props.stateStore.on('items:change', (items) => {
        this.setState({ items: items });
      });
    }

    render() {
      console.log("Render list view");
      return(
        <div className="blog list-view">
          { this.state.items.map(item => {
            return <BlogItem
              selectBlogPost={ this.props.selectBlogPost }
              stateStore={ this.props.stateStore }
              key={ item.id }
              post={ item }
            />
          }) }
        </div>
      )
    }

}

module.exports = ListView;
