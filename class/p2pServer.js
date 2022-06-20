const { ioClient } = require("socket.io-client");
const express = require('express');
const { getBlockChain, BlockChain } = require("./blockChain");
const { updateAllTransactionPool, addToTransactionPool, getTransactionPool } = require("./transactionPool");
const { MessageType } = require("./constance");
const Block = require("./block");

const sockets = [];

const getSockets = ()=>{
    return sockets;
}

const initP2P = (p2pPort)=>{
    const app = express();
    const http = require('http').Server(app);

    http.listen(p2pPort, () => {
        console.log(`Socket listening on port: ${p2pPort}`);
    });

    const io = require('socket.io')(http,{
        cors: {
            origin: '*',
        }
    })

    io.on('connection', (socket) => {
        console.log('P2P connection ');
        sockets.push(io);
        initConnection(io);
    });

    io.on("disconnect", (reason) => {
        console.log('P2P disconnection ');
    });
}

const queryChainLengthMsg = (io) => io.emit(MessageType.QUERY_LATEST, null);

const broadcast = (type, message) =>{
    for (var item in sockets)
    {
        item.emit(type, message);
    }
} 

const queryTransactionPoolMsg = (io) => io.emit(MessageType.QUERY_TRANSACTION_POOL, null)

initHandleMessage = (io) =>{
    // listen
    io.on(MessageType.QUERY_LATEST,(data)=>{
        io.emit(MessageType.RESPONSE_LASTBLOCK, getBlockChain().getLast())
    })
    io.on(MessageType.QUERY_ALL,(data)=>{
        io.emit(MessageType.RESPONSE_BLOCKCHAIN,getBlockChain().chain)
    })
    io.on(MessageType.RESPONSE_BLOCKCHAIN,(data)=>{
        getBlockChain().replaceChain(data)
    })
    io.on(MessageType.RESPONSE_LASTBLOCK,(data)=>{
        if (getBlockChain().chain.length <= data.index)
        {
            io.emit(MessageType.QUERY_ALL)
        }
        if (getBlockChain().chain.length - 1 === data.index && getBlockChain().chain[0].timestamp > data.timestamp)
        {
            this.chain[this.chain.length - 1] = new Block(data.index, data.preHash, data.data, data.difficulty, data.hash, data.timestamp, data.mineData)
        }
    })
    io.on(MessageType.QUERY_TRANSACTION_POOL,(data)=>{
        io.emit(MessageType.RESPONSE_TRANSACTION_POOL, getTransactionPool());
    })
    io.on(MessageType.RESPONSE_TRANSACTION_POOL, (data)=>{
        if (data.length > getTransactionPool().length)
        {
            updateAllTransactionPool(data);
        }
    })
    io.on(MessageType.ADD_TRANSACTION_TO_POOL, (data) =>{
        try{
            addToTransactionPool(data)
        }
        catch(e)
        {
            
        }
    })
    
}

const initConnection = (io) => {
    initHandleMessage(io);
    queryChainLengthMsg(io)

    queryTransactionPoolMsg(io);
}

const conectPeer = (domain) =>{
    const io = ioClient(domain)

    io.on('connection', (socket) => {
        console.log('New socket connection ');
        sockets.push(io);
        initConnection(io);
    });

    io.on("disconnect", (reason) => {
        console.log('P2P disconnection ');
    });
}

module.exports = {
    initP2P,
    conectPeer,
    getSockets,
    broadcast,
    sockets
}