<template>
    <div>
        <v-snackbar :timeout="3000" bottom right class="success--text" v-model="housingUpdatedAlert">Unterbringungskategorie erfolgreich geändert</v-snackbar>
        <v-progress-linear height="4" class="ma-0" v-if="!mounted || !housingsMounted" :indeterminate="true" />
        <v-card class="ma-3" v-if="mounted && housingsMounted">
            <v-container fluid>
                <h1 class="headline">Unterbringungskategorie bearbeiten</h1>
                <v-form v-model="valid" @submit="editHousing" ref="form" lazy-validation>
                    <v-layout row wrap>
                        <v-flex xs12>
                            <v-text-field
                                v-model="title"
                                required
                                class="mb-2"
                                :rules="[v => !!v || 'Eine Titel ist erforderlich']"
                                label="Titel"
                                hint="Geben Sie eine Titel für die Unterbringungskategorie ein"
                                persistent-hint
                            />
                        </v-flex>
                        <v-flex xs12>
                            <v-select
                                v-model="housings"
                                :items="availableHousings"
                                item-text="title"
                                return-object
                                label="Unterbringungsmöglichkeiten"
                                hint="In welchen Unterbringungsmöglichkeiten befindet sich diese Kategorie"
                                persistent-hint
                                dense
                                multiple
                                chips
                                deletable-chips
                                :menu-props="{ nudgeBottom: '43', transition:'slide-y-transition' }"
                            />
                        </v-flex>
                        <v-flex xs12 class="mt-4">
                            <quill-editor ref="textEditor" v-model="editorContent" :options="editorOption" />
                        </v-flex>
                        <v-flex xs12>
                            <v-btn
                                @click="editHousing"
                                :disabled="mainLoading"
                                :large="$vuetify.breakpoint.smAndDown ? true : false"
                                :class="$vuetify.breakpoint.smAndDown ? 'w-100' : ''"
                                class="ma-0 mt-3 rounded-0 elevation-0"
                                color="primary"
                            >
                                <span v-if="!mainLoading">Unterbringungskategorie speichern</span>
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
            housingsMounted: false,
            housingUpdatedAlert: false,
            mainLoading: false,
            housings: [],
            availableHousings: [],
            valid: true,
            title: '',
            editorOption: {
                placeholder: 'Beschreibung',
            },
            editorContent: ''
        }
    },
    props: ['id'],
    methods: {
        editHousing (event) {
            event.preventDefault();
            if (this.$refs.form.validate()) {
                this.mainLoading = true;
                let requestContent = { title: this.title, description: this.editorContent }
                if (this.housings.length > 0) {
                    let housings = new Array;
                    this.housings.forEach(element => { housings.push(element.id) });
                    requestContent.housings = housings;
                }
                axios.put('api/auth/housingCategory/' + this.id,
                requestContent,
                { headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest", "Authorization": "Bearer " + this.$auth.getToken() } }
                ).then(response => {
                    // console.log(response.data);
                    this.housingUpdatedAlert = true;
                    this.mainLoading = false;
                })
                .catch(error => {
                    console.log(error);
                });
            }
        },
        getHousingCategory () {
            axios.get('api/auth/housingCategory/' + this.id,
            { headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest", "Authorization": "Bearer " + this.$auth.getToken() } }
            ).then(response => {
                // console.log(response.data);
                this.title = response.data.data.title;
                this.editorContent = response.data.data.description;
                this.housings = response.data.data.housings
                this.mounted = true;
            })
            .catch(error => {
                console.log(error);
            });
        },
        getHousings () {
            axios.get('api/auth/housing',
            { headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest", "Authorization": "Bearer " + this.$auth.getToken() } }
            ).then(response => {
                // console.log(response.data);
                this.availableHousings = response.data.data;
                this.housingsMounted = true;
            })
            .catch(error => {
                console.log(error);
            });
        }
    },
    components: {
        quillEditor
    },
    mounted () {
        this.getHousingCategory();
        this.getHousings();
    }
}
</script>