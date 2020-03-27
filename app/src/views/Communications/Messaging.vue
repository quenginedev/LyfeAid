<template>
    <v-row justify="center">
        <v-col cols="10" sm="6" md="4" lg="3" xl="3" class="messages">
            <v-list>
                <v-alert
                    class="py-0"
                    v-for="(chat, index) in chatRoom.content" :key="index"
                    :border="isSelf(chat.sender.id) ? 'right' : 'left'"
                    :color="isSelf(chat.sender.id) ?  'primary' : 'secondary'"
                    colored-border
                >   
                    <p class="ma-0">{{chat.text}}</p>
                    <p class=" grey--text font-weight-light overline ma-0">
                        {{chat.sender.name.toUpperCase()}}
                        <span>
                            | {{chat.createdAt | moment("DD-MM-YYYY, h:mm:ss a")}}
                        </span>    
                    </p>
                    
                </v-alert>
            </v-list>
        </v-col>
        <v-col cols="12" :class="darkMode" class="nav ma-0 pa-0">
            <v-row justify="center">
                <v-col cols="10">
                    <v-row justify="space-between" align="center">
                        <v-btn @click="$router.go(-1)" icon><v-icon>mdi-arrow-left</v-icon></v-btn>
                        <v-avatar color="primary"><v-icon dark>mdi-doctor</v-icon></v-avatar>
                    </v-row>
                </v-col>
            </v-row>
        </v-col>
        <v-row v-if="loading" justify="center">
            <v-progress-circular
                indeterminate
                color="primary"
            ></v-progress-circular>
        </v-row>
        <v-col cols="12" :class="darkMode" class="input ma-0 pa-0">
            <v-row justify="center">
                <v-col cols="11" class=" pb-0 mb-0">
                    <v-textarea
                        v-model="newText"
                        rows="1"
                        auto-grow
                        filled
                        rounded
                        placeholder="message"
                        dense
                        clearable
                    >
                        <v-icon slot="prepend" color="secondary">mdi-camera</v-icon>
                        <v-icon v-if="!newText" slot="append-outer" color="red lighten-1">mdi-microphone</v-icon>
                        <v-icon @click="sendMessage" v-else slot="append-outer" color="primary lighten-1">mdi-send</v-icon>
                    </v-textarea>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
</template>
<script>
import Crud from '../../graphql/Crud.gql'
const ChatRoom = new Crud('chatRoom')
const MessageContent = new Crud('messageContent')

export default {
    name: 'Messaging',
    data() {
        return {
            user: this.$store.getters['auth/getUser'],
            loading: false,
            chatRoom: {},
            newText: ''
        }
    },

    computed: {
        darkMode(){
            return this.$vuetify.theme.dark ? 'black' : 'white'
        }
    },

    methods: {
        isSelf(id){
            return id === this.user.id
        },
        getChatRoom(id){
            this.loading = true
            ChatRoom.findOne(`
            {
                id
                recipients{
                    name
                }
                content {
                    text
                    sender{
                        name
                        id
                    }
                    createdAt
                }
                createdAt
                updatedAt
            }`, {
                where: {
                    id
                }
            }).then(ChatRoom=>{
                this.chatRoom = ChatRoom
                console.log(ChatRoom)
            }).catch(ChatRoomError=>{
                console.error({ChatRoomError})
            }).finally(_=>{
                this.loading = false
            })
        },

        listenToIncomingMessages(id){
            MessageContent.subscribeToMore(`{
                text
                sender{
                    name
                    id
                }
                createdAt
            }`, {
                    where: { 
                        chatRoom: {id } 
                    } 
                },
                this.onSnapShot
            )
        },

        onSnapShot(snapShot){
            console.log({snapShot})
            if(snapShot.mutation === 'CREATED'){
                this.chatRoom.content.push(snapShot.node)
            }
        },

        sendMessage(){
            MessageContent.insert(`{
                text
                sender{
                    name
                    id
                }
                createdAt
            }`, {
                data: {
                    text: this.newText,
                    sender: {connect: {id: this.user.id}},
                    chatRoom: {connect : {id: this.chatRoom.id}}
                }
            }).then(_=>{
                this.newText = ''
            }).catch(sendMessageError=>{
                console.error(sendMessageError)
            })
        }
    },
    created(){
        let id = this.$route.params.id
        this.getChatRoom(id)
        this.listenToIncomingMessages(id)
    }
}
</script>
<style scoped>
    .input, .nav{
        position: fixed;
    }

    .nav{
        width: 100%;
        top: 0
    }

    .input{
        bottom: 0px
    }

    .messages{
        margin-top: 56px;
        margin-bottom: 56px;
    }

</style>