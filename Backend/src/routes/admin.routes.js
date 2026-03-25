const express = require('express');
const adminRouter = express.Router();
const { adminRegister } = require('../controllers/auth.controller');
const auth = require('../middlewares/auth.middleware');
const authorizeRole = require('../middlewares/authorizeRole.middleware');

adminRouter.use(auth);
adminRouter.use(authorizeRole('admin'));

// create another admin
adminRouter.post('/create-admin', adminRegister);

module.exports = adminRouter;
