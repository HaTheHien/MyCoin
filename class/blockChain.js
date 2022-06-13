const Block = require('./block.js');

class BlockChain{
    constructor(difficulty) {
        const block = new Block(0,'',{init: true}, this.difficulty);
        this.chain = [block]
        this.difficulty = difficulty
    }

    getLast(){
        return this.chain[this.chain.length - 1]
    }

    addBlock(data){
        const newBlock = new Block(this.chain.length,this.getLast().hash,data, this.difficulty);
        newBlock.mine(this.difficulty)

        this.chain.push(newBlock)
    }

    checkValid(){
        for (let i=1;i<this.chain.length;i++) {
            const curBlock = this.chain[i];
            const preBlock = this.chain[i-1];

            if (curBlock.hash != curBlock.caculateHash())
            {
                return false
            }

            if (curBlock.prevHash != preBlock.hash)
            {
                return false
            }
        }
        return true
    }
}

module.exports = BlockChain
