import { Router } from 'express';
import {
  getCalendars,
  createCalendar,
  createMultipleCalendars,
  updateCalendar,
  deleteCalendar,
  deleteMultipleCalendars,
} from '../controllers/calendars.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', getCalendars);
router.post('/', createCalendar);
router.post('/bulk', createMultipleCalendars);
router.put('/:id', updateCalendar);
router.delete('/:id', deleteCalendar);
router.delete('/bulk/multiple', deleteMultipleCalendars);

export default router;

