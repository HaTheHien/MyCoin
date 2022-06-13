const BlockChain = require('./class/blockChain.js');

const mychain = new BlockChain(2)
mychain.addBlock({hello: '1'})
mychain.addBlock({hello: '2'})
mychain.addBlock({hello: '3'})

console.log(mychain.chain)
console.log(mychain.checkValid())