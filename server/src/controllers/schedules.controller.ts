import { Response } from 'express';
import { Schedule, ISchedule } from '../models';
import { AuthRequest } from '../middleware/auth.middleware';

export const getSchedules = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req;
    
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const schedules = await Schedule.find({ userId }).sort({ id: 1 });
    
    const transformedSchedules = schedules.map(schedule => {
      const scheduleObj = schedule.toObject();
      if (scheduleObj.colorOption && typeof scheduleObj.colorOption === 'string') {
        try {
          scheduleObj.colorOption = JSON.parse(scheduleObj.colorOption);
        } catch {
        }
      }
      return scheduleObj;
    });
    
    res.json(transformedSchedules);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createSchedule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req;
    
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { colorOption, ...restBody } = req.body;
    const colorOptionStr = typeof colorOption === 'object' && colorOption !== null
      ? JSON.stringify(colorOption)
      : colorOption || '';

    const scheduleData: Partial<ISchedule> = {
      ...restBody,
      userId,
      colorOption: colorOptionStr,
      id: restBody.id || Date.now(), 
    };

    const schedule = await Schedule.create(scheduleData);
    res.status(201).json(schedule);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const createMultipleSchedules = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req;
    const { schedules } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!Array.isArray(schedules)) {
      res.status(400).json({ error: 'schedules must be an array' });
      return;
    }

    const schedulesWithUserId = schedules.map((sch: any) => {
      const { colorOption, ...restSch } = sch;
      const colorOptionStr = typeof colorOption === 'object' && colorOption !== null
        ? JSON.stringify(colorOption)
        : colorOption || '';
      
      return {
        ...restSch,
        userId,
        colorOption: colorOptionStr,
        id: restSch.id || Date.now() + Math.random(), 
      };
    });

    const created = await Schedule.insertMany(schedulesWithUserId);
    
    const transformedCreated = created.map(schedule => {
      const scheduleObj = schedule.toObject();
      if (scheduleObj.colorOption && typeof scheduleObj.colorOption === 'string') {
        try {
          scheduleObj.colorOption = JSON.parse(scheduleObj.colorOption);
        } catch {
        }
      }
      return scheduleObj;
    });
    
    res.status(201).json(transformedCreated);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateSchedule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const schedule = await Schedule.findOne({ userId, id: Number(id) });
    
    if (!schedule) {
      res.status(404).json({ error: 'Schedule not found' });
      return;
    }

    const { colorOption, ...restBody } = req.body;
    const colorOptionStr = typeof colorOption === 'object' && colorOption !== null
      ? JSON.stringify(colorOption)
      : colorOption;

    Object.assign(schedule, restBody, colorOption !== undefined ? { colorOption: colorOptionStr } : {});
    await schedule.save();
    
    const scheduleObj = schedule.toObject();
    if (scheduleObj.colorOption && typeof scheduleObj.colorOption === 'string') {
      try {
        scheduleObj.colorOption = JSON.parse(scheduleObj.colorOption);
      } catch {
      }
    }
    
    res.json(scheduleObj);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteSchedule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const schedule = await Schedule.findOneAndDelete({ userId, id: Number(id) });
    
    if (!schedule) {
      res.status(404).json({ error: 'Schedule not found' });
      return;
    }

    res.json({ message: 'Schedule deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteMultipleSchedules = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req;
    const { ids } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!Array.isArray(ids)) {
      res.status(400).json({ error: 'ids must be an array' });
      return;
    }

    const numericIds = ids.map((id: string | number) => Number(id));
    const result = await Schedule.deleteMany({ userId, id: { $in: numericIds } });
    
    res.json({ message: `${result.deletedCount} schedules deleted successfully` });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

