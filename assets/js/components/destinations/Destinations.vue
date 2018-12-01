<template>
    <div>
        <v-snackbar :timeout="3000" bottom right class="success--text" v-model="snackbar">Reiseziel erfolgreich gelöscht</v-snackbar>
        <v-progress-linear height="4" class="ma-0" v-if="!mounted" :indeterminate="true" />
        <v-dialog transition="slide-y-transition" persistent v-model="deleteDialog" max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="title">Reiseziel <b>{{ this.selectedDestination.adress }}</b> löschen</span>
                </v-card-title>
                <v-card-text>
                    <p>Sind Sie sicher, dass Sie das Reiseziel <b>{{ this.selectedDestination.adress }}</b> mit der ID <b>{{ this.selectedDestination.id }}</b> löschen wollen?</p>
                </v-card-text>
                <v-divider />
                <v-card-actions>
                    <v-btn color="error" flat @click="deleteDialog = !deleteDialog; loading = null">Abbrechen</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat @click="deleteDialog = !deleteDialog; deleteDestination(selectedDestination.id);">Löschen</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-container v-if="mounted" fluid>
            <v-btn @click="navigateToCreate" flat color="primary" class="ma-0 mb-1" :class="$vuetify.breakpoint.smAndDown ? 'w-100' : ''">
                Reisziel erstellen
            </v-btn>
            <v-card>
                <v-card-title>
                    <h4>Liste aller Reiseziele</h4>
                    <v-spacer></v-spacer>
                    <v-text-field append-icon="search" label="Reisziele durchsuchen" single-line hide-details v-model="search"></v-text-field>
                </v-card-title>
                <v-data-table
                    :rows-per-page-items="[ 10, 25 ]"
                    rowsPerPageText="Zeilen pro Seite"
                    noDataText="Keine Elemente gefunden"
                    :headers="headers"
                    :items="destinations"
                    :search="search"
                >
                    <template slot="items" slot-scope="props">
                        <td>{{ props.item.id }}</td>
                        <td class="text-xs">{{ props.item.adress }}</td>
                        <td class="text-xs">{{ props.item.country.name }}</td>
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
                                @click="deleteDialog = true; selectedDestination = props.item; loading = props.item.id"
                            >
                                <v-icon v-if="loading == props.item.id" class="custom-loader" light>cached</v-icon>
                                <v-icon v-if="loading != props.item.id" color="pink">close</v-icon>
                            </v-btn>
                        </td>
                        <td class="text-xs">{{ props.item.created_at }}</td>
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
            destinations: [],
            selectedDestination: {},
            deleteDialog: false,
            loading: false,
            
            headers: [
                { text: 'ID', align: 'left', value: 'id' },
                { text: 'Reiseziel', value: 'adress' },
                { text: 'Land', value: 'country' },
                { text: 'Bearbeiten', sortable: false },
                { text: 'Löschen', sortable: false },
                { text: 'Erstellt am', value: 'created_at' },
            ],
        }
    },
    methods: {
        navigateToCreate () {
            this.$router.push({ name: 'createDestination' });
        },
        navigateToEdit (id) {
            this.$router.push({ name: 'editDestination', params: { id } });
        },
        getDestinations () {
            axios.get('api/auth/destination',
            { headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest", "Authorization": "Bearer " + this.$auth.getToken() } }
            ).then(response => {
                // console.log(response.data);
                this.destinations = response.data.data;
                this.mounted = true;
            })
            .catch(error => {
                console.log(error);
            });
        },
        deleteDestination (id) {
            axios.delete('api/auth/destination/' + id,
            { headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest", "Authorization": "Bearer " + this.$auth.getToken() } }
            ).then(response => {
                // console.log(response);
                this.selectedDestination = {};
                this.loading = null;
                for (let i in this.destinations) {
                    if (id == this.destinations[i].id) {
                        this.destinations.splice(i, 1);
                    }
                }
                this.snackbar = true;
            })
            .catch(error => {
                console.log(error);
            });
        }
    },
    mounted () {
        this.getDestinations();
    }
}

</script>
