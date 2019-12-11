import Vue from 'vue'
import VueRouter from 'vue-router'
import Documentation from '../views/Documentation.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'documentation',
    component: Documentation
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
