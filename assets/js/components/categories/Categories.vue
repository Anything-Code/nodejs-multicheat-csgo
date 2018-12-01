<template>
    <div>
        <v-snackbar :timeout="3000" bottom right :class="snackbarColor + '--text'" v-model="snackbar">{{ snackbarText }}</v-snackbar>
        <v-progress-linear height="4" class="ma-0" v-if="!mounted" :indeterminate="true" />
        <v-dialog transition="slide-y-transition" persistent v-model="deleteDialog" max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="title">Kategorie <b>{{ this.selectedCategory.name }}</b> löschen</span>
                </v-card-title>
                <v-card-text>
                    <p>Sind Sie sicher, dass Sie die Kategorie <b>{{ this.selectedCategory.name }}</b> mit der ID <b>{{ this.selectedCategory.id }}</b> löschen wollen?</p>
                </v-card-text>
                <v-divider />
                <v-card-actions>
                    <v-btn color="error" flat @click="deleteDialog = !deleteDialog; loading = null">Abbrechen</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat @click="deleteDialog = !deleteDialog; deleteCategory(selectedCategory.id);">Löschen</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-container v-if="mounted" fluid>
            <v-layout class="mb-3" row wrap v-if="openCreateInput">
                <v-flex>
                    <v-form v-model="form" @submit="storeCategory" ref="form" lazy-validation>
                        <v-text-field
                            v-model="newCategoryName"
                            :rules="[v => !!v || 'Eine Kategorie ist erforderlich']"
                            label="Kategorie"
                            hint="Geben sie der neuen Kategorie einen Namen"
                            persistent-hint
                            autofocus
                        />
                        <input class="d-none" type="submit">
                    </v-form>
                </v-flex>
                <v-btn @click="openCreateInput = false" class="ma-0 mt-3" icon>
                    <v-icon color="pink">block</v-icon>
                </v-btn>
                <v-btn @click="storeCategory" class="ma-0 mt-3" :disabled="createButtonDisabled" icon>
                    <v-icon v-if="!createButtonLoading" color="primary">check</v-icon>
                    <v-icon v-if="createButtonLoading" color="primary" class="custom-loader">cached</v-icon>
                </v-btn>
            </v-layout>
            <v-btn
                @click="openCreateInput = true"
                v-if="!openCreateInput"
                flat
                color="primary"
                class="ma-0 mb-1"
                :class="$vuetify.breakpoint.smAndDown ? 'w-100' : ''"
            >
                Kategorie erstellen
            </v-btn>
            <v-card>
                <v-card-title>
                    <h4>Liste aller Kategorien</h4>
                    <v-spacer></v-spacer>
                    <v-text-field append-icon="search" label="Kategorien durchsuchen" single-line hide-details v-model="search"></v-text-field>
                </v-card-title>
                <v-data-table
                    :rows-per-page-items="[ 10, 25 ]"
                    rowsPerPageText="Zeilen pro Seite"
                    noDataText="Keine Elemente gefunden"
                    :headers="headers"
                    :items="categories"
                    :search="search"
                >
                    <template slot="items" slot-scope="props">
                        <td>
                            {{ props.item.id }}
                        </td>
                        <td class="text-xs">
                            <v-edit-dialog
                                :return-value.sync="props.item.name"
                                large
                                lazy
                                @save="editCategory(props.item.id, props.item.name)"
                                save-text="Speichern"
                                cancel-text="Abbrechen"
                            >
                                <div class="primary--text">{{ props.item.name }}</div>
                                <v-text-field
                                    class="pt-2"
                                    slot="input"
                                    v-model="props.item.name"
                                    :rules="[v => !!v || 'Eine Kategorie ist erforderlich']"
                                    hint="Hier können Sie den namen der Kategorie ändern"
                                    persistent-hint
                                    autofocus
                                />
                            </v-edit-dialog>
                        </td>
                        <td>
                            <v-btn
                                :disabled="loading == props.item.id"
                                icon
                                class="mx-0"
                                :data-id="props.item.id"
                                @click="deleteDialog = true; selectedCategory = props.item; loading = props.item.id"
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
.d-none { display: none }
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

            openCreateInput: false,
            form: true,
            createButtonLoading: false,
            createButtonDisabled: false,
            newCategoryName: '',

            snackbarColor: '',
            snackbarText: '',
            search: '',
            categories: [],
            selectedCategory: {},
            deleteDialog: false,
            loading: null,
            
            headers: [
                { text: 'ID', align: 'left', value: 'id' },
                { text: 'Kategorie', value: 'name' },
                { text: 'Löschen', sortable: false },
                { text: 'Erstellt am', value: 'created_at' },
            ],
        }
    },
    methods: {
        getCategories () {
            axios.get('api/auth/category',
            { headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest", "Authorization": "Bearer " + this.$auth.getToken() } }
            ).then(response => {
                // console.log(response.data);
                this.categories = response.data;
                this.mounted = true;
            })
            .catch(error => {
                console.log(error);
            });
        },
        storeCategory () {
            if (this.$refs.form.validate()) {
                this.createButtonLoading = true;
                this.createButtonDisabled = true;
                axios.post('api/auth/category',
                { name: this.newCategoryName },
                { headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest", "Authorization": "Bearer " + this.$auth.getToken() } }
                ).then(response => {
                    // console.log(response);
                    this.$refs.form.reset();
                    this.newCategoryName = '';
                    this.createButtonLoading = false;
                    this.createButtonDisabled = false;

                    this.categories.push(response.data.category);
                    this.openCreateInput = false;

                    this.snackbarColor = 'primary';
                    this.snackbarText = response.data.message;
                    this.snackbar = true;
                })
                .catch(error => {
                    console.log(error);
                });
            }
        },
        editCategory (id, categoryName) {
            if (categoryName.length > 0) {
                axios.put('api/auth/category/' + id,
                { name: categoryName },
                { headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest", "Authorization": "Bearer " + this.$auth.getToken() } }
                ).then(response => {
                    // console.log(response);
                    this.snackbarColor = 'success';
                    this.snackbarText = response.data.message;
                    this.snackbar = true;
                })
                .catch(error => {
                    console.log(error);
                });
            } else {
                this.snackbarColor = 'error';
                this.snackbarText = 'Die Kategorie muss mehr als 0 Zeichen haben';
                this.snackbar = true;
            }
        },
        deleteCategory (id) {
            axios.delete('api/auth/category/' + id,
            { headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest", "Authorization": "Bearer " + this.$auth.getToken() } }
            ).then(response => {
                // console.log(response);
                this.selectedCategory = {};
                this.loading = null;
                for (let i in this.categories) {
                    if (id == this.categories[i].id) {
                        this.categories.splice(i, 1);
                    }
                }
                this.snackbarColor = 'error';
                this.snackbarText = response.data.message;
                this.snackbar = true;
            })
            .catch(error => {
                console.log(error);
            });
        }
    },
    mounted () {
        this.getCategories();
    }
}

</script>
