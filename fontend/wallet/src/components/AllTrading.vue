<template>
    <div class="center">
        <div class="container">
            <Label>All trading</Label>
            <v-data-table
                :headers="headers"
                :items="list"
                :item-key="txOutId"
                :items-per-page="5"
                :single-expand="true"
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
                <td :colspan="headers.length">
                    More info about {{ item.hash }}
                </td>
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
    props: ['list'],
    components: { TransactionTile }
};
</script>

<style scoped>

</style>
