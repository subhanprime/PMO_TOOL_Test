import { Request, Response, NextFunction } from 'express';
import CustomError from './customError';

const ErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof CustomError) {
        res.status(err.statusCode).json({ message: err.message, status: false });
    } else {
        err.message = err.message || "Internal Server Error";
        const statusCode = (err as any).statusCode || 500;
        res.status(statusCode).json({ message: err.message, status: false });
    }
};

export default ErrorHandler;