const { Product } = require("../model/product");

exports.createProduct = async (req, res) => {
  const product = new Product(req.body);
  const response = await product.save();
  console.log(response);
  try {
    res.status(201).send(response);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.fetchAllProducts = async (req, res) => {
  let query = Product.find({ deleted: { $ne: true } });
  if (req.query.category) {
    query = query.find({ category: req.query.category });
  }
  if (req.query.brand) {
    query = query.find({ brand: req.query.brand });
  }
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

exports.fetchProductsById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    res.status(200).send(product);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(201).send(product);
  } catch (error) {
    res.status(400).send(error);
  }
};
