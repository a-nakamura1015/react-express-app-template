import { db } from '../db';
import { RowDataPacket, OkPacket } from 'mysql2/promise';
import { deletePostsByUserId } from './post';

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

// ユーザーを削除する関数
export const deleteUser = async (id: number): Promise<number> => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // ユーザーに紐づく投稿を削除
    await deletePostsByUserId(id, connection);

    // ユーザーを削除
    const [result] = await connection.query<OkPacket>('DELETE FROM users WHERE id = ?', [id]);

    await connection.commit();

    return result.affectedRows;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
