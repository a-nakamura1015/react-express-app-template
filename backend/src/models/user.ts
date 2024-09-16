import { db } from '../db';
import { RowDataPacket } from 'mysql2';

// Userの型定義
type User = {
  id: number;
  name: string;
  email: string;
};

// 全ユーザーを取得する関数
export const getAllUsers = async (): Promise<User[]> => {
  const [rows] = await db.query<User[] & RowDataPacket[]>('SELECT * FROM users');
  return rows;
};

// 特定のユーザーを取得する関数
export const getUserById = async (id: number): Promise<User | null> => {
  const [rows] = await db.query<User[] & RowDataPacket[]>('SELECT * FROM users WHERE id = ?', [id]);
  return rows.length > 0 ? rows[0] : null;
};
