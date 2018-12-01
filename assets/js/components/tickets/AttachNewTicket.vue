<template>
    <div>
        <v-layout class="mt-3" align-center>
            <b class="primary--text cursor-pointer" @click="dialog = true">
                <v-icon class="primary--text">add</v-icon>
            </b>
            <b class="primary--text cursor-pointer" @click="dialog = true">neues Ticket erstellen</b>
        </v-layout>
        <v-dialog v-model="dialog" fullscreen hide-overlay transition="fade-transition">
            <div v-if="dialog" class="bg-main" :class="$parent.isDark ? 'dark' : 'grey lighten-5'">
                <div class="pa-3">
                    <v-card>
                        <v-container fluid>
                            <h1 class="headline">Ticket erstellen</h1>
                            <v-form v-model="valid" @submit="storeTicket" ref="form" lazy-validation>
                                <v-layout row wrap>
                                    <v-flex xs12>
                                        <v-text-field
                                            v-model="title"
                                            :rules="[v => !!v || 'Ein Titel ist erforderlich']"
                                            label="Titel"
                                            hint="Geben Sie dem Ticket einen Namen"
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
                                    <v-flex xs12>
                                        <v-btn
                                            @click="dialog = false"
                                            color="error"
                                            :large="$vuetify.breakpoint.smAndDown ? true : false"
                                            :class="$vuetify.breakpoint.smAndDown ? 'w-100' : ''"
                                            class="ma-0 mt-3 mr-2 elevation-0"
                                        >
                                            Abbrechen
                                        </v-btn>
                                        <v-btn
                                            @click="storeTicket"
                                            :disabled="mainLoading"
                                            :large="$vuetify.breakpoint.smAndDown ? true : false"
                                            :class="$vuetify.breakpoint.smAndDown ? 'w-100 mt-3' : 'mt-3'"
                                            class="ma-0"
                                            color="primary"
                                        >
                                            <span v-if="!mainLoading">Ticket erstellen</span>
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
            </div>
        </v-dialog>
    </div>
</template>

<style>
.d-none { display: none }
.w-100 { width: 100% }
.bg-main { min-height: 100%; width: 100%; }
.dark { background-color: #303030 }

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
            dialog: false,
            mainLoading: false,
            valid: true,
            title: '',
            price: '',
            description: '',
            editorOption: {
                placeholder: 'Beschreibung',
            }
        }
    },
    methods: {
        storeTicket (event) {
            event.preventDefault();
            if (this.$refs.form.validate()) {
                this.mainLoading = true;
                let price = parseFloat(this.price);
                axios.post('api/auth/ticket',
                { name: this.title, price, description: this.description },
                { headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest", "Authorization": "Bearer " + this.$auth.getToken() } }
                ).then(response => {
                    // console.log(response.data);
                    this.dialog = false;
                    this.mainLoading = false;
                    this.title = '';
                    this.description = '';
                    this.description = '';
                    this.$emit('ticketStored', response.data.data);
                })
                .catch(error => {
                    console.log(error);
                });
            }
        },
    },
    components: {
        quillEditor
    }
}
</script>