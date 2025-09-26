import { Request, Response } from 'express';

const { v4: uuidv4 } = require('uuid');
var BasicSettings = require("../models/basicsettings");
var Cards = require("../models/cards");
var Tasks = require("../models/tasks");
var User = require("../models/user");
var DailyCardPair = require('../models/dailycardpair');
var cron = require("node-cron");

cron.schedule('0 0 * * *', async () => { // 24hr
  try {
    const users = await User.find({});
    const updatePromises = users.map(async (user: any) => {
      if (user.dailyData.isDayCountEnable) {
        user.dailyData = {
          cardChance: 3,
          boostCount: 3,
          dayCount: 0,
          isDayCountEnable: true,
        };
      } else {
        user.dailyData.cardChance = 3;
        user.dailyData.boostCount = 3;
        user.dailyData.isDayCountEnable = true;
      }
      return user.save(); // Return the promise
    });
    await Promise.all(updatePromises); // Wait for all saves to complete
    console.log("Updated all users' dailyData successfully");
  } catch (error) {
    console.error('Error updating users:', error);
  }
});

export const getTest = async (req: Request, res: Response) => {
  res.status(200).json({ message: "GET successuly" });
};

export const getUser = async (req: Request, res: Response) => {
  const tgId = req.params.id;
  let { userName, firstName, lastName, start_param } = req.body;
  try {
    const user = await User.findOne({ tgId: tgId })
    if (user) {
      user.lastLogin = Date.now(); user.save();
      res.status(200).json(user);
    } else {
      let inviteLink = uuidv4();
      const basicSettings = await BasicSettings.findOne({});
      const inviteRevenue = 10000; // default revenue for inviting a friend
      if (start_param) { // if user is invited by owner
        const owner = await User.findOne({ inviteLink: start_param });
        if (owner) {
          User.create({
            tgId, userName, firstName, lastName,
            isInvited: true, inviteLink,
            cards: Array(30).fill(0)
          }).then(async (user: any) => {
            if (!owner.friends.includes(tgId)) {
              owner.friends.push(tgId);
              owner.points.total += inviteRevenue;
              owner.points.current += inviteRevenue;
              let friendCounts = owner.friends.length;
              let matchedCountInfo = await basicSettings.friendsRevenue.find(
                (item: any) => item.friendCount === friendCounts
              )
              if (matchedCountInfo) {
                owner.points.total += matchedCountInfo.revenue;
                owner.points.current += matchedCountInfo.revenue;
              }
              await owner.save();
              // await bot.telegram.sendMessage(
              //     owner.tgId, 
              //     `@${user.userName} has joined by your invitation! 🌱🚀Get ready for more fun together! 👥💪`, 
              // );
            }
            res.status(200).json(user);
          }).catch((err: any) => { res.json(err); });
        }
        else {
          res.status(400).json({ message: "Unauthorized Invitation Link!" });
        }
      }
      else { // if user is not invited by another user
        User.create({
          tgId, userName, firstName, lastName, inviteLink,
          cards: Array(30).fill(0)
        })
          .then((user: any) => {
            // const emitNewUserEvent = async () => {
            //     const io = getIo();
            //     io.emit('newUserRegistered', { totalCount });
            // };
            // await emitNewUserEvent();
            res.status(200).json(user);
          }).catch((err: any) => { res.json(err); });
      }
    }
  }
  catch (err) { res.json(err) };
};

export const updatePoints = async (req: Request, res: Response) => {
  let tgId = req.params.id;
  let { taps } = req.body;
  try {
    const user              = await User.findOne({ tgId: tgId });
    const basicSettings     = await BasicSettings.findOne({});
    const currentTime: Date = new Date();
    const timeSecond        = (currentTime.getTime() - user.timeManager.lastTimefarm.getTime()) / 1000;
    const energySecond      = (currentTime.getTime() - user.timeManager.lastUpdateEnergy.getTime()) / 1000;
    let newPoints = 0;
    // add points by taps;
    // Validate number of taps ---- Have to think after updating frontend
    newPoints     += taps * basicSettings.energy.tap2PointLevel[user.energy.tap2PointLvl].value;
    let time2Point = Math.floor(timeSecond / 3600 * user.points.hourInc);
    newPoints     += time2Point;
    user.timeManager.lastTimefarm = currentTime;

    let time2Energy = Math.floor(energySecond * basicSettings.energy.secondIncLevel[user.energy.secondIncLvl].value);
    user.timeManager.lastUpdateEnergy = currentTime;

    user.points.total   = user.points.total + newPoints;
    user.points.current = user.points.current + newPoints;

    user.energy.curEnergy -= newPoints;
    user.energy.curEnergy += time2Energy;
    user.energy.curEnergy  = Math.min(
      user.energy.curEnergy,
      basicSettings.energy.maxEnergyLevel[user.energy.maxLvl].value
    );
    await user.save();
    res.status(200).send(true);
  } catch (err) { res.send(err) }
}; // updated

export const energyLevelUp = async (req: Request, res: Response) => {
  let tgId = req.params.id;
  let { newMaxLvl = 0, newSecondIncLvl = 0, newTap2PointLvl = 0 } = req.body;
  try {
    const user          = await User.findOne({ tgId: tgId });
    const basicSettings = await BasicSettings.findOne({});
    if (user.energy.maxLvl <= (basicSettings.energy.maxLevel.length - 2)) {
      let fee = newMaxLvl * basicSettings.energy.maxLevel[user.energy.maxLvl].cost;
      if (user.points.current >= fee) {
        user.points.current -= fee;
        user.energy.maxLvl += newMaxLvl;
      } else { res.status(200).send(false); }
    }
    if (user.energy.secondIncLvl <= (basicSettings.energy.secondIncLevel.length - 2)) {
      let fee = newSecondIncLvl * basicSettings.energy.secondIncLevel[user.energy.secondIncLvl].cost;
      if (user.points.current >= fee) {
        user.points.current -= fee;
        user.energy.secondIncLvl += newSecondIncLvl;
      } else { res.status(200).send(false); }
    }
    if (user.energy.tap2PointLvl <= (basicSettings.energy.tap2PointLevel.length - 2)) {
      let fee = newTap2PointLvl * basicSettings.energy.tap2PointLevel[user.energy.tap2PointLvl].cost;
      if (user.points.current >= fee) {
        user.points.current -= fee;
        user.energy.tap2PointLvl += newTap2PointLvl;
      } else { res.status(200).send(false); }
    }
    user.save();
    res.status(200).send(true);
  } catch (err) { res.send(err); }
}; // updated

export const updateCard = async (req: Request, res: Response) => {
  let tgId = req.params.id;
  let { cardId } = req.body;
  try {
    const user       = await User.findOne({ tgId: tgId });
    const targetCard = await Cards.findOne({ id: cardId });
    let profit       = targetCard.info[user.cards[cardId]].hourlyIncome;
    let fee          = targetCard.info[user.cards[cardId]].nextLvlCost;
    if (user.points.current >= fee) {
      user.points.hourInc += profit;
      user.points.current -= fee;
      user.cards[cardId]++;
      await user.save();
      res.status(200).send({
        currentLevel: targetCard.info[user.cards[cardId]],
        nextLevel: targetCard.info[user.cards[cardId] + 1],
      });
    } else { res.status(200).send(false); }
  } catch (err) { res.send(err); }
}; // updated

export const updateTask = async (req: Request, res: Response) => {
  let tgId = req.params.id;
  let { taskId } = req.body;
  try {
    const user = await User.findOne({ tgId: tgId });
    let tasks  = user.tasks;
    if (!tasks.includes(taskId)) {
      user.tasks.push(taskId);
      const targetTask = await Tasks.findOne({ id: taskId });
      if (targetTask) {
        user.points.total   += targetTask.revenue.point;
        user.points.current += targetTask.revenue.point;
      } else {
        res.status(200).send(false);
      }
      await user.save();
      res.status(200).send(true);
    }
    else { res.status(200).send(false); }
  } catch (err) { res.send(err) }
}; // updated

export const updateEnergy = async (req: Request, res: Response) => {
  let tgId = req.params.id;
  let { curEnergy } = req.body;
  try {
    const user = await User.findOne({ tgId: tgId });
    user.energy.curEnergy = curEnergy;
    user.timeManager.lastUpdateEnergy = Date.now();
    await user.save();
    res.status(200).send(true);
  } catch (err) { res.send(err) }
}; // updated 

export const updateDayCount = async (req: Request, res: Response) => {
  let tgId = req.params.id;
  try {
    const user = await User.findOne({ tgId: tgId });
    if (user.dailyData.isDayCountEnable) {
      if (user.dailyData.dayCount >= 9) {
        user.dailyData.dayCount = 0;
        user.dailyData.isDayCountEnable = false;
        await user.save();
        res.status(200).send(true);
      } else {
        user.dailyData.dayCount++;
        user.dailyData.isDayCountEnable = false;
        await user.save();
        res.status(200).send(true);
      }
    } else { res.status(200).send(false) }
  } catch (err) { res.send(err) }
}; // not bad

export const updateBoostCount = async (req: Request, res: Response) => {
  let tgId = req.params.id;
  try {
    const user = await User.findOne({ tgId: tgId });
    const basicSettings = await BasicSettings.findOne({});
    if (user.dailyData.boostCount <= 0) {
      res.status(200).send(false);
    } else {
      user.dailyData.boostCount--;
      user.energy.curEnergy = basicSettings.energy.maxLevel[user.energy.maxLvl].value;
      await user.save();
      res.status(200).send(true);
    }
  } catch (err) { res.send(err) }
}; // not bad

export const updateCardReward = async (req: Request, res: Response) => {
  let tgId = req.params.id;
  let { cardpair } = req.body;
  try {
    const user = await User.findOne({ tgId: tgId });
    const dailycardpair = await DailyCardPair.find({});
    const paircards = [dailycardpair[0].cardId, dailycardpair[1].cardId, dailycardpair[2].cardId];
    if (user.dailyData.cardChance > 0) {
      user.dailyData.cardChance--;
      let matchedCards: any = [];
      for (let k = 0; k < 3; k++) {
        // console.log('ok', paircards.includes(cardpair[k]));
        if (paircards.includes(cardpair[k])) matchedCards.push(cardpair[k]);
      }
      if (matchedCards.length >= 3) {
        user.rewards.cards += 2000000;
        user.points.total += 2000000;
        user.points.current += 2000000;
        user.dailyData.cardChance = 0;
        await user.save();
        res.status(200).send(matchedCards);
      } else {
        await user.save();
        res.status(200).send(matchedCards);
      }
    } else {
      res.status(200).send(false);
    }
  } catch (err) { res.send(err) }
}; // updated

export const getData4HomePage = async (req: Request, res: Response) => {
  let tgId = req.params.id;
  const user = await User.findOne({ tgId: tgId });
  if (!user) { res.status(200).json({ error: "user not found, try with other tgId" }); }
  else {
    const basicSettings = await BasicSettings.findOne();
    const currentTIme = new Date();
    const deltaSecond = (currentTIme.getTime() - user.timeManager.lastUpdateEnergy.getTime()) / 1000; // 
    const users = await User.find({});
    users.sort((a: any, b: any) => b.points.total - a.points.total);
    for (let i = 0; i <= 100; i++) {
      if (users[i]?.tgId == user.tgId) { user.rank.points = i + 1; }
      else { user.rank.points = 100; }
    }
    let result = {
      totalPoint:       user.points.total,
      currentPoint:     user.points.current,
      profitPerHour:    user.points.hourInc,
      curEnergy:        user.energy.curEnergy,
      maxEnergy:        basicSettings.energy.maxLevel[user.energy.maxLvl].value,
      recoverSpeed:     basicSettings.energy.secondIncLevel[user.energy.secondIncLvl].value,
      multiValue:       basicSettings.energy.tap2PointLevel[user.energy.tap2PointLvl].value,
      updatedAt:        user.updatedAt,
      isDayCountEnable: user.dailyData.isDayCountEnable,
      dT:               deltaSecond,
      serverTime:       Date.now(),
    }
    res.status(200).send(result);
  }
}; // updated

export const getData4CardPage = async (req: Request, res: Response) => {
  let tgId = req.params.id;
  const user = await User.findOne({ tgId: tgId });
  if (!user) { res.status(200).json({ error: "user not found, try with other tgId" }); }
  else {
    const cards = await Cards.find({});
    let cardInfo = [{}];
    user.cards.map((level: number, index: number) => {
      cardInfo[index] = {
        title: cards[index]?.title,
        category: cards[index]?.category,
        detail: cards[index]?.info[level],
      };
    });
    let result = {
      profitPerHour:       user.points.hourInc,
      timeLeft:            Date.now(), //have to rewrite
      cardReward:          user.rewards.cards,
      dailyCardPairChance: user.dailyData.cardChance,
      cardInfo,
    }
    res.status(200).send(result);
  }
}; // updated

export const getData4TaskPage = async (req: Request, res: Response) => {
  let tgId = req.params.id;
  const user = await User.findOne({ tgId: tgId });
  if (!user) { res.status(200).json({ error: "user not found, try with other tgId" }); }
  else {
    const tasks = await Tasks.find({});
    let result = {
      taskReward:     user.rewards.tasks,
      dailyReward:    user.rewards.daily,
      completedTasks: user.tasks,
      tasks:          tasks,
    }
    res.status(200).send(result);
  }
}; // updated

export const getData4BoosterPage = async (req: Request, res: Response) => {
  let tgId = req.params.id;
  const user = await User.findOne({ tgId: tgId });
  if (!user) { res.status(200).json({ error: "user not found, try with other tgId" }); }
  else {
    const basicSettings = await BasicSettings.findOne({});
    let result = {
      fullBoosterEnergyCount: user.dailyData.boostCount,
      recoverSpeedLevel:      user.energy.secondIncLvl,
      rsNextLevelInfo:        basicSettings.energy.secondIncLevel[user.energy.secondIncLvl],
      maxEnergyLevel:         user.energy.maxLvl,
      meNextLevelInfo:        basicSettings.energy.maxLevel[user.energy.maxLvl],
      multiValueLevel:        user.energy.tap2PointLvl,
      mvNextLevelInfo:        basicSettings.energy.tap2PointLevel[user.energy.tap2PointLvl],
    }
    res.status(200).send(result);
  }
}; // updated

export const getData4FriendsPage = async (req: Request, res: Response) => {
  let tgId = req.params.id;
  const user = await User.findOne({ tgId: tgId });
  if (!user) { res.status(200).json({ error: "user not found, try with other tgId" }); }
  else {
    const users = await User.find({});
    let friendsInfo = [{}];
    users.map((friend: any) => {
      for (let i = 0; i < user.friends.length; i++) {
        if (user.friends[i] == friend.tgId) {
          friendsInfo.push({
            id:         friend.tgId,
            firstName:  friend.firstName,
            lastName:   friend.lastName,
            totalPoint: friend.points.total,
          });
        }
      }
    });
    let result = {
      inviteLink: user.inviteLink,
      friends:    friendsInfo,
    }
    res.status(200).send(result);
  }
}; // updated

export const getData4RankPage = async (req: Request, res: Response) => {
  let tgId = req.params.id;
  const userInfo = await User.findOne({ tgId: tgId });
  if (!userInfo) { res.status(200).json({ error: "user not found, try with other tgId" }); }
  else {
    const users = await User.find({}); // I think it cours error at sometime
    const users2 = users;
    let myPointRank = 100;
    let myInviteRank = 100;
    let topUsersByPoints = [{}];
    let topUsersByInvites = [{}];

    users.sort((a: any, b: any) => b.points.total - a.points.total);
    users2.sort((a: any, b: any) => b.friends.length - a.friends.length);

    for (let i = 0; i <= 100; i++) {
      if (users[i]?.tgId == userInfo.tgId) { myPointRank = i + 1; }
      if (users2[i]?.tgId == userInfo.tgId) { myInviteRank = i + 1; }
      topUsersByPoints.push({
        id: users[i]?.tgId,
        firstName: users[i]?.firstName,
        lastName: users[i]?.lastName,
        totalPoint: users[i]?.points.total,
      });
      topUsersByInvites.push({
        id: users2[i]?.tgId,
        firstName: users2[i]?.firstName,
        lastName: users2[i]?.lastName,
        totalInvites: users2[i]?.friends.length,
      });
    }
    let result = {
      myPoint: userInfo.points.total,
      myInvites: userInfo.friends.length,
      myPointRank: myPointRank,
      myInviteRank: myInviteRank,
      topUsersByPoints: topUsersByPoints,
      topUsersByInvites: topUsersByInvites,
    }
    res.status(200).send(result);
  }
}; // updated

export const getData4RewardsPage = async (req: Request, res: Response) => {
  let tgId = req.params.id;
  const user = await User.findOne({ tgId: tgId });
  if (!user) { res.status(200).json({ error: "user not found, try with other tgId" }); }
  else {
    let result = {
      currentPoint: user.points.current,
      currentCoin:  user.curCoin,
    }
    res.status(200).send(result);
  }
};

export const getData4DailyRewardPage = async (req: Request, res: Response) => {
  let tgId = req.params.id;
  const user = await User.findOne({ tgId: tgId });
  if (!user) { res.status(200).json({ error: "user not found, try with other tgId" }); }
  else {
    const currentDate = new Date();
    let result = {
      dayCount: user.dailyData.dayCount,
      isDayCountEnable: user.dailyData.isDayCountEnable,
      currentDate: currentDate,
    }
    res.status(200).send(result);
  }
};