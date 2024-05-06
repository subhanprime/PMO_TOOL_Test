// const swaggerDefinition = require('./swaggerDefinition');
import swaggerDefinition from './swaggerDefinition';

const options = {
    swaggerDefinition,
    apis: ['./index.ts', './routes/**/*.ts','./controllers/**/*.ts'],// Path to the API routes folder
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
export default options;
