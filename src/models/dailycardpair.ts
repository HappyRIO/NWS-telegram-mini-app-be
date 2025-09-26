var mongoose            = require("mongoose"),
    Schema              = mongoose.Schema;
var DailyCardPairSchema = new Schema(
  {
    id: { type: Number, required: true },
    cardId: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "DailyCardPair",
  DailyCardPairSchema,
  "dailycardpair"
);