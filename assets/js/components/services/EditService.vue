<template>
    <div>
        <v-snackbar :timeout="3000" bottom right class="success--text" v-model="snackbar">Zusatzleistung erfolgreich geändert</v-snackbar>
        <v-progress-linear height="4" class="ma-0" v-if="!mounted" :indeterminate="true" />
        <v-card v-if="mounted">
            <v-container fluid>
                <h1 class="headline">Zusatzleistung bearbeiten</h1>
                <v-form v-model="valid" @submit="editService" ref="form" lazy-validation>
                    <v-layout row wrap>
                        <v-flex xs12>
                            <v-text-field
                                v-model="title"
                                :rules="[v => !!v || 'Ein Titel ist erforderlich']"
                                label="Titel"
                                hint="Ändern Sie den Titel der Zusatzleistung"
                                persistent-hint
                            />
                        </v-flex>
                    </v-layout>
                    <v-layout class="mt-1" row wrap>
                        <v-flex xs12>
                            <v-text-field
                                type="number"
                                min="0"
                                v-model="price"
                                :class="$vuetify.breakpoint.mdAndUp ? 'pr-2' : ''"
                                :rules="[
                                    v => !!v || 'Ein Preis ist erforderlich',
                                    v => parseInt(v) >= 0 || 'dieser Wert muss 0 oder größer sein',
                                    v => v.match(/^\d+(\.\d{2})?$/gm) != null || 'Der Preis muss im Format \'0*.00\' angegeben werden'
                                ]"
                                suffix="€"
                                label="Preis"
                                hint="Wie viel soll's kosten?"
                            />
                        </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                        <v-flex xs12 class="mt-4">
                            <quill-editor ref="textEditor" v-model="description" :options="editorOption" />
                        </v-flex>
                        <v-flex xs12 class="mt-3">
                            <ImagePicker :attached-images="attachedImages" />
                        </v-flex>
                        <v-flex xs12>
                            <v-btn
                                @click="editService"
                                :disabled="mainLoading"
                                :large="$vuetify.breakpoint.smAndDown ? true : false"
                                :class="$vuetify.breakpoint.smAndDown ? 'w-100' : ''"
                                class="ma-0 mt-3 rounded-0 elevation-0"
                                color="primary"
                            >
                                <span v-if="!mainLoading">Land speichern</span>
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
            snackbar: false,
            countryStoredAlert: false,
            mainLoading: false,
            valid: true,
            title: '',
            price: '',
            description: '',
            attachedImages: [],
            editorOption: {
                placeholder: 'Beschreibung',
            }
        }
    },
    props: ['id'],
    methods: {
        editService (event) {
            event.preventDefault();
            if (this.$refs.form.validate()) {
                this.mainLoading = true;
                let requestContent = new Object;
                let price = parseFloat(this.price);
                if (this.attachedImages.length == 0) {
                    requestContent = { name: this.title, price, description: this.description };
                } else {
                    let attachedImages = new Array;
                    for (let attachedImage of this.attachedImages) {
                        attachedImages.push(attachedImage.id);
                    }
                    requestContent = { name: this.title, price, description: this.description, images: attachedImages };
                }
                axios.put('api/auth/service/' + this.id,
                requestContent,
                { headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest", "Authorization": "Bearer " + this.$auth.getToken() } }
                ).then(response => {
                    // console.log(response.data);
                    this.snackbar = true;
                    this.mainLoading = false;
                })
                .catch(error => {
                    console.log(error);
                });
            }
        },
        getCountry () {
            axios.get('api/auth/service/' + this.id,
            { headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest", "Authorization": "Bearer " + this.$auth.getToken() } }
            ).then(response => {
                // console.log(response.data);
                this.title = response.data.data.name;
                this.price = response.data.data.price.toString();
                this.description = response.data.data.description;
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
        }
    },
    components: {
        quillEditor,
        ImagePicker
    },
    mounted() {
        this.getCountry();
    }
}
</script>