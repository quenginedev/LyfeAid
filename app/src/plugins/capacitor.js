import { Capacitor } from '@capacitor/core'

export default {
    install(Vue, options){
        Vue.prototype.$capacitor = Capacitor
    }
}