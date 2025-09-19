import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  category: 'tshirts' | 'shirts' | 'pants' | 'jackets' | 'hoodies';
  price: number;
  sizes: string[]
  colors: string[];
  images: string[];
  description: string;
  stock: number;
  tags: string[];
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { 
    type: String, 
    required: true,
    enum: ['tshirts', 'shirts', 'pants', 'jackets', 'hoodies']
  },
  price: { type: Number, required: true },
  sizes: [{ type: String, enum: ['S', 'M', 'L', 'XL', 'XXL'] }],
  colors: [{ type: String }],
  images: [{ type: String }],
  description: { type: String },
  stock: { type: Number, default: 0 },
  tags: [{ type: String }],
  featured: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model<IProduct>('Product', ProductSchema);