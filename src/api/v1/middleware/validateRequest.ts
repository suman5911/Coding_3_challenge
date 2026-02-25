import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";
import { HTTP_STATUS } from "../../../constants/httpConstants";
 
interface RequestSchemas {
  body?: ObjectSchema;
  params?: ObjectSchema;
  query?: ObjectSchema;
}
 
/**
 * Validates incoming requests against Joi schemas
 * @param schemas - Object containing schemas for body, params, and query
 * @returns Express middleware function
 */
export const validateRequest = (schemas: RequestSchemas) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors: string[] = [];
 
      const validatePart = (
        schema: ObjectSchema,
        data: any,
        partName: string,
        shouldStrip: boolean
      ) => {
        const { error, value } = schema.validate(data, {
          abortEarly: false,
          stripUnknown: shouldStrip,
        });
        if (error) {
          errors.push(
            ...error.details.map(
              (detail) => `${detail.message}`
            )
          );
        } else if (shouldStrip) {
          return value;
        }
        return data;
      };
 
      if (schemas.body) {
        req.body = validatePart(schemas.body, req.body, "Body", true);
      }
      if (schemas.params) {
        req.params = validatePart(schemas.params, req.params, "Params", false);
      }
      if (schemas.query) {
        req.query = validatePart(schemas.query, req.query, "Query", true);
      }
 
      if (errors.length > 0) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          message: `Validation error: ${errors.join(", ")}`,
        });
        return;
      }
 
      next();
    } catch (error: unknown) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: (error as Error).message,
      });
    }
  };
};
 