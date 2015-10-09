import React, { Component } from  'react';
import MediumEditor from 'medium-editor';

class EditorView extends React.Component {

    constructor(props) {
      super(props);
    }

    componentDidMount() {

    }

    handleChange() {
      return
    }

    render() {

      var editor;
      if (this.props.post) {
        editor = (() => {
          /** post selected markup */
          return(
            <textarea onChange={ this.handleChange } value={ this.props.post.content } />
          )
        })();
      } else {
        editor = (() => {
          /** no post selected markup */
          return(
            <h2>:(</h2>
          )

        })();
      }

      return(
        <div className="blog editor-view">
          {editor}
        </div>

      )
    }

}

module.exports = EditorView;
