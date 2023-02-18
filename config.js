require("dotenv").config();
const key = process.env.OPENAI_API_KEY;
const port = process.env.PORT;
const mongoUri = process.env.MONGO_URL;
const accesTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

module.exports = { key, port, mongoUri, accesTokenSecret, refreshTokenSecret };
