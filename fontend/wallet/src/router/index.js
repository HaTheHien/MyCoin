import Vue from "vue";
import VueRouter from "vue-router";

import Login from "@/views/SignInForm";
import User from "@/views/User";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "Login",
        component: Login,
    },
    {
        path: "/user",
        name: "User",
        component: User,
    },

    // redirect on invalid route
    {
        path: "*",
        redirect: "/",
    },
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes,
});

export default router;
