const Cart = require('../models/Cart');

// Helper to get or create cart for user
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [], subtotal: 0, totalItemsCount: 0 });
  }
  return cart;
};

// @desc    Get logged in user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { product, name, price, image, size = '44', quantity = 1 } = req.body;

    if (!product || !name || price === undefined) {
      return res.status(400).json({ message: 'Product ID, name and price are required' });
    }

    const productId = product._id || product.id || product;
    const cart = await getOrCreateCart(req.user._id);

    const existingIndex = cart.items.findIndex(
      (item) => String(item.product) === String(productId) && item.size === size
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += Number(quantity);
    } else {
      cart.items.push({
        product: String(productId),
        name,
        price: Number(price),
        image: image || '',
        size,
        quantity: Number(quantity),
      });
    }

    cart.calculateTotals();
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update item quantity in cart
// @route   PUT /api/cart/update
// @access  Private
const updateCartQuantity = async (req, res) => {
  try {
    const { product, size = '44', quantity } = req.body;
    const productId = product._id || product.id || product;

    const cart = await getOrCreateCart(req.user._id);
    const existingIndex = cart.items.findIndex(
      (item) => String(item.product) === String(productId) && item.size === size
    );

    if (existingIndex > -1) {
      const newQty = Number(quantity);
      if (newQty <= 0) {
        cart.items.splice(existingIndex, 1);
      } else {
        cart.items[existingIndex].quantity = newQty;
      }
      cart.calculateTotals();
      await cart.save();
      return res.json(cart);
    } else {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const { product, size = '44' } = req.body;
    const productId = product._id || product.id || product;

    const cart = await getOrCreateCart(req.user._id);
    cart.items = cart.items.filter(
      (item) => !(String(item.product) === String(productId) && item.size === size)
    );

    cart.calculateTotals();
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart/clear
// @access  Private
const clearCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    cart.items = [];
    cart.calculateTotals();
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Sync / merge guest cart items with user's saved DB cart
// @route   POST /api/cart/sync
// @access  Private
const syncCart = async (req, res) => {
  try {
    const { items = [] } = req.body;
    const cart = await getOrCreateCart(req.user._id);

    if (Array.isArray(items) && items.length > 0) {
      for (const guestItem of items) {
        const productId = guestItem.product || guestItem.id || guestItem._id;
        if (!productId) continue;

        const size = guestItem.size || '44';
        const qty = Number(guestItem.quantity) || 1;

        const existingIndex = cart.items.findIndex(
          (item) => String(item.product) === String(productId) && item.size === size
        );

        if (existingIndex > -1) {
          cart.items[existingIndex].quantity += qty;
        } else {
          cart.items.push({
            product: String(productId),
            name: guestItem.name || 'Product',
            price: Number(guestItem.price) || 0,
            image: guestItem.image || '',
            size: size,
            quantity: qty,
          });
        }
      }

      cart.calculateTotals();
      await cart.save();
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  syncCart,
};
