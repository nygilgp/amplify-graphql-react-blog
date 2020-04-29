import React, { Component } from  'react';
import { API, graphqlOperation } from 'aws-amplify';

import { listPosts } from '../graphql/queries';
import { onCreatePost, onDeletePost, onUpdatePost } from '../graphql/subscriptions';

import DeletePost from './DeletePost';
import EditPost from './EditPost';

class DisplayPosts extends Component {
    state = {
        posts: [],
    };

    updatePostsList = (newPost, update) => {
        let posts = [];
        const prevPosts = this.state.posts;
        debugger;
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
        debugger;
        this.setState({posts});
    }

    componentDidMount = async () => {
            this.getPosts();
            
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
                })
    };
    
    componentWillUnmount() {
        this.createPostListner.unsubscribe();
        this.updatePostListner.unsubscribe();
        this.deletePostListner.unsubscribe();
    }

    getPosts = async () => {
        const result = await API.graphql(graphqlOperation(listPosts));
        this.setState({posts: result.data.listPosts.items});
    };

    render() {
        const { posts } = this.state;
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
                        <DeletePost postId={post.id} />
                        <EditPost post={post} />
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