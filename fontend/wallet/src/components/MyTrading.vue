<template>
    <div class="center">
        <div class="container">
            <Label>My trading</Label>
        </div>
    </div>
</template>

<script>
export default {
    name: "MyTrading",
    data() {
        return {
            privateKey: "",
        };
    },
    created () {
        this.privateKey = localStorage.getItem("privateKey_myCoin")
    },
};
</script>

<style scoped>

</style>
