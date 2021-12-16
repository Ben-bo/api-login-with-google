const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
const db = {
  mongoose: mongoose,
  URL: "mongodb://localhost:27017/rest-mongodb",
  users: require("./user.model")(mongoose),
};
module.exports = db;
