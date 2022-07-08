const Block = require("./class/block");

var block = new Block(
    1,
    "02ee01ad38fa67d1d86ca89370ba2c832c926482dd795140406ad32d35fb8a72",
    {
        "id": "478734297d86fcd51fd50f40f21da0dfbb62d3adb2ebd78ba39b4e984d822c9b",
        "txIns": [
            {
                "signature": "304402205060b9c666a3550e9ca572b88b6fd8014047fe9f2cf85e77bb6360f228f6439b02200253b6a3e30c910ec4618312e2ba8ef5b4cf947a23a34e00e961bc33822255b0",
                "txOutId": "255fcd8a2eded4f036b397c4f83b724a2c18d8738e7fe5d479c95845eb5de617",
                "txOutIndex": 0
            }
        ],
        "txOuts": [
            {
                "address": "abc",
                "amount": 12
            },
            {
                "address": "044a916f2a55fc5233b4f335da34e9bd40f2435c23ee9b534c3a607c3fedf64534b57aeaab6f8593a1d5c4c2829067ba5ceb36a507df1d6274648e2f1ba462a821",
                "amount": 488
            }
        ],
        "publicKey": "044a916f2a55fc5233b4f335da34e9bd40f2435c23ee9b534c3a607c3fedf64534b57aeaab6f8593a1d5c4c2829067ba5ceb36a507df1d6274648e2f1ba462a821"
    },
    2
)
block.mine()

console.log(block.hash)
console.log(block.nonce)