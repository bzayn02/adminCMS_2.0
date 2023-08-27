import AdminSchema from './adminSchema.js';

export const insertAdmin = (obj) => {
  return AdminSchema(obj).save();
};

export const findAllAdmins = () => {
  return AdminSchema.find();
};

export const getAdminByEmail = (email) => {
  return AdminSchema.findOne({ email });
};
export const getOneAdmin = (filter) => {
  return AdminSchema.findOne(filter);
};
export const updateAdminById = ({ _id, ...rest }) => {
  console.log(_id, rest, 'from model');
  return AdminSchema.findByIdAndUpdate(_id, rest, { new: true });
};

// @filter and @updateObj must be object
export const updateVerifyAdmin = (filter, updateObj) => {
  return AdminSchema.findOneAndUpdate(filter, updateObj);
};

export const updateAdmin = (filter, updateObj) => {
  return AdminSchema.findOneAndUpdate(filter, updateObj, { new: true });
};

export const deleteAdminById = (_id) => {
  return AdminSchema.findByIdAndDelete(_id);
};
