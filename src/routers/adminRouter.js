import express from 'express';
import { hashPassword } from '../helpers/bcrypt.js';
import { insertAdmin, updateVerifyAdmin } from '../model/admin/adminModel.js';
import {
  newAdminValidation,
  newAdminVerificationValidation,
} from '../middlewares/joiValidation.js';
import {
  accountVerificationEmail,
  accountVerifiedNotification,
} from '../helpers/nodemailer.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Create new admin
router.post('/', newAdminValidation, async (req, res, next) => {
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

export default router;
