<template>
    <v-app dark>
        <Nav />
        <v-content>
            <transition name="slide-y-transition" mode="out-in">
                <router-view />
            </transition>
        </v-content>
    </v-app>
</template>

<style>
html { overflow-y: auto }
.rounded-0 { border-radius: 0; }
</style>

<script>
import Nav from '../components/Nav';
export default {
    components: { Nav }
}
</script>