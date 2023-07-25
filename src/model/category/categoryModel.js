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

// @filter and @updateObj must be object
export const updateVerifyCategory = (filter, updateObj) => {
  return CategorySchema.findOneAndUpdate(filter, updateObj);
};
export const deleteCategoryById = (_id) => {
  return CategorySchema.findByIdAndDelete(_id);
};
