import express from 'express';
import slugify from 'slugify';
import multer from 'multer';
import {
  deleteProductById,
  findProductById,
  getProducts,
  insertProduct,
  updateProductById,
} from '../model/product/productModel.js';
import {
  newProductValidation,
  updateProductValidation,
} from '../middlewares/joiValidation.js';

const router = express.Router();

const imgFolderPath = 'public/img/product';
// setup multer

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let error = null;
    // validation check
    cb(error, imgFolderPath);
  },
  filename: (req, file, cb) => {
    let error = null;
    // construct/rename file

    const fullFileName = Date.now() + '-' + file.originalname;
    console.log(file.mimetype);
    cb(error, fullFileName);
  },
});
const upload = multer({ storage });
// where to store the file
// what name to give

router.get('/:_id?', async (req, res, next) => {
  try {
    const { _id } = req.params;
    const products = _id ? await findProductById(_id) : await getProducts();

    res.json({
      status: 'success',
      message: 'Here are the lists of the products.',
      products,
    });
  } catch (error) {
    next(error);
  }
});

router.post(
  '/',
  upload.array('images', 5),
  newProductValidation,
  async (req, res, next) => {
    try {
      if (req.files.length) {
        req.body.images = req.files.map((item) => item.path);
        req.body.thumbnail = req.body.images[0];
      }
      req.body.slug = slugify(req.body.name, { trim: true, lower: true });
      const result = await insertProduct(req.body);

      result?._id
        ? res.json({
            status: 'success',
            message: 'The product has been added successfully.',
          })
        : res.json({
            status: 'error',
            message: 'Unable to add the products.',
          });
    } catch (error) {
      if (error.message.includes('E11000 duplicate key error collection')) {
        error.statusCode = 200;
        error.message =
          'The product slug or sku is already related to another product, please change name and sku and try again later.';
      }
      next(error);
    }
  }
);

router.put(
  '/',
  upload.array('images', 5),
  updateProductValidation,
  async (req, res, next) => {
    try {
      if (req.files.length) {
        const newImgs = req.files.map((item) => item.path);
        req.body.images = [...req.body.images, ...newImgs];
      }

      const result = await updateProductById(req.body);

      result?._id
        ? res.json({
            status: 'success',
            message: 'The product has been updated successfully.',
          })
        : res.json({
            status: 'error',
            message: 'Unable to update the product. Please try again later.',
          });
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:_id', async (req, res, next) => {
  try {
    const _id = req.params;
    const result = await deleteProductById(_id);

    result?._id
      ? res.json({
          status: 'success',
          message: 'The product has been deleted successfully.',
        })
      : res.json({
          status: 'error',
          message: 'Unable to delete the product. Please try again later.',
        });
  } catch (error) {
    next(error);
  }
});

export default router;
