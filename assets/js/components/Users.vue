<template>
    <div>
        <v-dialog transition="slide-y-transition" persistent v-model="deleteDialog" max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="title">Benutzer <b>{{ this.clickedUser.username }}</b> löschen</span>
                </v-card-title>
                <v-card-text>
                    <p>Sind Sie sicher, dass Sie den Benutzer <b>{{ this.clickedUser.username }}</b> mit der ID <b>{{ this.clickedUser.id }}</b> löschen wollen?</p>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-btn color="error" flat @click="deleteDialog = !deleteDialog; loading = null">Abbrechen</v-btn>
                    <v-spacer />
                    <v-btn color="primary" flat @click="deleteDialog = !deleteDialog; deleteUser(clickedUser.id);">Löschen</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog persistent v-model="registerDialog" max-width="500px">
            <v-card>
                <v-card-title class="pb-0">
                <span class="headline">Benutzer erstellen</span>
                </v-card-title>
                <v-card-text class="pt-0">
                    <v-form  v-model="valid" ref="form" lazy-validation>
                        <v-flex xs12>
                            <v-text-field type="text" v-model="username" label="Benutzername" :rules="[v => !!v || 'Ein Benutzername ist erforderlich']" required></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field type="email" v-model="email" label="E-Mail Adresse" :rules="emailRules" required></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field v-model="password" loading label="Passwort" :rules="passwordRules" required :append-icon="eye ? 'visibility' : 'visibility_off'" @click:append="() => (eye = !eye)" :type="eye ? 'password' : 'text'">
                                <v-progress-linear height="2" v-if="custom" slot="progress" :value="progress" :color="color" />
                            </v-text-field>
                        </v-flex>
                    </v-form>
                <v-alert outline class="my-0 py-2" type="error" :value="wrong">Ups! Etwas ist schiefgelaufen.</v-alert>
                </v-card-text>
                <v-divider />
                <v-card-actions>
                <v-spacer />
                <v-btn color="error" flat @click="registerDialog = !registerDialog;">Abbrechen</v-btn>
                <v-btn color="primary" flat @click="register()">Benutzer erstellen</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-progress-linear height="4" class="ma-0" v-if="!mounted" :indeterminate="true"></v-progress-linear>
        <v-container v-if="mounted" fluid>
            <v-card>
                <v-card-title>
                    <h4>Liste aller Benutzer außer dem aktuellen Nutzer</h4>
                    <v-spacer></v-spacer>
                    <v-text-field append-icon="search" label="Benutzer durchsuchen" single-line hide-details v-model="search" />
                </v-card-title>
                <v-data-table rowsPerPageText="Zeilen pro Seite" noDataText="Keine Elemente gefunden" :headers="headers" :items="users" :search="search">
                    <template slot="items" slot-scope="props">
                    <td>{{ props.item.id }}</td>
                    <td class="text-xs">{{ props.item.username }}</td>
                    <td class="text-xs">{{ props.item.email }}</td>
                    <td class="layout">
                        <v-btn
                            icon
                            :disabled="loading == props.item.id"
                            class="mx-0" :data-id="props.item.id"
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
            <v-btn class="my-2 mx-0" flat color="primary" @click="registerDialog = true">Neuen Benutzer erstellen</v-btn>
        </v-container>
    </div>
</template>

<style scoped>
.text-align-center { text-align: center; }
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
            
            emailRules: [
                v => !!v || 'Eine E-Mail Adresse ist erforderlich',
                v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Bitte geben Sie eine echte E-Mail Adresse ein'
            ],

            passwordRules: [
                v => !!v || '',
                v => v.length >= 4 || ''
            ],
            headers: [
                { text: 'ID', align: 'left', value: 'id' },
                { text: 'Benutzername', value: 'username' },
                { text: 'E-Mail', value: 'email' },
                { text: 'Löschen', sortable: false }
            ],
            users: []
        }
    },
    computed: {
        progress () {
        return Math.min(100, this.password.length * 10)
        },
        color () {
        return ['error', 'warning', 'success'][Math.floor(this.progress / 40)]
        }
    },
    methods: {
        register () {
            if (this.$refs.form.validate()) {
                axios.post('api/auth/register',
                { username: this.username, email: this.email, password: this.password },
                { headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest', 'Authorization': 'Bearer ' + this.$auth.getToken(), } }
                ).then (
                    (response) => {
                        //console.log(response.data);
                        this.registerDialog = false;
                        this.$refs.form.reset();

                        this.users.push({
                            value: false,
                            id: response.data.data.id,
                            username: response.data.data.username,
                            email: response.data.data.email
                        });

                        this.wrong = false;
                        this.username = '';
                        this.email = '';
                        this.password ='';
                    }
                ).catch (
                    (error) => {
                        //console.log(error);
                        this.wrong = true;
                    }
                );
            }
        },
        deleteUser (id) {
            axios.delete('api/auth/user/' + id,
            { headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest', 'Authorization': 'Bearer ' + this.$auth.getToken() } }
            ).then ((response) => {
                this.loading = null;
                this.clickedUser = {};
                this.users.splice(this.users.findIndex(user => { return user == id }), 1);
            }).catch ((error) => {
                console.log(error);
            });
        },
        getUsers () {
            this.mounted = false;
            this.users = [];
            axios.get('api/auth/users',
            { headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest', 'Authorization': 'Bearer ' + this.$auth.getToken() } }
            ).then (
                (response) => {
                    //console.log(response.data);
                    response.data.forEach(user => {
                        this.users.push({ value: false, id: user.id, username: user.username, email: user.email });
                    });
                    this.mounted = true;
                }
            ).catch (
                (error) => {
                    //console.log(error);
                }
            );
        }
    },
    mounted () {
        this.getUsers();
    }
}
</script>