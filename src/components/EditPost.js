import React, { Component } from  'react';
import { API, graphqlOperation, Auth } from 'aws-amplify'
import { listPosts } from '../graphql/queries';
import { updatePost } from '../graphql/mutations';

class EditPost extends Component {

    state = {
        show: false,
        id: this.props.post.id,
        postTitle: this.props.post.postTitle,
        postBody: this.props.post.postBody,
        postOwnerId: this.props.post.postOwnerId,
        postOwnerUsername: this.props.post.postOwnerUsername,
    }

    toggleModal = (e) => {
        e.preventDefault()
        this.setState({ show: !this.state.show });
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }

    componentWillMount = async () => {
        await Auth.currentUserInfo()
            .then(user => {
                this.setState({
                    postOwnerId: user.attributes.sub,
                    postOwnerUsername: user.username,
                });
            })
    }

    handleUpdatePost = async (event) => {
        event.preventDefault();
        const input = {
            id: this.state.id,
            postTitle: this.state.postTitle,
            postBody: this.state.postBody,
            postOwnerId: this.state.postOwnerId,
            postOwnerUsername: this.state.postOwnerUsername,
            createdAt: new Date().toISOString(),
        }
        await API.graphql(graphqlOperation(updatePost, { input }));
        this.setState({
            show: false,
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
            <>
                {this.state.show && (
                    <div className="modal">
                        <button
                            className="close"
                            onClick={this.toggleModal}
                        >X</button>
                        <form className="add-post"
                            onSubmit={this.handleUpdatePost}>
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
                    </div>
                )}
                <button onClick={this.toggleModal}>Edit</button>
            </>
        )
    }
}

export default EditPost;