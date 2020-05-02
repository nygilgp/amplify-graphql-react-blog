import React, { Component } from  'react';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import { createPost } from '../graphql/mutations'


class CommentPost extends Component {

    render() {
        const {comment} = this.props;
        return (
            <div className="comment">
                <span style={{ fontStyle: "italic", color: "#0cafe297" }}>
                { "Comment by: " } { comment.commentOwnerUsername }
                        { " on " }
                        <time>
                            {new Date(comment.createdAt).toDateString()}
                        </time>
                </span>
                <p>{ comment.content }</p>
            </div>
        );
    }
}

export default CommentPost;