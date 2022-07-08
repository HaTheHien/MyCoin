<template>
    <div class="center">
        <div class="container">
            <Label>All trading</Label>
            <v-data-table
                :headers="headers"
                :items="list"
                item-key="index"
                :items-per-page="5"
                show-expand
                class="elevation-1"
            >
            <template v-slot:item.prevHash="{ item }">
                <p class="ma-4" style="width:200px">{{item.prevHash}}</p>
            </template>
            <template v-slot:item.hash="{ item }">
                <p class="ma-4" style="width:200px">{{item.hash}}</p>
            </template>
            <template v-slot:expanded-item="{ headers, item }">
                <p clase="ml-3">
                    <tr v-if="item.index !== 0">From:
                        <p v-if="item.index !== 0 && item.data.publicKey === publicKey" class="ma-4" style="width:200px;color:red">My address</p>
                    <p v-if="item.index !== 0 && item.data.publicKey !== publicKey" class="ma-4" style="width:200px;color:red">{{item.data.publicKey}}</p>
                    </tr>
                    
                    <tr>To:</tr>
                    <tr :colspan="headers.length" md4 v-for="itemData in item.data.txOuts" :key="itemData.address">
                        <p v-if="itemData.address == publicKey" class="ma-4" style="width:200px;color:green">{{"My address +" + itemData.amount}}</p>
                        <p v-else  class="ma-4" style="width:200px;color:green">{{itemData.address.substring(0, 18) + "...+" + itemData.amount}}</p>
                    </tr>
                </p>
               
            </template>
            </v-data-table>
        </div>
    </div>
</template>

<script>
import TransactionTile from './TransactionTile.vue';
export default {
    name: "AllTrading",
    data() {
        return {
             headers: [
                {
                    text: 'Block index',
                    align: 'start',
                    sortable: false,
                    value: 'index',
                },
                { text: 'Time stamp', value: 'timestamp' },
                { text: 'Previous', value: 'prevHash', },
                { text: 'Hash', value: 'hash', },
            ],
            privateKey: "",
        };
    },
    created () {
        this.privateKey = localStorage.getItem("privateKey_myCoin")
    },
    props: ['list',"publicKey"],
    components: { TransactionTile },
    methods: {
        getTransaction(id) {
            return axios.get(`http://localhost:3000/transaction/${id}`).then((value)=> value.data);
        },
    },
};
</script>

<style scoped>

</style>
