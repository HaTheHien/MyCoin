const elliptic = require('elliptic')
const EC = new elliptic('secp256k1');
const fs = require('fs');
const lodash = require('lodash')
const dotenv = require('dotenv');
dotenv.config();

class Wallet{
    constructor(){
        if (fs.existsSync(privateKeyLocation)) {
            return;
        }
        const newPrivateKey = generatePrivateKey();

        // save to current computer
        fs.writeFileSync(process.env.SAVE_PRIVATE_KEY, newPrivateKey);
    }

    getPrivateFromWallet(){
        const buffer = fs.readFileSync(process.env.SAVE_PRIVATE_KEY, 'utf8');
        return buffer.toString();
    };

    setPrivateFromWallet(){
        const buffer = fs.writeFileSync(process.env.SAVE_PRIVATE_KEY, newPrivateKey);
        return buffer.toString();
    };
    
    generatePrivateKey(){
        const keyPair = EC.genKeyPair();
        const privateKey = keyPair.getPrivate();
        return privateKey.toString(16);
    };

    getPublicKey(){
        const privateKey = getPrivateFromWallet();
        const key = EC.keyFromPrivate(privateKey, 'hex');
        return key.getPublic().encode('hex');
    }

    createTransaction(receiverAddress, amount,
        unspentTxOuts, txPool){
        const myAddress = getPublicKey();
        const myUnspentTxOutsA = unspentTxOuts.filter((uTxO) => uTxO.address === myAddress);
    }
}

module.exports = Wallet