import { server } from "typescript";

const swaggerDefinition = {
    info: {
        title: 'PMO Toll',
        version: '1.0.0',
        description: 'PMO Toll API is here',
    },
    server: [
        {
            url: 'https://9393-39-59-52-9.ngrok-free.app',
        }
    ],
};

export default swaggerDefinition;
