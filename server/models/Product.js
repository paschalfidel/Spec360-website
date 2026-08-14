import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 200 },
  category: { type: String, required: true, enum: ['phone', 'accessory', 'part'], lowercase: true },
  price: { type: Number, required: true, min: 0 },
  compareAt: { type: Number, min: 0 },
  description: { type: String, trim: true, maxlength: 2000, default: '' },
  imageUrl: { type: String, default: '' },
  images: { type: [String], default: [] },
  stock: { type: Number, required: true, min: 0, default: 0 },
  compatibility: { type: String, trim: true, default: '' },
  brand: { type: String, trim: true, default: '' },
  featured: { type: Boolean, default: false },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  reviews: { type: Number, min: 0, default: 0 },
  specifications: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

productSchema.index({ category: 1, stock: 1 });
productSchema.index({ name: 'text', description: 'text', brand: 'text' });

export default mongoose.model('Product', productSchema);
