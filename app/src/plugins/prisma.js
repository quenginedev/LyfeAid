import Prisma from '../../prisma-client'


export default {
    install(Vue){
        Vue.prototype.$prisma = new Prisma({})
    }
}