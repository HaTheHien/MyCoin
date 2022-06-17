const dotenv = require('dotenv');
dotenv.config();
const sha256 = require("crypto-js/sha256");
const {ec} = require('elliptic');
const { addToTransactionPool } = require('./transactionPool');
const { broadcast } = require('./p2pServer');
const { MessageType } = require('./constance');
const EC = new ec('secp256k1');

class UnspentTxOut {
    constructor(txOutId, txOutIndex, address, amount) {
        this.txOutId = txOutId;
        this.txOutIndex = txOutIndex;
        this.address = address;
        this.amount = amount;
    }
}

class TxIn {
    constructor(txOutId, txOutIndex, signature) {
        this.txOutId = txOutId
        this.txOutIndex = txOutIndex
        this.signature = signature
    }
}

class TxOut {
    constructor(address, amount) {
        this.address = address
        this.amount = amount
    }
}

class Transaction {
    constructor(){
        this.id = ""
        this.txIns = []
        this.txOuts = []
    }

    // return string
    getTransactionId(){
        const txInContent = this.txIns
            .map((txIn) => txIn.txOutId + txIn.txOutIndex)
            .reduce((a, b) => a + b, '');
    
        const txOutContent = this.txOuts
            .map((txOut) => txOut.address + txOut.amount)
            .reduce((a, b) => a + b, '');
    
        return sha256(txInContent + txOutContent).toString();
    };

    //check valid transaction
    validateTransaction(){
        if (typeof this.id !== 'string')
        {
            return false;
        }
        if (this.id !== this.getTransactionId())
        {
            console.log("not same id")
            return false;
        }
        for (var item in this.TxIns)
        {
            if (this.validateTxIn(item) === false)
            {
                return false;
            }
        }
        if (this.txIns.length === 0)
        {
            return false;
        }

        // check signature
        const publicKey = this.txIns[0].txOutId;
        const key = EC.keyFromPublic(publicKey, 'hex')
        for (var item in this.TxIns)
        {
            if (key.verify(this.id, item.signature) === false)
            {
                console.log("key not same signature")
                return false;
            }
        }
        
        return true
    }

    validateTxIn(TxIn){
        if (TxIn == null)
        {
            return false;
        }
        if (typeof TxIn.signature !== 'string')
        {
            return false;
        }
        if (TxIn.txOutIndex !== 'string')
        {
            return false;
        }
        if (typeof this.txIns !== 'string')
        {
            return false;
        }
    }
    
}

const getCoinbaseTransaction = (minerAddress, blockIndex) => {
    const t = new Transaction();
    const txIn = new TxIn();
    txIn.signature = '';
    txIn.txOutId = '';
    txIn.txOutIndex = blockIndex;

    t.txIns = [txIn];
    t.txOuts = [new TxOut(minerAddress, process.env.COINBASE_AMOUNT)];
    t.id = getTransactionId(t);
    return t;
};

const toHexString = (byteArray) => {
    return Array.from(byteArray, (byte) => {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
};


const getSignature = (tx, privateKey) =>{
    const key = EC.keyFromPrivate(privateKey, 'hex');
    const signature = toHexString(key.sign(tx.id).toDER());
    return signature
}

const createTransaction = (txIns, txOuts, id) => {
    tx = new Transaction()
    tx.txIns = txIns
    tx.txOuts = txOuts
    tx.id = id
    
    if (tx.validateTransaction() === false)
    {
        return false;
    }

    try{
        addToTransactionPool(tx)
        broadcast(MessageType.ADD_TRANSACTION_TO_POOL,tx)
    }
    catch(e)
    {
        console.log(e);
        return false
    }
    
    return true;
}

module.exports = {
    Transaction,
    createTransaction,
    getSignature,
    toHexString
}