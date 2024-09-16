import { useState, useEffect } from 'react';
import axios from 'axios';

export const usePosts = () => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Failed to fetch Posts:', error);
    }
  };

  const addPost = async (postData: { userId: number; title: string; content: string }) => {
    if (!postData.userId || !postData.title || !postData.content) {
      console.error('All fields are required.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/posts', postData);
      // 投稿後に再取得
      await fetchPosts();
    } catch (error) {
      console.error('Failed to add Post:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return { posts, addPost };
};
