<template>
    <v-card class="card-rounded px-3 mb-7">
        <v-row align="center">
            <v-col cols="3" class=" text-center">
                <v-avatar class=" elevation-3" color="primary">
                    <v-img v-if="doctor.photoURL" :src="doctor.photoURL"></v-img>
                    <v-icon v-else color="white">mdi-doctor</v-icon>
                </v-avatar>
            </v-col>
            <v-col cols="9">
                <p class="ma-0 pa-0"><v-icon left>mdi-account</v-icon>Dr. {{doctor.name}}</p>
                <p class="ma-0 pa-0 text-capitalize">
                    <v-icon left>mdi-stethoscope</v-icon>
                    {{doctor.specialization || 'general doctor'}}
                </p>
            </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row justify="center" class=" text-center">
            <v-col cols="3">
                <v-btn 
                    icon
                    color="secondary" 
                    :loading="chatLoading"
                    @click="messageUser(doctor)">
                        <v-icon>mdi-chat</v-icon>
                    </v-btn>
            </v-col>
            <v-col cols="3">
                <v-btn icon color="primary"><v-icon>mdi-phone</v-icon></v-btn>
            </v-col>
            <v-col cols="3">
                <v-btn icon color="warning"><v-icon>mdi-video</v-icon></v-btn>
            </v-col>
            <v-col cols="3">
                <v-btn icon color="grey"><v-icon>mdi-information</v-icon></v-btn>
            </v-col>
        </v-row>
        <v-card-actions v-if="showCreateChatRoomField"> 
            <v-textarea
                v-model="creationMessage"
                :rules="creationMessageRules"
                rows="1"
                auto-grow
                filled
                rounded
                placeholder="Message"
                dense
                autofocus
            >
                <v-icon 
                    slot="append-outer"
                    v-if="!creationMessageSending" 
                    :color="creationMessage ? 'secondary' : 'grey'"
                    @click="sendCreationMessage(doctor)"
                >mdi-send</v-icon>
                <v-icon v-else slot="append-outer">mdi-send-clock</v-icon>
            </v-textarea>
        </v-card-actions>
    </v-card>
</template>
<script>
import Crud from '../graphql/Crud.gql'
const ChatRoom = new Crud('chatRoom')
export default {
    props: ['doctor'],
    data() {
        return {
            user: this.$store.getters['auth/getUser'],
            chatLoading: false,

            creationMessage: '',
            creationMessageRules: [v => v.length <= 255 || 'Max 255 characters'],
            showCreateChatRoomField: false,
            creationMessageSending: false
        }
    },
    methods: {
        messageUser(doctor){
            this.chatLoading = true
            // console.log(this.user.id, doctor.id)
            ChatRoom.find(`{id}`, {
                where: {
                    recipients_every: {
                    AND: [
                        {id: this.user.id},
                        {id: doctor.id},
                    ]
                    }
                }
            }).then(res=>{
                if(res.data.length < 1){
                    this.showCreateChatRoomField = true
                }else{
                    this.goToChatRoom(res.data[0])
                }
            }).catch(error=>{
                    console.error(error)
            }).finally(_=>{
                this.chatLoading = false
            })
        },

        sendCreationMessage(doctor){
            if(this.creationMessage){
                this.creationMessageSending = true
                ChatRoom.insert(`{id}`,{
                    data:  {
                        recipients: {
                            connect: [
                                {id: this.user.id},
                                {id: doctor.id},
                            ]
                        },
                        content: {create: {
                            text: this.creationMessage,
                            sender: {connect: {id: this.user.id}}
                            }
                        }
                    }
                }).then(chatRoom=>{
                    console.log({chatRoom})
                    this.goToChatRoom(chatRoom)
                }).catch(err=>{
                    console.error(err)
                }).finally(_=>{
                    this.creationMessageSending = false
                })
            }
        },
        goToChatRoom(chatRoom){
            //GoToChat
            this.$router.push({name: 'messaging', params: {id: chatRoom.id}})
        }
    },
}
</script>