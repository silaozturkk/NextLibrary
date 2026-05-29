const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'İsim gerekli'],
      trim: true,
      maxlength: [100, 'İsim en fazla 100 karakter olabilir'],
    },
    email: {
      type: String,
      required: [true, 'Email gerekli'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Geçerli bir email girin'],
    },
    subject: {
      type: String,
      required: [true, 'Konu gerekli'],
      trim: true,
      maxlength: [200, 'Konu en fazla 200 karakter olabilir'],
    },
    message: {
      type: String,
      required: [true, 'Mesaj gerekli'],
      trim: true,
      minlength: [10, 'Mesaj en az 10 karakter olmalı'],
      maxlength: [2000, 'Mesaj en fazla 2000 karakter olabilir'],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Message', messageSchema);
