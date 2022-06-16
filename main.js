const initHttpServer = require('./class/httpServer');
const dotenv = require('dotenv');
dotenv.config();

initHttpServer(process.env.HTTP_SERVER_PORT);
