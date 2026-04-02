
// 引入 naive ui
import { 
    create, 
    NButton,
    NLayout,
    NFlex,
    NGrid,
    NGi,
    NCard,
    NSpace,
    NDialogProvider,
    NModalProvider,
    NModal,
    NAlert,
    NInput,
    NSelect,
    NEllipsis,
} from 'naive-ui'

import { createApp } from 'vue'
import App from './App.vue'

import router from './router'

import pinia from './store'

import Loading from './components/Loading/index.vue'


const naive = create({
    components: [
        NButton,
        NLayout,
        NFlex,
        NGrid,
        NGi,
        NCard,
        NSpace,
        NDialogProvider,
        NModalProvider,
        NModal,
        NAlert,
        NInput,
        NSelect,
        NEllipsis,
    ]
})


const app = createApp(App)

// 全局注册 Loading
app.component('Loading', Loading)

app.use(naive) // 正确写法
app.use(router)
app.use(pinia)
app.mount('#app')