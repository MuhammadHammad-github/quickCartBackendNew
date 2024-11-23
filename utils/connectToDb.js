const mongoose = require("mongoose");
const mongoUri = process.env.MONGO_URI;
const connectToDb = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log("Database connected!");
  } catch (error) {
    console.error(error);
    console.log(error.message);
    throw new Error(error.message);
  }
};
module.exports = connectToDb;
