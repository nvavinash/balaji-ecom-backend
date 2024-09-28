require("dotenv").config();
const express = require("express");
const server = express();
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const cookieParser = require("cookie-parser");
const productRouters = require("./routes/Product");
const categoriesRouters = require("./routes/Category");
const brandsRouters = require("./routes/Brands");
const userRouter = require("./routes/User");
const authRouter = require("./routes/Auth");
const cartRouter = require("./routes/Cart");
const ordersRouter = require("./routes/Order");
const { User } = require("./model/User");
const { isAuth, sanitizeUser, cookieExtractor } = require("./services/common");
const path = require('path');
console.log(process.env)


// Webhook

// TODO: we will capture actual order after deploying out server live on public URL

const endpointSecret = process.env.ENDPOINT_SECRET;

server.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object;
      console.log({paymentIntentSucceeded})
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});


// JWT options
const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.JWT_SECRET_KEY; // TODO: should not be in code;



//middlewares
server.use(express.static(path.resolve(__dirname,'build')))
server.use(cookieParser());
server.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
  })
);



server.use(passport.authenticate("session"));
server.use(cors());
// server.use(express.raw({ type: "application/json" }));
server.use(express.json());//to parse req.body
server.use((req, res, next) => {
  console.log('Cookies:', req.cookies);  // Log all cookies in the request
  next();
});


server.use("/auth", authRouter.router);
server.use("/products", isAuth(), productRouters.router);
server.use("/categories", isAuth(), categoriesRouters.router);
server.use("/brands", isAuth(), brandsRouters.router);
server.use("/users", isAuth(), userRouter.router);

server.use("/cart", isAuth(), cartRouter.router);
server.use("/orders", isAuth(), ordersRouter.router);

//Passport Strategies
passport.use(
  "local",
  new LocalStrategy({ usernameField: "email" }, async function (
    email,
    password,
    done
  ) {
    // by default passport uses username
    try {
      const user = await User.findOne({ email: email });
      console.log(email, password, user);
      if (!user) {
        return done(null, false, { message: "invalid credentials" }); // for safety
      }
      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        "sha256",
        async function (err, hashedPassword) {
          if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
            return done(null, false, { message: "invalid credentials" });
          }
          const token = jwt.sign(sanitizeUser(user), process.env.JWT_SECRET_KEY);
          done(null, {id: user.id, role: user.role, token}); // this lines sends to serializer
        }
      );
    } catch (err) {
      done(err);
    }
  })
);

//jwt Strategy starts here
passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    console.log("jwtPayload" ,{ jwt_payload });
    try {
      const user = await User.findById(jwt_payload.id);
      console.log(jwt_payload)
      if (user) {
        return done(null, sanitizeUser(user)); // this calls serializer
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

// this creates session variable req.user on being called from callbacks
passport.serializeUser(function (user, cb) {
  console.log("serialize", user);
  process.nextTick(function () {
    return cb(null, { id: user.id, role: user.role });
  });
});

// this changes session variable req.user when called from authorized request

passport.deserializeUser(function (user, cb) {
  console.log("de-serialize", user);
  process.nextTick(function () {
    return cb(null, user);
  });
});

//payment Stripe

const stripe = require("stripe")(
process.env.STRIPE_SERVER_KEY
);

// const calculateOrderAmount = (items) => {
// Calculate the order total on the server to prevent
// people from directly manipulating the amount on the client
//   return 1400;
// };

server.post("/create-payment-intent", async (req, res) => {
  const { totalAmount,orderId } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    // amount: calculateOrderAmount(items),
    amount: totalAmount * 100, // for decimal
    currency: "inr",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
    // [DEV]: For demo purposes only, you should avoid exposing the PaymentIntent ID in the client-side code.
    dpmCheckerLink: `https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${paymentIntent.id}`,
  });
});



//Connetion to DB---------------------------------------------------------->
const connectToDB = async () => {
  try {
    await mongoose.connect(
     process.env.MONGODB_URL
    ); // Fix the connection string
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};
connectToDB().catch((err) => console.err(err));

server.get("/", (req, res) => {
  res.json({ status: "success" });
});

connectToDB().then(() => {
  server.listen(process.env.PORT, () => {
    console.log("yep Server Started ..");
  });
});
