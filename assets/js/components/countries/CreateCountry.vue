<template>
    <div>
        <v-card class="ma-3">
            <v-container fluid>
                <h1 class="headline">Land erstellen</h1>
                <v-form v-model="form" @submit="storeCountry" ref="form" lazy-validation>
                    <v-layout row wrap>
                        <v-flex xs12>
                            <v-text-field
                                v-model="countryName"
                                :rules="[v => !!v || 'Ein Ländername ist erforderlich']"
                                label="Name des Landes"
                                hint="Geben Sie den Namen des Landes ein"
                                persistent-hint
                            />
                        </v-flex>
                        <v-flex xs12 class="mt-4">
                            <quill-editor ref="textEditor" v-model="description" :options="editorOption" />
                        </v-flex>
                        <v-flex xs12 class="mt-3">
                            <ImagePicker :attached-images="attachedImages" />
                        </v-flex>
                        <v-flex xs12>
                            <v-btn
                                @click="storeCountry"
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
            mainLoading: false,
            form: true,
            countryName: '',
            editorOption: {
                placeholder: 'Beschreibung',
            },
            description: '',
            attachedImages: []
        }
    },
    methods: {
        storeCountry (event) {
            event.preventDefault();
            if (this.$refs.form.validate()) {
                this.mainLoading = true;
                let requestContent = new Object;
                if (this.attachedImages.length == 0) {
                    requestContent = { name: this.countryName, description: this.description };
                } else {
                    let attachedImages = new Array;
                    for (let attachedImage of this.attachedImages) {
                        attachedImages.push(attachedImage.id);
                    }
                    requestContent = { name: this.countryName, description: this.description, images: attachedImages };
                }
                axios.post('api/auth/country',
                requestContent,
                { headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest", "Authorization": "Bearer " + this.$auth.getToken() } }
                ).then(response => {
                    // console.log(response.data);
                    this.$router.push({ name: 'countries' });
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