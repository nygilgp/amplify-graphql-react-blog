import React, { Component } from  'react';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import { createComment } from '../graphql/mutations'


class CreatCommentPost extends Component {
    state = {
        commentOwnerId: "",
        commentOwnerUsername: "",
        content: "",
    }

    componentDidMount = async () => {
        await Auth.currentUserInfo()
            .then(user => {
                this.setState({
                    commentOwnerId: user.attributes.sub,
                    commentOwnerUsername: user.username,
                });
            })
    }

    handleChange = (e) => this.setState({ [e.target.name]: e.target.value });

    handleSubmit = async (e) => {
        e.preventDefault();
        const input = {
            commentPostId: this.props.postId,
            content: this.state.content,
            commentOwnerId: this.state.commentOwnerId,
            commentOwnerUsername: this.state.commentOwnerUsername,
            createdAt: new Date().toISOString(),
        }
        await API.graphql(graphqlOperation(createComment, { input }));
        this.setState({
            content: "",
        });
    }

    render() {

        return (
            <div>
                <form
                    onSubmit={this.handleSubmit}
                    className="add-comment"
                    >
                    <textarea
                        name="content"
                        rows="3"
                        column="40"
                        required
                        placeholder="Add your comment"
                        value={this.state.content}
                        onChange={this.handleChange}
                        ></textarea>
                    <input
                        className="btn"
                        type="submit"
                        value="Add Comment"
                        style={{ fontSize: '19px' }}
                        />
                </form>
            </div>
        )
    }
}

export default CreatCommentPost;