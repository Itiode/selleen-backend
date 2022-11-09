import Joi from "joi";

interface ValidatorOpts {
  min?: number;
  max?: number;
}

export function email(label?: string, opts?: ValidatorOpts): Joi.SchemaLike {
  const validators = Joi.string()
    .trim()
    .min(5)
    .max(250)
    .lowercase()
    .email({ minDomainSegments: 2 })
    .required()
    .messages({
      "string.base": `${label || "Email"} should be text`,
      "string.empty": `${label || "Email"} can't be empty`,
      "string.min": `${label || "Email"} must be at least 5 characters`,
      "string.max": `${label || "Email"} can't be more than 250 characters`,
      "string.email": `${label || "Email"} should be valid`,
      "any.required": `${label || "Email"} is required`,
    });

  return validators;
}

export function address(
  label: string,
  opts: ValidatorOpts = { min: 2, max: 250 }
): Joi.SchemaLike {
  return Joi.string()
    .trim()
    .min(opts.min ? opts.min : 2)
    .max(opts.max ? opts.max : 250)
    .allow("", null)
    .required()
    .messages({
      "string.base": `${label} should be text`,
      "string.empty": `${label} can't be empty`,
      "string.min": `${label} must be at least ${
        opts.min ? opts.min : 2
      } characters`,
      "string.max": `${label} can't be more than ${
        opts.max ? opts.max : 250
      } characters`,
      "any.required": `${label} is required`,
    });
}

export function string(
  label: string,
  opts: ValidatorOpts = { min: 1, max: 10 }
): Joi.SchemaLike {
  return Joi.string()
    .trim()
    .min(opts.min ? opts.min : 1)
    .max(opts.max ? opts.max : 10)
    .required()
    .messages({
      "string.base": `${label} should be text`,
      "string.empty": `${label} can't be empty`,
      "string.min": `${label} must be at least ${
        opts.min ? opts.min : 1
      } characters`,
      "string.max": `${label} can't be more than ${
        opts.max ? opts.max : 10
      } characters`,
      "any.required": `${label} is required`,
    });
}

export function regexString(
  label: string,
  regex: string,
  opts: ValidatorOpts = { min: 1, max: 10 }
): Joi.SchemaLike {
  const validators = Joi.string()
    .trim()
    .min(opts.min ? opts.min : 1)
    .max(opts.max ? opts.max : 10)
    .pattern(new RegExp(regex))
    .required()
    .messages({
      "string.base": `${label} should be text`,
      "string.empty": `${label} can't be empty`,
      "string.min": `${label} shouldn't be less than ${
        opts.min ? opts.min : 1
      } characters`,
      "string.max": `${label} shouldn't be more than ${
        opts.min ? opts.min : 1
      } characters`,
      "string.pattern.base": `${label} is invalid`,
      "any.required": `${label} is required`,
    });

  return validators;
}

export function digit(
  label: string,
  opts: ValidatorOpts = { min: 1, max: 10 }
): Joi.SchemaLike {
  return Joi.string()
    .trim()
    .min(opts.min ? opts.min : 1)
    .max(opts.max ? opts.max : 10)
    .pattern(new RegExp("^[0-9]*$"))
    .required()
    .messages({
      "string.base": `${label} should be text`,
      "string.empty": `${label} can't be empty`,
      "string.min": `${label} should be ${opts.min ? opts.min : 1} digits`,
      "string.max": `${label} should be ${opts.max ? opts.max : 10} digits`,
      "string.pattern.base": `${label} is invalid`,
      "any.required": `${label} is required`,
    });
}

export function number(
  label: string,
  opts: ValidatorOpts = { min: 1, max: 10 }
): Joi.SchemaLike {
  return Joi.number()
    .min(opts.min ? opts.min : 1)
    .max(opts.max ? opts.max : 10)
    .required()
    .messages({
      "number.min": `${label} shouldn't be less than ${
        opts.min ? opts.min : 1
      }`,
      "number.max": `${label} shouldn't be greater than ${
        opts.max ? opts.max : 10
      }`,
      "any.required": `${label} is required`,
    });
}

export function mongoId(label: string): Joi.SchemaLike {
  return Joi.string()
    .trim()
    .pattern(new RegExp("^[0-9a-fA-F]{24}$"))
    .required()
    .messages({
      "string.base": `${label} should be text`,
      "string.empty": `${label} can't be empty`,
      "string.pattern.base": `${label} is invalid`,
      "any.required": `${label} is required`,
    });
}
