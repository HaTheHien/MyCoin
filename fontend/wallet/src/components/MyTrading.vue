<template>
    <div class="center">
        <div class="container">
            <Label>My trading</Label>
            <v-data-table
                :headers="headers"
                :items="list"
                :items-per-page="5"
                :single-expand="true"
                :show-expand="true"
                item-key="txOutId"
                class="elevation-1"
            >
            <template v-slot:item.address="{ item }">
                <p class="ma-4" style="width:200px">{{item.address}}</p>
            </template>
            <template v-slot:item.txOutId="{ item }">
                <p v-if="item.txOutId != 'transaction pool' " style="width:200px">{{item.txOutId}}</p>
                <p v-else class="ma-4">{{item.txOutId}}</p>
            </template>
            <!-- <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                    More info about {{item.address}}
                </td>
            </template> -->
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
                { text: 'Address', value: 'address', },
                { text: 'Amount (vtc)', value: 'amount', },
            ],
            privateKey: "",
        };
    },
    created() {
        this.privateKey = localStorage.getItem("privateKey_myCoin");
    },
    props: ["list"],
    methods: {
        getTransaction() {
            return axios.get(`http://localhost:3000/blocks`);
        },
    },
};
</script>

<style scoped>

</style>
