import Joi from 'joi';

const SHORTSTR = Joi.string().min(3).max(100);
const SHORTSTRREQ = Joi.string().min(3).max(100).required();

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
