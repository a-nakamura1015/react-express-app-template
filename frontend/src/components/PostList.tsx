import { FC } from 'react';

type Post = {
  id: number;
  userId: number;
  title: string;
  content: string;
};

const PostList: FC<{ posts: Post[] }> = ({ posts }) => {
  return (
    <div>
      <h2>Post List</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <strong>{post.title}</strong> - {post.content}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostList;
