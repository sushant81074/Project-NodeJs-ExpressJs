const { Cart } = require("../model/Cart");

exports.fetchCartByUser = async (req, res) => {
  const { id } = req.user;
  try {
    const cart = await Cart.find({ user: id })
      .populate("user")
      .populate("product");
    res.status(200).send(cart);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.addToCart = async (req, res) => {
  const { id } = req.user;
  const cart = new Cart({ ...req.body, user: id });
  try {
    const doc = await cart.save();
    const result = doc.populate("product");
    res.status(200).send(result);
    console.log("brand created");
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deleteFromCart = async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await Cart.findByIdAndDelete(id);
    res.status(200).send(doc);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.updateCart = async (req, res) => {
  const { id } = req.params;
  try {
    const cart = await Cart.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    const result = cart.populate("product");
    res.status(201).send(result);
  } catch (error) {
    res.status(400).send(error);
  }
};
