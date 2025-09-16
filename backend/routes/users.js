const express = require('express');
const User = require('../models/user.model');
const Product = require('../models/product.model');
const bcrypt = require('bcryptjs');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Bu email adresi zaten kullanılıyor.' });
    }
    const newUser = new User({ firstName, lastName, email, password });
    await newUser.save();
    res.status(201).json({ message: 'Kullanıcı başarıyla kaydedildi!', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Kayıt sırasında bir hata oluştu.', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Geçersiz email veya şifre.' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Geçersiz email veya şifre.' });
    }
    res.status(200).json({ message: 'Başarıyla giriş yapıldı!', user });
  } catch (error) {
    res.status(500).json({ message: 'Giriş sırasında bir hata oluştu.', error: error.message });
  }
});

router.post('/:userId/cart', async (req, res) => {
  const { userId } = req.params;
  const { productId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı.' });
    }
    const alreadyInCart = user.cart.some(item => item.productId.toString() === productId);
    if (alreadyInCart) {
      return res.status(409).json({ message: 'Ürün zaten sepette!' });
    }
    user.cart.push({ productId });
    await user.save();
    res.status(200).json({ message: 'Ürün sepete başarıyla eklendi.', cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: 'Sepete ekleme sırasında bir hata oluştu.', error: error.message });
  }
});

router.post('/:userId/favorites', async (req, res) => {
  const { userId } = req.params;
  const { productId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı.' });
    }
    const alreadyInFavorites = user.favorites.some(item => item.productId.toString() === productId);
    if (alreadyInFavorites) {
      return res.status(409).json({ message: 'Ürün zaten favorilerde!' });
    }
    user.favorites.push({ productId });
    await user.save();
    res.status(200).json({ message: 'Ürün favorilere başarıyla eklendi.', favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: 'Favorilere ekleme sırasında bir hata oluştu.', error: error.message });
  }
});

router.get('/:userId/cart', async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).populate('cart.productId');
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }
    const items = user.cart.map(item => ({
      productId: item.productId._id,
      product: item.productId
    }));
    res.status(200).json({ items });
  } catch (error) {
    res.status(500).json({ message: 'Sepet verileri çekilirken bir hata oluştu.', error: error.message });
  }
});

router.get('/:userId/favorites', async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).populate('favorites.productId');
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }
    const items = user.favorites.map(item => ({
      productId: item.productId._id,
      product: item.productId
    }));
    res.status(200).json({ items });
  } catch (error) {
    res.status(500).json({ message: 'Favori verileri çekilirken bir hata oluştu.', error: error.message });
  }
});

router.delete('/:userId/cart/:productId', async (req, res) => {
  const { userId, productId } = req.params;
  try {
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
      }
      
      user.cart.pull({ productId });
      await user.save();
      
      res.status(200).json({ message: 'Ürün sepetten başarıyla kaldırıldı.', cart: user.cart });
  } catch (error) {
      res.status(500).json({ message: 'Sepetten çıkarma sırasında bir hata oluştu.', error: error.message });
  }
});

router.delete('/:userId/favorites/:productId', async (req, res) => {
  const { userId, productId } = req.params;
  try {
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
      }
      
      user.favorites.pull({ productId });
      await user.save();
      
      res.status(200).json({ message: 'Ürün favorilerden başarıyla kaldırıldı.', favorites: user.favorites });
  } catch (error) {
      res.status(500).json({ message: 'Favorilerden çıkarma sırasında bir hata oluştu.', error: error.message });
  }
});

module.exports = router;