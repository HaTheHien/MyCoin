<template>
    <div class="center">
        <div class="container">
            <Label>{{ transaction.id }}</Label>
        </div>
    </div>
</template>

<script>
export default {
    name: "TransactionTile",
    data() {
        return {
        };
    },
    props: ['transaction']
};
</script>

<style scoped>

</style>
