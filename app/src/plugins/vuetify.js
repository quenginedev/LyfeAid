import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: '#06B75E',
                secondary: '#00A9FF',
                accent: '#F28200',
                error: '#FF5157',
            },
            dark: {
                primary: '#06B75E',
                secondary: '#00A9FF',
                accent: '#F28200',
                error: '#FF5157',
            }
        },
    },
});
