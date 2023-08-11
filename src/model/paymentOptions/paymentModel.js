import PaymentSchema from './paymentSchema.js';

export const insertPaymentOptions = (obj) => {
  return PaymentSchema(obj).save();
};
export const getPaymentOptions = () => {
  return PaymentSchema.find();
};
export const updatePaymentById = ({ _id, ...rest }) => {
  return PaymentSchema.findByIdAndUpdate(_id, rest);
};

export const deletePaymentById = (_id) => {
  return PaymentSchema.findByIdAndDelete(_id);
};
