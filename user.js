const Wallet = require("./class/wallet")

var wallet = new Wallet()

console.log("public key" + wallet.getPublicKey())
console.log("private key" + wallet.getPrivateFromWallet())