const Block = require('./block.js');

const genesisBlock = new Block(
    0, '816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7', 
    {
        'txIns': [{'signature': '', 'txOutId': '', 'txOutIndex': 0}],
        'txOuts': [{
            'address': '044a916f2a55fc5233b4f335da34e9bd40f2435c23ee9b534c3a607c3fedf64534b57aeaab6f8593a1d5c4c2829067ba5ceb36a507df1d6274648e2f1ba462a821',
            'amount': 500
        }],
        'id': '255fcd8a2eded4f036b397c4f83b724a2c18d8738e7fe5d479c95845eb5de617'
    }, 
    this.difficulty, undefined, 1465154705
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
        if (this.checkValidNewBlock(newBlock, this.getLast())) {
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
            console.log("Not same pre hash")
            return false;
        }
        if (newBlock.hash !== newBlock.caculateHash())
        {
            console.log("Hash not correct")
            return false;
        }
        if(!newBlock.hash.startsWith('0'.repeat(this.difficulty)))
        {
            console.log("Not correct diffcult in hash")
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
