const { Category } = require("../model/Category");

exports.fetchCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).exec();
    res.status(200).send(brands);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.createCategory = async (req, res) => {
  const categories = new Category(req.body);
  try {
    const category = await categories.save();
    res.status(200).send(category);
  } catch (error) {
    res.status(400).send(error);
  }
};
