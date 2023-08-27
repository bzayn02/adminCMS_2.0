import express from 'express';
import { comparePassword, hashPassword } from '../helpers/bcrypt.js';
import {
  findAllAdmins,
  getAdminByEmail,
  insertAdmin,
  updateAdmin,
  updateAdminById,
  updateVerifyAdmin,
} from '../model/admin/adminModel.js';
import {
  loginValidation,
  newAdminValidation,
  newAdminVerificationValidation,
  updateAdminValidation,
} from '../middlewares/joiValidation.js';
import {
  accountVerificationEmail,
  accountVerifiedNotification,
  passwordChangeNotification,
  sendOTPNotification,
} from '../helpers/nodemailer.js';
import { v4 as uuidv4 } from 'uuid';
import { createAccessJWT, createRefreshJWT } from '../helpers/jwt.js';
import { auth, refreshAuth } from '../middlewares/authMiddleware.js';
import {
  deleteSession,
  deleteSessionByFilter,
  insertNewSession,
} from '../model/session/sessionModel.js';
import { OTPGenerator } from '../helpers/randomGenerator.js';

const router = express.Router();

// Get admin details
router.get('/', auth, (req, res, next) => {
  try {
    req.userInfo.password = undefined;
    res.json({
      status: 'success',
      message: 'Here is the user info.',
      user: req.userInfo,
    });
  } catch (error) {
    next(error);
  }
});

// Get all admin-users details
router.get('/admin-users', auth, async (req, res, next) => {
  try {
    const admins = await findAllAdmins();
    res.json({
      status: 'success',
      message: 'Here is the list of all admins.',
      adminUsers: admins,
    });
  } catch (error) {
    next(error);
  }
});

// Create new admin
router.post('/', auth, newAdminValidation, async (req, res, next) => {
  try {
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

router.put(
  '/update-profile',
  auth,
  updateAdminValidation,
  async (req, res, next) => {
    try {
      const { currentPassword, ...info } = req.body;

      const user = req.userInfo;
      const isMatched = comparePassword(currentPassword, user.password);

      if (isMatched) {
        if (info?.password) {
          info.password = hashPassword(info.password);
        }
        const result = await updateAdminById({ _id: user._id, ...info });
        console.log(result, 'from udpate');
        result?._id
          ? res.json({
              status: 'success',
              message: 'Your profile has been successfully updated.',
            })
          : res.json({
              status: 'error',
              message: 'Unable to create new account. Please try again later.',
            });
        return;
      }
      res.json({
        status: 'error',
        message: 'Your password is incorrect. Please use the correct password.',
      });
    } catch (error) {
      next(error);
    }
  }
);

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

//  =========== Resetting Password ===========
router.post('/request-otp', async (req, res, next) => {
  try {
    const { email } = req.body;
    if (email) {
      // check user exists
      const user = await getAdminByEmail(email);

      if (user?._id) {
        // create 6 digit otp and store along with session in session table
        const otp = OTPGenerator();

        // store otp and email in session table for future check
        const obj = {
          token: otp,
          associate: email,
        };
        const result = await insertNewSession(obj);
        if (result?._id) {
          // send otp to their email
          await sendOTPNotification({
            otp,
            email,
            fname: user.fname,
          });
        }
      }
    }
    res.json({
      status: 'success',
      message:
        'If your email exists in our system you will get OTP in your mail box. Please check your email for instruction and OTP.',
    });
  } catch (error) {
    next(error);
  }
});

router.post('/reset-password', async (req, res, next) => {
  try {
    const { email, password, otp } = req.body;
    if (email && password) {
      // check if the token is valid and also delete the session (Deleting also checks and returns result)
      const result = await deleteSessionByFilter({
        token: otp,
        associate: email,
      });
      if (result?._id) {
        // check user exists
        const user = await getAdminByEmail(email);
        if (user?._id) {
          // encrypt the password
          const hashPass = hashPassword(password);

          const updatedUser = await updateAdmin(
            { email },
            { password: hashPass }
          );

          if (updatedUser?._id) {
            // send email notification
            await passwordChangeNotification({
              email,
              fname: updatedUser.fname,
            });

            return res.json({
              status: 'success',
              message:
                'Your password has been successfully updated. You may login now!',
            });
          }
        }
      }
    }
    res.json({
      status: 'error',
      message: 'Unable to process your request. Invalid request or token.',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
