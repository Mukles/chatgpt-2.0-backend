const mongoose = require("mongoose");
const { port, mongoUri } = require("./config");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoute = require("./routes/user");
const gptRoute = require("./routes/chatGpt");
const app = express();
const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,POST,PUT,DELETE, PATCH",
  credentials: true,
};

app.use(bodyParser.json());
app.use(cors(corsOptions));

async function main() {
  mongoose.set("strictQuery", false);
  await mongoose.connect(mongoUri);
}

//user rotues
app.use("/api/user", userRoute);

//Chat-gpt
app.use("/api/gpt", gptRoute);

//DEFAULT ERROR HANDLER
app.use((err, req, res, next) => {
  res.status(500).json({ message: err?.message || "Something went wrong!" });
});

main()
  .then(() => app.listen(port, () => console.log("server responsed " + port)))
  .catch((err) => console.log(err));