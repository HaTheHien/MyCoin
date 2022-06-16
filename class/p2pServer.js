const { ioClient } = require("socket.io-client");
const express = require('express');
const { getBlockChain, BlockChain } = require("./blockChain");

const sockets = [];

const MessageType =  {
    "QUERY_LATEST": "QUERY_LATEST",
    "RESPONSE_LASTBLOCK":"RESPONSE_LASTBLOCK",
    "QUERY_ALL":"QUERY_ALL",
    "RESPONSE_BLOCKCHAIN":"RESPONSE_BLOCKCHAIN",
    "QUERY_TRANSACTION_POOL":"QUERY_TRANSACTION_POOL",
    "RESPONSE_TRANSACTION_POOL": "RESPONSE_TRANSACTION_POOL",
}

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
    })
    io.on(MessageType.QUERY_TRANSACTION_POOL,(data)=>{
        
    })
    io.on(MessageType.RESPONSE_TRANSACTION_POOL, (data)=>{
        
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
}