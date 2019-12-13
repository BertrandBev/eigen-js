import Vue from 'vue'
import VueRouter from 'vue-router'
import Documentation from '../views/Documentation.vue'
import Benchmarks from '../views/Benchmarks.vue'

Vue.use(VueRouter)

const classes = [
  { name: 'matrix', title: 'Matrix', icon: 'mdi-matrix' },
  { name: 'solvers', title: 'Solvers', icon: 'mdi-cogs' }
]
const classRoutes = classes.map(cl => ({
  ...cl,
  group: 'Classes',
  path: `/${cl.name}`,
  component: Documentation,
  props: { className: cl.title }
}))

const routes = [
  {
    path: '/',
    redirect: '/benchmark'
  },
  {
    path: '/benchmark',
    name: 'benchmark',
    title: 'Benchmark',
    group: 'Benchmarks',
    component: Benchmarks,
    icon: 'mdi-speedometer'
  },
  ...classRoutes,
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export { routes }
export default router
