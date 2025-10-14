import { FC } from 'react';

type User = {
  id: number;
  name: string;
  email: string;
};

const UserList: FC<{ users: User[]; deleteUser: (id: number) => void; loading: boolean }> = ({ users, deleteUser, loading }) => {
  if (loading) {
    return <div>Loading users...</div>;
  }

  if (users.length === 0) {
    return <div>ユーザーが存在しません</div>;
  }

  return (
    <div>
      <h2>User List</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} ({user.email})
            <button onClick={() => deleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
