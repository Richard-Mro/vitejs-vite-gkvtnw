import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function App() {
  const [posts, setPosts] = useState([]);
  const [editedPost, setEditedPost] = useState({ id: null, title: '' });
  const editInputRef = useRef(null);

  useEffect(() => {
   
    axios.get('https://jsonplaceholder.typicode.com/posts')
      .then(response => setPosts(response.data))
      .catch(error => console.error('Error fetching posts:', error));
  }, []);

  const handleEditClick = (postId, postTitle) => {
   
    setEditedPost({ id: postId, title: postTitle });
    editInputRef.current.focus();
    editInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleUpdatePost = () => {
    
    axios.put(`https://jsonplaceholder.typicode.com/posts/${editedPost.id}`, {
      id: editedPost.id,
      title: editedPost.title,
    })
    .then(response => {
      setPosts(posts.map(post => (post.id === editedPost.id ? response.data : post)));
      setEditedPost({ id: null, title: '' });
    })
    .catch(error => console.error('Error updating post:', error));
  };

  const handleDeletePost = (postId) => {
    
    axios.delete(`https://jsonplaceholder.typicode.com/posts/${postId}`)
    .then(() => {
     
      setPosts(posts.filter(post => post.id !== postId));
    })
    .catch(error => console.error('Error deleting post:', error));
  };

  return (
    <div className="App">
      <h1>Posts</h1>
      {editedPost.id && (
        <div>
          <h2>Edit Post</h2>
          <input
            type="text"
            value={editedPost.title}
            onChange={(e) => setEditedPost({ ...editedPost, title: e.target.value })}
            ref={editInputRef}
          />
          <button onClick={handleUpdatePost}>Update</button>
        </div>
      )}
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            {post.title}
            <button onClick={() => handleEditClick(post.id, post.title)}>Edit</button>
            <button onClick={() => handleDeletePost(post.id)}>Delete</button>
          </li>
        ))}
      </ul>
    
    </div>
  );
}

export default App;
