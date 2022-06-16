const { ioClient } = require("socket.io-client");
const express = require('express');

const sockets = [];

const MessageType =  {
    "QUERY_LATEST": "QUERY_LATEST",
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

const queryChainLengthMsg = () => ({'type': MessageType.QUERY_LATEST, 'data': null});

const queryTransactionPoolMsg = () => ({
    'type': MessageType.QUERY_TRANSACTION_POOL,
    'data': null
});

initHandleMessage = (io) =>{
    // listen
    io.on(MessageType.QUERY_LATEST,(data)=>{
        io.emit()
    })
    io.on(MessageType.QUERY_ALL,(data)=>{
        io.emit()
    })
    io.on(MessageType.RESPONSE_BLOCKCHAIN,(data)=>{
        io.emit()
    })
    io.on(MessageType.QUERY_TRANSACTION_POOL,(data)=>{
        io.emit()
    })
    io.on(MessageType.RESPONSE_TRANSACTION_POOL, (data)=>{
        io.emit()
    })
    
}

const initConnection = (io) => {
    initHandleMessage(io);
    io.emit(MessageType.QUERY_LATEST, queryChainLengthMsg());

    broadcast(queryTransactionPoolMsg());
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

const broadcast = (message) => sockets.forEach((socket) => write(socket, message));

module.exports = {
    initP2P,
    conectPeer,
    getSockets,
    broadcast,
}