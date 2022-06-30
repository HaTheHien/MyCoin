<template>
    <div class="center">
        <div class="container">
            <Label>All trading</Label>
        </div>
    </div>
</template>

<script>
export default {
    name: "AllTrading",
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
