import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {name: 'login', path: '/login', component: ()=>import('../views/Login.vue')},
  {path: '/', component: ()=>import('../views/Main.vue'), children:[
    {name: 'home', path: '', component: ()=>import('../views/Home.vue')},
    {name: 'new-user', path: 'new-user', component: ()=>import('../views/Forms/NewUser.vue')},
    {name: 'search-doctor', path: 'search-doctor', component: ()=>import('../views/Forms/SearchDoctor.vue')},
    {name: 'search-doctor-category', path: 'search-doctor/:category', component: ()=>import('../views/Forms/SearchDoctor.vue')},
    {name: 'messaging', path: 'messaging/:id', component: ()=>import('../views/Communications/Messaging.vue')},
  ]}
]

const router = new VueRouter({
  routes
})

export default router
