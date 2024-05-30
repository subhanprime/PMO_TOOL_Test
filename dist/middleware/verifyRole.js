"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const customError_1 = __importDefault(require("../Errors/customError"));
const verifyRole = (...roles) => {
    return (req, res, next) => {
        if (!roles)
            return next(new customError_1.default("Please Provide role", 401));
        if (req.role && roles.includes(req.role)) {
            next();
        }
        else {
            return next(new customError_1.default("You are not Eligible For this Route", 401));
        }
    };
};
exports.default = verifyRole;
