import express from 'express';
import {
  deletePaymentById,
  getPaymentOptions,
  insertPaymentOptions,
  updatePaymentById,
} from '../model/paymentOptions/paymentModel.js';
import { newPaymentOptionValidation } from '../middlewares/joiValidation.js';

const router = express.Router();

// Adding new payment options
router.post('/', newPaymentOptionValidation, async (req, res, next) => {
  try {
    const paymentOptions = req.body;
    const result = await insertPaymentOptions(paymentOptions);
    result?._id
      ? res.json({
          status: 'success',
          message: 'New payment option has been added successfully.',
          result,
        })
      : res.json({
          status: 'error',
          message: 'Unable to add the payment option, try again later.',
        });
  } catch (error) {
    next(error);
  }
});

// Get all payments
router.get('/', async (req, res, next) => {
  try {
    const paymentOptions = await getPaymentOptions();
    if (paymentOptions) {
      res.json({
        status: 'success',
        message: 'Here are the payment options.',
        paymentOptions,
      });
    }
  } catch (error) {
    next(error);
  }
});

router.put('/', async (req, res, next) => {
  try {
    const result = await updatePaymentById(req.body);

    result?._id
      ? res.json({
          status: 'success',
          message: 'Payment option has been updated successfully.',
        })
      : res.json({
          status: 'error',
          message: 'Unable to update payment option, please try again later.',
        });
  } catch (error) {
    next(error);
  }
});

router.delete('/:_id', async (req, res, next) => {
  const _id = req.params;
  try {
    if (_id) {
      const result = await deletePaymentById(_id);
      result._id &&
        res.json({
          status: 'success',
          message: 'Payment option has been deleted successfully.',
        });
      return;
    }
    res.json({
      status: 'error',
      message: 'Unable to delete payment option, please try again later.',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
