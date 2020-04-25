import React, { Component } from  'react';
import { API, graphqlOperation } from 'aws-amplify';
import { createPost } from '../graphql/mutations'


class CreatePost extends Component {
    state = {
        postTitle: "",
        postBody: "",
        postOwnerId: "",
        postOwnerUsername: "",
    }

    componentDidMount = async () => {
        // TODO: later
    }

    handleAddPost = async (event) => {
        event.preventDefault();
        const input = {
            postTitle: this.state.postTitle,
            postBody: this.state.postBody,
            postOwnerId: "239nwew", // this.state.postOwnerId,
            postOwnerUsername: "Neo", // this.state.postOwnerName,
            createdAt: new Date().toISOString(),
        }
        const result = await API.graphql(graphqlOperation(createPost, { input }));
        this.setState({
            postBody: "",
            postTitle: "",
        });

    }

    handleOnChange = async (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    render() {
        return (
            <form className="add-post"
                onSubmit={this.handleAddPost}>
                <input style={{font: '19px'}}
                    name="postTitle"
                    placeholder="Title"
                    value={this.state.postTitle}
                    required
                    onChange={this.handleOnChange}
                    />
                <textarea
                    name="postBody"
                    rows="3"
                    cols="40"
                    value={this.state.postBody}
                    required
                    onChange={this.handleOnChange}
                    placeholder="New blog post"
                />
                <input 
                    type="submit"
                    className="btn"
                    />
            </form>
        )
    }
}

export default CreatePost;