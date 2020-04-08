<template>
    <v-row justify="center">
        <v-col cols="12">
            <v-btn @click="$router.go(-1)" class="mb-5" icon><v-icon>mdi-arrow-left</v-icon></v-btn>
            <!-- <pre>{{user}}</pre> -->
            <!-- <pre>{{chatUsers}}</pre> -->
            <!-- <v-card class="card-rounded px-3 mb-7" v-for="(chatUser, index) in chatUsers" :key="index">

                <v-row align="center">
                    <v-col cols="3" class=" text-center">
                        <v-avatar class=" elevation-3" color="primary">
                            <v-img v-if="chatUser.photoURL" :src="chatUser.photoURL"></v-img>
                            <v-icon v-else color="white">
                                {{chatUser.account_type.name == 'doctor' ? 'mdi-doctor' : 'mdi-account'}} 
                            </v-icon>
                        </v-avatar>
                    </v-col>
                    <v-col >
                        <p class="ma-0 pa-0">
                            {{chatUser.account_type.name == 'doctor' ? 'Dr.' : ''}} 
                            {{chatUser.name}}
                        </p>
                    </v-col>
                    <v-col cols="3">
                        <v-btn @click="goToChatMessages(chatUser)" icon>
                            <v-icon>mdi-chat</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card> -->
            <UserCommunicationCard v-for="(chatUser, index) in chatUsers" :key="index" :person="chatUser"/>
        </v-col>
    </v-row>
</template>
<script>
import Crud from '../../graphql/Crud.gql'
const User = new Crud('user')
import UserCommunicationCard from '../../components/UserCommunicationCard'

export default {
    components:{UserCommunicationCard},
    data() {
        return {
            chatUsers: [],
            user: this.$store.getters['auth/getUser']
        }
    },
    methods: {
        goToChatMessages(chatUser){
            // console.log(chatUser.chatRooms[0])
            this.$router.push({name: 'messaging', params: {id: chatUser.chatRooms[0].id}})
        }
    },
    created() {
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
            photoURL
            account_type{
                id
                name
            }
            chatRooms(first: 1){
                id
                content(orderBy: createdAt_DESC first: 1){
                    createdAt
                }
            }
        }`, {
            where: {
                chatRooms_some: {
                    recipients_some: {
                        id_in: this.user.id
                    }
                },
                id_not: this.user.id
            },
            orderBy: 'createdAt_DESC'
        }).then(res=>{
            console.log(res)
            this.chatUsers = res.data
        }).catch(err=>{
            console.error(err)
        })
    },
}
</script>