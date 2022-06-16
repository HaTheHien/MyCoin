const dotenv = require('dotenv');
dotenv.config();
const sha256 = require("crypto-js/sha256");

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
        this.txIns = [{'signature': '', 'txOutId': '', 'txOutIndex': 0}]
        this.txOuts = [{
            'address': '044a916f2a55fc5233b4f335da34e9bd40f2435c23ee9b534c3a607c3fedf64534b57aeaab6f8593a1d5c4c2829067ba5ceb36a507df1d6274648e2f1ba462a821',
            'amount': 500
        }]
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
            return false;
        }
        for (var item in this.TxIns)
        {
            if (this.validateTxIn(item) === false)
            {
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

const addTransaction = (receiverAddress, amount, minerAddress, hash) => {
    const transactionCoinBase =  getCoinbaseTransaction(minerAddress, getBlockChain().getLast().index + 1)

    const newBlock= new Block(blockChain.getLast().index + 1, blockChain.getLast().prevHash, data.data, blockChain.difficulty, hash);
    if(getBlockChain().addBlock(newBlock))
    {
        res.send(newBlock);
        return;
    }
}

module.exports = {
    Transaction
}