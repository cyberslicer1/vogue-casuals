import { Request, Response } from 'express';
import Order from '../models/Order';
import asyncHandler from '../middleware/asyncHandler';

// Create new order
export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      console.error('Order creation failed: No order items');
      return res.status(400).json({ message: 'No order items' });
    }

    if (!req.user || !req.user._id) {
      console.error('Order creation failed: User not authenticated');
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const order = new Order({
      orderItems: orderItems.map((item: any) => ({
        ...item,
        product: item.product || item._id
      })),
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (err: any) {
    console.error('Order creation error:', err);
    res.status(500).json({ message: err.message || 'Order creation failed' });
  }
});

// Get logged in user orders
export const getOrders = asyncHandler(async (req: Request, res: Response) => {
  if (req.user.role === 'admin') {
    // Admin: return all orders
    const orders = await Order.find({}).populate('user', 'name email');
    res.json(orders);
  } else {
    // Regular user: return only their orders
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  }
});

// Get order by ID
export const getOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});