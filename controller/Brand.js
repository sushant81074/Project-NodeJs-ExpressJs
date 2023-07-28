const { Brand } = require("../model/Brand");

exports.fetchAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find({}).exec();
    res.status(200).send(brands);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.createBrand = async (req, res) => {
  const brand = new Brand(req.body);
  try {
    const brands = await Brand.find({}).exec();
    res.status(200).send(brand);
    console.log("brand created");
  } catch (error) {
    res.status(400).send(error);
  }
};

// watch this section again
