<template>
    <div>
        <v-app :dark="darkValue">
            <transition name="fade-transition" mode="out-in">
                <router-view @darkenTheme="invertColors" />
            </transition>
        </v-app>
    </div>
</template>

<style>
html { overflow-y: auto }
.rounded-0 { border-radius: 0; }
</style>

<script>
    export default {
        data () {
            return {
                darkValue: false,
            }
        },
        methods: {
            invertColors () {
                if (localStorage.getItem('applicationTheme')) {
                    this.darkValue = false;
                    localStorage.removeItem('applicationTheme')
                } else {
                    this.darkValue = true;
                    localStorage.setItem('applicationTheme', 'dark')
                }
            }
        },
        mounted () {
            if (localStorage.getItem('applicationTheme'))
                this.darkValue = true;
            else
                this.darkValue = false;
        }
    }
</script>