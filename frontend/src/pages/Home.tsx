import { FC } from 'react';
import UserList from '../components/UserList';
import PostList from '../components/PostList';
import PostForm from '../components/PostForm';
import { useUsers } from '../hooks/useUsers';
import { usePosts } from '../hooks/usePosts';

const Home: FC = () => {
  const { users, deleteUser, loading } = useUsers();
  const { posts, addPost, fetchPosts } = usePosts();

  const handleDeleteUser = async (id: number) => {
    await deleteUser(id);
    await fetchPosts();
  };

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      <UserList users={users} deleteUser={handleDeleteUser} loading={loading} />
      <PostList posts={posts} />
      <PostForm users={users} onPostAdded={addPost} />
    </div>
  );
};

export default Home;
