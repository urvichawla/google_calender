import { Response } from 'express';
import { Calendar, ICalendar } from '../models';
import { AuthRequest } from '../middleware/auth.middleware';

export const getCalendars = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req;
    
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const calendars = await Calendar.find({ userId }).sort({ id: 1 });
    
    const transformedCalendars = calendars.map(calendar => {
      const calendarObj = calendar.toObject();
      if (calendarObj.colorOption && typeof calendarObj.colorOption === 'string') {
        try {
          calendarObj.colorOption = JSON.parse(calendarObj.colorOption);
        } catch {
        }
      }
      return calendarObj;
    });
    
    res.json(transformedCalendars);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createCalendar = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const calendarData: Partial<ICalendar> = {
      ...restBody,
      userId,
      colorOption: colorOptionStr,
      id: restBody.id || Date.now(), // Fallback if id is missing
    };

    const calendar = await Calendar.create(calendarData);
    res.status(201).json(calendar);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const createMultipleCalendars = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req;
    const { calendars } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!Array.isArray(calendars)) {
      res.status(400).json({ error: 'calendars must be an array' });
      return;
    }

    const calendarsWithUserId = calendars.map((cal: any) => {
      const { colorOption, ...restCal } = cal;
      const colorOptionStr = typeof colorOption === 'object' && colorOption !== null
        ? JSON.stringify(colorOption)
        : colorOption || '';
      
      return {
        ...restCal,
        userId,
        colorOption: colorOptionStr,
        id: restCal.id || Date.now() + Math.random(), // Fallback if id is missing
      };
    });

    const created = await Calendar.insertMany(calendarsWithUserId);
    
    const transformedCreated = created.map(calendar => {
      const calendarObj = calendar.toObject();
      if (calendarObj.colorOption && typeof calendarObj.colorOption === 'string') {
        try {
          calendarObj.colorOption = JSON.parse(calendarObj.colorOption);
        } catch {
        }
      }
      return calendarObj;
    });
    
    res.status(201).json(transformedCreated);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateCalendar = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const calendar = await Calendar.findOne({ userId, id: Number(id) });
    
    if (!calendar) {
      res.status(404).json({ error: 'Calendar not found' });
      return;
    }

    const { colorOption, ...restBody } = req.body;
    const colorOptionStr = typeof colorOption === 'object' && colorOption !== null
      ? JSON.stringify(colorOption)
      : colorOption;

    Object.assign(calendar, restBody, colorOption !== undefined ? { colorOption: colorOptionStr } : {});
    await calendar.save();
    
    const calendarObj = calendar.toObject();
    if (calendarObj.colorOption && typeof calendarObj.colorOption === 'string') {
      try {
        calendarObj.colorOption = JSON.parse(calendarObj.colorOption);
      } catch {
      }
    }
    
    res.json(calendarObj);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteCalendar = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const calendar = await Calendar.findOneAndDelete({ userId, id: Number(id) });
    
    if (!calendar) {
      res.status(404).json({ error: 'Calendar not found' });
      return;
    }

    res.json({ message: 'Calendar deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteMultipleCalendars = async (req: AuthRequest, res: Response): Promise<void> => {
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
    const result = await Calendar.deleteMany({ userId, id: { $in: numericIds } });
    
    res.json({ message: `${result.deletedCount} calendars deleted successfully` });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

