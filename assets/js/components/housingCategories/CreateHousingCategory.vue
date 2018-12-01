<template>
    <div>
        <v-progress-linear height="4" class="ma-0" v-if="!mounted || !housingsMounted" :indeterminate="true" />
        <v-card class="ma-3" v-if="mounted && housingsMounted">
            <v-container fluid>
                <h1 class="headline">Unterbringungskategorie erstellen</h1>
                <v-form v-model="valid" @submit="storeHousingCategory" ref="form" lazy-validation>
                    <v-layout row wrap>
                        <v-flex xs12>
                            <v-text-field
                                v-model="title"
                                required
                                label="Titel"
                                ref="adress"
                                class="mb-2"
                                :rules="[v => !!v || 'Eine Unterbringungskategorie ist erforderlich']"
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
                            <quill-editor ref="textEditor" v-model="description" :options="editorOptions" />
                        </v-flex>
                        <v-flex xs12>
                            <v-btn
                                @click="storeHousingCategory"
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
            housingsMounted: false,
            mainLoading: false,
            housings: [],
            availableHousings: [],
            valid: true,
            title: '',
            editorOptions: {
                placeholder: 'Beschreibung',
            },
            autocomplete: null,
            description: '',
        }
    },
    methods: {
        storeHousingCategory (event) {
            event.preventDefault();
            if (this.$refs.form.validate()) {
                this.mainLoading = true;
                let requestContent = { title: this.title, description: this.editorContent }
                if (this.housings.length > 0) {
                    let housings = new Array;
                    this.housings.forEach(element => { housings.push(element.id) });
                    requestContent.housings = housings;
                }
                axios.post('api/auth/housingCategory',
                requestContent,
                { headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest", "Authorization": "Bearer " + this.$auth.getToken() } }
                ).then(response => {
                    // console.log(response.data);
                    this.$router.push({ name: 'housingCategories' });
                })
                .catch(error => {
                    console.log(error);
                });
            }
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
        this.mounted = true;
        this.getHousings();
    }
}
</script>