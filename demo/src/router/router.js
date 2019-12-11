import Vue from 'vue'
import VueRouter from 'vue-router'
import DenseMatrix from '../views/DenseMatrix.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'denseMatrix',
    component: DenseMatrix
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
