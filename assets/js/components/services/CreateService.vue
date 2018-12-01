<template>
    <div>
        <v-card class="ma-3">
            <v-container fluid>
                <h1 class="headline">Zusatzleistung erstellen</h1>
                <v-form v-model="valid" @submit="storeService" ref="form" lazy-validation>
                    <v-layout row wrap>
                        <v-flex xs12>
                            <v-text-field
                                v-model="title"
                                :rules="[v => !!v || 'Ein Titel ist erforderlich']"
                                label="Titel"
                                hint="Geben Sie der Zusatzleistung einen Titel"
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
                                @click="storeService"
                                :disabled="mainLoading"
                                :large="$vuetify.breakpoint.smAndDown ? true : false"
                                :class="$vuetify.breakpoint.smAndDown ? 'w-100' : ''"
                                class="ma-0 mt-3 rounded-0 elevation-0"
                                color="primary"
                            >
                                <span v-if="!mainLoading">Zusatzleistung erstellen</span>
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
    methods: {
        storeService (event) {
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
                axios.post('api/auth/service',
                requestContent,
                { headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest", "Authorization": "Bearer " + this.$auth.getToken() } }
                ).then(response => {
                    // console.log(response.data);
                    this.$router.push({ name: 'services' });
                })
                .catch(error => {
                    console.log(error);
                });
            }
        },
    },
    components: {
        quillEditor,
        ImagePicker
    }
}
</script>