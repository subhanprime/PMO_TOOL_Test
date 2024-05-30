"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const customError_1 = __importDefault(require("./customError"));
const ErrorHandler = (err, req, res, next) => {
    if (err instanceof customError_1.default) {
        res.status(err.statusCode).json({ message: err.message, status: false });
    }
    else {
        err.message = err.message || "Internal Server Error";
        const statusCode = err.statusCode || 500;
        res.status(statusCode).json({ message: err.message, status: false });
    }
};
exports.default = ErrorHandler;
