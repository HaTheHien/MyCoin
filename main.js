const initHttpServer = require('./class/httpServer');
const dotenv = require('dotenv');
const { initP2P } = require('./class/p2pServer');
dotenv.config();

initHttpServer(process.env.HTTP_SERVER_PORT);
initP2P(process.env.P2P_SERVER_PORT)
