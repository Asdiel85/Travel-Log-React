import PostCard from '../PostCard/PostCard';
import * as postService from '../../service/postService';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/AuthContext.js';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner.jsx';

export default function Feed() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [loggedUser, setLoggedUser] = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    postService
      .getAllPosts()
      .then((result) => {
        setPosts(result);
        setLoading(false);
      })
      .catch((err) => navigate('*'));
  }, []);

  const deletePost = async (id) => {
    try {
      await postService.deletePost(id);
      setPosts(posts.filter((post) => post._id !== id));
    } catch (error) {
      navigate('*');
    }
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : posts.length > 0 ? (
        posts.map((post) => (
          <PostCard
            key={post._id}
            {...post}
            liked={post.likes.includes(loggedUser?.id)}
            confirmTask={() => deletePost(post._id)}
          />
        ))
      ) : (
        <h1>There are no posts yet</h1>
      )}
    </>
  );
}
