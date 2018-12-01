<template>
    <div>
        <v-snackbar :timeout="3000" bottom right class="success--text" v-model="linkSavedAlert">Link erfolgreich hinzugefügt</v-snackbar>
        <v-snackbar :timeout="3000" bottom right class="success--text" v-model="linkUpdatedAlert">URL erfolgreich geändert</v-snackbar>
        <v-snackbar :timeout="3000" bottom right class="success--text" v-model="linkRemovedAlert">Link erfolgreich gelöscht</v-snackbar>
        <v-progress-linear height="4" class="ma-0" v-if="!mounted" :indeterminate="true"></v-progress-linear>
        <v-container v-if="mounted" fluid>
            <h1 class="title">Social Media Links</h1>
            <v-form v-model="valid" @submit="saveSocialLink" ref="form" lazy-validation>
                <v-layout class="mt-3 mb-5" row wrap>
                    <v-flex :class="$vuetify.breakpoint.mdAndUp ? 'pr-1' : ''" xs12 md3>
                        <v-select
                            :rules="[v => !!v || 'Wählen Sie ein Soziales Netzwerk aus']"
                            :items="socialMediaTypes"
                            :prepend-icon="socialMediaIcons(selected)"
                            v-model="selected"
                            :menu-props="{ nudgeBottom:'33' }"
                            dense
                            label="Social-Media-Icon"
                            hint="Wählen Sie einen der Social Media Typen aus für die Darstellung der Icons"
                            persistent-hint
                        />
                    </v-flex>
                    <v-flex :class="$vuetify.breakpoint.mdAndUp ? 'pl-1' : ''" xs12 md9>
                        <v-text-field
                            v-model="url"
                            required
                            :rules="[v => !!v || 'Fügen Sie einen Profil-Link ein']"
                            label="url"
                            hint="fügen Sie ihre Profil-URL ein"
                            persistent-hint
                        />
                    </v-flex>
                    <v-flex xs12>
                        <v-btn
                        @click="saveSocialLink"
                        :disabled="mainLoading"
                        :large="$vuetify.breakpoint.smAndDown ? true : false"
                        class="ma-0 mt-4 rounded-0 elevation-0"
                        :class="$vuetify.breakpoint.smAndDown ? 'w-100' : ''"
                        color="primary"
                        >
                            <span v-if="!mainLoading">Link speichern</span>
                            <span v-if="mainLoading" class="custom-loader">
                                <v-icon light>cached</v-icon>
                            </span>
                        </v-btn>
                        <input class="d-none" type="submit">
                    </v-flex>
                </v-layout>
            </v-form>
            <h1 v-if="savedLinks.length > 0" class="subheading">Gespeicherte Links:</h1>
            <v-layout v-for="savedLink in savedLinks" :key="savedLink.id" class="my-2" align-center>
                <v-flex>
                    <v-text-field
                        ref="focus"
                        :prepend-icon="socialMediaIcons(savedLink.type)"
                        label="url"
                        :disabled="savedLink.disabled"
                        v-model="savedLink.url"
                    />
                </v-flex>
                <v-btn @click="updateSocialLink(savedLink.id)" v-if="!savedLink.disabled" class="ma-0" icon>
                    <v-icon v-if="!savedLink.storeLoading" color="success">check</v-icon>
                    <v-icon v-if="savedLink.storeLoading" color="success" class="custom-loader">cached</v-icon>
                </v-btn>
                <v-btn @click="enableSocialLink(savedLink.id)" class="ma-0" icon>
                    <v-icon :color="savedLink.disabled ? 'primary' : 'pink'">{{savedLink.disabled ? 'edit' : 'block'}}</v-icon>
                </v-btn>
                <v-btn @click="deleteSocialLink(savedLink.id)" class="ma-0" icon>
                    <v-icon v-if="!savedLink.deleteLoading" color="pink">close</v-icon>
                    <v-icon v-if="savedLink.deleteLoading" color="pink" class="custom-loader">cached</v-icon>
                </v-btn>
            </v-layout>
        </v-container>
    </div>
</template>

<style scoped>
.w-100 { width: 100%; }
.d-none { display: none }

.custom-loader { animation: loader 1s infinite; display: flex; }

@-moz-keyframes loader { from { transform: rotate(0); } to { transform: rotate(360deg); } }
@-webkit-keyframes loader { from { transform: rotate(0); } to { transform: rotate(360deg); } }
@-o-keyframes loader { from { transform: rotate(0); } to { transform: rotate(360deg); } }
@keyframes loader { from { transform: rotate(0); } to { transform: rotate(360deg); } }
</style>


<script>

export default {
    data () {
        return {
            linkSavedAlert: false,
            linkUpdatedAlert: false,
            linkRemovedAlert: false,
            mounted: false,
            mainLoading: false,
            valid: true,
            selected: '',
            url: '',
            socialMediaTypes: [
                'Twitter',
                'Facebook',
                'Instagram',
                'Google+',
                'YouTube'
            ],
            socialMediaTypeIcons: [
                'close'
            ],
            savedLinks: []
        }
    },
    methods: {
        getSocialLinks () {
            axios.get('api/auth/social',
            { headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest", "Authorization": "Bearer " + this.$auth.getToken() } }
            ).then(response => {
                // console.log(response.data);
                for (let retrievedLink of response.data) {
                    this.savedLinks.unshift({
                        id: retrievedLink.id,
                        disabled: true,
                        type: retrievedLink.social_media_type,
                        storeLoading: false,
                        deleteLoading: false,
                        url: retrievedLink.url
                    });
                }
                this.mounted = true;
            })
            .catch(error => {
                console.log(error);
            });
        },
        updateSocialLink (id) {
            for (let savedLink of this.savedLinks) {
                if (id == savedLink.id) {
                    savedLink.storeLoading = true;
                    axios.put('api/auth/social/' + id,
                    { url: savedLink.url },
                    { headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest", "Authorization": "Bearer " + this.$auth.getToken() } }
                    ).then(response => {
                        // console.log(response);
                        savedLink.disabled = !savedLink.disabled;
                        savedLink.storeLoading = false;
                        this.linkUpdatedAlert = true;
                    }
                    ).catch(error => {
                        console.log(error);
                        savedLink.storeLoading = false;
                    });
                }
            }
        },
        enableSocialLink (id) {
            this.savedLinks.forEach((savedLink, i) =>{
                if (id == savedLink.id) {
                    savedLink.disabled = !savedLink.disabled;
                    setTimeout(_ => {
                        this.$refs.focus[i].focus();
                    }, 100);
                }
            })
        },
        saveSocialLink (event) {
            event.preventDefault();
            if (this.$refs.form.validate()) {
                this.mainLoading = true;
                axios.post('api/auth/social',
                { social_media_type: this.selected, url: this.url },
                { headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest", "Authorization": "Bearer " + this.$auth.getToken() } }
                ).then(response => {
                    // console.log(response.data);
                    this.mainLoading = false;
                    this.savedLinks.push({
                        id: response.data.newLinkObject.id,
                        disabled: true,
                        type: this.selected,
                        storeLoading: false,
                        deleteLoading: false,
                        url: this.url
                    });
                    this.selected = '';
                    this.url = '';
                    this.$refs.form.reset();
                    this.linkSavedAlert = true;
                })
                .catch(error => {
                    console.log(error);
                });
            }
        },
        deleteSocialLink (id) {
            for (let i in this.savedLinks) {
                if (id == this.savedLinks[i].id) {
                    this.savedLinks[i].deleteLoading = true;
                }
            }
            axios.delete('api/auth/social/' + id,
            { headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest", "Authorization": "Bearer " + this.$auth.getToken() } }
            ).then(response => {
                // console.log(response);
                for (let i in this.savedLinks) {
                    if (id == this.savedLinks[i].id) {
                        this.savedLinks.splice(i, 1);
                    }
                }
                this.linkRemovedAlert = true;
            })
            .catch(error => {
                console.log(error);
                for (let i in this.savedLinks) {
                    if (id == this.savedLinks[i].id) {
                        this.savedLinks[i].deleteLoading = false;
                    }
                }
            });
        },
        socialMediaIcons (selected) {
            switch (selected) {
                case 'Twitter':
                    return 'fab fa-twitter';
                    break;
                case 'Facebook':
                    return 'fab fa-facebook-f';
                    break;
                case 'Instagram':
                    return 'fab fa-instagram';
                    break;
                case 'Google+':
                    return 'fab fa-google-plus-g';
                    break;
                case 'YouTube':
                    return 'fab fa-youtube';
                    break;
            }
        }
    },
    mounted () {
        this.getSocialLinks();
    }
}

</script>
