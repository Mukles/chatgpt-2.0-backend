const mongoose = require("mongoose");
const { port, mongoUri, clientUrl } = require("./config");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoute = require("./routes/user");
const gptRoute = require("./routes/chatGpt");
const app = express();
const corsOptions = {
  origin: [clientUrl, "http://localhost:3000"],
  methods: "GET,POST,PUT,DELETE, PATCH",
  credentials: true,
};

app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, "uploads")));

async function main() {
  mongoose.set("strictQuery", false);
  await mongoose.connect(mongoUri);
}

app.get("/hello", (req, res) => {
  res.status(200).send(<h1>Hello booss</h1>);
});

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
