import { Router } from 'express';
import { 
  getTest,
  getUser,
  updatePoints,
  energyLevelUp,
  updateCard,
  updateTask,
  getData4HomePage,
  getData4CardPage,
  getData4TaskPage,
  getData4BoosterPage,
  getData4FriendsPage,
  getData4RankPage,
  getData4RewardsPage,
  getData4DailyRewardPage,
  updateDayCount,
  updateBoostCount,
  updateCardReward,
  updateEnergy
 } from '../controllers/userControllers';

const router = Router();

router.post('/get-user/:id', getUser);
router.put('/update/points/:id', updatePoints);
router.put('/update/energy-levelup/:id', energyLevelUp);
router.put('/update/card/:id', updateCard);
router.put('/update/task/:id', updateTask);
router.put('/update/current-values/:id', updateEnergy);  // only local
router.put('/update/daily-data/daycount/:id', updateDayCount);  // only local
router.put('/update/daily-data/boostcount/:id', updateBoostCount);  // only local
router.put('/update/card-reward/:id', updateCardReward);  // only local  

router.get('/', getTest);
router.get('/get-home-data/:id', getData4HomePage);
router.get('/get-card-data/:id', getData4CardPage);
router.get('/get-task-data/:id', getData4TaskPage);
router.get('/get-booster-data/:id', getData4BoosterPage);
router.get('/get-friend-data/:id', getData4FriendsPage);
router.get('/get-rank-data/:id', getData4RankPage);
router.get('/get-rewards-data/:id', getData4RewardsPage);
router.get('/get-dailyreward-data/:id', getData4DailyRewardPage);

export default router;
