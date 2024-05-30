"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const swaggerDefinition = require('./swaggerDefinition');
const swaggerDefinition_1 = __importDefault(require("./swaggerDefinition"));
const options = {
    swaggerDefinition: swaggerDefinition_1.default,
    apis: ['./index.ts', './routes/**/*.ts', './controllers/**/*.ts'], // Path to the API routes folder
};
// const options = {
//     definition: {
//         openapi: '3.0.0',
//         info: {
//             title: 'User Status API',
//             version: '1.0.0',
//             description: 'API to check the status of users'
//         },
//     },
//     // Path(s) to the API route files
//     apis: ['./index.ts', './**/*.ts'],  // Replace this with your actual API route path
// };
exports.default = options;
