import { verifyAccessJWT } from '../helpers/jwt.js';
import { getAdminByEmail } from '../model/admin/adminModel.js';

export const auth = async (req, res, next) => {
  try {
    // 1. Get the accessJWT
    const { authorization } = req.headers;
    console.log(authorization);

    // 2. Decode JWT
    const decoded = verifyAccessJWT(authorization);
    console.log(decoded);

    // 3. Extract email and get user by email
    // 4. Check if user is active
    if (decoded?.email) {
      const user = await getAdminByEmail(decoded?.email);
      console.log(user);

      if (user?._id && user?.status === 'active') {
        user.refreshJWT = undefined;
        user.password = undefined;
        req.userInfo = user;
        return next();
      }
    }
    res.status(401).json({
      status: 'error',
      message: 'Unauthorized...',
    });
  } catch (error) {
    if (error.message.includes('jwt expired')) {
      error.statusCode = 403;
      error.message = error.message;
    }
    if (error.message.includes('invalid signature')) {
      error.statusCode = 401;
      error.message = error.message;
    }
    next(error);
  }
};
