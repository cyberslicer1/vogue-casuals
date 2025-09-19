"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Product_1 = __importDefault(require("../models/Product"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
const sampleProducts = [
    {
        name: 'Classic Cotton T-Shirt',
        slug: 'classic-cotton-t-shirt',
        category: 'tshirts',
        price: 29.99,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Black', 'White', 'Gray'],
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'],
        description: 'Premium quality cotton t-shirt for everyday wear. Made from 100% organic cotton for maximum comfort.',
        stock: 100,
        tags: ['casual', 'cotton', 'basic', 'comfort'],
        featured: true
    },
    {
        name: 'Slim Fit Dress Shirt',
        slug: 'slim-fit-dress-shirt',
        category: 'shirts',
        price: 59.99,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Blue', 'White', 'Pink'],
        images: ['https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500'],
        description: 'Elegant slim fit dress shirt for formal occasions. Perfect for business meetings and special events.',
        stock: 75,
        tags: ['formal', 'dress', 'slim-fit', 'business'],
        featured: true
    },
    {
        name: 'Comfort Fit Jeans',
        slug: 'comfort-fit-jeans',
        category: 'pants',
        price: 79.99,
        sizes: ['S', 'M', 'L', 'XL'], // Changed from numeric to letter sizes
        colors: ['Blue', 'Black', 'Dark Wash'],
        images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=500'],
        description: 'Comfortable jeans with a modern fit. Made from durable denim that gets better with every wear.',
        stock: 60,
        tags: ['denim', 'casual', 'comfort', 'jeans'],
        featured: true
    },
    {
        name: 'Winter Parka Jacket',
        slug: 'winter-parka-jacket',
        category: 'jackets',
        price: 129.99,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Black', 'Navy', 'Green'],
        images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500'],
        description: 'Warm winter parka designed to keep you comfortable in cold weather. Water-resistant and insulated.',
        stock: 45,
        tags: ['winter', 'warm', 'parka', 'water-resistant'],
        featured: true
    },
    {
        name: 'Premium Hoodie',
        slug: 'premium-hoodie',
        category: 'hoodies',
        price: 69.99,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Gray', 'Black', 'Navy'],
        images: ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500'],
        description: 'Soft and comfortable premium hoodie. Perfect for casual wear and lounging.',
        stock: 85,
        tags: ['casual', 'comfort', 'warm', 'hoodie'],
        featured: true
    },
    {
        name: 'Graphic Print T-Shirt',
        slug: 'graphic-print-t-shirt',
        category: 'tshirts',
        price: 34.99,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['White', 'Black', 'Red'],
        images: ['https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500'],
        description: 'T-shirt with unique graphic print. Stand out with this stylish design.',
        stock: 90,
        tags: ['graphic', 'design', 'casual', 'trendy'],
        featured: false
    },
    {
        name: 'Oxford Button-Down Shirt',
        slug: 'oxford-button-down-shirt',
        category: 'shirts',
        price: 64.99,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['White', 'Blue', 'Striped'],
        images: ['https://images.unsplash.com/photo-1665499959667-76176832315e?w=500'],
        description: 'Classic oxford button-down shirt. Versatile enough for both casual and formal wear.',
        stock: 70,
        tags: ['oxford', 'classic', 'versatile', 'button-down'],
        featured: false
    },
    {
        name: 'Athletic Jogger Pants',
        slug: 'athletic-jogger-pants',
        category: 'pants',
        price: 54.99,
        sizes: ['S', 'M', 'L', 'XL'], // Changed from numeric to letter sizes
        colors: ['Black', 'Gray', 'Navy'],
        images: ['https://images.unsplash.com/photo-1588117305388-c2631a279f82?w=500'],
        description: 'Comfortable athletic jogger pants with elastic cuffs. Perfect for workouts or casual wear.',
        stock: 55,
        tags: ['athletic', 'jogger', 'comfort', 'sport'],
        featured: false
    },
    {
        name: 'Denim Jacket',
        slug: 'denim-jacket',
        category: 'jackets',
        price: 89.99,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Blue', 'Black', 'Light Wash'],
        images: ['https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=500'],
        description: 'Classic denim jacket that never goes out of style. Perfect for layering in any season.',
        stock: 40,
        tags: ['denim', 'jacket', 'casual', 'classic'],
        featured: false
    },
    {
        name: 'Zip-Up Hoodie',
        slug: 'zip-up-hoodie',
        category: 'hoodies',
        price: 74.99,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Black', 'Gray', 'Green'],
        images: ['https://images.unsplash.com/photo-1625124434919-7c6c9f8c6c3b?w=500'],
        description: 'Versatile zip-up hoodie for easy on and off. Great for variable weather conditions.',
        stock: 65,
        tags: ['hoodie', 'zip-up', 'versatile', 'casual'],
        featured: false
    }
];
const seedData = async () => {
    try {
        // Connect to MongoDB
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vogue-casuals';
        await mongoose_1.default.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');
        // Clear existing products
        await Product_1.default.deleteMany({});
        console.log('✅ Cleared existing products');
        // Insert sample products
        await Product_1.default.insertMany(sampleProducts);
        console.log('✅ Sample products added successfully');
        // Display the added products
        const products = await Product_1.default.find({});
        console.log(`\n📦 Added ${products.length} products:`);
        products.forEach(product => {
            console.log(`   - ${product.name} (${product.category}) - $${product.price}`);
        });
        console.log('\n🎉 Database seeding completed successfully!');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
};
// Run the seed function
seedData();
