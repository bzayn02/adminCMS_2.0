import express from 'express';
import slugify from 'slugify';
import {
  getCategories,
  insertCategory,
} from '../model/category/categoryModel.js';
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const result = await getCategories();

    res.json({
      status: 'success',
      message: 'Here are the lists of the categories.',
      result,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { title, slug } = req.body;
    !title &&
      res.json({ status: 'error', message: 'Category title is required.' });
    console.log(title);
    const obj = {
      title,
      slug: slugify(title, { trim: true, lower: true }),
    };

    const result = await insertCategory(obj);

    result?._id
      ? res.json({
          status: 'success',
          message: 'New category has been added successfully.',
        })
      : res.json({
          status: 'error',
          message: 'Unable to add category, please try again later.',
        });
  } catch (error) {
    if (error.message.includes('E11000 duplicate key error collection')) {
      error.statusCode = 200;
      error.message =
        'The slug of the category already exists, please change the category name.';
    }
    next(error);
  }
});

export default router;
