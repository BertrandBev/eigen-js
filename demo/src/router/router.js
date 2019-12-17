import Vue from 'vue'
import VueRouter from 'vue-router'
import Documentation from '../views/Documentation.vue'
import BenchmarksView from '../views/BenchmarksView.vue'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const classes = [
  { name: 'matrix', title: 'Matrix', icon: 'mdi-matrix' },
  { name: 'solvers', title: 'Solvers', icon: 'mdi-cogs' },
  { name: 'decompositions', title: 'Decompositions', icon: 'mdi-puzzle' }
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
    name: 'home',
    title: 'Eigen JS',
    group: 'Pages',
    component: Home,
    icon: 'mdi-lambda'

  },
  ...classRoutes,
  {
    path: '/benchmark',
    name: 'benchmark',
    title: 'Benchmark',
    group: 'Benchmarks',
    component: BenchmarksView,
    icon: 'mdi-speedometer'
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export { routes }
export default router
