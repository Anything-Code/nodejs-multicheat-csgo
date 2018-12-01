<template>
    <div>
        <v-progress-linear height="4" class="ma-0" v-if="!mounted" :indeterminate="true" />
        <v-card class="ma-3" v-if="mounted">
            <v-container fluid>
                <h1 class="headline">Reiseziel erstellen</h1>
                <v-form v-model="valid" @submit="storeDestination" ref="form" lazy-validation>
                    <v-layout row wrap>
                        <v-flex xs12>
                            <v-text-field
                                v-model="destinationAdress"
                                label="Adresse"
                                ref="adress"
                                class="mb-2"
                                :rules="[v => !!v || 'Eine Adresse ist erforderlich']"
                                hint="Geben Sie eine Adresse für das Reiseziel ein"
                                persistent-hint
                            />
                            <v-combobox
                                v-model="country"
                                :items="availableCountryNames"
                                :rules="[v => !!v || 'Ein Land ist erforderlich']"
                                label="Land"
                                hint="In welchem Land liegt das Reiseziel"
                                persistent-hint
                                dense
                                :menu-props="{ transition: 'slide-y-transition' }"
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
                                @click="storeDestination"
                                :disabled="mainLoading"
                                :large="$vuetify.breakpoint.smAndDown ? true : false"
                                :class="$vuetify.breakpoint.smAndDown ? 'w-100' : ''"
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

<style scoped>
.d-none { display: none }
.w-100 { width: 100% }

.custom-loader { animation: loader 1s infinite; display: flex; }
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
            destinationStoredAlert: false,
            mainLoading: false,
            valid: true,
            destinationAdress: '',
            country: '',
            availableCountries: [],
            availableCountryNames: [],
            editorOption: {
                placeholder: 'Beschreibung',
            },
            autocomplete: null,
            editorContent: '',
            attachedImages: []
        }
    },
    methods: {
        storeDestination (event) {
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
                axios.post('api/auth/destination',
                requestContent,
                { headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest", "Authorization": "Bearer " + this.$auth.getToken() } }
                ).then(response => {
                    // console.log(response.data);
                    this.$router.push({ name: 'destinations' });
                })
                .catch(error => {
                    console.log(error);
                });
            }
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
                this.mounted = true;
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
        this.getCountries();
    }
}
</script>