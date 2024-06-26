"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomError extends Error {
    statusCode;
    constructor(message, statusCode) {
        super(message);
        Object.setPrototypeOf(this, CustomError.prototype);
        this.statusCode = statusCode;
    }
}
exports.default = CustomError;
