const Block = require("./class/block");

var block = new Block(
    1,
    "02ee01ad38fa67d1d86ca89370ba2c832c926482dd795140406ad32d35fb8a72",
    {
        "id": "456cfdc7ce9850c14602d4bbced85f3c56db40828f6260e04d44ab57212327ef",
        "txIns": [
            {
                "signature": "3045022100b8f33525e97b6c7263793a5e63decd095a20457162f54053662e0b91d9920467022058e289e5d3b133685d2d041f32ca0a5351b0daf2e26f8f5770075f2e449f59cb",
                "txOutId": "255fcd8a2eded4f036b397c4f83b724a2c18d8738e7fe5d479c95845eb5de617",
                "txOutIndex": 0
            }
        ],
        "txOuts": [
            {
                "address": "abc",
                "amount": 20
            },
            {
                "address": "044a916f2a55fc5233b4f335da34e9bd40f2435c23ee9b534c3a607c3fedf64534b57aeaab6f8593a1d5c4c2829067ba5ceb36a507df1d6274648e2f1ba462a821",
                "amount": 480
            }
        ]
    },
    2
)
block.mine()

console.log(block.hash)
console.log(block.nonce)