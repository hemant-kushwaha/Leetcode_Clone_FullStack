const express = require("express");
const authRouter = express.Router();
const {register,login,logout,adminRegister} = require('../controllers/auth.controller');
const auth = require('../middlewares/auth.middleware')

//Public
authRouter.post("/register", register);
authRouter.post("/login", login);

//Protected
authRouter.post("/logout",auth,logout);

module.exports =authRouter;
