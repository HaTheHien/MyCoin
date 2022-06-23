<template>
    <div class="container">
        
    </div>
</template>

<script>
import axios from 'axios';
import elliptic from 'elliptic';
const EC = elliptic.ec('secp256k1');
export default {
    name: "UserDetail",
    data() {
        return {
            privateKey: "",
            publicKey: "",
            blockChain: [],
            unspentTx: [],
        };
    },
    created () {
        this.privateKey = localStorage.getItem("privateKey_myCoin")
        if (this.privateKey === null)
        {
            this.$router.push("/")
        }
        this.publicKey = EC.keyFromPrivate(this.privateKey, 'hex').getPublic().encode('hex');
        this.getBlockChain().then((result) => {
            this.blockChain = result;
        })
        this.getUnspentTx().then((result) => {
            this.unspentTx = result;
        })
    },
    methods: {
        getBlockChain (){
            return axios.get(`http://localhost:3000/blocks`);
        },
        getUnspentTx(){
            return axios.post('http://localhost:3000/unspentTransactions', {
                publicAddress: this.publicKey,
            })
        }, 
    },
};
</script>

<style scoped>

</style>
