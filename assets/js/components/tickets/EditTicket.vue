<template>
    <div>
        <v-snackbar :timeout="3000" bottom right class="success--text" v-model="snackbar">Ticket erfolgreich geändert</v-snackbar>
        <v-progress-linear height="4" class="ma-0" v-if="!mounted" :indeterminate="true" />
        <v-card class="ma-3" v-if="mounted">
            <v-container fluid>
                <h1 class="headline">Ticket bearbeiten</h1>
                <v-form v-model="valid" @submit="editTicket" ref="form" lazy-validation>
                    <v-layout row wrap>
                        <v-flex xs12>
                            <v-text-field
                                v-model="title"
                                :rules="[v => !!v || 'Ein Name ist erforderlich']"
                                label="Name"
                                hint="Ändern Sie den Name des Tickets"
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
                                @click="editTicket"
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
    props: ['id'],
    methods: {
        editTicket (event) {
            event.preventDefault();
            if (this.$refs.form.validate()) {
                this.mainLoading = true;
                let price = parseFloat(this.price);
                axios.put('api/auth/ticket/' + this.id,
                { name: this.title, price, description: this.description },
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
        getTicket () {
            axios.get('api/auth/ticket/' + this.id,
            { headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest", "Authorization": "Bearer " + this.$auth.getToken() } }
            ).then(response => {
                // console.log(response.data);
                this.title = response.data.data.name;
                this.price = response.data.data.price.toString();
                this.description = response.data.data.description;
                this.mounted = true;
            })
            .catch(error => {
                console.log(error);
            });
        }
    },
    components: {
        quillEditor
    },
    mounted() {
        this.getTicket();
    }
}
</script>