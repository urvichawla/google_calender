import { Router } from 'express';
import authRoutes from './auth.routes';
import calendarsRoutes from './calendars.routes';
import schedulesRoutes from './schedules.routes';
import holidayRoutes from './holiday.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/calendars', calendarsRoutes);
router.use('/schedules', schedulesRoutes);
router.use('/holiday', holidayRoutes);

export default router;

