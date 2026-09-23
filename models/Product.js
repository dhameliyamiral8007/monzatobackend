const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      default: 'SUITS',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      default: 0.0,
    },
    formattedPrice: {
      type: String,
    },
    image: {
      type: String,
      required: [true, 'Product image is required'],
    },
    hoverImage: {
      type: String,
    },
    images: [
      {
        type: String,
      },
    ],
    video: {
      type: String,
    },
    color: {
      type: String,
    },
    fit: {
      type: String,
    },
    material: {
      type: String,
    },
    description: {
      type: String,
    },
    isNewProduct: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isBestseller: {
      type: Boolean,
      default: false,
    },
    stock: {
      type: Number,
      default: 50,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual or pre-save to format price and generate slug
productSchema.pre('save', function () {
  if (!this.formattedPrice && this.price) {
    this.formattedPrice = `$${this.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  }
  if (!this.slug && this.name) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }
});

module.exports = mongoose.model('Product', productSchema);
