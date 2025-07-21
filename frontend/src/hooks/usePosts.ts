import { useState, useEffect } from 'react';
import { getPosts, addPost } from '../services/api';

type Post = {
  id: number;
  userId: number;
  title: string;
  content: string;
};

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = async () => {
    try {
      const data = await getPosts();
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch Posts:', error);
    }
  };

  const handleAddPost = async (postData: { userId: number; title: string; content: string }) => {
    if (!postData.userId || !postData.title || !postData.content) {
      console.error('All fields are required.');
      return;
    }

    try {
      await addPost(postData);
      // 投稿後に再取得
      await fetchPosts();
    } catch (error) {
      console.error('Failed to add Post:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return { posts, addPost: handleAddPost };
};
