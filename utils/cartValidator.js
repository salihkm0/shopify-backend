import Joi from "joi";

export const cartValidationSchema = Joi.object({
//   cartId: Joi.string().required().messages({
//     "any.required": "cart id is required",
//   }),
  user_email: Joi.string().email().required().messages({
    "string.email": "User email must be a valid email address",
    "any.required": "User email is required",
  }),
  lines: Joi.array()
    .items(
      Joi.object({
        merchandise: Joi.object({
          productVariantId: Joi.string().required().messages({
            "any.required": "Product Variant ID is required",
          }),
          title: Joi.string().required().messages({
            "any.required": "Product title is required",
          }),
        }).required(),
        quantity: Joi.number().min(1).required().messages({
          "number.min": "Quantity must be at least 1",
          "any.required": "Quantity is required",
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.min": "Cart must contain at least one item",
      "any.required": "Cart lines are required",
    }),
//   checkoutUrl: Joi.string().uri().optional().messages({
//     "string.uri": "Checkout URL must be a valid URI",
//   }),
});
