import AdminSchema from './adminSchema.js';

export const insertAdmin = (obj) => {
  return AdminSchema(obj).save();
};
export const getAdminByEmail = (email) => {
  return AdminSchema.findOne({ email });
};
export const updateAdminById = ({ _id, ...rest }) => {
  return AdminSchema.findByIdAndUpdate(_id, rest);
};

// @filter and @updateObj must be object
export const updateVerifyAdmin = (filter, updateObj) => {
  return AdminSchema.findOneAndUpdate(filter, updateObj);
};
export const deleteAdminById = (_id) => {
  return AdminSchema.findByIdAndDelete(_id);
};