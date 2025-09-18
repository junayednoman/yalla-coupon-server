import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

export const handleZodValidation = (schema: AnyZodObject, { formData }: { formData?: boolean } = {}) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (formData && req.body.payload) {
      await schema?.parseAsync(JSON.parse(req.body.payload))
      req.body = JSON.parse(req.body.payload)
    }
    else {
      await schema?.parseAsync(req.body)
    }
    next()
  } catch (error) {
    next(error)
  }
}
