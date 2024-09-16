import { FC, FormEvent, useEffect, useState } from 'react';

interface User {
  id: number;
  name: string;
}

interface PostFormProps {
  users: User[];
  onPostAdded: (postData: { userId: number; title: string; content: string }) => Promise<void>;
}

const PostForm: FC<PostFormProps> = ({ users, onPostAdded }) => {
  const [userId, setUserId] = useState('');

  // users が更新されたときに userId を設定
  useEffect(() => {
    if (users.length > 0) {
      setUserId(users[0].id.toString());
    }
  }, [users]);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!userId || !title || !content) {
      console.error("All fields are required");
      return;
    }

    onPostAdded({ userId: Number(userId), title, content });
    setTitle('');
    setContent('');
  };

  return (
    <>
      {users.length > 0 ? (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label>
            User:
            <select value={userId} onChange={(e) => setUserId(e.target.value)}>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Title:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
          <label>
            Content:
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </label>
          <button type="submit">Create Post</button>
        </form>
      ) : (
        <p>Loading users...</p>
      )}
    </>
  );
};

export default PostForm;
