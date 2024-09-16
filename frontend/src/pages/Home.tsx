import { FC } from 'react';
import UserList from '../components/UserList';
import PostList from '../components/PostList';
import PostForm from '../components/PostForm';
import { useUsers } from '../hooks/useUsers';
import { usePosts } from '../hooks/usePosts';

const Home: FC = () => {
  const users = useUsers();
  const { posts, addPost } = usePosts();

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      <UserList users={users} />
      <PostList posts={posts} />
      <PostForm users={users} onPostAdded={addPost} />
    </div>
  );
};

export default Home;
