const mongoose = require("mongoose");
const { Schema } = mongoose;

const categorySchema = mongoose.Schema({
  label: { type: String, required: [false], unique: true },
  value: { type: String, required: [false], unique: true },
});

const virtual = categorySchema.virtual("id");
virtual.get(() => {
  this._id;
});
categorySchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.Category = mongoose.model("Category", categorySchema);
