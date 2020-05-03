import React, { Component } from  'react';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import { FaThumbsUp, FaSadTear } from 'react-icons/fa';


import { listPosts } from '../graphql/queries';
import { createLike } from '../graphql/mutations';
import { onCreatePost, onDeletePost, onUpdatePost, onCreateComment, onCreateLike } from '../graphql/subscriptions';

import DeletePost from './DeletePost';
import EditPost from './EditPost';
import CreateCommentPost from './CreateCommentPost';
import CommentPost from './CommentPost';

class DisplayPosts extends Component {
    state = {
        errorMessage: "",
        postLikedBy: [],
        ownerId: "",
        ownerUsername: "",
        isHover: false,
        posts: [],
    };

    updatePostsList = (newPost, update) => {
        let posts = [];
        const prevPosts = this.state.posts;
        if(update) {
            const index = this.state.posts.findIndex(post => (post.id === newPost.id));
            posts = [
                ...prevPosts.slice(0, index),
                newPost,
                ...prevPosts.slice(index + 1)
            ]
        } else {
            posts = [newPost, ...prevPosts];
        }
        this.setState({posts});
    }

    componentDidMount = async () => {
            this.getPosts();

            await Auth.currentUserInfo()
                .then(user => {
                    this.setState({
                        ownerId: user.attributes.sub,
                        ownerUsername: user.username,
                    });
                });
            
            this.createPostListner = await API.graphql(graphqlOperation(onCreatePost))
                .subscribe({
                    next: postData => this.updatePostsList(postData.value.data.onCreatePost, false) 
                });
            this.updatePostListner = await API.graphql(graphqlOperation(onUpdatePost))
                .subscribe({
                    next: postData => this.updatePostsList(postData.value.data.onUpdatePost, 
                        true) 
                });
            this.deletePostListner = await API.graphql(graphqlOperation(onDeletePost))
                .subscribe({
                    next: postData => {
                        const deletedPost = postData.value.data.onDeletePost;
                        const posts = this.state.posts.filter(post => post.id !== deletedPost.id);
                        this.setState({posts});
                    }
                });
            this.createPostCommentListner = await API.graphql(graphqlOperation(onCreateComment))
                .subscribe({
                    next: commentData => {
                        const newComment = commentData.value.data.onCreateComment;
                        let posts = [ ...this.state.posts];
                        const index = posts.findIndex((post) => 
                            post.id === newComment.post.id);
                        posts[index].comments.items.push(newComment);
                        this.setState({posts});
                    }
                });
            this.createPostLikeListner = await API.graphql(graphqlOperation(onCreateLike))
                .subscribe({
                    next: likeData => {
                        const newLike = likeData.value.data.onCreateLike;
                        let posts = [ ...this.state.posts];
                        const index = posts.findIndex((post) => 
                            post.id === newLike.post.id);
                        posts[index].likes.items.push(newLike);
                        this.setState({posts});
                    }
                });
    };
    
    componentWillUnmount() {
        this.createPostListner.unsubscribe();
        this.updatePostListner.unsubscribe();
        this.deletePostListner.unsubscribe();
        this.createPostCommentListner.unsubscribe();
        this.createPostLikeListner.unsubscribe();
    }

    getPosts = async () => {
        const result = await API.graphql(graphqlOperation(listPosts));
        this.setState({posts: result.data.listPosts.items});
    };

    likedPost = (postId) => {
        const post = this.state.posts.find(post => post.id === postId);
        if(post.postOwnerId === this.state.ownerId) return true;
        const like = post.likes.items.findIndex(like => 
            like.likeOwnerId === this.state.ownerId);
        if(like !== -1) return true;
        return false;
    }

    handleLike = async postId => {
        if(this.likedPost(postId)) return this.setState({errorMessage: "You can't like your own post."})
        const input = {
            likePostId: postId,
            numberLikes: 1,
            likeOwnerId: this.state.ownerId,
            likeOwnerUsername: this.state.ownerUsername,
        }
        await API.graphql(graphqlOperation(createLike, { input }));
    }

    handleMouseHover = postId => {
        const post = this.state.posts.find(post => post.id === postId);
        const postLikedBy = post.likes.items.map(like => 
            like.likeOwnerUsername);
        this.setState({ isHover: !this.state.isHover, postLikedBy });
    }

    handleMouseLeave = () => this.setState({
        isHover: !this.state.isHover,
        postLikedBy: [],
    });

    render() {
        const { posts } = this.state;
        const loggedInUser = this.state.ownerId;
        return (
            posts.map((post) => (
                <div key={post.id} className='posts' style={rowStyle}>
                    <h1>{post.postTitle}</h1>
                    <span style={{fontStyle: "italic", color: "#0ca5e297"}}>
                        { "Wrote by: " } { post.postOwnerUsername }
                        { " on " }
                        <time>
                            {new Date(post.createdAt).toDateString()}
                        </time>
                    </span>
                    <p>{post.postBody}</p>
                    <br />
                    <span>
                        {post.postOwnerId === loggedInUser &&
                            <>
                            <DeletePost postId={post.id} />
                            <EditPost post={post} />
                            </>
                        }

                        <span>
                            <p className="alert">{post.postOwnerId === loggedInUser &&
                                this.state.errorMessage
                            }</p>
                            <p 
                                onMouseEnter={() => this.handleMouseHover(post.id)}
                                onMouseLeave={() => this.handleMouseLeave()}
                                onClick={() => this.handleLike(post.id) }
                                style={{
                                    color: post.likes.items.length > 0 ? "blue" : "gray"
                                }}
                                className="like-button"
                                >
                                <FaThumbsUp /> 
                                {post.likes.items.length}
                            </p>
                            {this.state.isHover &&
                                <div className="users-liked">
                                {this.state.postLikedBy.length === 0 ? 
                                    "Be the first to like it." :
                                    "Liked by: "
                                }
                                {this.state.postLikedBy.length === 0 ? 
                                    <FaSadTear /> : 
                                    this.state.postLikedBy
                                    .map(user => (
                                        <div key={user}>
                                            <span
                                                style={{fontStyle: "bold", color: "#ged"}}
                                                >{user}</span>
                                        </div>
                                    ))
                                }
                                </div>
                            }
                        </span>
                    </span>
                    <span>
                        <CreateCommentPost postId={post.id} />
                        {post?.comments?.items?.length > 0 && (
                            <>
                            <span style={{ fontStyle: '19px', color:'gray' }}>
                                Comments:
                            </span>
                            {post.comments.items.map((comment, index) => (
                                <CommentPost comment={comment} key={index} />
                            ))}
                            </>
                        )}
                    </span>
                </div>
            ))
        )
    }
}

const rowStyle = {
    backgroud: '#f4f4f4',
    padding: '10px',
    border: '1px #ccc dotted',
    margin: '14px',
}

export default DisplayPosts;