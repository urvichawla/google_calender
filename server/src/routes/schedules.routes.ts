import { Router } from 'express';
import {
  getSchedules,
  createSchedule,
  createMultipleSchedules,
  updateSchedule,
  deleteSchedule,
  deleteMultipleSchedules,
} from '../controllers/schedules.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', getSchedules);
router.post('/', createSchedule);
router.post('/bulk', createMultipleSchedules);
router.put('/:id', updateSchedule);
router.delete('/:id', deleteSchedule);
router.delete('/bulk/multiple', deleteMultipleSchedules);

export default router;

