import { createWebHistory, createRouter } from "vue-router";
import Login from "@/components/SignInForm.vue";
import User from "@/components/User.vue";

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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;