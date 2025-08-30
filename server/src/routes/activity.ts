import { Router } from 'express';
import { createActivity, getActivitiesForUser } from '../controllers/activity/activity';

const router = Router();

router.post('/', createActivity);
router.get('/:userId', getActivitiesForUser);

export default router;