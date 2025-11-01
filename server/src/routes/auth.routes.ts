import { Router } from 'express';
import { createOrGetUser, getUser } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authMiddleware, createOrGetUser);
router.get('/me', authMiddleware, getUser);

export default router;

