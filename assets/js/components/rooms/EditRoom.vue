<template>
    <div>
        <v-snackbar :timeout="3000" bottom right class="success--text" v-model="roomUpdatedAlert">Unterbringungsmöglichkeit erfolgreich geändert</v-snackbar>
        <v-progress-linear height="4" class="ma-0" v-if="!mounted" :indeterminate="true" />
        <v-card class="ma-3" v-if="mounted">
            <v-container fluid>
                <h1 class="headline">Raum bearbeiten</h1>
                <v-form v-model="valid" @submit="editRoom" ref="form" lazy-validation>
                    <v-layout row wrap>
                        <v-flex xs12>
                            <v-text-field
                                v-model="roomName"
                                required
                                label="Raum"
                                :rules="[v => !!v || 'Eine Raum ist erforderlich']"
                                hint="Geben Sie eine Namen für die Raum ein"
                                persistent-hint
                            />
                        </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                        <v-flex xs12>
                            <v-select
                                v-model="housing"
                                :items="availableHousingNames"
                                required
                                :rules="[v => !!v || 'Eine Unterbringungsmöglichkeit ist erforderlich']"
                                label="Unterbringungsmöglichkeit"
                                hint="In welcher Unterbringungsmöglichkeit befindet sich der Raum"
                                persistent-hint
                                dense
                                :menu-props="{ nudgeBottom: '33', transition:'slide-y-transition' }"
                            />
                        </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                        <v-flex xs6>
                            <v-text-field
                                v-model="quantitySingleBeds"
                                label="Anzahl Einzelbetten"
                                type="number"
                                hint="Wie viele Einzelbetten gibt es in diesem Raum?"
                                persistent-hint
                                class="mr-2"
                            />
                        </v-flex>
                        <v-flex xs6>
                            <v-text-field
                                v-model="quantityDoubleBeds"
                                label="Anzahl Doppelbetten"
                                type="number"
                                hint="Wie viele Doppelbetten gibt es in diesem Raum?"
                                persistent-hint
                                class="ml-2"
                            />
                        </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                        <v-flex xs12>
                            <v-btn
                                @click="editRoom"
                                :disabled="mainLoading"
                                :large="$vuetify.breakpoint.smAndDown ? true : false"
                                :class="$vuetify.breakpoint.smAndDown ? 'w-100' : ''"
                                class="ma-0 mt-4 rounded-0 elevation-0"
                                color="primary"
                            >
                                <span v-if="!mainLoading">Unterbringungsmöglichkeit bearbeiten</span>
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
            mainLoading: false,
            roomUpdatedAlert: false,
            valid: true,
            roomName: '',
            housing: '',
            availableHousings: [],
            availableHousingNames: [],
            quantitySingleBeds: 0,
            quantityDoubleBeds: 0
        }
    },
    props: ['id'],
    methods: {
        editRoom (event) {
            event.preventDefault();
            if (this.$refs.form.validate()) {
                this.mainLoading = true;
                let housing_id = null;
                this.availableHousings.forEach(item => { if (item.title == this.housing) housing_id = item.id });
                axios.put('api/auth/room/' + this.id,
                {
                    title: this.roomName,
                    housing_id,
                    quantity_singlebeds: this.quantitySingleBeds,
                    quantity_doublebeds: this.quantityDoubleBeds
                },
                { headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest", "Authorization": "Bearer " + this.$auth.getToken() } }
                ).then(response => {
                    // console.log(response.data);
                    this.mainLoading = false;
                    this.roomUpdatedAlert = true;
                })
                .catch(error => {
                    console.log(error);
                });
            }
        },
        getRoom () {
            axios.get('api/auth/room/' + this.id,
            { headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest", "Authorization": "Bearer " + this.$auth.getToken() } }
            ).then(response => {
                // console.log(response.data.data);
                this.roomName = response.data.data.title;
                this.housing = response.data.data.housing.title;
                this.quantitySingleBeds = response.data.data.quantity_singlebeds;
                this.quantityDoubleBeds = response.data.data.quantity_doublebeds;
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
                // console.log(response.data.data);
                this.availableHousings = response.data.data;
                for (let housing of this.availableHousings) {
                    this.availableHousingNames.push(housing.title);
                }
            })
            .catch(error => {
                console.log(error);
            });
        }
    },
    mounted() {
        this.getHousings();
        this.getRoom();
    }
}
</script>