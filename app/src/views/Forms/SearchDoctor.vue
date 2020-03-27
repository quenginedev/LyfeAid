<template>
    <v-row justify="center">
        <v-col cols="10" sm="6" md="4" lg="3" xl="3">
            <v-row justify="space-between">
                <v-text-field
                        v-model="search_phrase"
                        autofocus
                        class="mt-3"
                        dense
                        placeholder="Search doctors"
                        rounded
                        filled
                    >
                        <v-icon @click="$router.go(-1)" slot="prepend">mdi-arrow-left</v-icon>
                        <v-icon color="primary" v-if="loading" slot="append">mdi-loading</v-icon>
                        <v-icon color="primary" v-else slot="append">mdi-magnify</v-icon>
                        <v-icon color="secondary" slot="append-outer">mdi-filter</v-icon>
                </v-text-field>
            </v-row>
            <v-row v-if="loading" justify="center">
                <v-progress-circular
                    indeterminate
                    color="primary"
                ></v-progress-circular>
            </v-row>
            <doctor-search-card 
                v-for="(doctor, index) in doctors" 
                :key="index"
                :doctor="doctor"
            ></doctor-search-card>
        </v-col>
    </v-row>
</template>
<script>
import Crud from '../../graphql/Crud.gql'
const User = new Crud('user')

import DoctorSearchCard from '../../components/DoctorSearchCard'

export default {
    name: "searchDoctor",
    components: {DoctorSearchCard},
    data() {
        return {
            loading: false,
            doctors: [],
            search_phrase: ''
        }
    },
    methods: {
        searchDoctors(){
            this.loading = true
            User.find(`{
                id
                name
                phone
                gender
                verified
                specialization{
                    id
                    name
                }            
            }`, {
                where: {
                    account_type: {
                        name: "doctor"
                    }
                }
            }).then(res=>{
                this.doctors = res.data
            }).catch(error=>{
                console.error(error)
            }).finally(_=>{
                this.loading = false
            })
            
        }
    },
    created() {
        this.searchDoctors()
    },
}
</script>