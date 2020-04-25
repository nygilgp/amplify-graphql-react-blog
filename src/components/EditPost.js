import React, { Component } from  'react';
import { API, graphqlOperation } from 'aws-amplify'
import { listPosts } from '../graphql/queries';

class EditPost extends Component {

    render() {
        return (
            <button>Edit</button>
        )
    }
}

export default EditPost;