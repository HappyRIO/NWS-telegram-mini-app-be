import { Request, Response } from 'express';

var Admins          = require("../models/admins");
var BasicSettings   = require("../models/basicsettings");
var Cards           = require("../models/cards");
var DailyCardPair   = require("../models/dailycardpair");
var Tasks           = require("../models/tasks");
var cron            = require("node-cron");

export const getTest = async (req: Request, res: Response) => {
  const user = { message: 'GET adminsCtr successfuly!' };
  res.json(user);
};

cron.schedule('0 0 * * *', async () => {// 24hr
  try {
      const cards = await DailyCardPair.find({});
      const uniqueCardIds = new Set();
      // Generate unique cardIds
      while (uniqueCardIds.size < cards.length) {
          uniqueCardIds.add(Math.floor(Math.random() * cards.length + 1));
      }
      await Promise.all(cards.map((card:any, index:any) => {
          DailyCardPair.updateOne({ _id: card._id }, { cardId: Array.from(uniqueCardIds)[index] });
      }));
      const now = new Date(); // Create a new Date object
      console.log(`Updated cardIds at ${now.getHours()}h:${now.getMinutes()}m:${now.getSeconds()}s`);
  } catch (error) {
      console.error('Error updating cardId:', error);
  }
});

export const updateAdmin = async (req: Request, res: Response) => {
  let index = req.params.id;
  let newData = req.body;
  try {
      const updatedAdmins = await Admins.findOneAndUpdate({id: index}, newData, {new: true});
      if(updatedAdmins) {
          res.status(200).json(updatedAdmins);
      } else {
          const newAdmin = new Admins({
              id: index,
              ...newData,
          })
          const savedAdmin = await newAdmin.save();
          res.status(200).json(savedAdmin);
      }
  } catch (err) { res.json(err); }
};

export const updateCards = async (req: Request, res: Response) => {
  let index = req.params.id;
  let newData = req.body;
  try {
      const updatedCards = await Cards.findOneAndUpdate({id: index}, newData, {new: true});
      if(updatedCards) {
          res.status(200).json(updatedCards);
      } else {
          const newCard = new Cards({
              id: index,
              ...newData,
          })
          const savedCard = await newCard.save();
          res.status(200).json(savedCard);
      }
  } catch (err) { res.json(err); }
};

export const updateTasks = async (req: Request, res: Response) => {
  let index = req.params.id;
  let newData = req.body;
  try {
      const updatedTasks = await Tasks.findOneAndUpdate({id: index}, newData, {new: true});
      if(updatedTasks) {
          res.status(200).json(updatedTasks);
      } else {
          const newTask = new Tasks({
              id: index,
              ...newData,
          })
          const savedTask = await newTask.save();
          res.status(200).json(savedTask);
      }
  } catch (err) { res.json(err); }
};

export const deleteTask = async (req: Request, res: Response) => {
  let index = req.params.id;
  try {
      const tasks = await Tasks.deleteOne({id:index});
      res.status(200).send(true);
  } catch (err) { res.json(err); }
};

export const deleteCard = async (req: Request, res: Response) => {
  let index = req.params.id;
  try {
      const cards = await Cards.deleteOne({id:index});
      res.status(200).send(true);
  } catch (err) { res.json(err); }
};

export const updateDailyRevenue = async (req: Request, res: Response) => {
  let index = req.params.id;
  let newRevenue = req.body;
  try {
      let basicSettings = await BasicSettings.findOne();
      basicSettings.dailyRevenue[index] = newRevenue;
      await basicSettings.save();
      res.status(200).json(basicSettings);
  } catch (err) {
      res.json(err);
  }
};

export const updateFriendsRevenue = async (req: Request, res: Response) => {
  let index = req.params.id;
  let newRevenue = req.body;
  try {
      let basicSettings = await BasicSettings.findOne();
      basicSettings.friendsRevenue[index] = newRevenue;
      await basicSettings.save();
      res.status(200).json(basicSettings);
  } catch (err) {
      res.json(err);
  }
};

export const updateEnergyLevel = async (req: Request, res: Response) => {
  let index = req.params.id; // level
  let newData = req.body; // value for one level
  try {
      let basicSettings = await BasicSettings.findOne();
      basicSettings.energy.maxLevel[index] = newData.max;
      basicSettings.energy.secondIncLevel[index] = newData.secondInc;
      basicSettings.energy.tap2PointLevel[index] = newData.tap2Point;
      await basicSettings.save();
      res.status(200).json(basicSettings);
  } catch (err) {
      res.json(err);
  }
};

export const getAdmins = async (req: Request, res: Response) => {
  let admins = await Admins.find({});
  res.status(200).json(admins);
};

export const getCards = async (req: Request, res: Response) => {
  let cards = await Cards.find({});
  res.status(200).json(cards);
};

export const getTasks = async (req: Request, res: Response) => {
  let tasks = await Tasks.find({});
  res.status(200).json(tasks);
};

export const getTaskById = async (req: Request, res: Response) => {
  let taskId = req.params.id;
  let task = await Tasks.find({id: taskId});
  res.status(200).json(task);
};

export const getDailyCardPair = async (req: Request, res: Response) => {
  let dailyCardPair = await DailyCardPair.find({});
  res.status(200).json(dailyCardPair);
};

export const getBasicSettings = async (req: Request, res: Response) => {
  let basicSettings = await BasicSettings.find({});
  res.status(200).json(basicSettings);
};