<template>
    <v-row justify="center">
        <v-col cols="11" sm="6" md="4" lg="3" xl="3">
            <v-row justify="space-between">
                <v-btn icon color="primary">
                    <v-icon>mdi-menu</v-icon>
                </v-btn>
                <template >
                    <v-btn icon color="secondary" class="">
                        <v-icon>mdi-bell</v-icon>
                    </v-btn>
                    <v-btn @click="$router.push({name: 'chat-rooms'})" icon color="accent">
                        <v-icon>mdi-chat</v-icon>
                    </v-btn>
                </template>
            </v-row>
            <h1 class=" display-1 my-7 ">
                Online Doctor Consultation
            </h1>

            <v-text-field
                @click="$router.push({name: 'search-doctor'})"
                dense
                placeholder="Search"
                rounded
                filled
            >
                <v-icon color="primary" slot="append">mdi-magnify</v-icon>
            </v-text-field>
            <h4 class="headline mb-3">Choose by category</h4>
            <v-row justify="center">
                <v-col cols="12" v-for="(item, index) in categories" :key="index">
                    <v-card @click="$router.push({
                        name: 'search-doctor-category', 
                        params: {category: item.name}
                        })" 
                        class="card-rounded px-3" outlined >
                        <!-- <v-card-text> -->
                            <v-row align="center">
                                <v-col cols="3">
                                    <v-avatar 
                                        size="42"
                                        :color="`${item.color} lighten-1`"
                                    >
                                        <v-icon class="white--text">{{item.icon}}</v-icon>
                                    </v-avatar>
                                    
                                </v-col>
                                <v-col cols="9">
                                    <span class=" text-capitalize subtitle-1">
                                        {{item.name}}
                                    </span>
                                </v-col>
                            </v-row>
                        <!-- </v-card-text> -->
                    </v-card>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
</template>

<script>
    export default {
        name: "Home",
        data() {
            return {
                categories: [
                    {name: 'general doctor', icon: 'mdi-stethoscope', color: 'green'},
                    {name: 'dental care', icon: 'mdi-tooth', color: "blue"},
                ]
            }
        },
    }
</script>

<style scoped>

</style>