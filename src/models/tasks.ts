var mongoose   = require("mongoose"),
    Schema     = mongoose.Schema;
var TaskSchema = new Schema(
  {
    id: { type: Number, required: true },
    title: { type: String, required: true },
    category: { type: String, default: "" },
    content: { type: String, default: "" },
    image: { type: String, default: "" },
    link: { type: String, default: "" },
    revenue: {
     point: { type: Number, default: 5000 },
     coin:  { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Tasks",
  TaskSchema,
  "tasks"
);