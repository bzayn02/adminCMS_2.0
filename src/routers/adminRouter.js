import express from 'express';
import { comparePassword, hashPassword } from '../helpers/bcrypt.js';
import {
  getAdminByEmail,
  insertAdmin,
  updateAdminById,
  updateVerifyAdmin,
} from '../model/admin/adminModel.js';
import {
  loginValidation,
  newAdminValidation,
  newAdminVerificationValidation,
} from '../middlewares/joiValidation.js';
import {
  accountVerificationEmail,
  accountVerifiedNotification,
} from '../helpers/nodemailer.js';
import { v4 as uuidv4 } from 'uuid';
import { createAccessJWT, createRefreshJWT } from '../helpers/jwt.js';
import { auth, refreshAuth } from '../middlewares/authMiddleware.js';
import { deleteSession } from '../model/session/sessionModel.js';

const router = express.Router();

// Get admin details
router.get('/', auth, (req, res, next) => {
  try {
    res.json({
      status: 'success',
      message: 'Here is the user info.',
      user: req.userInfo,
    });
  } catch (error) {
    next(error);
  }
});

// Create new admin
router.post('/', auth, newAdminValidation, async (req, res, next) => {
  try {
    console.log(req.body);
    const { password } = req.body;
    req.body.password = hashPassword(password);

    // To Dos
    // Create code and add it with req.body
    req.body.verificationCode = uuidv4();

    const result = await insertAdmin(req.body);
    if (result?._id) {
      res.json({
        status: 'success',
        message:
          'Please check your email and follow the instructions to activate the account.',
      });
      const link = ` ${process.env.WEB_DOMAIN}/admin-verification?code=${result.verificationCode}&email=${result.email}`;
      await accountVerificationEmail({
        fname: result.fname,
        email: result.email,
        link,
      });
      return;
    }
    res.json({
      status: 'error',
      message: 'Unable to create new account. Please try again later.',
    });
  } catch (error) {
    if (error.message.includes('E11000 duplicate key error collection')) {
      error.statusCode = 400;
      error.message =
        'This email is already used by another admin, use another email.';
    }
    next(error);
  }
});

router.post(
  '/admin-verification',
  newAdminVerificationValidation,
  async (req, res, next) => {
    try {
      const { email, code } = req.body;
      const filter = { email, verificationCode: code };
      const updateObj = { isVerified: true, verificationCode: '' };
      const result = await updateVerifyAdmin(filter, updateObj);

      if (result?._id) {
        console.log(result);
        await accountVerifiedNotification(result);
        res.json({
          status: 'success',
          message: 'Your account has been verified. You may login now.',
        });
      }
      res.json({
        status: 'error',
        message: 'Either the link is expired or invalid.',
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post('/sign-in', loginValidation, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // find user by email
    const user = await getAdminByEmail(email);
    if (user?._id) {
      // compare password

      const isMatched = comparePassword(password, user.password);

      if (isMatched) {
        const accessJWT = await createAccessJWT(email);
        const refreshJWT = await createRefreshJWT(email);
        console.log(accessJWT, refreshJWT);
        // create 2 jwts
        // create accessJWT and store in session table : short lived 15 min
        // create refreshJWT and store with user data in user table :
        return res.json({
          status: 'success',
          message: 'Signed in successfully.',
          token: { accessJWT, refreshJWT },
        });
      }
    }
    res.json({
      status: 'error',
      message: 'Invalid login details.',
    });
  } catch (error) {
    next(error);
  }
});

// Return refresh JWT
router.get('/', refreshAuth, (req, res, next) => {
  try {
    res.json({
      status: 'success',
      message: 'Here is the user info.',
      user: req.userInfo,
    });
  } catch (error) {
    next(error);
  }
});

// Return refresh JWT
router.get('/get-accessjwt', refreshAuth);

// Admin Logout
router.post('/signout', async (req, res, next) => {
  try {
    const { accessJWT, refreshJWT, _id } = req.body;
    accessJWT && deleteSession(accessJWT);
    if (refreshJWT && _id) {
      await updateAdminById({ _id, refreshJWT: '' });
    }

    res.json({
      status: 'success',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
