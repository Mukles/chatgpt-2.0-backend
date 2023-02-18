const mongoose = require("mongoose");
const { mongoUri } = require("../middleware/coonect");

const connection = async (req, res) => {
  try {
    await mongoose.connect(mongoUri);
  } catch (error) {
    console.log({ error });
  }
};

module.exports = connection;
