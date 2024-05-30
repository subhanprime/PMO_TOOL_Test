// const CustomError = require('../errors/customError.js');
import { Response, Request, NextFunction } from "express";
import CustomError from "../Errors/customError";

interface CustomRequest extends Request {
  role?: string; // Define the 'role' property as optional
}
const verifyRole = (...roles: any) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!roles) return next(new CustomError("Please Provide role", 401));
    if (req.role && roles.includes(req.role)) {
      next();
    } else {
      return next(new CustomError("You are not Eligible For this Route", 401));
    }
  };
};

export default verifyRole;
