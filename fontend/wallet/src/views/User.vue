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
            color="primary"
            dark
            @click.stop="dialog = true"
            >
            Open Dialog
        </v-btn>
        <v-dialog
            v-model="dialog"
            persistent
            @click:outside="closeDialog"
            max-width="600px"
        >
      <v-card>
        <v-card-title>
          <span class="text-h5">Create transaction</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form v-model="formValid" ref="myForm">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Address"
                  v-model="address"
                  :rules="rules.required"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Amount"
                  type="number"
                  min="1"
                  v-model="amount"
                  :rules="rules.required"
                ></v-text-field>
              </v-col>
            </v-row>
            </v-form>
            <div v-if="formValid == false && onclick == true" style="color:red">  Data not valid</div>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="closeDialog"
          >
            Close
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="validateDialog"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
            formValid: true,
            dialog: false,
            privateKey: "",
            publicKey: "",
            blockChain: [],
            unspentTx: [],
            address: "",
            amount: "",
            onclick: false,
            rules: {
                required: [value => !!value || "Required."]
            }
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
        },
        closeDialog(){
            this.dialog = false;
            this.onclick = false;
            this.$refs.myForm.reset()
        },
        validateDialog(){
            this.onclick = true;
            console.log(this.address)
            if (this.formValid == true) this.closeDialog()
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
