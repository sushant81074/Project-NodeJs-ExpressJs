const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const crypto = require("crypto");
var jwt = require("jsonwebtoken");

const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local").Strategy;
const productsRouter = require("./routes/products");
const categoriesRouter = require("./routes/Category");
const brandsRouter = require("./routes/Brand");
const userRouter = require("./routes/User");
const authRouter = require("./routes/Auth");
const cartRouter = require("./routes/Cart");
const orderRouter = require("./routes/Order");
const { User } = require("./model/User");
const { isAuth, sanitizer } = require("./services/common");

const cors = require("cors");
const server = express();

const PORT = 5000;

const SECRET_KEY = "SECRET_KEY";
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "SECRET_KEY";

const mongo = async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/ecommerce");
  console.log("connected to database");
};

mongo().catch((e) => console.log(e));

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cors());
server.use(
  session({
    secret: "keyboard cat",
    resave: "",
    saveUninitialized: "",
  })
);
server.use(passport.authenticate("session"));
passport.use(
  "local",
  new LocalStrategy({ usernameField: "email" }, async function (
    email,
    password,
    done
  ) {
    try {
      const user = await User.findOne({ email: email }, "id name email").exec();
      if (!user) {
        done(null, false, { message: "invalid credentials" });
      }
      crypto.pbkdf2(
        password,
        user.salt,
        10000,
        32,
        "sha256",
        async function (error, hashedPassword) {
          if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
            done(null, false, { message: "invalid credentials" });
          }
          var token = jwt.sign(sanitizer(user), SECRET_KEY);
          done(null, { id: user.id, role: user.role });
        }
      );

      // res.status(200).send(user);
    } catch (error) {
      done(error);
    }
  })
);

passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const user = User.findById(jwt_payload.id);
      if (user) {
        return done(null, sanitizer(user));
      } else {
        return done(null, false);
        // or you could create a new account
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, { id: user.id, role: user.role });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

const stripe = require("stripe")("my_developer_stripe_key");

server.use(express.static("public"));
server.use(express.json());

const calculateOrderAmount = (items) => {
  return 1400;
};

server.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

// app.listen(4242, () => console.log("Node server listening on port 4242!"));
server.get("/", (req, res) => {
  res.send({ message: "Home Page" });
});
server.use("/products", isAuth(), productsRouter.router);
server.use("/categories", isAuth(), categoriesRouter.router);
server.use("/brands", isAuth(), brandsRouter.router);
server.use("/users", isAuth(), userRouter.router);
server.use("/auth", authRouter.router);
server.use("/cart", isAuth(), cartRouter.router);
server.use("/orders", isAuth(), orderRouter.router);

server.listen(PORT, () => {
  console.log(`server is running on port number : ${PORT}`);
});
