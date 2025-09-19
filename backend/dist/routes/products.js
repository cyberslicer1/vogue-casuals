"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.route('/')
    .get(productController_1.getProducts)
    .post(auth_1.protect, auth_1.admin, productController_1.createProduct);
router.route('/:id')
    .get(productController_1.getProduct)
    .put(auth_1.protect, auth_1.admin, productController_1.updateProduct)
    .delete(auth_1.protect, auth_1.admin, productController_1.deleteProduct);
exports.default = router;
