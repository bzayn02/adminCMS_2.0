import mongoose, { Schema } from 'mongoose';

const adminSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: 'inactive',
    },
    fname: {
      type: String,
      required: true,
    },
    lname: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      index: 1,
      required: true,
    },
    // dob: {
    //   type: Date,
    //   default: null,
    // },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      default: '',
    },
    refreshJWT: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Admin', adminSchema);
