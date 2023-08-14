import sessionSchema from './sessionSchema.js';

export const insertNewSession = (obj) => {
  return sessionSchema(obj).save();
};

// @token is a string
export const deleteSession = async (token) => {
  const data = await sessionSchema.findOneAndDelete({ token });
};
export const deleteSessionByFilter = async (filter) => {
  const data = await sessionSchema.findOneAndDelete(filter);
  return data;
};
