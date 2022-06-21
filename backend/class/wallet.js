const {ec} = require('elliptic')
const EC = new ec('secp256k1');
const dotenv = require('dotenv');
dotenv.config();

class Wallet{
    constructor(){
        this.privateKey = this.generatePrivateKey();
    }

    getPrivateFromWallet(){
        const buffer = this.privateKey
        return buffer.toString();
    };
    
    generatePrivateKey(){
        const keyPair = EC.genKeyPair();
        const privateKey = keyPair.getPrivate();
        return privateKey.toString(16);
    };

    getPublicKey(){
        const privateKey = this.getPrivateFromWallet();
        const key = EC.keyFromPrivate(privateKey, 'hex');
        return key.getPublic().encode('hex');
    }

    createTransaction(receiverAddress, amount,
        unspentTxOuts, txPool){
        const myAddress = this.getPublicKey();
        const myUnspentTxOutsA = unspentTxOuts.filter((uTxO) => uTxO.address === myAddress);
    }
}

module.exports = Wallet