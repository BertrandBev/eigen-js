import Vue from 'vue'
import App from './App.vue'
import router from './router/router.js'
import vuetify from './plugins/vuetify';
import VueKatex from 'vue-katex'
import 'katex/dist/katex.min.css';
import { SimpleSVG } from 'vue-simple-svg'
import SvgFiller from 'vue-svg-filler'
import '@vue-live-docs/plugins/codeMirror'; // TODO: clean that up
import 'highlight.js/styles/monokai-sublime.css'; // TODO: clean that up

Vue.use(VueKatex)
Vue.component('svg-filler', SvgFiller)
Vue.component('simple-svg', SimpleSVG)

const store = new Vue({
  data: () => ({
    windowSize: { x: 0, y: 0 }
  })
})
Vue.prototype.$store = store

Vue.config.productionTip = false
new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
