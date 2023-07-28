const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = mongoose.Schema({
  title: { type: String, required: [false], unique: true },
  discription: { type: String, required: [false] },
  price: {
    type: Number,
    min: [0, "wrong min price"],
    max: [100000, "wrong max price"],
  },
  discountPercentage: {
    type: Number,
    min: [1, "wrong min discount"],
    max: [99, "wrong max discount"],
  },
  rating: {
    type: Number,
    min: [0, "wrong min rating"],
    max: [5, "wrong max rating"],
    default: 0,
  },
  stock: {
    type: Number,
    min: [0, "wrong min stock"],
    default: 0,
  },
  brand: { type: String, required: [false] },
  category: { type: String, required: [false] },
  thumbnail: { type: String, required: [false] },
  images: { type: [String], required: [false] },
  deleted: { type: Boolean, default: false },
});

const virtual = productSchema.virtual("id");
virtual.get(() => {
  this._id;
});
productSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.Product = mongoose.model("Product", productSchema);
