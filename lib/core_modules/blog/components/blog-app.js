import React, { Component } from  'react';
import velvet from 'velvet-react';
import makeReactive, { reactiveComponent } from 'mobservable-react';
import ListView from './list-view';
import EditorView from './editor-view';
import request from 'isomorphic-fetch';
import { EventEmitter } from 'events';

class BlogApp extends Component {

  constructor(props) {
      super(props);
      // set initialstate
      this.stateStore = new EventEmitter();
      this.state ={
        selectedPost: null
      };
  }

  componentDidMount () {
    velvet
      .ajax()
      .url('/api/blog/posts.json')
      .on('success', (response) => {
        this.stateStore.emit('items:change', response);
      })
      .go()
  }

  handleSelectBlogPost (ev, post) {
    this.setState({ selectedPost: post })
  }

  render() {

    return (
      <div id="blog-app">
        <ListView selectBlogPost={ this.handleSelectBlogPost.bind(this) } stateStore={ this.stateStore } />
        <EditorView post={ this.state.selectedPost } />
      </div>
    )
  }

}
velvet.tag('blog-app', BlogApp);
