const User = require('../models/User.model');
const userValidator = require('../validators/user.validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { redisClient } = require('../config/redis.config');
const Submission = require('../models/Submission.model');

//Only User Registration
const register = async (req, res) => {
  try {
    userValidator(req.body);

    const { firstName, emailId, password } = req.body;

    const userExist = await User.exists({ emailId });
    if (userExist)
      throw new Error('User Already Registered with this email ID');

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      emailId,
      password: hashedPassword,
      role: 'user'
    });

    const token = jwt.sign(
      { _id: user._id, emailId: emailId, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: 60 * 60 }
    ); //Second

    res.cookie('token', token, { maxAge: 60 * 60 * 1000 }); // MilliSeconds
    res.status(201).send({
      success: true,
      message: 'User created successfully'
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message
    });
  }
};

//Only Admin Registration
const adminRegister = async (req, res) => {
  try {
    if (req.user.role != 'admin') throw new Error('Forbidden Access');

    const { firstName, emailId, password, role } = req.body;

    const userExist = await User.exists({ emailId });
    if (userExist)
      throw new Error(`${role} Already Registered with this email ID`);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      emailId,
      password: hashedPassword,
      role
    });

    const token = jwt.sign(
      { _id: user._id, emailId: emailId, role: role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: 60 * 60 }
    ); //Second

    res.cookie('token', token, { maxAge: 60 * 60 * 1000 }); // MilliSeconds
    res.status(201).send({
      success: true,
      message: `${role} created successfully`
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId) throw new Error('Invald Crendentials');
    if (!password) throw new Error('Invald Crendentials');

    const user = await User.findOne({ emailId });

    const match = await bcrypt.compare(password, user.password);

    if (!match) throw new Error('Invald Crendentials');

    const token = jwt.sign(
      { _id: user._id, emailId: emailId, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: 60 * 60 }
    ); //Second

    res.cookie('token', token, { maxAge: 60 * 60 * 1000 });
    res.status(200).send({
      success: true,
      message: 'Logged In Successfully'
    });
  } catch (error) {
    res.status(401).send({
      //Unauthorized Access
      success: false,
      message: error.message
    });
  }
};

const logout = async (req, res) => {
  try {
    const { token } = req.cookies;
    const payload = jwt.decode(token);

    // Store token and set expiry in Redis
    await redisClient.set(`token:${token}`, 'Blocked');
    await redisClient.expireAt(`token:${token}`, payload.exp);

    res.clearCookie('token');

    res.status(200).send({
      success: true,
      message: 'Logged Out Successfully'
    });
  } catch (error) {
    res.status(503).send({
      //Service unavailable
      success: false,
      message: error.message
    });
  }
};

const deleteProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    //userSchema delete
    await User.findByIdAndDelete(userId);

    //Submission delete
    // await Submission.deleteMany({ userId }); --> Handled Directly in userSchema

    res.status(200).send('User Deleted SuccessFully');
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message
    });
  }
};

module.exports = { register, adminRegister, login, logout, deleteProfile };
