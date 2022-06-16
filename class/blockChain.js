const Block = require('./block.js');

const genesisBlock = new Block(
    0, '816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7', {
        init: true
    }, this.difficulty, 1465154705
);

var blocks = null;

function initBlockChain(){
    blocks =  new BlockChain(2);
}

function getBlockChain(){
    return blocks;
}

class BlockChain{
    constructor(difficulty) {
        this.chain = [genesisBlock]
        this.difficulty = difficulty
    }

    getLast(){
        return this.chain[this.chain.length - 1]
    }

    addBlock(newBlock){
        if (checkValidNewBlock(newBlock, this.getLast())) {
            this.chain.push(newBlock);
            return true;
        }
        return false;
    }

    checkValid(chain){
        for (let i=1;i<chain.length;i++) {
            const curBlock = this.chain[i];
            const preBlock = this.chain[i-1];

            if (curBlock.hash !== curBlock.caculateHash())
            {
                return false
            }

            if (curBlock.prevHash !== preBlock.hash)
            {
                return false
            }
        }
        return true
    }

    checkValidNewBlock(newBlock, preBlock){
        if (this.getLast().index + 1 !== newBlock.index)
        {
            return false;
        }
        if (preBlock.hash !== newBlock.prevHash)
        {
            return false;
        }
        if (newBlock.hash !== newBlock.caculateHash())
        {
            return false;
        }
        if(!newBlock.hash.startsWith('0'.repeat(this.difficulty)))
        {
            return false;
        }
        return true;
    }

    replaceChain(newBlocks){
        if (this.checkValid(newBlocks) && newBlocks.length > this.chain.length) {
            console.log('Received blockchain is valid. Replacing current blockchain with received blockchain');
            this.chain = newBlocks;
        } else {
            console.log('Received blockchain invalid');
        }
    };
}

module.exports = {
    getBlockChain,
    initBlockChain,
}
