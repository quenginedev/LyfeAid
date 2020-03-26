import firebase from 'firebase/app'
import config from '../config'

import 'firebase/auth'
import 'firebase/analytics'
import 'firebase/storage'

export default {
    install(Vue, options){
        firebase.initializeApp(config.firebaseConfig)
        Vue.prototype.$firebase = firebase
    }
}