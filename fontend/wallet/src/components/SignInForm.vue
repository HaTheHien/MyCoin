<template>
    <div class="center">
        <div class="container">
            <Label>Login form</Label>
            <input type="privateKey" placeholder="Enter private key:" v-model="privateKey" required />

            <button @click="login">Login</button>
        </div>
    </div>
</template>

<script>
export default {
    name: "SignInForm",
    data() {
        return {
            privateKey: "",
        };
    },
    methods: {
        login() {
          localStorage.setItem("privateKey_myCoin", this.privateKey);
          this.$router.push({ name: "User" })
        },
    },
};
</script>

<style scoped>
form {
    border: 3px solid #f1f1f1;
}

/* Full-width inputs */
input[type="privateKey"] {
    width: 100%;
    padding: 12px 20px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid #ccc;
    box-sizing: border-box;
}

/* Set a style for all buttons */
button {
    background-color: #04aa6d;
    color: white;
    padding: 14px 20px;
    margin: 8px 0;
    border: none;
    cursor: pointer;
    width: 100%;
}

button[disabled="disabled"],
button:disabled {
    border: 1px solid #999999;
    background-color: #cccccc;
    color: #666666;
}

/* Add padding to containers */
.container {
    padding: 16px;
}

.center {
    height: 200px;
    width: 400px;
    background-color: beige;

    position: fixed;
    top: 50%;
    left: 50%;
    margin-top: -100px;
    margin-left: -200px;
}
</style>
