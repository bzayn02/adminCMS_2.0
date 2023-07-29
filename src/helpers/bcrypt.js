import bcrypt from 'bcryptjs';

const salt = 10;

export const hashPassword = (plainPassword) => {
  return bcrypt.hashSync(plainPassword, salt);
};

export const comparePassword = (plainPass, hashPass) => {
  return bcrypt.compareSync(plainPass, hashPass);
};
