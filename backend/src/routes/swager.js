import express from "express";
import swaggerJSDoc from 'swagger-jsdoc';

const router = express.Router();

const swaggerOptions = {
    definition: {
        openapi: '3.0.0', // latest version
        info: {
            title: 'My Cool API',
            version: '1.0.0',
            description: 'This is a simple API made by Bestie 💖'
        },
        servers: [
            {
                url: 'http://localhost:3000', // your server URL
            },
        ],
    },
    apis: ['../index.js'], // where your API routes are written
};
export const swaggerSpec = swaggerJSDoc(swaggerOptions);