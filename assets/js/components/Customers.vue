<template>
    <div>
        <v-dialog transition="slide-y-transition" persistent v-model="deleteDialog" max-width="500px">
        <v-card>
            <v-card-title>
            <span class="headline">Kunde <b>{{ this.clickedUser.vorname }} {{ this.clickedUser.nachname }}</b> löschen</span>
            </v-card-title>
            <v-card-text>
                <p>Sind Sie sicher, dass Sie den Kunden <b>{{ this.clickedUser.vorname }} {{ this.clickedUser.nachname }}</b> mit der ID <b>{{ this.clickedUser.id }}</b> löschen wollen?</p>
            </v-card-text>
            <v-divider />
            <v-card-actions>
                <v-btn color="error" flat @click="deleteDialog = !deleteDialog; loading = null">Abbrechen</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary" flat @click="deleteDialog = !deleteDialog; deleteCustomer(clickedUser.id);">Löschen</v-btn>
            </v-card-actions>
        </v-card>
        </v-dialog>

        <v-progress-linear height="4" class="ma-0" v-if="!mounted" :indeterminate="true"></v-progress-linear>
        <v-container v-if="mounted" fluid>
            <v-card>
                <v-card-title>
                    Liste aller registrierten Kunden ({{ this.customers.length }})
                    <v-spacer></v-spacer>
                    <v-text-field append-icon="search" label="Search" single-line hide-details v-model="search"></v-text-field>
                </v-card-title>
                <v-data-table rowsPerPageText="Zeilen pro Seite" noDataText="Keine Elemente gefunden" searchText="awd" :headers="headers" :items="customers" :search="search">
                    <template slot="items" slot-scope="props">
                    <td>{{ props.item.id }}</td>
                    <td class="text-xs">{{ props.item.vorname }} {{ props.item.nachname }}</td>
                    <td class="text-xs">{{ props.item.email }}</td>
                    <td class="layout">
                        <v-btn
                            :disabled="loading == props.item.id"
                            icon
                            class="mx-0"
                            :data-id="props.item.id"
                            @click="deleteDialog = true; clickedUser = props.item; loading = props.item.id"
                        >
                            <v-icon v-if="loading == props.item.id" class="custom-loader" light>cached</v-icon>
                            <v-icon v-if="loading != props.item.id" color="pink">close</v-icon>
                        </v-btn>
                    </td>
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

<style scoped>
.custom-loader { animation: loader 1s infinite; display: flex; }
@-moz-keyframes loader { from { transform: rotate(0); } to { transform: rotate(360deg); } }
@-webkit-keyframes loader { from { transform: rotate(0); } to { transform: rotate(360deg); } }
@-o-keyframes loader { from { transform: rotate(0); } to { transform: rotate(360deg); } }
@keyframes loader { from { transform: rotate(0); } to { transform: rotate(360deg); } }
</style>

<script>
import axios from 'axios';

export default {
    data () {
        return {
            mounted: false,
            loading: null,
            deleteDialog: false,
            clickedUser: {},
            registerDialog: false,
            username: '',
            email: '',
            password: '',
            eye: true,
            wrong: false,
            valid: true,
            custom: true,
            search: '',

            headers: [
                { text: 'ID', align: 'left', value: 'id' },
                { text: 'Ganzer Name', value: 'vorname' },
                { text: 'E-Mail', value: 'email' },
                { text: 'Löschen', sortable: false },
            ],
            customers: []
        }
    },
    methods: {
        deleteCustomer (id) {
            axios.delete('api/auth/customer/' + id,
            { headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest', 'Authorization': 'Bearer ' + this.$auth.getToken(), } }
            ).then((response) => {
                this.loading = null;
                this.clickedUser = {};
                this.customers.splice(this.customers.findIndex(customer => { return customer == id }), 1);
            }).catch ((error) => {
                console.log(error);
            });
        },
        getCustomers () {
            this.mounted = false;
            this.customers = [];
            axios.get('api/auth/customers',
            { headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest', 'Authorization': 'Bearer ' + this.$auth.getToken(), } }
            ).then((response) => {
                //console.log(response.data);
                response.data.forEach(element => {
                    this.customers.push({ value: false, id: element.id, nachname: element.nachname, vorname: element.vorname, email: element.email });
                });
                this.mounted = true;
                loading = null;
            }
            ).catch((error) => {
                //console.log(error);
            }
            );
        }
    },
    mounted () {
        this.getCustomers();
    }
}
</script>