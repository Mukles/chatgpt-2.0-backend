const jwt = require("jsonwebtoken");
const { accesTokenSecret } = require("../config");

const generateToken = (user) => {
  return jwt.sign(user, accesTokenSecret, {
    expiresIn: "10h",
  });
};

module.exports = generateToken;
