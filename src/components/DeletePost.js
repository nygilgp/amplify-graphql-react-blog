import React, { Component } from  'react';
import { API, graphqlOperation } from 'aws-amplify'
import { deletePost } from '../graphql/mutations';

class DeletePost extends Component {
    handleOnClick = async (id) => {
        const input = {id};
        await API.graphql(graphqlOperation(deletePost, { input }))
    }
    render() {
        const { postId } = this.props;
        return (
            <button onClick={() => this.handleOnClick(postId)}>Delete</button>
        )
    }
}

export default DeletePost;