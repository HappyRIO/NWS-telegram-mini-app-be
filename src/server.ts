import app from './app';
import bot from './bot';
import { PORT, DB } from './config';

var Admins        = require("./models/admins");
var BasicSettings = require("./models/basicsettings");
var Cards         = require("./models/cards");
var DailyCardPair = require("./models/dailycardpair");
var Tasks         = require("./models/tasks");
var User          = require("./models/user");
var Constants     = require("./config/constants");

require("mongoose").connect(DB)
  .then(() => {
    console.log("MongoDB Connected!");
    initDB();
  })

bot.launch()
  .then(() => console.log('Bot started'))
  .catch(err => console.error('Error starting bot:', err));

app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});

async function initDB() {
  try {
    let admins        = await Admins.findOne({}),
        basicsettings = await BasicSettings.findOne({}),
        cards         = await Cards.findOne({}),
        dailycardpair = await DailyCardPair.findOne({}),
        tasks         = await Tasks.findOne({});
        // users         = await User.find({});

    if(!admins) {
      Constants.admins.map(async (admin: Object) => {
        await new Admins(admin).save();
      });
      console.log("📘: Admins registered")
    } else { console.log("✅: Admins already exists!"); }

    if(!basicsettings) {
      const basicsettings = new BasicSettings({
        dailyRevenue:    Constants.dailyRevenue,
        friendsRevenue: Constants.friendsRevenue,
        energy:         Constants.energy,
      });
      await basicsettings.save().then(console.log("📘: BasicSettings registered"));
    } else { console.log("✅: BasicSettings already exists!"); }

    if(!cards) {
      Constants.cardList.map(async (card: Object) => {
        await new Cards(card).save();
      });
      console.log("📘: Cards registered");
    } else { console.log("✅: cards already exists!"); }

    if(!dailycardpair) {
      let myCards = [
        { id: 0, cardId: 6 },
        { id: 1, cardId: 3 },
        { id: 2, cardId: 9 },
      ];
      myCards.map(async (card: Object) => {
        await new DailyCardPair(card).save();
      });
      console.log("📘: DailyCardPiar registered");
    } else { console.log("✅: DailyCardPair already exists!"); }

    if(!tasks) {
      Constants.taskList.map(async (task: Object) => {
        await new Tasks(task).save();
      });
      console.log("📘: Tasks registered");
    } else { console.log("✅: Tasks already exists!") }
    console.log("🎉: Successfuly initciated all settings!");



  } catch (err) {
    console.log( "🥶: Error ensuring default Setting", err );
  }
}