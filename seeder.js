require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const connectDB = require('./config/db');

const initialProducts = [
  {
    slug: 'deep-river-suit',
    name: 'Deep River Suit',
    category: 'SUITS',
    price: 1640.00,
    formattedPrice: '$1,640.00',
    image: '/images/suit_blue.jpg',
    hoverImage: '/images/suit_chartreuse.jpg',
    color: 'Electric Royal Blue',
    fit: 'Modern Slim Tailored',
    material: '100% Super 150s Italian Wool',
    description: 'Masterfully crafted in Italy, the Deep River Suit features a vibrant royal blue tone with peak lapels, horn buttons, and handcrafted shoulder stitching for an impeccable silhouette.',
    isNewProduct: true,
    isFeatured: false,
    isBestseller: false,
    stock: 25,
  },
  {
    slug: 'chartreuse-royale-suit',
    name: 'Chartreuse Royale Suit',
    category: 'SUITS',
    price: 1950.00,
    formattedPrice: '$1,950.00',
    image: '/images/suit_chartreuse.jpg',
    hoverImage: '/images/suit_saffron.jpg',
    color: 'Mustard Chartreuse',
    fit: 'Double-Breasted Classic Fit',
    material: 'Silk-Wool Blend Couture',
    description: 'Statement couture tailored suit in a rich chartreuse gold hue. Features double-breasted 6-button front construction with flat-front tailored trousers.',
    isNewProduct: false,
    isFeatured: true,
    isBestseller: false,
    stock: 15,
  },
  {
    slug: 'saffron-suit',
    name: 'Saffron Suit',
    category: 'SUITS',
    price: 1640.00,
    formattedPrice: '$1,640.00',
    image: '/images/suit_saffron.jpg',
    hoverImage: '/images/suit_purple.jpg',
    color: 'Terracotta Saffron',
    fit: 'Tailored Fit',
    material: '100% Virgin Cashmere-Wool',
    description: 'Warm saffron orange suit designed for contemporary luxury. Engineered with high armholes and unconstructed soft shoulders for supreme comfort and elegance.',
    isNewProduct: true,
    isFeatured: false,
    isBestseller: false,
    stock: 30,
  },
  {
    slug: 'midnight-haze-suit',
    name: 'Midnight haze Suit',
    category: 'SUITS',
    price: 1289.00,
    formattedPrice: '$1,289.00',
    image: '/images/suit_purple.jpg',
    hoverImage: '/images/suit_blue.jpg',
    color: 'Deep Velvet Purple',
    fit: 'Modern Double-Breasted',
    material: '100% Velvet Silk-Lined Wool',
    description: 'Sophisticated evening suit featuring deep midnight plum tones, structured chest canvas, and silk-lined interiors for formal evening events.',
    isNewProduct: false,
    isFeatured: false,
    isBestseller: true,
    stock: 20,
  },
];

const seedData = async () => {
  try {
    await connectDB();

    // Clear previous data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});

    console.log('[Seeder]: Old data cleared');

    // Create Admin and User accounts
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'Monzato',
      email: 'admin@monzato.com',
      password: 'admin123',
      role: 'admin',
    });

    const normalUser = await User.create({
      firstName: 'Alexander',
      lastName: 'Monzato',
      email: 'alexander@monzato.com',
      password: 'user123',
      role: 'user',
    });

    console.log('[Seeder]: Default Users Created:');
    console.log(`  - Admin: admin@monzato.com / admin123`);
    console.log(`  - User: alexander@monzato.com / user123`);

    // Insert Products
    const createdProducts = await Product.insertMany(initialProducts);
    console.log(`[Seeder]: ${createdProducts.length} Products inserted successfully`);

    // Create a sample order for demonstration
    await Order.create({
      user: normalUser._id,
      orderItems: [
        {
          name: createdProducts[1].name,
          quantity: 1,
          image: createdProducts[1].image,
          price: createdProducts[1].price,
          size: '44',
          product: createdProducts[1]._id,
        },
      ],
      shippingAddress: {
        address: 'Via Montenapoleone 8',
        city: 'Milan',
        postalCode: '20121',
        country: 'Italy',
      },
      paymentMethod: 'Credit Card',
      totalPrice: createdProducts[1].price,
      status: 'Processing',
      isPaid: true,
      paidAt: new Date(),
    });

    console.log('[Seeder]: Sample Order created');
    console.log('[Seeder]: Database Seeding Complete!');
    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error]: ${error.message}`);
    process.exit(1);
  }
};

seedData();
