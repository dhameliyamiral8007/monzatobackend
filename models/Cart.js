const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: String, // product id or ObjectId string
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
  },
  size: {
    type: String,
    default: '44',
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
    subtotal: {
      type: Number,
      default: 0,
    },
    totalItemsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Method to recalculate cart subtotal and total item count
cartSchema.methods.calculateTotals = function () {
  this.totalItemsCount = this.items.reduce((sum, item) => sum + item.quantity, 0);
  this.subtotal = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

module.exports = mongoose.model('Cart', cartSchema);
