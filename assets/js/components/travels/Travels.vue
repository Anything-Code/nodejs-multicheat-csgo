<template>
    <div>
        <v-snackbar :timeout="3000" bottom right class="success--text" v-model="snackbar">Reise erfolgreich gelöscht</v-snackbar>
        <v-progress-linear height="4" class="ma-0" v-if="!mounted" :indeterminate="true" />
        <v-dialog transition="slide-y-transition" persistent v-model="deleteDialog" max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="title">Reise <b>{{ this.selectedTravel.title }}</b> löschen</span>
                </v-card-title>
                <v-card-text>
                    <p>Sind Sie sicher, dass Sie die Reise <b>{{ this.selectedTravel.title }}</b> mit der ID <b>{{ this.selectedTravel.id }}</b> löschen wollen?</p>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-btn color="error" flat @click="deleteDialog = !deleteDialog; loading = null">Abbrechen</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat @click="deleteDialog = !deleteDialog; deleteTravel(selectedTravel.id);">Löschen</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-container v-if="mounted" fluid>
            <v-btn @click="navigateToCreate" flat color="primary" class="ma-0 mb-1" :class="$vuetify.breakpoint.smAndDown ? 'w-100' : ''">
                Reise erstellen
            </v-btn>
            <v-card>
                <v-card-title>
                    <h4>Liste aller Reisen</h4>
                    <v-spacer></v-spacer>
                    <v-text-field append-icon="search" label="Reisen durchsuchen" single-line hide-details v-model="search" />
                </v-card-title>
                <v-data-table
                    :rows-per-page-items="[ 10, 25 ]"
                    rowsPerPageText="Zeilen pro Seite"
                    noDataText="Keine Elemente gefunden"
                    :headers="headers"
                    :items="travels"
                    :search="search"
                >
                    <template slot="items" slot-scope="props">
                        <td>{{ props.item.id }}</td>
                        <td class="text-xs">{{ props.item.title }}</td>
                        <td class="text-xs">{{ props.item.destination.adress }}</td>
                        <td class="text-xs">{{ props.item.backend_user.username }}</td>
                        <td>
                            <v-btn @click="navigateToEdit(props.item.id)" icon class="mx-0" :data-id="props.item.id">
                                <v-icon color="primary">edit</v-icon>
                            </v-btn>
                        </td>
                        <td>
                            <v-btn
                                :disabled="loading == props.item.id"
                                icon
                                class="mx-0"
                                :data-id="props.item.id"
                                @click="deleteDialog = true; selectedTravel = props.item; loading = props.item.id"
                            >
                                <v-icon v-if="loading == props.item.id" class="custom-loader" light>cached</v-icon>
                                <v-icon v-if="loading != props.item.id" color="pink">close</v-icon>
                            </v-btn>
                        </td>
                        <td class="text-xs">{{ new Date(props.item.beginning_date).toLocaleDateString() }}</td>
                    </template>
                    <v-layout slot="no-results">
                        <v-flex>
                            <p class="text-align-center ma-0">Ihre Suche zu <b>"{{ search }}"</b> hat keine Ergebnisse.</p>
                        </v-flex>
                    </v-layout>
                </v-data-table>
            </v-card>
        </v-container>
    </div>
</template>

<style>
.w-100 { width: 100% }
.text-align-center { text-align: center; }
.custom-loader { animation: loader 1s infinite; display: flex; }
@-moz-keyframes loader { from { transform: rotate(0); } to { transform: rotate(360deg); } }
@-webkit-keyframes loader { from { transform: rotate(0); } to { transform: rotate(360deg); } }
@-o-keyframes loader { from { transform: rotate(0); } to { transform: rotate(360deg); } }
@keyframes loader { from { transform: rotate(0); } to { transform: rotate(360deg); } }
</style>

<script>
export default {
    data () {
        return {
            mounted: false,
            snackbar: false,
            search: '',
            travels: [],
            selectedTravel: new Object,
            deleteDialog: false,
            loading: false,
            
            headers: [
                { text: 'ID', align: 'left', value: 'id' },
                { text: 'Reisetitel', value: 'title' },
                { text: 'Adresse', value: 'destination.adress' },
                { text: 'Erstellt von', value: 'backend_user.username' },
                { text: 'Bearbeiten', sortable: false },
                { text: 'Löschen', sortable: false },
                { text: 'Reisestart', value: 'beginning_date' }
            ],
        }
    },
    methods: {
        navigateToCreate () {
            this.$router.push({ name: 'createTravel' });
        },
        navigateToEdit (id) {
            this.$router.push({ name: 'editTravel', params: { id } });
        },
        getTravels () {
            axios.get('api/auth/travel',
            { headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest", "Authorization": "Bearer " + this.$auth.getToken() } }
            ).then(response => {
                // console.log(response.data);
                this.travels = response.data.data;
                this.mounted = true;
            })
            .catch(error => {
                console.log(error);
            });
        },
        deleteTravel (id) {
            axios.delete('api/auth/travel/' + id,
            { headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest", "Authorization": "Bearer " + this.$auth.getToken() } }
            ).then(response => {
                // console.log(response);
                this.selectedTravel = new Object;
                this.loading = null;
                let travelIdToDelete = element => { return element == id };
                this.travels.splice(this.travels.findIndex(travelIdToDelete), 1);
                this.snackbar = true;
            })
            .catch(error => {
                console.log(error);
            });
        }
    },
    mounted () {
        this.getTravels();
    }
}

</script>
