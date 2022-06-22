const ioClient = require("socket.io-client");
const { getBlockChain, BlockChain } = require("./blockChain");
const { updateAllTransactionPool, addToTransactionPool, getTransactionPool, removeTransactionPool } = require("./transactionPool");
const { MessageType } = require("./constance");
const Block = require("./block");
const { Transaction } = require("./transaction");

const { Server } = require('socket.io');

const sockets = [];

const getSockets = ()=>{
    return sockets;
}

const initP2P = (server)=>{
    const io = new Server(server, {
        cors: {
            origin: '*',
        }
    });

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
    for (var index =0;index<sockets.length;index++)
    {
        var item = sockets[index];
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
        var txs = [];
        for (var index=0;index <data.length;index++)
        {
            var item = data[index]
            var tx = new Transaction()
            tx.id = item.id
            tx.txIns = item.txIns
            tx.txOuts = item.txOuts
            txs.push(tx)
        }
        updateAllTransactionPool(txs);
    })
    io.on(MessageType.REMOVE_TRANSACTION_FROM_POOL, (data)=>{
        const id = data.id;
        removeTransactionPool(id)
    })
    io.on(MessageType.ADD_TRANSACTION_TO_POOL, (data) =>{
        try{
            var tx = new Transaction()
            tx.id = data.tx.id
            tx.txIns = data.tx.txIns
            tx.txOuts = data.tx.txOuts
            addToTransactionPool(tx,data.publicAddress)
        }
        catch(e)
        {
            console.log(e)
        }
    })
    
}

const initConnection = (io) => {
    initHandleMessage(io);
    queryChainLengthMsg(io)

    queryTransactionPoolMsg(io);
}

const conectPeer = (domain) =>{
    const io = ioClient.io(domain)

    io.on('connect', (socket) => {
        console.log('New socket connection ');
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