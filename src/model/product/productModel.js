import ProductSchema from './productSchema.js';

export const insertProduct = (obj) => {
  return ProductSchema(obj).save();
};
export const getProducts = () => {
  return ProductSchema.find();
};
export const updateProductById = ({ _id, ...rest }) => {
  return ProductSchema.findByIdAndUpdate(_id, rest, { new: true });
};
export const findOneProductByFilter = (filter) => {
  return ProductSchema.findOne(filter);
};
export const findProductById = (_id) => {
  return ProductSchema.findById(_id);
};

export const deleteProductById = (_id) => {
  return ProductSchema.findByIdAndDelete(_id);
};
