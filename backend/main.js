const initHttpServer = require('./class/httpServer');
const dotenv = require('dotenv');
const { initP2P } = require('./class/p2pServer');
const { initBlockChain } = require('./class/blockChain');
const http = require('http')
const cors = require('cors')
const express = require('express');
dotenv.config();

initBlockChain()

const app = express();
app.use(express.json());

app.use(
	cors({
		methods: 'GET,PATCH,POST,DELETE,PUT',
	})
);
initHttpServer(app);

var server = http.createServer(app);

initP2P(server)

server.listen(process.env.HTTP_SERVER_PORT, () => {
    console.log(`App listening on port: ${process.env.HTTP_SERVER_PORT}`);
});


