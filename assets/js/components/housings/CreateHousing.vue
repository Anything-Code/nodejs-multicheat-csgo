<template>
    <div>
        <v-progress-linear height="4" class="ma-0" v-if="!mounted || !housingCategoriesMounted" :indeterminate="true" />
        <v-card class="ma-3" v-if="mounted && housingCategoriesMounted">
            <v-container fluid>
                <h1 class="headline">Unterbringungsmöglichkeit erstellen</h1>
                <v-form v-model="valid" @submit="storeHousing" ref="form" lazy-validation>
                    <v-layout row wrap>
                        <v-flex xs12>
                            <v-text-field
                                v-model="housingName"
                                required
                                label="Unterbringungsmöglichkeit"
                                ref="adress"
                                class="mb-2"
                                :rules="[v => !!v || 'Eine Unterbringungsmöglichkeit ist erforderlich']"
                                hint="Geben Sie eine Namen für die Unterbringungsmöglichkeit ein"
                                persistent-hint
                            />
                            <v-select
                                v-model="destination"
                                :items="availableDestinationNames"
                                required
                                :rules="[v => !!v || 'Ein Ort ist erforderlich']"
                                label="Ort"
                                hint="In welchem Ort befindet sich die Unterbringungsmöglichkeit"
                                persistent-hint
                                dense
                                :menu-props="{ nudgeBottom:'33', transition:'slide-y-transition' }"
                            />
                        </v-flex>
                        <v-flex xs12>
                            <v-combobox
                                v-model="housingCategories"
                                :items="availableHousingCategories"
                                item-text="title"
                                return-object
                                label="Unterbringungskategorien"
                                hint="Welche Unterbringungskategorien sind verfügbar?"
                                persistent-hint
                                dense
                                multiple
                                chips
                                deletable-chips
                                :menu-props="{ transition:'slide-y-transition' }"
                            />
                        </v-flex>
                        <v-flex xs12 class="mt-4">
                            <quill-editor ref="textEditor" v-model="editorContent" :options="editorOptions" />
                        </v-flex>
                        <v-flex xs12 class="mt-3">
                            <ImagePicker :attached-images="attachedImages" />
                        </v-flex>
                        <v-flex xs12>
                            <v-btn
                                @click="storeHousing"
                                :disabled="mainLoading"
                                :large="$vuetify.breakpoint.smAndDown ? true : false"
                                :class="$vuetify.breakpoint.smAndDown ? 'w-100' : ''"
                                class="ma-0 mt-3 rounded-0 elevation-0"
                                color="primary"
                            >
                                <span v-if="!mainLoading">Unterbringungsmöglichkeit erstellen</span>
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
            housingCategoriesMounted: false,
            mainLoading: false,
            valid: true,
            housingName: '',
            destination: '',
            housingCategories: [],
            availableHousingCategories: [],
            availableDestinations: [],
            availableDestinationNames: [],
            editorOptions: {
                placeholder: 'Beschreibung',
            },
            autocomplete: null,
            editorContent: '',
            attachedImages: []
        }
    },
    methods: {
        storeHousing (event) {
            event.preventDefault();
            if (this.$refs.form.validate()) {
                this.mainLoading = true;
                let requestContent = new Object;
                let destination = this.destination;
                for (let availableDestination of this.availableDestinations) {
                    if (availableDestination.adress == this.destination)
                        destination = availableDestination.id;
                }
                if (this.attachedImages.length == 0) {
                    requestContent = { title: this.housingName, destination, description: this.editorContent };
                } else {
                    let attachedImages = new Array;
                    for (let attachedImage of this.attachedImages) {
                        attachedImages.push(attachedImage.id);
                    }
                    requestContent = { title: this.housingName, destination, description: this.editorContent, images: attachedImages };
                }
                if (this.housingCategories.length > 0)
                    requestContent.housingCategories = this.housingCategories;
                    
                axios.post('api/auth/housing',
                requestContent,
                { headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest", "Authorization": "Bearer " + this.$auth.getToken() } }
                ).then(response => {
                    // console.log(response.data);
                    this.$router.push({ name: 'housings' });
                })
                .catch(error => {
                    console.log(error);
                });
            }
        },
        getDestinations () {
            axios.get('api/auth/destination',
            { headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest", "Authorization": "Bearer " + this.$auth.getToken() } }
            ).then(response => {
                // console.log(response.data);
                this.availableDestinations = response.data.data;
                this.availableDestinations.forEach(destination => { this.availableDestinationNames.push(destination.adress) });
                this.mounted = true;
            })
            .catch(error => {
                console.log(error);
            });
        },
        getHousingCategories () {
            axios.get('api/auth/housingCategory',
            { headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest", "Authorization": "Bearer " + this.$auth.getToken() } }
            ).then(response => {
                // console.log(response.data);
                this.availableHousingCategories = response.data;
                this.housingCategoriesMounted = true;
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
        this.getDestinations();
        this.getHousingCategories();
    }
}
</script>