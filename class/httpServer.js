const { conectPeer, getSockets } = require('./p2pServer')
const bodyParser = require('body-parser');
const express = require('express');
const { getBlockChain } = require('./blockChain');
const Block = require('./block');

const initHttpServer = (myHttpPort) => {
    const app = express();
    app.use(bodyParser.json());

    app.get('/blocks', (req, res) => {
        res.send(getBlockChain().chain);
    });

    app.get('/transaction/:id', (req, res) => {
        
    });

    app.post('/mineBlock', (req, res) => {
        const transactionId = req.body.transactionId
        const minerAddress = req.body.minerAddress;
        const hash = req.body.hash

        res.send(true)
    });

    app.post('createTransaction', (req, res) => {
        const data = req.body.data
        
        
        res.send(false);
    });

    app.get('/peers', (req, res) => {
        res.send(getSockets().map(( s ) => s._socket.remoteAddress + ':' + s._socket.remotePort));
    });

    app.post('/addPeer', (req, res) => {
        conectPeer(req.body.peer);
        res.send();
    });

    app.post('/stop', (req, res) => {
        res.send({'msg' : 'stopping server'});
        process.exit();
    });
    
    app.listen(myHttpPort, () => {
        console.log(`App listening on port: ${myHttpPort}`);
    });
};

module.exports = initHttpServer