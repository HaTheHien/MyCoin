const { conectPeer, getSockets } = require('./p2pServer')
const bodyParser = require('body-parser');
const express = require('express');
const { getBlockChain } = require('./blockChain');
const Block = require('./block');
const { findTransaction, getTransactionPool } = require('./transactionPool');
const { createTransaction } = require('./transaction');

const initHttpServer = (myHttpPort) => {
    const app = express();
    app.use(bodyParser.json());

    app.get('/blocks', (req, res) => {
        res.send(getBlockChain().chain);
    });

    app.get('/transaction', (req, res) => {
        res.send(getTransactionPool())
    });

    app.get('/transaction/:id', (req, res) => {
        res.send(findTransaction(req.params.id))
    });

    app.post('/mineBlock', (req, res) => {
        const transactionId = req.body.transactionId
        const minerAddress = req.body.minerAddress;
        const hash = req.body.hash

        res.send(true)
    });

    app.post('/createTransaction', (req, res) => {
        const data = req.body
        if (data.txIns === null || data.txOuts === null || data.id === null) 
        {
            res.send(false);
            return
        }
        
        if (createTransaction(data.txIns, data.txOuts, data.id) === false)
        {
            res.send(false)
            return;
        }
        
        res.send(true);
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