import { createApp } from 'vue'
import App from './App.vue'

import { createStore } from 'vuex'

const store = createStore({
    state () {
      return {
        dataM: {}
      }
    },
    mutations: {
      addData (state, payload) {
        state.dataM = payload
      }
    }
  })



const app =createApp(App)
app.use(store)
app.mount('#app')
