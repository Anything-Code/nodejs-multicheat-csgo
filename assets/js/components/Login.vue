<template>
    <div style="height: 99vh;">
        <v-progress-linear height="4" style="position: fixed; top: 0;" class="ma-0" v-if="loading == 'loading'" :indeterminate="true" />
        <v-container fluid fill-height>
            <v-layout align-center justify-center>
                <v-flex xs12 sm8 md4>
                    <v-card class="elevation-4 rounded-0">
                        <v-card-text>
                        <v-form v-model="valid" @submit="login" ref="form" lazy-validation>
                            <v-text-field
                                type="text"
                                prepend-icon="person"
                                name="username"
                                label="Benutzername"
                                :rules="[v => !!v || 'Ein Benutzername ist erforderlich']"
                                v-model="username"
                                required
                            />
                            <v-text-field
                                prepend-icon="lock"
                                name="password"
                                label="Passwort"
                                :rules="[v => !!v || 'Ein Password ist erforderlich']"
                                :append-icon="eye ? 'visibility' : 'visibility_off'"
                                @click:append="() => (eye = !eye)"
                                :type="eye ? 'password' : 'text'"
                                v-model="password"
                                required
                                />
                                <v-checkbox class="mt-3" label="Angemeldet bleiben (2 Wochen)" v-model="remember" type="checkbox"></v-checkbox>
                                <input class="d-none" type="submit">
                        </v-form>
                        <v-alert outline class="my-0 py-2" type="error" :value="wrongPassword">Der Benutzername oder das Passwort ist falsch!</v-alert>
                        <v-card-actions class="px-0">
                        <v-btn
                            :large="$vuetify.breakpoint.smAndDown ? true : false"
                            color="primary elevation-0"
                            :class="$vuetify.breakpoint.smAndDown ? 'w-100' : ''"
                            class="mx-0 rounded-0"
                            @click="login"
                            :disabled="!valid || mainLoading"
                        >
                            <span v-if="!mainLoading">Anmelden</span>
                            <span v-if="mainLoading" class="custom-loader">
                                <v-icon light>cached</v-icon>
                            </span>
                        </v-btn>
                        </v-card-actions>
                        </v-card-text>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </div>

</template>

<style scoped>
.d-none { display: none }
.w-100 { width: 100%; }

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
                username: '',
                password: '',
                remember: false,
                eye: true,
                valid: true,
                wrongPassword: false,
                loading: '',
                mainLoading: false
            }
        },
        methods: {
            login (event) {
                event.preventDefault();
                let requestBody = { username: this.username, password: this.password, remember: this.remember };
                if (this.$refs.form.validate()) {
                    this.loading = 'loading';
                    this.mainLoading = true;
                    axios.post('api/auth/login',
                    requestBody,
                    { headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' } }
                    ).then(response => {
                        this.loading = '';
                        const   token = response.data.access_token,
                                base64URL = token.split('.')[1],
                                base64 = base64URL.replace('-', '+').replace('_', '/'),
                                decodedToken = JSON.parse(window.atob(base64));
                        //console.log(decodedToken);
                        //console.log('Sie werden in ' + ( response.data.expires_in / 60 ) / 60 + ' Stunden ausgeloggt');
                        this.wrong = false;
                        this.$auth.destroyToken();
                        this.$auth.setToken(token, decodedToken.exp);
                        this.$router.push('/admin/backend/dashboard');
                    }).catch(error => {
                        this.loading = '';
                        console.log(error);
                        this.wrongPassword = true;
                    });
                }
            }
        }
    }
</script>