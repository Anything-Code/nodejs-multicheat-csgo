<template>
    <div>
        <v-navigation-drawer app dark floating fixed v-model="drawer">
            <v-list dense expand>
                <v-list-tile :to="{ name: 'visuals' }">
                    <v-list-tile-action>
                        <v-icon>home</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Visuals</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile class="grey--text">
                    <v-list-tile-action>
                        <v-icon>home</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Aimbot</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile class="grey--text">
                    <v-list-tile-action>
                        <v-icon>home</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Bunnyhop</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile class="grey--text">
                    <v-list-tile-action>
                        <v-icon>home</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Misc</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        
        <v-toolbar fixed app>
            <v-toolbar-side-icon @click.stop="drawer = !drawer" />
            <v-toolbar-title>
                <span class="primary--text">Cheat Menu</span>
            </v-toolbar-title>
        </v-toolbar>
    </div>
</template>

<script>
export default {
    data () {
        return {
            drawer: null
        }
    }
}
</script>