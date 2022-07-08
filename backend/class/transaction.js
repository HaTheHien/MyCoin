const dotenv = require('dotenv');
dotenv.config();
const sha256 = require("crypto-js/sha256");
const { ec } = require('elliptic');
const { addToTransactionPool, getTransactionPool } = require('./transactionPool');
const { MessageType } = require('./constance');
const { getBlockChain } = require('./blockChain');
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
        this.publicKey = ""
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
    validateTransaction(publicAddress){
        if (typeof this.id !== 'string')
        {
            return false;
        }
        if (this.id !== this.getTransactionId())
        {
            console.log("not same id transaction")
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

        const aUnspentTxOuts = findAUnspentTxOuts(publicAddress)

        const totalTxInValues = aUnspentTxOuts
            .map((aUnspentTxOut) => aUnspentTxOut.amount)
            .reduce((a, b) => (a + b), 0);

        const totalTxOutValues = this.txOuts
            .map((txOut) => txOut.amount)
            .reduce((a, b) => (a + b), 0);

        if (totalTxInValues !== totalTxOutValues)
        {
            console.log("Current unspentTx in and out not same");
            return false;
        }

        // check signature
        const publicKey = publicAddress;
        const key = EC.keyFromPublic(publicKey, 'hex')

        for (var index=0;index< this.txIns.length; index++)
        {
            var item = this.txIns[index]
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
        if (typeof TxIn.txOutId !== 'string')
        {
            return false;
        }
        if (typeof this.txIns !== 'string')
        {
            return false;
        }
        return true;
    }
}

const findAUnspentTxOuts = (publicAddress) =>{
    var unspentTxOuts = [] 
    const blocks = getBlockChain()
    //console.log(blocks.chain)
    const key = EC.keyFromPublic(publicAddress, 'hex')
    for (var index=0;index< blocks.chain.length; index++) {
        const block = blocks.chain[index];
        for (var index2 = 0; index2 < block.data.txOuts.length; index2++) {
            const item2 = block.data.txOuts[index2]
            if (item2.address === publicAddress) {
                unspentTxOuts.push(new UnspentTxOut(block.data.id,block.index, item2.address, item2.amount))
            }
        }
        if (block.mineData !== undefined)
        {
            for (var index2=0;index2< block.mineData.txOuts.length; index2++) {
                const item2 = block.mineData.txOuts[index2]
                if (item2.address === publicAddress) {
                    unspentTxOuts.push(new UnspentTxOut(block.data.id,block.index, item2.address, item2.amount))
                }
            }
        }
        if (block.data.txIns.length > 0)
        {
            if (block.data.id !== "" && block.data.txIns[0].txOutId !== "" && key.verify(block.data.id, block.data.txIns[0].signature) === true) {
                for (var index2=0;index2< block.data.txOuts.length; index2++) {
                    const item2 = block.data.txOuts[index2]
                    unspentTxOuts.push(new UnspentTxOut(block.data.id, block.index, item2.address, -item2.amount))
                }
                
            }
        }
    }
    for (var index=0; index < getTransactionPool().length; index++) {
        const data = getTransactionPool()[index];
        if (data.txIns.length > 0)
        {
            if (data.id !== "" && key.verify(data.id, data.txIns[0].signature) === true) {
                for (var index2=0;index2< data.txOuts.length; index2++) {
                    const item2 = data.txOuts[index2]
                    unspentTxOuts.push(new UnspentTxOut('transaction pool', 'transaction pool', item2.address, -item2.amount))
                }
            }
        }
    }
    return unspentTxOuts;
}

const getCoinbaseTransaction = (minerAddress) => {
    const t = new Transaction();
    const txIn = new TxIn();
    txIn.signature = '';
    txIn.txOutId = '';
    txIn.txOutIndex = 0;

    t.txIns = [txIn];
    t.txOuts = [new TxOut(minerAddress, process.env.COINBASE_AMOUNT)];
    t.id = t.getTransactionId(t);
    t.publicKey = undefined
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

const createTransaction = (txIns, txOuts, id, publicAddress) => {
    tx = new Transaction()
    tx.txIns = txIns
    tx.txOuts = txOuts
    tx.id = id
    tx.publicKey = publicAddress
    
    if (tx.validateTransaction(publicAddress) === false)
    {
        return false;
    }

    try{
        addToTransactionPool(tx, publicAddress)
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
    toHexString,
    getCoinbaseTransaction,
    findAUnspentTxOuts
}