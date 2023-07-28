const { Order } = require("../model/Order");

exports.fetchOrderByUser = async (req, res) => {
  const { id } = req.user;
  try {
    const orders = await Order.find({ user: id });
    res.status(200).send(orders);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.createOrder = async (req, res) => {
  const order = new Order(req.body);
  try {
    const doc = await order.save();
    res.status(200).send(result);
    console.log("order created");
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deleteFromOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await Order.findByIdAndDelete(id);
    res.status(200).send(doc);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(201).send(order);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.fetchAllOrders = async (req, res) => {
  let condition = {};
  if (!req.query.admin) {
    condition.deleted = { $ne: true };
  }

  let query = Order.find(condition);

  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }
  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const page = req.query._page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  try {
    const docs = await query.exec();
    res.status(200).json(docs);
  } catch (error) {
    res.status(400).send(error);
  }
};
