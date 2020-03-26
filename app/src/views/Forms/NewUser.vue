<template>
    <v-row justify="center" align="end" class="grey lighten-5">
        <img src="../../assets/LyfeAidGreenLogo.svg" height="124px"/>
        <v-col cols="11">
            <v-card class="card-rounded">
                <v-card-text>
                    <v-alert 
                        border="left"
                        color="primary"
                        colored-border
                        class="text-center subtitle-2 grey--text text--darken-2"
                        type="info"
                        >
                            We would like to know a little about you
                    </v-alert>
                    <v-form>
                        <v-text-field
                            v-model="user.name"
                            dense
                            filled
                            rounded
                            placeholder="Name"
                        >
                            <v-icon slot="prepend-inner" left>mdi-account</v-icon>
                        </v-text-field>
                        <v-text-field
                            v-model="user.phone"
                            dense
                            filled
                            rounded
                            placeholder="Phone"
                        >
                            <v-icon slot="prepend-inner" left>mdi-phone</v-icon>
                        </v-text-field>
                        <v-select
                            v-model="user.gender"
                            dense
                            filled
                            rounded
                            :items="genders"
                            placeholder="Gender"
                        >
                            <v-icon slot="prepend-inner" left>mdi-gender-transgender</v-icon>
                        </v-select>
                        <v-btn :loading="loading" @click="saveUserData" :disabled="!canSave" rounded block color="primary" >
                            <v-icon left>mdi-account-check</v-icon> set profile
                        </v-btn>
                    </v-form>
                </v-card-text>
           </v-card>
        </v-col>
    </v-row>
</template>
<script>
    import { mapGetters } from 'vuex'
    import Crud from '../../graphql/Crud.gql'
    const User = new Crud('user')
    export default {
    computed: {
        ...mapGetters({
            general: 'auth/getGeneral'
        }),
        canSave(){
            return this.user.name && this.user.phone && this.user.gender
        },
        accountReturnType(){
            return this.general.name == 'patient' ?
            `{
                id
                firebase_id
                name
                phone
                gender
                account_type{
                    id
                    name
                }
                doctors{
                    name
                    id
                }
            }`
            :

            `{
                id
                firebase_id
                name
                phone
                account_type{
                    id
                    name
                }
                verified
                specialization{
                    id
                    name
                }
                patients{
                    name
                    id
                }
            }`
        }
    },
    data() {
        return {
            user: {},
            loading: false,
            fb_user : this.$firebase.auth().currentUser,
            genders: [
                {text: 'Male', value: 'male'},
                {text: 'Female', value: 'female'},
                {text: "Won't say", value: 'both'},
            ],
        }
    },
    methods: {
        saveUserData(){
            this.loading = true
            let data = {
                    firebase_id: this.fb_user.uid,
                    ...this.user,
                    account_type: {
                        connect: {
                            id: this.general.id
                        }
                    }
                }
            console. log(data)
            User.insert(this.accountReturnType, { data })
                .then(res=>{
                    this.$store.commit('auth/setUser', res)
                    this.$router.push({name: 'home'})
                }).catch(err=>{
                    console.error(err)
                }).finally(_=>{
                    this.loading = false
                })
        }
    },
    created() {
        this.user.name = this.fb_user.displayName
        this.user.phone = this.fb_user.phoneNumber
    },
}
</script>