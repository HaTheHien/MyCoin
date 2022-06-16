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

    app.post('/mineBlock', (req, res) => {
        if (req.body === null) {
            res.send('data parameter is missing');
            return;
        }
        const data = req.body;
        const newBlock= new Block(data.index, data.prevHash, data.data, data.difficulty, data.timestamp, data.hash);
        if(!newBlock.valid())
        {
            res.send(false)
        }
        res.send(newBlock);
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