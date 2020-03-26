export default {
    namespaced: true,
    state: {
        general: {
            id: "ck85iwswf7aq10a87bi6h4cvv",
            name: "patient",
        },
        user: null
    },
    getters: {
        getGeneral(state){
            return state.general
        },
        getUser(state){
            return state.user
        }
    },
    mutations: {
        setGeneral(state, payload){
            state.general = payload
        },
        setUser(state, payload){
            state.user = payload
        }
    }
}