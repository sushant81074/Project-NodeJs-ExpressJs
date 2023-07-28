const mongoose = require("mongoose");
const { Schema } = mongoose;

const brandSchema = mongoose.Schema({
  label: { type: String, required: [false], unique: true },
  value: { type: String, required: [false], unique: true },
});

const virtual = brandSchema.virtual("id");
virtual.get(() => {
  this._id;
});
brandSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.Brand = mongoose.model("Brand", brandSchema);
