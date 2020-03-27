<template>
  <v-app>        
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
  </v-app>
</template>

<script>
export default {
  name: 'App',

  data: () => ({
    error: {},
    is_show_error: false
  }),
  methods: {
    showError(error){
      this.error = error
      this.is_show_error = true
    }
  },
  mounted() {
    let format = 'hh:mm:ss'
    let now = this.$moment()
    let after = this.$moment('06:00:00', format)
    let before = this.$moment('18:00:00', format)
    if(now.isBetween(before, after)){
      this.$vuetify.theme.dark = true    
    }else{
      this.$vuetify.theme.dark = false
    }
  },
  created() {
    this.$root.$on('error', this.showError)
  },
};
</script>
<style>
  .card-rounded{
    border-radius: 32px !important;
  }
</style>