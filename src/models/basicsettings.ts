var mongoose           = require("mongoose"),
    Schema             = mongoose.Schema;
var BasicSettingSchema = new Schema(
  {
    dailyRevenue: [{
      dayCount: { type: Number, required: true },
      revenue:  { type: Number, required: true },
     }],
     friendsRevenue: [{
      friendCount: { type: Number, required: true },
      revenue: { type: Number, required: true },
     }],
     energy: {
      maxLevel: [{ 
          value: { type: Number, default: 500 },
          cost:  { type: Number, default: 1000 },
       }],
      secondIncLevel: [{ 
          value: { type: Number, default: 1 },
          cost:  { type: Number, default: 1000 },
       }],
      tap2PointLevel: [{ 
          value: { type: Number, default: 1 },
          cost:  { type: Number, default: 1000 },
       }],
     },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "BasicSettings",
  BasicSettingSchema,
  "basicsettings"
);