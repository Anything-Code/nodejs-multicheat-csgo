<template>
    <div>
        <v-dialog persistent v-model="passwordDialog" max-width="500px">
            <v-card>
                <v-card-title class="pb-0">
                <span class="title">Passwort ändern</span>
                </v-card-title>
                <v-card-text class="pt-0">
                    <v-form  v-model="valid" ref="form" lazy-validation>
                        <v-flex xs12>
                            <v-text-field v-model="old_password" label="Altes Passwort" :rules="[v => !!v || 'Bitte geben Sie ihr altes Passwort ein.']" required :append-icon="oldEye ? 'visibility' : 'visibility_off'" @click:append="() => (oldEye = !oldEye)" :type="oldEye ? 'password' : 'text'">
                            </v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field v-model="new_password" loading label="Neues Passwort" :rules="passwordRules" required :append-icon="newEye ? 'visibility' : 'visibility_off'" @click:append="() => (newEye = !newEye)" :type="newEye ? 'password' : 'text'">
                            <v-progress-linear height="2" v-if="custom" slot="progress" :value="progress" :color="color"></v-progress-linear>
                            </v-text-field>
                        </v-flex>
                    </v-form>
                <v-alert outline class="my-0 py-2" type="error" :value="wrong">Ihr altest Passwort ist falsch</v-alert>
                </v-card-text>
                <v-divider />
                <v-card-actions>
                <v-spacer />
                <v-btn color="error" flat @click="passwordDialog = !passwordDialog">Abbrechen</v-btn>
                <v-btn color="primary" flat @click="changePassword()">Passwort ändern</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-progress-linear height="4" class="ma-0" v-if="mounted === ''" :indeterminate="true"></v-progress-linear>
        <v-container fluid>
            <v-alert outline :value="mounted == 'notMounted'" class="my-0 py-2 mb-2" type="error">Sie sind für diese Anfrage nicht autorisiert.</v-alert>
            <v-alert class="pa-2" :value="passwordAlert" type="success">Ihr Passwort wurde erfolgreich geändert.</v-alert>
            <v-layout v-if="mounted == 'mounted'" row wrap>
                <v-flex>
                    <v-card>
                    <v-card-title>
                        <h4>Aktueller Nutzer</h4>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-list dense>
                        <v-list-tile>
                        <v-list-tile-content>ID:</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{ response.id }}</v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile>
                        <v-list-tile-content>Benutzername:</v-list-tile-content>
                        <v-list-tile-content class="align-end text-xs-right">
                            <v-text-field :disabled="editUser" class="user-inline-input" solo flat type="text" v-model="username"></v-text-field>
                        </v-list-tile-content>
                        <v-btn icon style="margin-right: -10px" @click="editUserMethod">
                            <v-icon :color="errorUser ? 'error' : 'primary'">{{ editUser ? 'edit' : 'done' }}</v-icon>
                        </v-btn>
                        </v-list-tile>
                        <v-list-tile>
                        <v-list-tile-content>E-Mail:</v-list-tile-content>
                        <v-list-tile-content class="align-end">
                            <v-text-field  :disabled="editEmail" class="user-inline-input" solo flat type="text" v-model="email"></v-text-field>
                        </v-list-tile-content>
                        <v-btn icon style="margin-right: -10px" @click="editEmailMethod">
                            <v-icon :color="errorEmail ? 'error' : 'primary'">{{ editEmail ? 'edit' : 'done' }}</v-icon>
                        </v-btn>
                        </v-list-tile>
                        <v-list-tile>
                        <v-list-tile-content>Geupdatet am:</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{ response.updated_at }}</v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile>
                        <v-list-tile-content>Erstellt am:</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{ response.created_at }}</v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                    </v-card>
                    <v-btn class="my-2 mx-0" flat color="primary" @click="passwordDialog = true">Passwort ändern</v-btn>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<style>
.user-inline-input .input-group__input {
    padding-right: 0!important;
}
.user-inline-input input {
    text-align: right;
    font-size: inherit;
}
</style>

<script>
import axios from 'axios';

    export default {

        data() {
            return {
                mounted: '',

                passwordDialog: false,
                passwordAlert: false,
                oldEye: true,
                newEye: true,
                custom: true,
                old_password: '',
                new_password: '',
                valid: true,
                wrong: false,

                response: '',
                username: '',
                email: '',
                editUser: true,
                editEmail: true,
                errorUser: false,
                errorEmail: false,
                passwordRules: [
                    v => !!v || 'Bitte geben Sie ein neues Passwort ein.',
                    v => v.length >= 4 || 'Das neue Passwort muss mindestens 4 Zeichen lang sein.'
                ],
            }
        },

        computed: {
            progress () {
            return Math.min(100, this.new_password.length * 10)
            },
            color () {
            return ['error', 'warning', 'success'][Math.floor(this.progress / 40)]
            }
        },

        methods: {

            changePassword () {

                let requestBody = { old_password: this.old_password, new_password: this.new_password };
                if (this.$refs.form.validate()) {

                    axios.put('api/auth/password',
                    requestBody,
                    { headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest', 'Authorization': 'Bearer ' + this.$auth.getToken(), } }
                    ).then(
                        (response) => {
                            //console.log(response.data);
                            this.$refs.form.reset();
                            this.passwordDialog = false;
                            this.wrong = false;
                            this.old_password = '';
                            this.new_password = '';
                            setTimeout(_ => { this.passwordAlert = true; }, 0);
                            setTimeout(_ => { this.passwordAlert = false; }, 2000);
                        }
                    ).catch(
                        (error) => {
                            //console.log(error);
                            this.wrong = true;
                        }
                    );

                }
            },

            editUserMethod () {
                if (this.editUser) {
                    this.editUser = false;
                } else {
                    axios.put('api/auth/user',
                    { 'username': this.username, 'email': this.email },
                    { headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest', 'Authorization': 'Bearer ' + this.$auth.getToken(), } }
                    ).then(
                        (response) => {
                            //console.log(response.data);
                            this.editUser = true;
                            this.errorUser = false;
                        }
                    ).catch(
                        (error) => {
                            //console.log(error);
                            this.errorUser = true;
                        }
                    );
                }
            },

            editEmailMethod () {
                if (this.editEmail) {
                    this.editEmail = false;
                } else {
                    axios.put('api/auth/user',
                    { 'username': this.username, 'email': this.email },
                    { headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest', 'Authorization': 'Bearer ' + this.$auth.getToken(), } }
                    ).then(
                        (response) => {
                            //console.log(response.data);
                            this.editEmail = true;
                            this.errorEmail = false;
                        }
                    ).catch(
                        (error) => {
                            //console.log(error);
                            this.errorEmail = true;
                        }
                    );
                }
            },

            getUser () {
                axios.get('api/auth/user',
                { headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest', 'Authorization': 'Bearer ' + this.$auth.getToken(), } }
                ).then(
                    (response) => {
                        //console.log(response.data);
                        this.response = response.data;
                        this.username = this.response.username;
                        this.email = this.response.email;
                        this.mounted = 'mounted';
                    }
                ).catch(
                    (error) => {
                        //console.log(error);
                        this.mounted = 'notMounted';
                    }
                );
            }
        },

        mounted () {
            this.getUser();
        }
    }
</script>