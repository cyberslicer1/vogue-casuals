import { Request, Response } from 'express';
import cloudinary from 'cloudinary';

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload image to Cloudinary
export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Upload to Cloudinary
    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: 'vogue-casuals'
    });
    
    res.json({ url: result.secure_url });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};