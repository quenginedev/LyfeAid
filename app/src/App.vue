<template>
  <v-app>
    <v-row justify="center">
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
  created() {
    this.$vuetify.theme.dark = false
    this.$root.$on('error', this.showError)
  },
};
</script>
<style>
  .card-rounded{
    border-radius: 32px !important;
  }
</style>