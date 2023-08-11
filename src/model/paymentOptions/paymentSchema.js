import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: 'inactive',
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('PaymentOption', paymentSchema);
