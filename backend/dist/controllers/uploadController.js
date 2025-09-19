"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const cloudinary_1 = __importDefault(require("cloudinary"));
// Configure Cloudinary
cloudinary_1.default.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
// Upload image to Cloudinary
const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        // Upload to Cloudinary
        const result = await cloudinary_1.default.v2.uploader.upload(req.file.path, {
            folder: 'vogue-casuals'
        });
        res.json({ url: result.secure_url });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.uploadImage = uploadImage;
