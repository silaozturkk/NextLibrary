const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Yeni kullanıcı kaydı
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Tüm alanlar zorunlu');
  }

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error('Bu email zaten kayıtlı');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role === 'admin' ? 'admin' : 'user',
  });

  res.status(201).json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token: generateToken(user._id),
  });
});

// @desc    Kullanıcı girişi
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email ve şifre gerekli');
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Email veya şifre hatalı');
  }

  res.json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token: generateToken(user._id),
  });
});

// @desc    Mevcut kullanıcı profili
// @route   GET /api/auth/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

module.exports = { registerUser, loginUser, getProfile };
