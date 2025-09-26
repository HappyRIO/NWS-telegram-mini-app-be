import { Router } from 'express';
import { 
  getTest,
  updateAdmin,
  updateCards,
  updateTasks,
  updateDailyRevenue,
  updateFriendsRevenue,
  updateEnergyLevel,
  getAdmins,
  getCards,
  getTasks,
  getBasicSettings,
  getDailyCardPair,
  deleteTask,
  deleteCard,
  getTaskById,
 } from '../controllers/adminControllers';

const router = Router();

router.put('/update/admins/:id', updateAdmin);
router.put('/update/cards/:id', updateCards);
router.put('/update/tasks/:id', updateTasks);
router.put('/update/basic/daily-revenue/:id', updateDailyRevenue);
router.put('/update/basic/friend-revenue/:id', updateFriendsRevenue);
router.put('/update/basic/energy-level/:id', updateEnergyLevel);
router.delete("/delete/task/:id", deleteTask);
router.delete("/delete/card/:id", deleteCard);

router.get('/', getTest);
router.get('/get-admins', getAdmins);
router.get('/get-cards', getCards);
router.get('/get-tasks', getTasks);
router.get('/get-task/:id', getTaskById);
router.get('/get-basic-settings', getBasicSettings);
router.get('/get-daily-card-pair', getDailyCardPair);

export default router;
