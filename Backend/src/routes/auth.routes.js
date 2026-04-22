const express = require('express');
const authRouter = express.Router();
const {
  register,
  login,
  logout,
  deleteProfile
} = require('../controllers/auth.controller');
const auth = require('../middlewares/auth.middleware');

//Public
authRouter.post('/register', register);
authRouter.post('/login', login);

//Protected
authRouter.post('/logout', auth, logout);
authRouter.post('/profile', auth, deleteProfile);

module.exports = authRouter;
