import express from 'express';
import slugify from 'slugify';
import {
  deleteCategoryById,
  getCategories,
  insertCategory,
  updateCategoryById,
} from '../model/category/categoryModel.js';
import { updateCategoryValidation } from '../middlewares/joiValidation.js';
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    console.log(req.userInfo);
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

router.put('/', updateCategoryValidation, async (req, res, next) => {
  try {
    const result = await updateCategoryById(req.body);

    result?._id
      ? res.json({
          status: 'success',
          message: 'Category has been updated successfully.',
        })
      : res.json({
          status: 'error',
          message: 'Unable to update category, please try again later.',
        });
  } catch (error) {
    next(error);
  }
});

router.delete('/:_id', async (req, res, next) => {
  const _id = req.params;
  try {
    if (_id) {
      const result = await deleteCategoryById(_id);
      result._id &&
        res.json({
          status: 'success',
          message: 'Category has been deleted successfully.',
        });
      return;
    }
    res.json({
      status: 'error',
      message: 'Unable to delete category, please try again later.',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
