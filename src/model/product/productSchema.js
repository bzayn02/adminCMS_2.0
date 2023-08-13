import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: 'inactive',
    },
    images: [
      {
        type: String,
      },
    ],
    name: {
      type: String,
      required: true,
      maxLength: 150,
    },
    parentCat: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
    slug: {
      type: String,
      unique: true,
      index: 1,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    salesPrice: {
      type: Number,
    },
    qty: {
      type: Number,
      required: true,
    },
    salesEndDate: {
      type: Date,
    },
    salesStartDate: {
      type: Date,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Product', productSchema);
