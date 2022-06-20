var transactionPool = [];

const getTransactionPool = ()=>{
    return transactionPool;
}

const addToTransactionPool = (tx, publicAddress) => {
    if (!tx.validateTransaction(publicAddress)) {
        throw Error('Trying to add invalid tx to pool');
    }

    if (!isValidTxForPool(tx)) {
        throw Error('Trying to add invalid tx to pool');
    }

    transactionPool.push(tx);
};

const findTransaction = (id) =>{
    return transactionPool.find((item)=>item.id = id);
}

const removeTransactionPool = (tx) => {
    var newTransactionPool = []
    for (var index=0;index< transactionPool.length; index++)
    {
        var item = transactionPool[index];
        if (item.id !== tx.id)
        {
            newTransactionPool.push(item);
        }
    }
    transactionPool = newTransactionPool;
};

const updateAllTransactionPool = (txs) => {
    transactionPool = txs;
};

const isValidTxForPool = (tx) => {
    for (var txPoolIn in transactionPool)
    {
        for (var txIn in tx.txIns)
        {
            if (txIn.txOutIndex === txPoolIn.txOutIndex && txIn.txOutId === txPoolIn.txOutId)
            {
                console.log('txIn already found in the txPool');
                return false;
            }
        }
    }

    return true;
};

module.exports = {
    addToTransactionPool,
    updateAllTransactionPool,
    removeTransactionPool,
    findTransaction,
    getTransactionPool
}