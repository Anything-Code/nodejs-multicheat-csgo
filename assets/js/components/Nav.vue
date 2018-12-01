<template>
    <div>
        <v-navigation-drawer
            fixed
            v-model="drawer"
            app
            dark
            floating
        >
            <v-list dense expand>
                <v-list-tile href="http://arriba.test">
                    <v-list-tile-action>
                        <v-icon>home</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Homepage</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-divider></v-divider>
                <v-list-tile :to="{ name: 'dashboard' }">
                    <v-list-tile-action>
                        <v-icon>dashboard</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Dashboard</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-divider></v-divider>
                <v-list-tile :to="{ name: 'images' }">
                    <v-list-tile-action>
                        <v-icon>perm_media</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Medienbibliothek</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile :to="{ name: 'navigation' }">
                    <v-list-tile-action>
                        <v-icon>picture_in_picture</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Navigation</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile :to="{ name: 'social' }">
                    <v-list-tile-action>
                        <v-icon>fab fa-twitter</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Social-Media Links</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-group prepend-icon="local_airport" value="true">
                    <v-list-tile slot="activator">
                        <v-list-tile-title>Reiseverwaltung</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile :to="{ name: 'travels' }">
                        <v-list-tile-action>
                            <v-icon>view_module</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>Alle Reisen</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile :to="{ name: 'countries' }">
                        <v-list-tile-action>
                            <v-icon>map</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>Länder</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile :to="{ name: 'destinations' }">
                        <v-list-tile-action>
                            <v-icon>place</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>Reiseziele</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile :to="{ name: 'housings' }">
                        <v-list-tile-action>
                            <v-icon>location_city</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>Unterbringungsmöglichkeiten</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile :to="{ name: 'housingCategories' }">
                        <v-list-tile-action>
                            <v-icon>supervised_user_circle</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>Unterbringungskategorien</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile :to="{ name: 'rooms' }">
                        <v-list-tile-action>
                            <v-icon>hotel</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>Unterbringungsräume</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile :to="{ name: 'categories' }">
                        <v-list-tile-action>
                            <v-icon>category</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>Kategorien</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile :to="{ name: 'services' }">
                        <v-list-tile-action>
                            <v-icon>note_add</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>Zusatzleistungen</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile :to="{ name: 'tickets' }">
                        <v-list-tile-action>
                            <v-icon>style</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>Tickets</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile :to="{ name: 'createTravel' }">
                        <v-list-tile-action>
                            <v-icon>add</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>Neu</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list-group>
                <v-divider />
                <v-list-group prepend-icon="account_circle" value="true">
                    <v-list-tile slot="activator">
                    <v-list-tile-title>Benutzer verwalten</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile :to="{ name: 'users' }">
                        <v-list-tile-action>
                            <v-icon>people</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>Andere Benutzer</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile :to="{ name: 'user' }">
                        <v-list-tile-action>
                            <v-icon>person</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>Ich</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list-group>
                <v-list-tile :to="{ name: 'customers' }">
                    <v-list-tile-action>
                        <v-icon>euro_symbol</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Kunden</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile color="grey">
                    <v-list-tile-action>
                        <v-icon>event_available</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Buchungen</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <!-- <v-divider></v-divider>
                <v-list-tile color="grey">
                    <v-list-tile-action>
                        <v-icon>search</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>SEO</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile color="grey">
                    <v-list-tile-action>
                        <v-icon>phonelink</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>PWA</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile> -->
                <v-divider />
                <v-list-tile @click.prevent="logout">
                    <v-list-tile-action>
                        <v-icon>exit_to_app</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Logout</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        
        <v-toolbar dark fixed app>
            <v-toolbar-side-icon @click.stop="drawer = !drawer" />
            <v-toolbar-title>
                <span class="amber--text">ARRIBA</span>
                <small class="body-1">
                    Admin Area
                </small>
                <small
                        @mouseover="creatorText = true"
                        @mouseout="creatorText = false"
                        :class="[creatorText ? 'text--darken-3' : 'text--darken-4']"
                        class="caption grey--text creator-text"
                    >
                        by Niklas Lübcke
                    </small>
            </v-toolbar-title>
            <v-spacer />
            <v-tooltip left>
                <v-btn @click="$emit('darkenTheme')" icon slot="activator">
                    <v-icon>
                        invert_colors
                    </v-icon>
                </v-btn>
                <span>Farben invertieren</span>
            </v-tooltip>
        </v-toolbar>
        <v-content>
            <transition name="fade-transition" mode="out-in">
                <router-view />
            </transition>
        </v-content>
    </div>
</template>

<style scoped>

aside.v-navigation-drawer::-webkit-scrollbar {
    width: 10px;
}
aside.v-navigation-drawer::-webkit-scrollbar-thumb {
    background: #444;
}
aside.v-navigation-drawer:hover::-webkit-scrollbar-thumb {
    background: #515151;
}
aside.v-navigation-drawer::-webkit-scrollbar-track {
    background: #444;
}

.creator-text { transition: all 350ms }
.router-link-active { pointer-events: none; color: #17a2b8!important; }
.dropdown-menu { border: none; padding-left: 0.5rem; margin-left: -0.5rem; }
.dropdown-menu a { color:rgba(255, 255, 255, 0.75); }
.dropdown-menu a:hover { color:#fff; background: none; }

@media (min-width: 768px) {
    .dropdown-menu { border-top-left-radius: 0; border-top-right-radius: 0; }
}

</style>

<script>
export default {
    data () {
        return {
            drawer: null,
            creatorText: false
        }
    },
    methods: {
        logout () {
            axios.post('api/auth/logout',
            {},
            { headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest', 'Authorization': 'Bearer ' + localStorage.getItem('token'), } }
            ).then(
                (response) => {
                    //console.log(response);
                    //console.log(response.data);
                    this.$auth.destroyToken();
                    this.$router.push('/admin');
                }
            ).catch(
                (error) => {
                    //console.log(error)
                }
            );
        }
    }
}
</script>