var mongoose   = require("mongoose"),
    Schema     = mongoose.Schema;
var CardSchema = new Schema(
  {
    id: { type: Number, required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    info: [{
     lvl:          { type: Number, required: true },
     hourlyIncome: { type: Number, default: 0 },
     nextLvlCost:  { type: Number, default: 1000 },
    }],
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Cards",
  CardSchema,
  "cards"
);