import Joi from "@hapi/joi";

/**
 * @function RegisterValidation
 * @param {JSON} body
 * @description Validate data for the registration of the user
 * @returns {Null | Error}
 */
export function RegisterValidation(body) {
  // Let's validate data before create a user

  const ValidationSchema = Joi.object({
    CIN: Joi.number().required().min(10000000).max(29999999),
    FirstName: Joi.string().required().min(2).max(60),
    LastName: Joi.string().required().min(2).max(60),
    Email: Joi.string().email().required().min(6).max(255),
    Password: Joi.string().required().min(8).max(40),
  });
  const { error } = ValidationSchema.validate(body);
  return error;
}

/**
 * @function LoginValidation
 * @param {JSON} body
 * @description Validate data for the user login: Can authorize either using CIN or Email
 * @returns {Null | Error}
 */
export function LoginValidation(body) {
  // Can authorize either using CIN or Email:
  const ValidationSchema = Joi.object({
    CIN: Joi.number().min(10000000).max(29999999),
    Email: Joi.string().email().min(6).max(255),
    Password: Joi.string().required().min(8).max(40),
  }).xor("CIN", "Email");
  const { error } = ValidationSchema.validate(body);
  return error;
}
