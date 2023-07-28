const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: Buffer, required: true },
  role: { type: String, required: true, default: "user" },
  address: { type: [Schema.Types.Mixed] },
  name: { type: String },
  salt: Buffer,
});

const virtual = userSchema.virtual("id");
virtual.get(() => {
  this._id;
});
userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.User = mongoose.model("User", userSchema);
