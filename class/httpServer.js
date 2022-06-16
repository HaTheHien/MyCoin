const { conectPeer, getSockets } = require('./p2pServer')
const bodyParser = require('body-parser');
const express = require('express');

const initHttpServer = ( myHttpPort) => {
    const app = express();
    app.use(bodyParser.json());

    app.get('/blocks', (req, res) => {
        res.send(getBlockchain());
    });

    app.post('/mineBlock', (req, res) => {
        const newBlock= generateNextBlock(req.body.data);
        res.send(newBlock);
    });

    app.get('/peers', (req, res) => {
        res.send(getSockets().map(( s ) => s._socket.remoteAddress + ':' + s._socket.remotePort));
    });

    app.post('/addPeer', (req, res) => {
        conectPeer(req.body.peer);
        res.send();
    });
    
    app.listen(myHttpPort, () => {
        console.log(`App listening on port: ${myHttpPort}`);
    });
};

module.exports = initHttpServer