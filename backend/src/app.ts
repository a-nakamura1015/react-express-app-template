import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes'; 
import { initDb } from './db/index';

dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

const app = express();
const port = process.env.PORT || 5000;

// CORSを有効にする
app.use(cors());

// JSONパーサー
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Hello, World!');
});

// ルートの設定
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// サーバー起動とインスタンス取得
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  initDb();
});

export { app, server }; 
