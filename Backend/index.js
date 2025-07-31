const express = require("express");
const dotenv = require("dotenv");
const logger = require("./utils/logger.js");
const rateLimit = require("./middlewares/rateLimiter.js");
const cookieParser = require("cookie-parser");
const DB_connect = require("./Database/DB_connect.js");

const userRoute = require("./routes/user.routes.js");
const sessionRoute = require("./routes/session.routes.js");

// cors
const cors = require("cors");

// dotenv configuration
dotenv.config({
  path: "./.env",
});

console.log("I am here ");

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URI,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

DB_connect();

// rate limiting
app.use(rateLimit);

const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Server is ready to listen");
});

app.use("/api/v1", userRoute);
app.use("/api/v1", sessionRoute);

console.log("I am here ");

app.listen(PORT, () => {
  logger.info("Server started on port " + 3000);
});
