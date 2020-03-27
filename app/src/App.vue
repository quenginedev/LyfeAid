<template>
  <v-app>
    <v-row justify="center" v-if="show_routes">
      <v-col cols="12" sm="8" md="6" lg="4" xl="3">
        <v-snackbar
          top
          color="error"
          v-model="is_show_error"
        >
          <v-icon left>mdi-alert</v-icon>{{ error.message }}
          <v-btn
                  color="pink"
                  text
                  @click="is_show_error = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-snackbar>
        <router-view></router-view>
      </v-col>  
    </v-row>
    <v-row v-if="show_unsupported" justify="center" align="center">
      <v-col class="text-center">
        <v-icon size="124">mdi-emoticon-sad</v-icon>
        <h3 class="display-2">Sorry platform not supported</h3>
        <p class="secondary--text headline">Android & IOS supported</p>
      </v-col>
    </v-row>
  </v-app>
</template>

<script>
export default {
  name: 'App',

  data: () => ({
    error: {},
    show_routes: false,
    show_unsupported: false,
    is_show_error: false
  }),
  methods: {
    showError(error){
      this.error = error
      this.is_show_error = true
    },
    setDarkMode(){
      let format = 'hh:mm:ss'
      let now = this.$moment()
      let before = this.$moment('18:00:00', format)
      let after = this.$moment('6:00:00', format)
      if(now.isBetween(before, after)){
        this.$vuetify.theme.dark = true    
      }else{
        this.$vuetify.theme.dark = false    

      }
    }
  },
  mounted() {
    this.setDarkMode()
  },
  created() {
    this.$capacitor.Plugins.Device.getInfo().then(info=>{
      console.log(info)
      if (info.operatingSystem == "android" || info.operatingSystem == 'ios'){
        this.show_routes =true
      }else{
        this.show_unsupported = true
      }
    })
    this.$root.$on('error', this.showError)
  },
};
</script>
<style>
  .card-rounded{
    border-radius: 32px !important;
  }
</style>