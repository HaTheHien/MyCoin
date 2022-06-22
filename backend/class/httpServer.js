const { conectPeer, getSockets, broadcast } = require('./p2pServer')
const bodyParser = require('body-parser');
const express = require('express');
const { getBlockChain } = require('./blockChain');
const Block = require('./block');
const { findTransaction, getTransactionPool, removeTransactionPool } = require('./transactionPool');
const { createTransaction, getCoinbaseTransaction, findAUnspentTxOuts, Transaction } = require('./transaction');
const { MessageType } = require('./constance');

const initHttpServer = (app) => {
    app.get('/blocks', (req, res) => {
        res.send(getBlockChain().chain);
    });

    app.get('/transaction', (req, res) => {
        res.send(getTransactionPool())
    });

    app.get('/transaction/:id', (req, res) => {
        res.send(findTransaction(req.params.id))
    });

    app.get('/unspentTransactions', (req, res) => {
        const publicAddress = req.body.publicAddress
        res.send(findAUnspentTxOuts(publicAddress))
    });

    app.post('/mineBlock', (req, res) => {
        const transactionId = req.body.transactionId
        const minerAddress = req.body.minerAddress;
        const hash = req.body.hash
        const nonce = req.body.nonce

        const tx = findTransaction(transactionId);

        if (tx === undefined)
        {
            res.send("Not found transaction")
        }

        const minerTx = getCoinbaseTransaction(minerAddress);

        const block = new Block(getBlockChain().getLast().index + 1, getBlockChain().getLast().hash, tx, getBlockChain().difficulty, hash, undefined, minerTx)
        block.nonce = nonce

        const check = getBlockChain().addBlock(block);

        if (check === true)
        {
            broadcast(MessageType.RESPONSE_LASTBLOCK, block)

            // update transaction pool
            removeTransactionPool(tx.id)
            broadcast(MessageType.REMOVE_TRANSACTION_FROM_POOL, tx)
        }

        res.send(check)
    });

    app.post('/createTransaction', (req, res) => {
        const data = req.body.data
        const publicAddress = req.body.publicAddress
        if (data.txIns === null || data.txOuts === null || data.id === null) 
        {
            res.send(false);
            return
        }
        
        if (createTransaction(data.txIns, data.txOuts, data.id, publicAddress) === false)
        {
            res.send(false)
            return;
        }

        tx = new Transaction()
        tx.txIns = data.txIns
        tx.txOuts = data.txOuts
        tx.id = data.id

        broadcast(MessageType.ADD_TRANSACTION_TO_POOL,{tx,publicAddress})
        
        res.send(true);
    });

    app.get('/peers', (req, res) => {
        res.send(getSockets().map(( item ) => item.id));
    });

    app.post('/addPeer', (req, res) => {
        conectPeer(req.body.peer);
        res.send();
    });

    app.post('/stop', (req, res) => {
        res.send({'msg' : 'stopping server'});
        process.exit();
    });
};

module.exports = initHttpServer