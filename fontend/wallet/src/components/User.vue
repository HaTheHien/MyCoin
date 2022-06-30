<template>
    <v-card>
        <v-row no-gutters>
            <v-tabs fixed-tabs>
                <v-tab>My trading</v-tab>
                <v-tab>All trading</v-tab>

                <v-tab-item>
                    <v-container class="pa-4">
                        <MyTrading/>
                    </v-container>
                </v-tab-item>
                <v-tab-item>
                    <v-container class="pa-4">
                        <AllTrading/>
                    </v-container>
                </v-tab-item>
            </v-tabs>
        </v-row>
    </v-card>
</template>

<script>
import axios from 'axios';
import elliptic from 'elliptic';
import MyTrading from './MyTrading.vue';
import AllTrading from './AllTrading.vue';
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
        this.getBlockChain().then((result) => {
            this.blockChain = result;
        });
        this.getUnspentTx().then((result) => {
            this.unspentTx = result;
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
    },
    components: { MyTrading, AllTrading }
};
</script>

<style scoped>

</style>
