import { FC } from 'react';

type User = {
  id: number;
  name: string;
  email: string;
};

const UserList: FC<{ users: User[] }> = ({ users }) => {
  return (
    <div>
      <h2>User List</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} ({user.email})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
