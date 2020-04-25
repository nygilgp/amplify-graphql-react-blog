import React, { Component } from  'react';
import { API, graphqlOperation } from 'aws-amplify'
import { listPosts } from '../graphql/queries';

class DeletePost extends Component {

    render() {
        return (
            <button>Delete</button>
        )
    }
}

export default DeletePost;