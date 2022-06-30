<template>
    <v-app>
        <div id="top"></div>
        <nprogress-container></nprogress-container>
        <v-container>
            <v-row justify="center">
                <v-col class="ma-4" lg="12" xl="8">
                    <!-- Actual view starts here -->
                    <v-row id="content">
                        <router-view :key="$router.path" />
                    </v-row>
                </v-col>
            </v-row>
        </v-container>
        <!-- <app-snackbar></app-snackbar> -->
    </v-app>
</template>

<script>
import "@fontsource/inter/variable.css";
import NprogressContainer from "vue-nprogress/src/NprogressContainer";

import AppSnackbar from "@/components/etc/snackbar";

export default {
    name: "App",
    components: { NprogressContainer, AppSnackbar },
};
</script>

<style>
#nprogess .spinner,
#nprogress .spinner-icon {
    display: none !important;
}
#nprogress .bar {
    background: #007bff;
    height: 8px;
}
</style>
