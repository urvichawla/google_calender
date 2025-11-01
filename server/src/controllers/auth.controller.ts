import { Request, Response } from 'express';
import { User } from '../models';
import { AuthRequest } from '../middleware/auth.middleware';

export const createOrGetUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req;
    const { email, name, photoURL } = req.body;

    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }

    let user = await User.findById(userId);
    
    if (!user) {
      user = await User.create({
        _id: userId,
        email: email || '',
        name,
        photoURL,
      });
    } else {
      if (name) user.name = name;
      if (photoURL) user.photoURL = photoURL;
      await user.save();
    }

    res.json({ user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req;
    
    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }

    const user = await User.findById(userId);
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

