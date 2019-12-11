import Vue from 'vue'
import App from './App.vue'
import router from './router/router.js'
import vuetify from './plugins/vuetify';
import VueKatex from 'vue-katex'
import 'katex/dist/katex.min.css';
import './plugins/codeMirror';

Vue.use(VueKatex)

Vue.config.productionTip = false
new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
