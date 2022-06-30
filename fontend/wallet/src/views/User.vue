<template>
<v-container class="ma-2 pa-0">
    <v-card>
        <v-card-actions>
            
        <v-spacer></v-spacer>
        <v-btn
            depressed
            color="primary"
            @click="reload">
            Reload
            
        </v-btn>
        <v-btn
            depressed
            color="primary">
            Create new transaction
        </v-btn>
        </v-card-actions>
        <v-row no-gutters>
            <v-tabs fixed-tabs>
                <v-tab >My trading</v-tab>
                <v-tab >All trading</v-tab>

                <v-tab-item>
                    <v-container class="pa-6">
                        <MyTrading :list="unspentTx"/>
                    </v-container>
                </v-tab-item>
                <v-tab-item>
                    <v-container class="pa-6">
                        <AllTrading :list="blockChain"/>
                    </v-container>
                </v-tab-item>
            </v-tabs>
        </v-row>
    </v-card>
</v-container>
</template>

<script>
import axios from 'axios';
import elliptic from 'elliptic';
import MyTrading from '@/components/MyTrading';
import AllTrading from '@/components/AllTrading';
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
    created() {
        this.privateKey = localStorage.getItem("privateKey_myCoin");
        if (this.privateKey === null) {
            this.$router.push("/");
        }
        this.publicKey = EC.keyFromPrivate(this.privateKey, "hex").getPublic().encode("hex");
        console.log(this.publicKey)
        this.getBlockChain().then((result) => {
            this.blockChain = result.data;
        });
        this.getUnspentTx().then((result) => {
            this.unspentTx = result.data;
        });
    },
    methods: {
        getBlockChain() {
            return axios.get(`http://localhost:3000/blocks`);
        },
        getUnspentTx() {
            return axios.post("http://localhost:3000/unspentTransactions", {
                publicAddress: this.publicKey,
            });
        },
        reload(){
            this.getBlockChain().then((result) => {
            this.blockChain = result.data;
        });
            this.getUnspentTx().then((result) => {
                this.unspentTx = result.data;
            });
        }
    },
    components: { MyTrading, AllTrading }
};
</script>

<style scoped>
  .text-right {
  float: right;
}
</style>
