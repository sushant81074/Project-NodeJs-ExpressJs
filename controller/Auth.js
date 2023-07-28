const passport = require("passport");
const { User } = require("../model/User");
const SECRET_KEY = "SECRET_KEY";
const jwt = require("jsonwebtoken");
// const jsonwebtoken = require("jsonwebtoken");
const crypto = require("crypto");
const { sanitizer } = require("../services/common");
exports.createUser = async (req, res) => {
  try {
    const salt = crypto.randomBytes(16).toString("hex");
    crypto.pbkdf2(
      req.body.password,
      salt,
      10000,
      32,
      "sha256",
      async function (error, hashedPassword) {
        const user = new User({ ...req.body, password: hashedPassword, salt });
        const doc = await user.save();
        req.login(sanitizer(doc), (err) => {
          if (err) {
            res.status(400).send(err);
          } else {
            var token = jwt.sign(sanitizer(doc), SECRET_KEY);
            res
              .cookie("jwt", token, {
                expires: new Date(Date.now() + 3600000),
                httpOnly: true,
              })
              .send({ id: doc.id, role: doc.role });
          }
        });
      }
    );
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.loginUser = async (req, res) => {
  res
    .cookie("jwt", req.user.token, {
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    })
    .send(req.user.token);
};

exports.checkAuth = async (req, res) => {
  const { username, password } = req.body;
  if (res.user) {
    res.status(200).send({ username, password });
  } else {
    res.status(400).send({ message: "checkAuth failed " });
  }
};
