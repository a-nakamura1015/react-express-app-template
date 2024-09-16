import { db } from '../db';
import { RowDataPacket } from 'mysql2';

// Postの型定義
type Post = {
  id: number;
  user_id: number;
  title: string;
  content: string;
};

// 全投稿を取得する関数
export const getAllPosts = async (): Promise<Post[]> => {
  const [rows] = await db.query<Post[] & RowDataPacket[]>('SELECT * FROM posts');
  return rows;
};

// 特定の投稿を取得する関数
export const getPostById = async (id: number): Promise<Post | null> => {
  const [rows] = await db.query<Post[] & RowDataPacket[]>('SELECT * FROM posts WHERE id = ?', [id]);
  return rows.length > 0 ? rows[0] : null;
};
