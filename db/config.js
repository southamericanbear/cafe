const mongoose = require("mongoose");
const uri = process.env.MONGO_CNN;

const dbConnection = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB is online");
  } catch (error) {
    console.log(error);
    throw new Error("Error in the db ignite");
  }
};

module.exports = dbConnection;
