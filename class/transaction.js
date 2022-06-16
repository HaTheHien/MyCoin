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
        this.TxIns = []
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
    
        return CryptoJS.SHA256(txInContent + txOutContent).toString();
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
        if (this.validateTxIn() == false)
        {
            return false;
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