const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Connecting to Mongo...");
    console.log(process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB Connected");
  } catch (err) {
    console.error("Mongo Error:");
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;