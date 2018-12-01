<template>
    <div>
        <v-snackbar :timeout="3000" bottom right class="success--text" v-model="countryUpdatedAlert">Reiseziel erfolgreich geändert</v-snackbar>
        <v-progress-linear height="4" class="ma-0" v-if="!mounted" :indeterminate="true" />
        <v-card class="ma-3" v-if="mounted">
            <v-container fluid>
                <h1 class="headline">Reiseziel bearbeiten</h1>
                <v-form v-model="valid" @submit="editDestination" ref="form" lazy-validation>
                    <v-layout row wrap>
                        <v-flex xs12>
                            <v-text-field
                                v-model="destinationAdress"
                                required
                                class="mb-2"
                                :rules="[v => !!v || 'Ein Ländername ist erforderlich']"
                                label="Adresse"
                                hint="Geben Sie eine Adresse für das Reiseziel ein"
                                persistent-hint
                            />
                            <v-combobox
                                v-model="country"
                                :items="availableCountryNames"
                                required
                                :rules="[v => !!v || 'Ein Land ist erforderlich']"
                                label="Land"
                                hint="In welchem Land liegt das Reiseziel"
                                persistent-hint
                                dense
                                :menu-props="{ transition:'slide-y-transition' }"
                            />
                        </v-flex>
                        <v-flex xs12 class="mt-4">
                            <quill-editor ref="textEditor" v-model="editorContent" :options="editorOption" />
                        </v-flex>
                        <v-flex xs12 class="mt-3">
                            <ImagePicker :attached-images="attachedImages" />
                        </v-flex>
                        <v-flex xs12>
                            <v-btn
                                @click="editDestination"
                                :disabled="mainLoading"
                                :large="$vuetify.breakpoint.smAndDown ? true : false"
                                :class="$vuetify.breakpoint.smAndDown ? 'w-100 mt-3' : 'mt-3'"
                                class="ma-0 mt-3 rounded-0 elevation-0"
                                color="primary"
                            >
                                <span v-if="!mainLoading">Reiseziel speichern</span>
                                <span v-if="mainLoading" class="custom-loader">
                                    <v-icon light>cached</v-icon>
                                </span>
                            </v-btn>
                            <input class="d-none" type="submit">
                        </v-flex>
                    </v-layout>
                </v-form>
            </v-container>
        </v-card>
    </div>
</template>

<style>
.d-none { display: none }
.w-100 { width: 100% }

.custom-loader {
    animation: loader 1s infinite;
    display: flex;
}

@-moz-keyframes loader { from { transform: rotate(0); } to { transform: rotate(360deg); } }
@-webkit-keyframes loader { from { transform: rotate(0); } to { transform: rotate(360deg); } }
@-o-keyframes loader { from { transform: rotate(0); } to { transform: rotate(360deg); } }
@keyframes loader { from { transform: rotate(0); } to { transform: rotate(360deg); } }
</style>

<script>
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';

import { quillEditor } from 'vue-quill-editor';
import ImagePicker from '../ImagePicker';

export default {
    data () {
        return {
            mounted: false,
            countryUpdatedAlert: false,
            mainLoading: false,
            valid: true,
            destinationAdress: '',
            country: '',
            availableCountries: [],
            availableCountryNames: [],
            editorOption: {
                placeholder: 'Beschreibung',
            },
            editorContent: '',
            attachedImages: []
        }
    },
    props: ['id'],
    methods: {
        editDestination (event) {
            event.preventDefault();
            if (this.$refs.form.validate()) {
                this.mainLoading = true;
                let requestContent = new Object;
                let country = this.country;
                for (let availableCountry of this.availableCountries) {
                    if (availableCountry.name == this.country)
                        country = availableCountry.id;
                }
                if (this.attachedImages.length == 0) {
                    requestContent = { adress: this.destinationAdress, country, description: this.editorContent };
                } else {
                    let attachedImages = new Array;
                    for (let attachedImage of this.attachedImages) {
                        attachedImages.push(attachedImage.id);
                    }
                    requestContent = { adress: this.destinationAdress, country, description: this.editorContent, images: attachedImages };
                }
                axios.put('api/auth/destination/' + this.id,
                requestContent,
                { headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest", "Authorization": "Bearer " + this.$auth.getToken() } }
                ).then(response => {
                    // console.log(response.data);
                    this.countryUpdatedAlert = true;
                    this.mainLoading = false;
                })
                .catch(error => {
                    console.log(error);
                });
            }
        },
        getDestination () {
            axios.get('api/auth/destination/' + this.id,
            { headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest", "Authorization": "Bearer " + this.$auth.getToken() } }
            ).then(response => {
                // console.log(response.data);
                this.destinationAdress = response.data.data.adress;
                this.country = response.data.data.country.name;
                this.editorContent = response.data.data.description;
                let images = new Array;
                for (let image of response.data.data.images) {
                    images.push({ id: image.id, url:image.url, smallImageUrl: image.url + '?w=300&h=300&fit=crop', largeImageUrl: image.url + '?w=750&h=750&fit=crop', alt_text: image.alt_text, by: image.by, name: image.name, title: image.title, description: image.description, resolution: image.resolution, size: image.size, created_at: image.created_at, updated_at: image.updated_at, selected: false });
                }
                this.attachedImages = images;
                this.mounted = true;
            })
            .catch(error => {
                console.log(error);
            });
        },
        getCountries () {
            axios.get('api/auth/country',
            { headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest", "Authorization": "Bearer " + this.$auth.getToken() } }
            ).then(response => {
                // console.log(response.data);
                this.availableCountries = response.data;
                for (let country of this.availableCountries) {
                    this.availableCountryNames.push(country.name);
                }
            })
            .catch(error => {
                console.log(error);
            });
        }
    },
    components: {
        quillEditor,
        ImagePicker
    },
    mounted () {
        this.getDestination();
        this.getCountries();
    }
}
</script>