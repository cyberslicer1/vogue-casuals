import { Request, Response } from 'express';
import Product from '../models/Product';
import { generateSlug } from '../utils/generateSlug';
import asyncHandler from '../middleware/asyncHandler';

// Get all products with optional filtering
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const { category, featured, page = 1, limit = 12, search } = req.query;
  
  let filter: any = {};
  if (category && category !== 'all') filter.category = category;
  if (featured) filter.featured = featured === 'true';
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search as string, 'i')] } }
    ];
  }
  
  const products = await Product.find(filter)
    .limit(Number(limit) * 1)
    .skip((Number(page) - 1) * Number(limit))
    .sort({ createdAt: -1 });
  
  const total = await Product.countDocuments(filter);
  
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
export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  let product;
  if (id.length === 24) {
    product = await Product.findById(id);
  } else {
    product = await Product.findOne({ slug: id });
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
export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const { name, category, price, description } = req.body;
  
  // Generate slug from name
  const slug = generateSlug(name);
  
  // Check if product with same slug exists
  const existingProduct = await Product.findOne({ slug });
  if (existingProduct) {
    return res.status(400).json({
      success: false,
      message: 'Product with this name already exists'
    });
  }
  
  const product = new Product({
    ...req.body,
    slug
  });
  
  await product.save();
  
  res.status(201).json({
    success: true,
    product
  });
});

// Update product (admin only)
export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  let product = await Product.findById(req.params.id);
  
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }
  
  // If name is being updated, update slug too
  if (req.body.name && req.body.name !== product.name) {
    req.body.slug = generateSlug(req.body.name);
  }
  
  product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  
  res.status(200).json({
    success: true,
    product
  });
});

// Delete product (admin only)
export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }
  
  await Product.findByIdAndDelete(req.params.id);
  
  res.status(200).json({
    success: true,
    message: 'Product deleted successfully'
  });
});