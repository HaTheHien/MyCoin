<template>
    <div class="center">
        <div class="container">
            <Label>User transaction</Label>
            <input type="privateKey" placeholder="Enter private key:" v-model="privateKey" required />

            <button @click="login">Login</button>
        </div>
    </div>
</template>

<script>
export default {
    name: "UserDetail",
    data() {
        return {
            privateKey: "",
        };
    },
    methods: {
        
    },
};
</script>

<style scoped>

</style>
