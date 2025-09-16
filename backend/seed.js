// seed.js
const mongoose = require('mongoose');
const Product = require('./models/product.model');
const fs = require('fs');

require('dotenv').config();

// MongoDB bağlantısı
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB\'ye başarıyla bağlandı. Seed işlemi başlatılıyor...');
    seedDatabase();
  }).catch(err => {
    console.error('MongoDB bağlantı hatası:', err);
  });

const seedDatabase = async () => {
  try {
    const productsData = JSON.parse(fs.readFileSync('./data/products.json', 'utf8'));

    let addedCount = 0;
    let updatedCount = 0;

    for (const product of productsData) {
      // name alanını kullanarak mevcut ürünü bul
      const existingProduct = await Product.findOne({ name: product.name });

      if (existingProduct) {
        await Product.updateOne({ _id: existingProduct._id }, { $set: product });
        console.log(`${product.name} ürünü güncellendi.`);
        updatedCount++;
      } else {
        const newProduct = new Product(product);
        await newProduct.save();
        console.log(`${product.name} ürünü eklendi.`);
        addedCount++;
      }
    }
    
    console.log(`Seed işlemi tamamlandı. ${addedCount} yeni ürün eklendi, ${updatedCount} ürün güncellendi.`);

    // Bağlantıyı kapat
    mongoose.connection.close();
    console.log('MongoDB bağlantısı kapatıldı.');
  } catch (error) {
    console.error('Veri ekleme/güncelleme işlemi sırasında bir hata oluştu:', error);
    mongoose.connection.close();
  }
};