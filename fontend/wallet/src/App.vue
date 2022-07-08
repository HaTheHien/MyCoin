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
        <v-snackbar v-model="snackbar" timeout="2500"
            >{{ snackbarMessage }}</v-snackbar
        >
    </v-app>
</template>

<script>
import "@fontsource/inter/variable.css";
import NprogressContainer from "vue-nprogress/src/NprogressContainer";

import AppSnackbar from "@/components/etc/snackbar";
import EventBus, { ACTIONS } from './plugins/eventbus';

export default {
    name: "App",
    components: { NprogressContainer, AppSnackbar },
        data: () => ({
      snackbar: false,
      snackbarMessage: '',
    }),
    mounted() {
      EventBus.$on(ACTIONS.SNACKBAR, message => {
        this.snackbarMessage = message;
        this.snackbar = true;
      });
    },
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
