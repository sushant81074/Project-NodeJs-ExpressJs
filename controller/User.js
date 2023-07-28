const { User } = require("../model/User");

exports.fetchUserById = async (req, res) => {
  const { id } = req.user;
  try {
    const user = await User.findById(id, "name email id").exec();
    res
      .status(200)
      .send({
        id: user.id,
        address: user.address,
        email: user.email,
        role: user.role,
      });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};
