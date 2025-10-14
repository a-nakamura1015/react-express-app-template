import { Router } from 'express';
import { getUsers, getUser, deleteUser } from '../controllers/userController';

const router = Router();

router.get('/', getUsers);
router.get('/:id', getUser);
router.delete('/:id', deleteUser);

export default router;
