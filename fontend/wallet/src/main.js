import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";

import nprogress from "./plugins/nprogress";
import "./plugins/tiptap-vuetify";
import "./plugins/lineClamp";

Vue.config.productionTip = false;

new Vue({
    nprogress,
    router,
    vuetify,
    render: (h) => h(App),
}).$mount("#app");
