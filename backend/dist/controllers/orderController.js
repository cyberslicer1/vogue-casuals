"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrder = exports.getOrders = exports.createOrder = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const asyncHandler_1 = __importDefault(require("../middleware/asyncHandler"));
// Create new order
exports.createOrder = (0, asyncHandler_1.default)(async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;
    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    }
    const order = new Order_1.default({
        orderItems: orderItems.map((item) => (Object.assign(Object.assign({}, item), { product: item._id }))),
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
});
// Get logged in user orders
exports.getOrders = (0, asyncHandler_1.default)(async (req, res) => {
    const orders = await Order_1.default.find({ user: req.user._id });
    res.json(orders);
});
// Get order by ID
exports.getOrder = (0, asyncHandler_1.default)(async (req, res) => {
    const order = await Order_1.default.findById(req.params.id).populate('user', 'name email');
    if (order) {
        res.json(order);
    }
    else {
        res.status(404);
        throw new Error('Order not found');
    }
});
