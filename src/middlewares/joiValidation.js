import Joi from 'joi';

const SHORTSTR = Joi.string().min(3).max(100);
const SHORTSTRREQ = Joi.string().min(3).max(100).required();
const LONGSTRREQ = Joi.string().min(3).max(10000).required();
const LONGSTR = Joi.string().min(3).max(10000);
const NUM = Joi.number();
const NUMREQ = Joi.number().required();

// ============= Admin ==============
export const newAdminValidation = (req, res, next) => {
  try {
    // Define schema
    const schema = Joi.object({
      fname: SHORTSTRREQ,
      lname: SHORTSTRREQ,
      email: SHORTSTRREQ.email({ minDomainSegments: 2 }),
      phone: SHORTSTRREQ,
      address: SHORTSTR.allow(''),
      password: SHORTSTRREQ.min(8),
    });
    // Check data against the rule

    const { error } = schema.validate(req.body);
    error
      ? res.json({
          status: 'error',
          message: error.message,
        })
      : next();
  } catch (error) {
    next(error);
  }
};
export const updateAdminValidation = (req, res, next) => {
  try {
    // Define schema
    const schema = Joi.object({
      fname: SHORTSTR,
      lname: SHORTSTR,
      email: SHORTSTR.email({ minDomainSegments: 2 }),
      phone: SHORTSTR,
      address: SHORTSTR.allow(''),
      password: SHORTSTR.min(8),
      currentPassword: SHORTSTR.min(8),
    });
    // Check data against the rule

    const { error } = schema.validate(req.body);
    error
      ? res.json({
          status: 'error',
          message: error.message,
        })
      : next();
  } catch (error) {
    next(error);
  }
};
export const newAdminVerificationValidation = (req, res, next) => {
  try {
    // Define schema
    const schema = Joi.object({
      email: SHORTSTRREQ.email({ minDomainSegments: 2 }),
      code: SHORTSTRREQ,
    });
    // Check data against the rule

    const { error } = schema.validate(req.body);
    error
      ? res.json({
          status: 'error',
          message: error.message,
        })
      : next();
  } catch (error) {
    next(error);
  }
};
export const loginValidation = (req, res, next) => {
  try {
    // Define schema
    const schema = Joi.object({
      email: SHORTSTRREQ.email({ minDomainSegments: 2 }),
      password: SHORTSTRREQ,
    });
    // Check data against the rule

    const { error } = schema.validate(req.body);
    error
      ? res.json({
          status: 'error',
          message: error.message,
        })
      : next();
  } catch (error) {
    next(error);
  }
};

// =========== Category ==========

export const updateCategoryValidation = (req, res, next) => {
  try {
    // Define schema
    const schema = Joi.object({
      title: SHORTSTRREQ,
      _id: SHORTSTRREQ,
      status: SHORTSTRREQ,
    });
    // Check data against the rule

    const { error } = schema.validate(req.body);
    error
      ? res.json({
          status: 'error',
          message: error.message,
        })
      : next();
  } catch (error) {
    next(error);
  }
};

// Payment option

export const newPaymentOptionValidation = (req, res, next) => {
  try {
    // Define schema
    const schema = Joi.object({
      status: SHORTSTRREQ,
      title: SHORTSTRREQ,
      description: SHORTSTRREQ,
    });
    // Check data against the rule

    const { error } = schema.validate(req.body);
    error
      ? res.json({
          status: 'error',
          message: error.message,
        })
      : next();
  } catch (error) {
    next(error);
  }
};

// Product Validation

export const newProductValidation = (req, res, next) => {
  try {
    req.body.salesPrice = req.body.salesPrice || 0;

    // Define schema
    const schema = Joi.object({
      status: SHORTSTRREQ,
      name: SHORTSTRREQ,
      description: LONGSTRREQ,
      price: NUMREQ,
      qty: NUMREQ,
      salesPrice: NUM,
      sku: SHORTSTRREQ,
      salesStartDate: SHORTSTR.allow('', null),
      salesEndDate: SHORTSTR.allow('', null),
      parentCat: SHORTSTRREQ,
    });
    // Check data against the rule

    const { error } = schema.validate(req.body);
    error
      ? res.json({
          status: 'error',
          message: error.message,
        })
      : next();
  } catch (error) {
    next(error);
  }
};
export const updateProductValidation = (req, res, next) => {
  try {
    req.body.salesPrice = req.body.salesPrice || 0;
    req.body.salesEndDate =
      req.body.salesEndDate === 'null' || !req.body.salesEndDate
        ? null
        : req.body.salesEndDate;
    req.body.salesStartDate =
      req.body.salesStartDate === 'null' || !req.body.salesStartDate
        ? null
        : req.body.salesStartDate;

    // Define schema
    const schema = Joi.object({
      _id: SHORTSTRREQ,
      status: SHORTSTRREQ,
      name: SHORTSTRREQ,
      description: LONGSTRREQ,
      price: NUMREQ,
      qty: NUMREQ,
      salesPrice: NUM,
      sku: SHORTSTR,
      salesStartDate: SHORTSTR.allow('', null),
      salesEndDate: SHORTSTR.allow('', null),
      parentCat: SHORTSTRREQ,
      images: LONGSTR.allow(''),
      thumbnail: LONGSTR.allow(''),
    });
    // Check data against the rule

    const { error } = schema.validate(req.body);
    req.body.images = req.body.images.split(',');
    error
      ? res.json({
          status: 'error',
          message: error.message,
        })
      : next();
  } catch (error) {
    next(error);
  }
};
