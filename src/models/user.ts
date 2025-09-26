var mongoose   = require("mongoose"),
    Schema     = mongoose.Schema;
var UserSchema = new Schema(
  {
    tgId: { type: String, required: [true, "Insert Tg Id."], },
    userName:  { type: String, default: "", },
    firstName: { type: String, default: "", },
    lastName:  { type: String, default: "", },
    points:{
      total:   { type: Number, default: 0.00, },
      current: { type: Number, default: 0.00, },
      hourInc: { type: Number, default: 0, },
    },
    curCoin: { type: Number, default: 0.00, },
    rewards: { 
      cards: { type: Number, default: 0.00, },
      tasks: { type: Number, default: 0.00, },
      daily: { type: Number, default: 0.00, },
    },
    energy: {
      maxLvl:       { type: Number, default: 0, },
      secondIncLvl: { type: Number, default: 0, },
      tap2PointLvl: { type: Number, default: 0, },
      curEnergy:    { type: Number, default: 200, },
    },
    dailyData: { 
      cardChance: { type: Number, default: 3 },
      boostCount: { type: Number, default: 3 },
      dayCount:   { type: Number, default: 0 },
      isDayCountEnable:   { type: Boolean, default: true },
    },  // daily updated automatically
    timeManager: {
      lastTimefarm: { type: Date, default: Date.now(), },
      lastUpdateEnergy: { type: Date, default: Date.now(), },
      lastLogin: { type: Date, default: Date.now(), },
    },
    inviteLink: { type: String, default: "", },
    isInvited: { type: Boolean, default: false },
    friends: [{ type: String, required: true }],
    tasks: [{ type: Number, required: true }],
    cards: [{ type: Number, default: 0 }], // card level
    rank: {
      points: { type: Number, default: 99 },
      friends: { type: Number, default: 99 }
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "User",
  UserSchema,
  "users"
);