var mongoose    = require("mongoose"),
    Schema      = mongoose.Schema;
var AdminSchema = new Schema(
  {
    id: { type: Number, required: true },
    userName: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Admins",
  AdminSchema,
  "admins"
);