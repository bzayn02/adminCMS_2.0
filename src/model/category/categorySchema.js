import mongoose, { Schema } from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: 'inactive',
    },
    title: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      unique: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Category', categorySchema);
