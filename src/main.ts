import { createApp } from 'vue'
import App from './App.vue'
import { Quasar } from 'quasar'
import './index.css'
import quasarIconSet from 'quasar/icon-set/material-icons'
import '@quasar/extras/material-icons/material-icons.css'
// import 'quasar/src/css/index.sass'

//createApp(App).mount('#app')



// import App from './App.vue'

const app = createApp(App)

app.use(Quasar, {
  plugins: {}, // import Quasar plugins and add here
  iconSet: quasarIconSet,
})

app.mount('#app')