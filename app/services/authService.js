const model = require("../models");
const userModel = model.users;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authService = {
  findByUsername: async (email) => {
    return await userModel.findOne({ email: email }).exec();
  },

  createService: async (userDetails) => {
    try {
      const saltRounds = 10;
      const salt = await bcrypt.genSaltSync(saltRounds);
      const hashedPassword = await bcrypt.hashSync(userDetails.password, salt); //ecnrypt password
      const isUserExist = await authService.findByUsername(userDetails.email); //cek data user
      let error = null;
      let result = {};

      if (!isUserExist) {
        const data = {
          email: userDetails.email,
          nama: userDetails.nama,
          password: hashedPassword,
        };
        const postData = new userModel(data);
        const saveData = await postData.save();
        result = saveData;
      } else {
        error = "user Alredy exist";
      }

      return {
        data: result,
        error,
      };
    } catch (error) {
      console.log(error);
      return error;
    }
  },

  loginService: async (userDetails) => {
    try {
      let error = null;
      let result = {};
      const isUserExist = await authService.findByUsername(
        userDetails.username
      );

      if (!isUserExist) {
        error = "user not registered";
        return {
          data: {},
          error,
        };
      }
      const isSamePassword = await bcrypt.compareSync(
        userDetails.password,
        isUserExist.dataValues.password
      );
      if (!isSamePassword) {
        error = "incorrect password";
        return {
          data: {},
          error,
        };
      }
      result = await jwt.sign(isUserExist.dataValues, "secret_key"); //buat token(identitas) dari data user(database)
      return {
        data: result,
        error,
      };
    } catch (error) {
      console.log(error);
      return error;
    }
  },
};
module.exports = authService;
