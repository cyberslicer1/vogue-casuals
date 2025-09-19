"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const orderController_1 = require("../controllers/orderController");
const router = express_1.default.Router();
router.route('/')
    .get(auth_1.protect, orderController_1.getOrders)
    .post(auth_1.protect, orderController_1.createOrder);
router.route('/:id')
    .get(auth_1.protect, orderController_1.getOrder);
exports.default = router;
