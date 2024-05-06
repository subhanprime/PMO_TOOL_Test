
import { config } from 'dotenv';
config();
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
// const bodyParser = require('body-parser');
import bodyParser from 'body-parser';
import { pool, sequelize } from './db/pgdb';
import rootRouter from './routes/index';
import ErrorHandler from './Errors/errorHandler';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import options from './swaggerOptions';

const app = express();

const corsOptions = {
    origin: '*', // Allow requests from all origins
    methods: 'GET,POST,PUT,DELETE', // Allow specific HTTP methods
    // allowedHeaders: 'Content-Type,Authorization', // Allow specific headers
    // optionsSuccessStatus: 200 // Set a custom success status code for preflight OPTIONS requests
};
// Initialize Swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);

// Serve Swagger documentation using swagger-ui-express
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// app.use(helmet());
app.use(cors());
// Parse incoming request bodies in a middleware before your handlers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("*", ErrorHandler);



const port = 8080;


app.use('/api', rootRouter);


async function testDatabaseConnection() {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}


app.get('/', async (req: Request, res: Response) => {
    console.log('running');
    try {
        const { rows } = await pool.query(`select * from users`)
        res.status(200).json({ message: "PMO Tool work", data: rows })
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port  ${port}`);
    testDatabaseConnection()
});