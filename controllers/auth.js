const bcryptjs = require("bcryptjs");
const { response, request } = require("express");
const { DefaultTransporter } = require("google-auth-library");
const User = require("../models/User");
const generateJWT = require("../utils/generate-jwt");
const googleVerify = require("../utils/google-verify");

const login = async (req = request, res = response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    const isActive = await user.state;
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!isActive) {
      return res.status(400).json({ msg: "Email is incorrect" });
    }
    if (!validPassword) {
      return res.status(400).json({ msg: "Password is incorrect" });
    }

    const token = await generateJWT(user.id);

    res.status(200).json({
      msg: "User successfully loged in",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "An error occurred, please call the admin",
    });
  }
};

const googleSignIn = async (req = request, res = response) => {
  const { id_token } = req.body;

  try {
    const { email, name, picture } = await googleVerify(id_token);

    let user = await User.findOne({ email });

    if (!user) {
      const data = {
        name,
        email,
        password: ":p",
        img: picture,
        rol: "USER_ROLE",
        google: true,
      };

      user = new User(data);

      await user.save();

      if (!user.state) {
        return res.status(401).json({
          msg: "talk with the admin, the user is bloqued",
        });
      }
    }

    const token = await generateJWT(user.id);

    res.status(200).json({
      msg: "todo ok",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: false,
      msg: "Bad request, cant verify token",
    });
  }
};

module.exports = { login, googleSignIn };
