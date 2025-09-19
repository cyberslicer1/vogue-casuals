"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uploadController_1 = require("../controllers/uploadController");
const auth_1 = require("../middleware/auth");
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
router.post('/', auth_1.protect, auth_1.admin, upload_1.upload.single('image'), uploadController_1.uploadImage);
exports.default = router;
