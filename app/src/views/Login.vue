<template>
    <v-row justify="center" align="end" class="ma-0">
        <v-col cols="11">
           <v-card class="card-rounded">
                <v-card-title class="text-center">
                        <v-col cols="12">
                            <img src="../assets/LyfeAidGreenLogo.svg" height="72px"/>
                            <h2 class="display-1 text-center">Sign In</h2>
                        </v-col>
                </v-card-title>
                <template  v-if="!loading">
                    <v-card-text>
                        <v-select
                            v-model="account_type"
                            @change="setAccount"
                            dense
                            filled
                            rounded
                            :items="account_types"
                            placeholder="Login Type"
                        >
                            <v-icon slot="prepend-inner" left>mdi-account</v-icon>
                        </v-select>
                        <template v-if="account_type.id">
                            <v-btn @click="loginGoogle" block rounded color="red accent-2" class="mb-3 white--text">
                                <v-icon left > mdi-google</v-icon> Google
                            </v-btn>
                            <v-btn disabled block rounded color="blue" class="mb-3 white--text">
                                <v-icon left> mdi-facebook</v-icon> Facebook
                            </v-btn>
                            <!-- <v-btn disabled block rounded color="blue" class="white--text" >
                                <v-icon left> mdi-apple</v-icon> Apple
                            </v-btn> -->
                        </template>
                    </v-card-text>
                    <v-card-actions class="text-center subtitle-2 grey--text text--darken-2">
                        <p>By Signing in you agree to the <a href>Terms and Conditions</a> of LyfeAid &copy;</p>
                    </v-card-actions>
                </template>
                <v-card-text v-else class="text-center">
                <v-progress-circular
                    indeterminate
                    color="primary"
                ></v-progress-circular>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>
<script>
import { mapGetters } from 'vuex'
import Crud from '../graphql/Crud.gql'
const AccountType = new Crud('accountType')

export default {
    computed: {
        ...mapGetters({
            general: 'auth/getGeneral'
        }),
        account_types(){
            return this.accountTypes.map(type=>{
                return {text: type.name.charAt(0).toUpperCase() + type.name.slice(1), value: type}
            })
        }
    },
    data(){
        return {
            accountTypes: [],
            account_type: {},
            google_loading: false,
            loading: true
        }
    },
    methods:{
        setAccount(){
            this.$store.commit('auth/setGeneral', this.account_type)
        },
        loginGoogle(){
            this.google_loading = true
            let provider = new this.$firebase.auth.GoogleAuthProvider()
            this.$firebase.auth().signInWithPopup(provider)
                .then(res=>{
                    this.$router.push({name: 'home'})
                })
                .catch(err=>{
                    this.$root.$emit('error', err)
                }).finally(_=>{
                    this.google_loading = false
                })
        }
    },
    created() {
        AccountType.find(`{
            id
            name
        }`).then(res=>{
            this.accountTypes = res.data
            this.loading = false
        }).catch(err=>{
            console.error(err)
        })
    },
}
</script>
<style>
    .login{
        background: url("../assets/illustration.jpg");
        background-repeat: no-repeat;
        background-size: 280px;
        background-position: top center;
    }

    .logo{
        position: absolute;
        top: 32px;
        left: 10px;
    }
</style>