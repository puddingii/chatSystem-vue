import VueRouter from "vue-router";
import Chat from "./components/Chat.vue"
import Login from "./components/Login.vue"

const routes = [
    { 
        path: "/", 
        component: Chat,
        beforeEnter: (to, from, next) => {
            if(from.path === "/") {
                next("/login");
            }
            next();
        }
    },
    { 
        path: "/login", 
        component: Login
    }
];

const router = new VueRouter({
    routes,
    mode: "history"
})

export default router;