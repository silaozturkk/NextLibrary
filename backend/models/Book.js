const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Başlık gerekli'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Yazar gerekli'],
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      default: '',
    },
    isbn: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    coverImage: {
      type: String,
      default: '',
    },
    totalCopies: {
      type: Number,
      required: true,
      min: [0, 'Negatif olamaz'],
      default: 1,
    },
    availableCopies: {
      type: Number,
      required: true,
      min: [0, 'Negatif olamaz'],
      default: 1,
    },
  },
  { timestamps: true },
);

bookSchema.index({ title: 'text', author: 'text', category: 'text' });

module.exports = mongoose.model('Book', bookSchema);
