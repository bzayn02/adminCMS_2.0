import CategorySchema from './categorySchema.js';

export const insertCategory = (obj) => {
  return CategorySchema(obj).save();
};
export const getCategories = () => {
  return CategorySchema.find();
};
export const updateCategoryById = ({ _id, ...rest }) => {
  return CategorySchema.findByIdAndUpdate(_id, rest);
};

export const deleteCategoryById = (_id) => {
  return CategorySchema.findByIdAndDelete(_id);
};
