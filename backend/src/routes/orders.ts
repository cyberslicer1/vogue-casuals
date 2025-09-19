import express from 'express';
import { protect } from '../middleware/auth';
import { createOrder, getOrders, getOrder } from '../controllers/orderController';

const router = express.Router();

router.route('/')
  .get(protect, getOrders)
  .post(protect, createOrder);

router.route('/:id')
  .get(protect, getOrder);

export default router;