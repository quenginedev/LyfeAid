<template>
    <div>
        <router-view class="pt-3 ma-0" v-if="show_route"/>
        <div v-else class="text-center">
            <v-progress-circular
                indeterminate
                size="72"
                color="primary"
            ></v-progress-circular>
            
            <p class="mt-3">Loading</p>
        </div>
    </div>
</template>
<script>
import Crud from '../graphql/Crud.gql'
const User = new Crud('user')
export default {
    data() {
        return {
            show_route: false
        }
    },
    created() {
        this.show_route = false
        this.$firebase.auth().onAuthStateChanged(user=>{
            if(!user){
                this.$router.push({name: 'login'})
            }else{
                console.log(user)
                User.findOne(`{
                    id
                    firebase_id
                    name
                    phone
                    gender
                    account_type {
                        id
                        name
                        permissions{
                            key
                            name
                        }
                    }
                    verified
                    specialization{
                        id
                        name
                    }
                    doctors{
                        id
                        name
                    }
                    patients{
                        name
                        id
                    }
                }`, {
                    where: { firebase_id: user.uid }
                }).then(res=>{
                    if(!res) this.$router.push({name: 'new-user'})
                    else {
                        this.$store.commit('auth/setUser', res)
                        //SetUpUserOnUpdate
                        //SetUpNotificationsAndWebWorkers
                    }
                    this.show_route = true
                }).catch(err=>{
                    console.error(err)
                })
            }
        })
    }
}
</script>