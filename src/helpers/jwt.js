import jwt from 'jsonwebtoken';
import { insertNewSession } from '../model/session/sessionModel.js';
import { updateAdminWithRefreshJWT } from '../model/admin/adminModel.js';

export const createAccessJWT = async (email) => {
  const token = jwt.sign({ email }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '15m',
  });
  await insertNewSession({ token, associate: email });
  return token;
};

export const createRefreshJWT = async (email) => {
  const refreshJWT = jwt.sign({ email }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '30d',
  });
  const dt = await updateAdminWithRefreshJWT({ email }, { refreshJWT });
  console.log(dt);
  return refreshJWT;
};
