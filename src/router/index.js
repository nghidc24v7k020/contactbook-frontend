import { createWebHistory, createRouter } from "vue-router";
import ContactBook from "@/views/ContactBook.vue";
import Login from "@/views/Login.vue";
const routes = [
    {
        path: "/login",
        name: "login",
        component: Login,
    },
    {
        path: "/",
        name: "contactbook",
        component: () => import("@/views/ContactBook.vue"),
        beforeEnter: (to, from, next) => {
            if (!localStorage.getItem("userToken")) {
                next({ name: "login" });
            } else {
                next();
            }
        }
    },
    {
        path: "/:pathMatch(.*)*",
        name: "notfound",
        component: () => import("@/views/NotFound.vue"),
    },
    {
        path: "/contacts/:id",
        name: "contact.edit",
        component: () => import("@/views/ContactEdit.vue"),
        props: true 
    },
    {
        path: "/contacts/add",
        name: "contact.add",
        component: () => import("@/views/ContactAdd.vue"),
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;