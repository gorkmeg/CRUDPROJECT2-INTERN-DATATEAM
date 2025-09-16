// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// middlewares
app.use(express.json());
app.use(cors());

// MongoDB bağlantısı
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB'ye başarıyla bağlandı.");
  }).catch(err => {
    console.error("MongoDB bağlantı hatası:", err);
  });

// routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor.`);
});