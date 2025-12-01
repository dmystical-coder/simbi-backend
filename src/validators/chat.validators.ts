import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { BadRequestError } from "../utils/errorClasses";



export function chatValidator(req: Request, res: Response, next: NextFunction): void {
  const schema = Joi.object({
    content: Joi.string().required().messages({
      "string.empty": "Message content is required",
      "any.required": "Message content is required",
    }),
    chatId: Joi.string().allow(null, '').optional(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    throw new BadRequestError(error.details[0].message);
  }

  next();
}