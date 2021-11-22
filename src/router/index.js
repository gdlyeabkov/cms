import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import CPanel from '../views/CPanel.vue'
import Settings from '../views/Settings.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/cpanel',
    name: 'CPanel',
    component: CPanel
  },
  {
    path: '/cpanel/settings',
    name: 'Settings',
    component: Settings
  }  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
