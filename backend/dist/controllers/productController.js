"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProduct = exports.getProducts = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const generateSlug_1 = require("../utils/generateSlug");
const asyncHandler_1 = __importDefault(require("../middleware/asyncHandler"));
// Get all products with optional filtering
exports.getProducts = (0, asyncHandler_1.default)(async (req, res) => {
    const { category, featured, page = 1, limit = 12, search } = req.query;
    let filter = {};
    if (category && category !== 'all')
        filter.category = category;
    if (featured)
        filter.featured = featured === 'true';
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { tags: { $in: [new RegExp(search, 'i')] } }
        ];
    }
    const products = await Product_1.default.find(filter)
        .limit(Number(limit) * 1)
        .skip((Number(page) - 1) * Number(limit))
        .sort({ createdAt: -1 });
    const total = await Product_1.default.countDocuments(filter);
    res.status(200).json({
        success: true,
        count: products.length,
        total,
        totalPages: Math.ceil(total / Number(limit)),
        currentPage: Number(page),
        products
    });
});
// Get single product by ID or slug
exports.getProduct = (0, asyncHandler_1.default)(async (req, res) => {
    const { id } = req.params;
    let product;
    if (id.length === 24) {
        product = await Product_1.default.findById(id);
    }
    else {
        product = await Product_1.default.findOne({ slug: id });
    }
    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        });
    }
    res.status(200).json({
        success: true,
        product
    });
});
// Create new product (admin only)
exports.createProduct = (0, asyncHandler_1.default)(async (req, res) => {
    const { name, category, price, description } = req.body;
    // Generate slug from name
    const slug = (0, generateSlug_1.generateSlug)(name);
    // Check if product with same slug exists
    const existingProduct = await Product_1.default.findOne({ slug });
    if (existingProduct) {
        return res.status(400).json({
            success: false,
            message: 'Product with this name already exists'
        });
    }
    const product = new Product_1.default(Object.assign(Object.assign({}, req.body), { slug }));
    await product.save();
    res.status(201).json({
        success: true,
        product
    });
});
// Update product (admin only)
exports.updateProduct = (0, asyncHandler_1.default)(async (req, res) => {
    let product = await Product_1.default.findById(req.params.id);
    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        });
    }
    // If name is being updated, update slug too
    if (req.body.name && req.body.name !== product.name) {
        req.body.slug = (0, generateSlug_1.generateSlug)(req.body.name);
    }
    product = await Product_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({
        success: true,
        product
    });
});
// Delete product (admin only)
exports.deleteProduct = (0, asyncHandler_1.default)(async (req, res) => {
    const product = await Product_1.default.findById(req.params.id);
    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        });
    }
    await Product_1.default.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
    });
});
