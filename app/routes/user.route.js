module.exports = (app) => {
  const route = require("express").Router();
  const auth = require("../controllers/authController");
  route.post("/register", auth.register);

  app.use("/api", route);
};
