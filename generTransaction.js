const { Transaction, getSignature } = require("./class/transaction");

tx = new Transaction()
tx.txIns = [{"signature": "", 
"txOutId": "255fcd8a2eded4f036b397c4f83b724a2c18d8738e7fe5d479c95845eb5de617", 
"txOutIndex": 0}]
tx.txOuts = [
    {
    "address": "abc",
    "amount": 20
},
{
    "address": "044a916f2a55fc5233b4f335da34e9bd40f2435c23ee9b534c3a607c3fedf64534b57aeaab6f8593a1d5c4c2829067ba5ceb36a507df1d6274648e2f1ba462a821",
    "amount": 480
}
]
tx.id = tx.getTransactionId()
console.log(tx.id)
console.log(getSignature(tx, "323acb1917d5545644fcb6de4cbae73fd2768abed9137ecdba669bc854cda1ac"))
