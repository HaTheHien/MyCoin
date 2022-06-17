const { Transaction, getSignature } = require("./class/transaction");

tx = new Transaction()
tx.txIns = [{"signature": "", "txOutId": "044a916f2a55fc5233b4f335da34e9bd40f2435c23ee9b534c3a607c3fedf64534b57aeaab6f8593a1d5c4c2829067ba5ceb36a507df1d6274648e2f1ba462a821", "txOutIndex": 0}]
tx.txOuts = [{
    "address": "044a916f2a55fc5233b4f335da34e9bd40f2435c23ee9b534c3a607c3fedf64534b57aeaab6f8593a1d5c4c2829067ba5ceb36a507df1d6274648e2f1ba462a821",
    "amount": 20
}]
tx.id = tx.getTransactionId()
console.log(tx.id)
console.log(getSignature(tx, "044a916f2a55fc5233b4f335da34e9bd40f2435c23ee9b534c3a607c3fedf64534b57aeaab6f8593a1d5c4c2829067ba5ceb36a507df1d6274648e2f1ba462a821"))
