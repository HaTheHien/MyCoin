<template>
    <div class="center">
        <div class="container">
            <Label>My trading</Label>
            <v-data-table
                :headers="headers"
                :items="list"
                :items-per-page="5"
                item-key="txOutId"
                show-expand
                class="elevation-1"
            >
            <template v-slot:item.address="{ item }">
                <p v-if="item.address == publicKey" class="ma-4" style="color:green">{{item.address}}</p>
                <p v-else class="ma-4">{{item.address}}</p>
            </template>
            <template v-slot:item.txOutId="{ item }">
                <p v-if="item.txOutId != 'transaction pool' ">{{item.txOutId}}</p>
                <p v-else class="ma-4">{{item.txOutId}}</p>
            </template>
            <template v-slot:expanded-item="{ headers, item }">
                <tr :colspan="headers.length" md4 v-for="itemData in item.txOuts">
                    <p v-if="itemData.amount < 0 " :colspan="headers.length" class="ma-4" style="width:200px;color:red">{{itemData.address + " " + itemData.amount}}</p>
                    <p v-if="itemData.amount > 0 " :colspan="headers.length" class="ma-4" style="width:200px;color:green">{{itemData.address + " +" + itemData.amount}}</p>
                </tr>

            </template>
            </v-data-table>
        </div>
    </div>
</template>

<script>
export default {
    name: "MyTrading",
    data() {
        return {
            headers: [
                {
                    text: 'Transaction id',
                    align: 'start',
                    sortable: false,
                    value: 'txOutId',
                },
                { text: 'Block chain index', value: 'txOutIndex' },
            ],
            privateKey: "",
        };
    },
    created() {
        this.privateKey = localStorage.getItem("privateKey_myCoin");
    },
    props: ["list","publicKey"],
    methods: {
        getTransaction() {
            return axios.get(`http://localhost:3000/blocks`);
        },
    },
};
</script>

<style scoped>

</style>
