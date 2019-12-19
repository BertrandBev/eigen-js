import Vue from 'vue'
import App from './App.vue'
import router from './router/router.js'
import vuetify from './plugins/vuetify';
import VueKatex from 'vue-katex'
import 'katex/dist/katex.min.css';
import './plugins/codeMirror';
import VueWorker from 'vue-worker'
import { SimpleSVG } from 'vue-simple-svg'
import SvgFiller from 'vue-svg-filler'
import 'highlight.js/styles/monokai.css';

Vue.use(VueWorker)
Vue.use(VueKatex)
Vue.component('svg-filler', SvgFiller)
Vue.component('simple-svg', SimpleSVG)

const store = new Vue({
  data: () => ({
    windowSize: { x: 0, y: 0 }
  })
})
console.log("DATA", store)

Vue.prototype.$store = store

Vue.config.productionTip = false
new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
