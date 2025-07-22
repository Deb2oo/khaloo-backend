const mongoose = require("mongoose");
require("dotenv").config(); // Load env variables

const mongoURI = process.env.MONGO_URI;

const mongoDB = async () => {
  try {
    await mongoose.connect(mongoURI);

    console.log("MongoDB connected successfully");

    const fetched_data = mongoose.connection.db.collection("food_items");
    const data = await fetched_data.find({}).toArray();
    const foodCategory = mongoose.connection.db.collection("food_category");
    const foodCategoryData = await foodCategory.find({}).toArray();

    global.food_items = data;
    global.food_category = foodCategoryData;
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
};

module.exports = mongoDB;
