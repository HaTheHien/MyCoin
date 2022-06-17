const sha256 = require("crypto-js/sha256");

class Block{
    constructor(index, prevHash, data, difficulty, hash=undefined)
    {
        this.index = index
        this.prevHash = prevHash
        this.data = data
        this.difficulty = difficulty
        this.timestamp = new Date().getMilliseconds
        this.hash = hash != undefined ? hash : this.caculateHash()
        this.nonce = 0
    }

    caculateHash(){
        return sha256(this.prevHash + JSON.stringify(this.data) + this.timestamp + this.nonce).toString();
    }

    mine(){
        while(!this.hash.startsWith('0'.repeat(this.difficulty))){
            this.nonce++
            this.hash = this.caculateHash()
        }
    }

    valid(){
        return this.hash.startsWith('0'.repeat(this.difficulty))
    }
}

module.exports = Block
