const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Ürün adı zorunludur.'],
    trim: true,
  },
  brand: {
    type: String,
    required: [true, 'Marka adı zorunludur.'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Fiyat zorunludur.'],
    min: [0, 'Fiyat negatif olamaz.'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageUrl: {
    type: String,
    required: [true, 'Resim URL\'si zorunludur.'],
  },
  sizes: {
    type: [Number],
    required: [true, 'Beden bilgileri zorunludur.'],
  },
  stock: {
    type: Number,
    required: [true, 'Stok bilgisi zorunludur.'],
    min: [0, 'Stok negatif olamaz.'],
  },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);