<template>
<v-container class="ma-2 pa-0">
    <v-card>
        <v-card-actions>
        <v-btn
            color="green"
            dark
            >
            Total {{total}}
        </v-btn>
            
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
            Create
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
            Send
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
                        <MyTrading :list="unspentTx" :publicKey="publicKey"/>
                    </v-container>
                </v-tab-item>
                <v-tab-item>
                    <v-container class="pa-6">
                        <AllTrading :list="blockChain" :publicKey="publicKey"/>
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
import sha256 from 'crypto-js/sha256';
const EC = elliptic.ec('secp256k1');
import { showSnackbar } from '../plugins/globalAction';


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
            total: 0,
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
        this.reload()
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
                var newArray =[]
                var index = -1;
                var previous = undefined;

                this.total = 0;

                // find last
                for (var i=0;i<result.data.length;i++) {
                  var item = result.data[i];
                  this.total += item.amount;
                }

                for (var i=0;i<result.data.length;i++)
                {
                  if (result.data[i].txOutId === previous)
                  {
                    newArray[index].txOuts.push({
                      address: result.data[i].address == this.publicKey ? "My address" : result.data[i].address,
                      amount:result.data[i].amount,
                    })
                  }
                  else{
                    newArray.push(result.data[i])
                    previous = result.data[i].txOutId
                    index = newArray.length - 1
                    newArray[index].txOuts = [
                      {
                        address: result.data[i].address == this.publicKey ? "My address" : result.data[i].address,
                        amount:result.data[i].amount,
                      }
                    ]
                  }
                }

                this.unspentTx = newArray
                });
        },
        closeDialog(){
            this.dialog = false;
            this.onclick = false;
            this.$refs.myForm.reset()
        },
        validateDialog(){
            this.onclick = true;
            if (this.formValid == true)
              this.createTrasaction() 
            this.closeDialog()
        },
        getTransactionId(txIns, txOuts){
            const txInContent = txIns
                .map((txIn) => txIn.txOutId + txIn.txOutIndex)
                .reduce((a, b) => a + b, '');
        
            const txOutContent = txOuts
                .map((txOut) => txOut.address + txOut.amount)
                .reduce((a, b) => a + b, '');
        
            return sha256(txInContent + txOutContent).toString();
        },
        toHexString (byteArray){
            return Array.from(byteArray, (byte) => {
                return ('0' + (byte & 0xFF).toString(16)).slice(-2);
            }).join('');
        },
        getSignature(txId, privateKey){
            const key = EC.keyFromPrivate(privateKey, 'hex');
            const signature = this.toHexString(key.sign(txId).toDER());
            return signature
        },

        
        createTrasaction(){
          this.reload()
          var lastTx = null;
          this.total = 0;

          // find last
          for (var i=0;i<this.unspentTx.length;i++) {
            var item = this.unspentTx[i];
            this.total += item.amount;
            if (item.amount > 0)
            {
              lastTx = item;
              
            }
          }

          if (lastTx == null)
          {
            showSnackbar("Can't find your transaction")
            return false;
          }

          // create txin, outs
          var txIns = [{"signature": "", 
          "txOutId": lastTx.txOutId, 
          "txOutIndex": lastTx.txOutIndex}]

          const txOuts = [
            {
              "address": this.address,
              "amount": parseInt(this.amount),
            },
            {
              "address": this.publicKey,
              "amount": this.total - parseInt(this.amount),
            }
          ]

          // get id tx
          var id  = this.getTransactionId(txIns, txOuts)

          // signnature
          var signature = this.getSignature(id, this.privateKey)

          for (var i=0;i<txIns.length;i++) {
            txIns[i].signature = signature;
          }

          return axios.post("http://localhost:3000/createTransaction", {
                publicAddress: this.publicKey,
                data: {
                  txIns:txIns,
                  txOuts:txOuts,
                  id: id,
                }
            }).then((response) =>{
              if (response.data == false)
              {
                showSnackbar("Can't create transaction")
              }
              else{
                this.reload()
              }
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
