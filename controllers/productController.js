const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { category, search, featured, bestseller, newProduct } = req.query;
    let query = {};

    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { color: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { material: { $regex: search, $options: 'i' } },
      ];
    }

    if (featured === 'true') query.isFeatured = true;
    if (bestseller === 'true') query.isBestseller = true;
    if (newProduct === 'true') query.isNewProduct = true;

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product by ID or slug
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      $or: [{ _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }, { slug: req.params.id }],
    });

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new product (Admin)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      image,
      hoverImage,
      images,
      video,
      color,
      fit,
      material,
      description,
      isNewProduct,
      isFeatured,
      isBestseller,
      stock,
    } = req.body;

    const product = new Product({
      name,
      category: category || 'SUITS',
      price: Number(price),
      formattedPrice: `$${Number(price).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      image: image || '/images/suit_blue.jpg',
      hoverImage: hoverImage || '',
      images: Array.isArray(images) ? images : (image ? [image] : []),
      video: video || '',
      color: color || 'Royal Blue',
      fit: fit || 'Tailored Fit',
      material: material || 'Italian Wool',
      description: description || '',
      isNewProduct: Boolean(isNewProduct),
      isFeatured: Boolean(isFeatured),
      isBestseller: Boolean(isBestseller),
      stock: stock ? Number(stock) : 50,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a product (Admin)
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = req.body.name || product.name;
      product.category = req.body.category || product.category;
      if (req.body.price !== undefined) {
        product.price = Number(req.body.price);
        product.formattedPrice = `$${Number(req.body.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
      }
      product.image = req.body.image || product.image;
      if (req.body.hoverImage !== undefined) product.hoverImage = req.body.hoverImage;
      if (req.body.images !== undefined && Array.isArray(req.body.images)) {
        product.images = req.body.images;
      }
      if (req.body.video !== undefined) product.video = req.body.video;
      product.color = req.body.color || product.color;
      product.fit = req.body.fit || product.fit;
      product.material = req.body.material || product.material;
      product.description = req.body.description || product.description;
      if (req.body.isNewProduct !== undefined) product.isNewProduct = req.body.isNewProduct;
      if (req.body.isFeatured !== undefined) product.isFeatured = req.body.isFeatured;
      if (req.body.isBestseller !== undefined) product.isBestseller = req.body.isBestseller;
      if (req.body.stock !== undefined) product.stock = Number(req.body.stock);

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a product (Admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
