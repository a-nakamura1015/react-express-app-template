import { Request, Response } from 'express';
import { getAllUsers, getUserById } from '../models/user';

export const getUsers = async (req: Request, res: Response) => {
  const users = await getAllUsers();
  res.json(users);
};

export const getUser = async (req: Request, res: Response) => {
  const user = await getUserById(Number(req.params.id));
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
};
