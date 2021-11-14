import VueRouter from 'vue-router';
import Chat from './components/Chat.vue'
import Login from './components/Login.vue'

const getUserInfo = () => {
    let result;
    for(let i = 0; i < localStorage.length; i++) {
        if(localStorage.getItem(i) !== "loglevel:webpack-dev-server") {
            result = localStorage.getItem(i);
        }
    }
    return result;
}

const routes = [
    { 
        path: "/", 
        component: Chat,
        beforeEnter: (to, from, next) => {
            console.log()
            if(getUserInfo()) {
                next();
            } else {
                next("/login");
            }
        }
    },
    { 
        path: "/login", 
        component: Login,
    }
];

const router = new VueRouter({
    routes,
    mode: "history"
})

export default router;