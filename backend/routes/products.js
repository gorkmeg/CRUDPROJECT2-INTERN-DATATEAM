const express = require('express');
const router = express.Router();
const Product = require('../models/product.model');

router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ error: 'Ürünleri getirme sırasında bir hata oluştu.' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Ürün bulunamadı.' });
        }
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ error: 'Geçersiz ürün ID\'si veya sunucu hatası.' });
    }
});

router.post('/add', async (req, res) => {
    try {
        const { name, brand, price, description, imageUrl, sizes, stock } = req.body;
        
        const newProduct = new Product({ name, brand, price, description, imageUrl, sizes, stock });
        await newProduct.save();
        
        res.status(201).json({ message: 'Ürün başarıyla eklendi!', product: newProduct });
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: 'Ürün ekleme sırasında bir hata oluştu.' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { name, brand, price, description, imageUrl, sizes, stock } = req.body;
        
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { name, brand, price, description, imageUrl, sizes, stock },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ error: 'Ürün bulunamadı.' });
        }
        
        res.status(200).json({ message: 'Ürün başarıyla güncellendi!', product: updatedProduct });
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: 'Ürün güncelleme sırasında bir hata oluştu.' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Ürün bulunamadı.' });
        }
        res.status(200).json({ message: 'Ürün başarıyla silindi.' });
    } catch (err) {
        res.status(500).json({ error: 'Ürün silme sırasında bir hata oluştu.' });
    }
});

module.exports = router;
