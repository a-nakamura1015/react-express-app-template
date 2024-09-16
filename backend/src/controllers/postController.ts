import { Request, Response } from 'express';
import { getAllPosts, getPostById } from '../models/post';
import { db } from '../db';
import { ResultSetHeader } from 'mysql2';


export const getPosts = async (req: Request, res: Response) => {
  const posts = await getAllPosts();
  res.json(posts);
};

export const getPost = async (req: Request, res: Response) => {
  const post = await getPostById(Number(req.params.id));
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }
  res.json(post);
};

export const createPost = async (req: Request, res: Response) => {
  const { userId, title, content } = req.body;
  
  // 入力のバリデーション
  if (!userId || !title || !content) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const [result] = await db.query<ResultSetHeader>(
      'INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)', 
      [userId, title, content]
    );
    res.status(201).json({ id: result.insertId, userId, title, content });
  } catch (error) {
    res.status(500).json({ error: 'Error creating post' });
  }
};
