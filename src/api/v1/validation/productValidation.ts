import Joi from "joi";
 
export const createProductSchema = {
  body: Joi.object({
    name: Joi.string().min(2).max(80).required().messages({
      "any.required": "Name is required",
      "string.min": "Name must be at least 2 characters",
      "string.max": "Name must be at most 80 characters",
    }),
    sku: Joi.string()
      .pattern(/^[A-Z]{3}\d{4}$/)
      .required()
      .messages({
        "any.required": "SKU is required",
        "string.pattern.base": "SKU must match pattern /^[A-Z]{3}\\d{4}$/ (e.g. ABC1234)",
      }),
    quantity: Joi.number().integer().min(0).required().messages({
      "any.required": "Quantity is required",
      "number.min": "Quantity must be a non-negative integer",
    }),
    price: Joi.number().positive().precision(2).required().messages({
      "any.required": "Price is required",
      "number.positive": "Price must be a positive number",
    }),
    category: Joi.string()
      .valid("electronics", "clothing", "food", "tools", "other")
      .required()
      .messages({
        "any.required": "Category is required",
        "any.only": "Category must be one of: electronics, clothing, food, tools, other",
      }),
  }),
};
 
export const updateProductSchema = {
  body: Joi.object({
    name: Joi.string().min(2).max(80).optional().messages({
      "string.min": "Name must be at least 2 characters",
      "string.max": "Name must be at most 80 characters",
    }),
    quantity: Joi.number().integer().min(0).optional().messages({
      "number.min": "Quantity must be a non-negative integer",
    }),
    price: Joi.number().positive().precision(2).optional().messages({
      "number.positive": "Price must be a positive number",
    }),
    category: Joi.string()
      .valid("electronics", "clothing", "food", "tools", "other")
      .optional()
      .messages({
        "any.only": "Category must be one of: electronics, clothing, food, tools, other",
      }),
  }),
};