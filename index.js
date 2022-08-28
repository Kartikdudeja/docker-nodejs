const express = require('express');
const mongoose = require('mongoose');
const session = require("express-session");
const redis = require("redis");
const cors = require("cors");

let RedisStore = require("connect-redis")(session);

const { MONGO_IP, MONGO_PORT, MONGO_USERNAME, MONGO_PASSWORD, EXPRESS_PORT, REDIS_URL, REDIS_PORT, SESSION_SECRET } = require("./config/config");

let redisClient = redis.createClient({
    host: REDIS_URL,
    port: REDIS_PORT,
  });

const app = express();
const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");

const mongoURL = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () => {
    mongoose
    .connect(mongoURL)
    .then(() => console.log("successfully connected to mongo db"))
    .catch((err) => {
        console.log(err)
        setTimeout(connectWithRetry, 5000)
    });
}

connectWithRetry();

// Check for PORT variable in environment variable and if not defined use the value 3000
// const port = process.env.PORT || 3000;
const port = EXPRESS_PORT;

app.enable("trust proxy");
app.use(cors())

// Redis Session Store
app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: SESSION_SECRET,
      cookie: {
        secure: false,
        resave: false,
        saveUninitialized: false,
        httpOnly: true,
        maxAge: 30000,
      },
    })
);

app.listen(port, () => console.log(`listening on port ${port}`));
app.use(express.json());

app.get('/api/v1', (req, res) => {
  res.send("<h2>Hi There</h2>");
  console.log("hit received on default path")
});

app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);
