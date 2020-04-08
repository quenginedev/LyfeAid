<template>
    <v-row v-scroll="onScroll" justify="center">
        <v-col cols="12" sm="6" md="4" lg="3" xl="3" class="messages">
            <v-list ref="messages" >
                <v-alert
                    class="py-0"
                    v-for="(chat, index) in chatRoom.content" :key="index"
                    :border="isSelf(chat.sender.id) ? 'right' : 'left'"
                    :color="isSelf(chat.sender.id) ?  'primary' : 'secondary'"
                    colored-border
                >   
                    <p class=" grey--text font-weight-light overline ma-0">
                        {{chat.sender.name.toUpperCase()}}
                        <span>
                            | {{chat.createdAt | moment("DD-MM-YYYY, h:mm:ss a")}}
                        </span>    
                    </p>
                    <p class="ma-0">{{chat.text}}</p>
                    
                </v-alert>
            </v-list>
        </v-col>
        <v-col cols="12" :class="darkMode" class="nav ma-0 pa-0">
            <v-row justify="center">
                <v-col cols="10">
                    <v-row justify="space-between" align="center">
                        <v-btn @click="$router.go(-1)" icon><v-icon>mdi-arrow-left</v-icon></v-btn>
                        <p class="ma-0 pa-0 subtitle-1">
                            {{isDoctor}}
                            {{recipient.name}}</p>
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
        <v-col cols="12" :class="darkMode" class="input pa-0">
            <v-row justify="center">
                <v-col cols="11" class="">
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
                        <v-icon @click="startRecognition" v-if="!newText && !recording" slot="append-outer" color="red lighten-1">mdi-microphone</v-icon>
                        <v-icon v-else-if="!recording && newText" @click="sendMessage" 
                            slot="append-outer" color="primary lighten-1">mdi-send
                        </v-icon>
                        <v-icon v-else  slot="append-outer" color="red lighten-1">mdi-microphone-outline</v-icon>
                    </v-textarea>
                </v-col>
            </v-row>
            <v-btn
                v-show="showFab"
                @click="goBottom"
                class="fab"
                color="primary"
                dark
                small
                fab

            >
                <v-icon>mdi-arrow-down</v-icon>
            </v-btn>
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
            recipient: {},
            loading: false,
            recording: false,
            recognition: false,
            chatRoom: {},
            newText: '',
            offsetTop: window.scrollY,
        }
    },

    watch: {
        // ['chatRoom.content'](chats){
        //     console.log(chats)
        //     if(chats){
        //         this.goBottom(chats[chats.length - 1])
        //     }
        // }
    },    

    computed: {
        showFab(){
            console.log({offsetTop: this.offsetTop, pageHeight:this.pageHeight })
            return this.offsetTop < this.pageHeight 
        },
        darkMode(){
            return this.$vuetify.theme.dark ? 'black' : 'white'
        },

        isDoctor(){
            if(this.recipient.account_type){
                return this.recipient.account_type.name == 'doctor' ? 'Dr.' : ''
            }else {
                return ''
            }
        }
    },

    methods: {

        startRecognition(){
            this.recognition.start()
            this.recording = true
        },
        initRecognition(){
            let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
            this.recognition = SpeechRecognition ? new SpeechRecognition() : false

            if (!this.recognition) {
                return false
            }

            console.log(this.recognition)
            this.recognition.lang = this.lang
            this.recognition.interimResults = true

            this.recognition.addEventListener('speechend', event => {
                this.recording = false
            })

            this.recognition.addEventListener('result', event => {
                this.newText = event.results[0][0].transcript
            })

        },

        onScroll (e) {
            this.offsetTop = window.scrollY
        },

        isSelf(id){
            return id === this.user.id
        },

        goBottom(node){
            setTimeout(_=>{
                this.$vuetify.goTo(this.$refs.messages.$el.scrollHeight)
                // console.log({height: this.$refs.messages.$el.scrollHeight})
            }, 500)
        },
        getChatRoom(id){
            this.loading = true
            ChatRoom.findOne(`
            {
                id
                recipients{
                    id
                    name
                    account_type{
                        id
                        name
                    }
                }
                content {
                    id
                    text
                    sender{
                        id
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
                ChatRoom.recipients.forEach(recipient => {
                    if(recipient.id !== this.user.id){
                        this.recipient = recipient
                    }
                })
                this.goBottom()
                // console.log(this.recipient)
            }).catch(ChatRoomError=>{
                console.error({ChatRoomError})
            }).finally(_=>{
                this.loading = false
            })
        },

        listenToIncomingMessages(id){
            MessageContent.subscribeToMore(`{
                id
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
                this.goBottom()
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
        this.initRecognition()
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

    .fab{
        position: fixed;
        bottom: 80px;
        right: 32px
    }

</style>