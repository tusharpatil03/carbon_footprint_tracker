import { Request, Response } from 'express';
import { Activity } from '../../models/Activity';
import HandleError from '../../utils/Error/error';

export const createActivity = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, name, category, carbonImpact, date, notes } = req.body;

    if (!userId || !name || carbonImpact === undefined || !date) {
      throw new HandleError('INVALID_INPUT', 'Missing required fields', 400);
    }

    const activity = await Activity.create({
      userId,
      name,
      category: category || 'other',
      carbonImpact: Number(carbonImpact),
      date: new Date(date),
      notes,
    });

    res.status(201).json({ activity });
  } catch (e: unknown) {
    console.error(e);
    if (e instanceof HandleError) {
      res.status(e.status || 500).json({ message: e.message });
    } else {
      res.status(500).json({ message: 'Unable to create activity' });
    }
  }
};

export const getActivitiesForUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    if (!userId) {
      throw new HandleError('INVALID_INPUT', 'userId is required', 400);
    }

    const activities = await Activity.find({ userId }).sort({ date: -1 }).lean();
    res.status(200).json({ activities });
  } catch (e: unknown) {
    console.error(e);
    res.status(500).json({ message: 'Unable to fetch activities' });
  }
};
