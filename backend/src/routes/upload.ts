import express from 'express';
import { uploadImage } from '../controllers/uploadController';
import { protect, admin } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();

router.post('/', protect, admin, upload.single('image'), uploadImage);

export default router;