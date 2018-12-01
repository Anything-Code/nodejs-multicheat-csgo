<template>
    <div v-scroll="refreshScrollTopOffset">
        <v-progress-linear
            height="4"
            class="ma-0"
            v-if="!travelMounted || !housingsMounted || !categoriesMounted"
            :indeterminate="true"
        />
        <v-snackbar :timeout="3000" bottom right class="success--text" v-model="snackbar">Reise erfolgreich geändert</v-snackbar>
        <v-container v-if="travelMounted && housingsMounted && categoriesMounted" fluid>
            <h1 class="headline mb-3">Reise bearbeiten</h1>
            <v-form @submit="storeTravel" ref="form" v-model="isFormValid" lazy-validation>
                <v-layout row wrap>
                    <v-flex :class="$vuetify.breakpoint.mdAndUp ? 'pr-2' : ''" xs12 md9>
                        <v-card class="pa-3">
                            <v-layout row wrap>
                                <v-flex xs12>
                                    <v-text-field
                                        v-model="title"
                                        :class="$vuetify.breakpoint.mdAndUp ? 'pr-2' : ''"
                                        :rules="[v => !!v || 'Ein Titel ist erforderlich']"
                                        label="Titel der Reise"
                                        hint="Geben Sie einen Titel für die Reise ein"
                                        persistent-hint
                                    />
                                </v-flex>
                            </v-layout>
                            <v-layout row wrap>
                                <v-flex xs12 class="mt-4">
                                    <quill-editor ref="textEditor" v-model="description" :options="editorOption" />
                                </v-flex>
                            </v-layout>
                            <v-layout row wrap>
                                <v-flex xs12 class="mt-3">
                                    <ImagePicker :attached-images="attachedImages" />
                                </v-flex>
                            </v-layout>
                        </v-card>
                        <v-card class="my-3 pa-3">
                            <v-layout row wrap>
                                <v-flex xs12>
                                    <v-select
                                        v-model="housings"
                                        @input="selectHousingToDisable"
                                        :disabled="housingsDisabled"
                                        :items="availableHousings"
                                        item-text="title"
                                        return-object
                                        :rules="[v => !!v || 'Mindestens eine Unterbringungsmöglichkeit ist erforderlich']"
                                        label="Unterbringungsmöglichkeiten"
                                        hint="In welchen Unterbringungsmöglichkeiten befindet sich der Raum"
                                        persistent-hint
                                        dense
                                        multiple
                                        chips
                                        deletable-chips
                                        :menu-props="{ nudgeBottom: '43', transition:'slide-y-transition' }"
                                    />
                                </v-flex>
                            </v-layout>
                            <AttachNewHousing @housingStored="addNewHousingToHousings" />
                        </v-card>
                        <v-card class="my-3 pa-3">
                            <div v-for="(housingCategory, index) in housingCategories" :key="index">
                                <v-layout class="my-3" v-if="index != 0" align-center>
                                    <v-flex xs5>
                                        <hr class="error">
                                    </v-flex>
                                    <v-flex xs2 justify-center>
                                        <div class="text-xs-center">
                                            <v-btn @click="housingCategories.pop()" color="error" class="ma-0" icon outline>
                                                <v-icon color="error">remove</v-icon>
                                            </v-btn>
                                        </div>
                                    </v-flex>
                                    <v-flex xs5>
                                        <hr class="error">
                                    </v-flex>
                                </v-layout>
                                <v-layout row wrap>
                                    <v-flex xs12>
                                        <v-select
                                            v-model="housingCategory.id"
                                            :items="availableHousingCategories"
                                            item-text="title"
                                            item-value="id"
                                            :rules="[v => !!v || 'Mindestens eine Unterbringungskategorie ist erforderlich']"
                                            label="Unterbringungskategorie"
                                            hint="Welche Unterbringungskategorie kann man mit dieser Reise buchen?"
                                            no-data-text="Wählen Sie zuerst mindestens eine Unterbringungsmöglichkeit aus"
                                            persistent-hint
                                            dense
                                            :menu-props="{ nudgeBottom: '33', transition:'slide-y-transition' }"
                                        />
                                    </v-flex>
                                </v-layout>
                                <v-layout row wrap>
                                    <v-flex xs12 md6>
                                        <v-text-field
                                            :class="$vuetify.breakpoint.mdAndUp ? 'pr-2' : ''"
                                            type="number"
                                            min="0"
                                            v-model="housingCategory.quantity"
                                            :rules="[v => !!v || 'Mindestens eine Unterbringungskategorie ist erforderlich', v => parseInt(v) >= 0 || 'dieser Wert muss 0 oder Größer sein']"
                                            label="Buchbare Anzahl"
                                            hint="Wie oft ist diese Kategorie verfügbar?"
                                            dense
                                        />
                                    </v-flex>
                                    <v-flex xs12 md6>
                                        <v-text-field
                                            :class="$vuetify.breakpoint.mdAndUp ? 'pr-2' : ''"
                                            type="number"
                                            min="0"
                                            v-model="housingCategory.price"
                                            :rules="[
                                                v => !!v || 'Ein Preis ist erforderlich',
                                                v => parseInt(v) >= 0 || 'dieser Wert muss 0 oder Größer sein',
                                                v => v.match(/^\d+(\.\d{2})?$/gm) != null || 'Der Preis muss im Format \'0*.00\' angegeben werden'
                                            ]"
                                            suffix="€"
                                            label="Preis"
                                            hint="Wie viel solls kosten?"
                                        />
                                    </v-flex>
                                </v-layout>
                                <v-layout class="my-3" v-if="index == housingCategories.length - 1" align-center>
                                    <v-flex xs5>
                                        <hr class="primary">
                                    </v-flex>
                                    <v-flex xs2 justify-center>
                                        <div class="text-xs-center">
                                            <v-btn @click="housingCategories.push({id: null, price: '', quantity: ''})" color="primary" class="ma-0" icon outline>
                                                <v-icon color="primary">add</v-icon>
                                            </v-btn>
                                        </div>
                                    </v-flex>
                                    <v-flex xs5>
                                        <hr class="primary">
                                    </v-flex>
                                </v-layout>
                            </div>
                        </v-card>
                        <v-card class="my-3 pa-3">
                            <v-layout row wrap>
                                <v-flex xs12>
                                    <v-combobox
                                        v-model="categories"
                                        :items="availableCategories"
                                        item-text="name"
                                        item-value="id"
                                        :rules="[v => !!v || 'Mindestens eine Kategorie ist erforderlich']"
                                        label="Kategorien"
                                        hint="neue Kategorien lassen sich mit der 'Absatz-Taste' hinzufügen"
                                        persistent-hint
                                        dense
                                        multiple
                                        chips
                                        deletable-chips
                                        :menu-props="{ nudgeBottom: '1', transition: 'slide-y-transition' }"
                                    />
                                </v-flex>
                            </v-layout>
                        </v-card>
                        <v-card class="my-3 pa-3">
                            <v-layout row wrap>
                                <v-flex xs12>
                                    <v-select
                                        v-model="services"
                                        :items="availableServices"
                                        item-text="name"
                                        item-value="id"
                                        required
                                        label="Zusatzleistungen"
                                        hint="Welche Zusatzleistungen sind für diese Reise verfügbar?"
                                        persistent-hint
                                        dense
                                        multiple
                                        chips
                                        deletable-chips
                                        :menu-props="{ nudgeBottom: '43', transition:'slide-y-transition' }"
                                    />
                                </v-flex>
                            </v-layout>
                            <AttachNewService @serviceStored="addNewServiceToServices" />
                        </v-card>
                        <v-card class="my-3 pa-3">
                            <v-layout row wrap>
                                <v-flex xs12>
                                    <v-select
                                        v-model="tickets"
                                        :items="availableTickets"
                                        item-text="name"
                                        item-value="id"
                                        required
                                        label="Tickets"
                                        hint="Welche Tickets sind für diese Reise verfügbar?"
                                        persistent-hint
                                        dense
                                        multiple
                                        chips
                                        deletable-chips
                                        :menu-props="{ nudgeBottom: '43', transition:'slide-y-transition' }"
                                    />
                                </v-flex>
                            </v-layout>
                            <AttachNewTicket @ticketStored="addNewTicketToTickets" />
                        </v-card>
                    </v-flex>
                    <v-flex :class="$vuetify.breakpoint.mdAndUp ? 'pl-2' : ''" xs12 md3>
                        <v-card
                            class="pa-3 no-transition"
                            :style="$vuetify.breakpoint.mdAndUp && offsetTop >= 56 ? 'margin-top: ' + ( offsetTop - 56 ) + 'px' : ''"
                        >
                            <v-menu
                                :close-on-content-click="false"
                                v-model="datePickerMenu"
                                :nudge-right="33"
                                :nudge-bottom="10"
                                lazy
                                transition="slide-y-transition"
                                offset-y
                                full-width
                                :min-width="290"
                            >
                                <v-text-field
                                    slot="activator"
                                    :rules="[v => !!v || 'Ein Datum für den Reisestart ist erforderlich']"
                                    v-model="beginningDate"
                                    label="Reisestart"
                                    hint="Wann soll's losgehen?"
                                    persistent-hint
                                    prepend-icon="event"
                                    readonly
                                />
                                <v-date-picker header-color="grey darken-2" v-model="beginningDate" @input="datePickerMenu = false" locale="DE-de" />
                            </v-menu>
                            <v-menu
                                :close-on-content-click="false"
                                v-model="endingDatePickerMenu"
                                :nudge-right="33"
                                :nudge-bottom="10"
                                lazy
                                transition="slide-y-transition"
                                offset-y
                                full-width
                                :min-width="290"
                            >
                                <v-text-field
                                    slot="activator"
                                    :rules="[v => !!v || 'Ein Datum für den Reiseende ist erforderlich']"
                                    v-model="endingDate"
                                    label="Reiseende"
                                    hint="Bis wann geht die Reise?"
                                    persistent-hint
                                    prepend-icon="event"
                                    readonly
                                />
                                <v-date-picker header-color="grey darken-2" v-model="endingDate" @input="endingDatePickerMenu = false" locale="DE-de" />
                            </v-menu>
                            <v-btn
                                :large="$vuetify.breakpoint.smAndDown ? true : false"
                                @click="storeTravel"
                                :disabled="mainLoading"
                                color="primary"
                                class="ma-0 mt-3 w-100 rounded-0 elevation-0"
                            >
                                <span v-if="!mainLoading">Reise bearbeiten</span>
                                <span v-if="mainLoading" class="custom-loader">
                                    <v-icon light>cached</v-icon>
                                </span>
                            </v-btn>
                        </v-card>
                    </v-flex>
                    <input type="submit" class="d-none">
                </v-layout>
            </v-form>
        </v-container>
    </div>
</template>

<style scoped>
hr { border: none; height: 1px }
.d-none { display: none }
.w-100 { width: 100% }
.no-transition { transition: none }
.cursor-pointer { cursor: pointer }

.custom-loader { animation: loader 1s infinite; display: flex; }
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
import AttachNewHousing from '../housings/AttachNewHousing';
import AttachNewService from '../services/AttachNewService';
import AttachNewTicket from '../tickets/AttachNewTicket';

export default {
    data() {
        return {
            travelMounted: false,
            housingsMounted: false,
            categoriesMounted: false,
            servicesMounted: false,
            ticketsMounted: false,

            snackbar: false,
            offsetTop: 0,
            housingsDisabled: false,
            mainLoading: false,
            datePickerMenu: false,
            beginningDate: null,
            endingDatePickerMenu: false,
            endingDate: null,
            editorOption: {
                placeholder: 'Beschreibung',
            },
            isFormValid: false,

            title: '',
            description: '',
            attachedImages: [],

            housings: null,
            availableHousings: [],

            categories: null,
            availableCategories: [],

            services: null,
            availableServices: [],

            tickets: null,
            availableTickets: [],

            housingCategories: [],
            availableHousingCategories: [],
        }
    },
    methods: {
        addNewTicketToTickets (newTicket) {
            this.availableTickets.push(newTicket);
            Array.isArray(this.tickets) ? this.tickets.push(newTicket.id) : this.tickets = [newTicket.id];
        },
        addNewServiceToServices (newService) {
            this.availableServices.push(newService[0]);
            Array.isArray(this.services) ? this.services.push(newService[0].id) : this.services = [newService[0].id];
        },
        addNewHousingToHousings (newHousing) {
            this.availableHousings.push(newHousing[0]);
            this.housings = newHousing;
            this.selectHousingToDisable(newHousing);
        },
        refreshScrollTopOffset () {
            this.offsetTop = window.pageYOffset || document.documentElement.scrollTop
        },
        selectHousingToDisable (newHousing) {
            if (this.housings.length >= 1) {
                this.housingsDisabled = true;
                for (let housing of this.availableHousings)
                    if (housing.destination.id != newHousing[0].destination.id)
                        housing.disabled = true;
                this.housingsDisabled = false;
            } else {
                this.housingsDisabled = true;
                for (let housing of this.availableHousings)
                    housing.disabled = false;
                this.housingsDisabled = false;
            }
            this.availableHousingCategories = new Array
            this.housings.forEach(element => { element.housing_categories.forEach(item => { this.availableHousingCategories.push(item) }) });
        },
        storeTravel (submitEvent) {
            submitEvent.preventDefault();
            if(this.$refs.form.validate()) {
                this.mainLoading = true;

                let title = this.title,
                    beginning_date = this.beginningDate,
                    ending_date = this.endingDate,
                    description = this.description,
                    images = new Array,
                    country = this.housings[0].destination.country.id,
                    destination = this.housings[0].destination.id,
                    housings = new Array,
                    categories = new Array,
                    housing_categories = new Array,
                    services = this.services,
                    tickets = this.tickets;

                for (let image of this.attachedImages)
                    images.push(image.id);
                for (let housing of this.housings)
                    housings.push(housing.id);
                for (let category of this.categories) {
                    if (category.id)
                        categories.push(category.id);
                    else
                        categories.push(category);
                }
                for (let housingCategory of this.housingCategories) {
                    housing_categories.push({
                        id: housingCategory.id,
                        quantity: housingCategory.quantity,
                        price: parseFloat(housingCategory.price)
                    });
                }

                let requestContent = {
                    beginning_date,
                    ending_date,
                    title,
                    country,
                    destination,
                    housings,
                    categories,
                    housing_categories
                }
                if (description != '')
                    requestContent.description = description;
                if (images.length > 0) {
                    requestContent.images = new Array;
                    this.attachedImages.forEach(element => { requestContent.images.push(element.id) });
                }
                if (services != null)
                    requestContent.services = services;
                if (tickets != null)
                    requestContent.tickets = tickets;

                axios.put('api/auth/travel/' + this.id,
                requestContent,
                { headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest", "Authorization": "Bearer " + this.$auth.getToken() } }
                ).then(response => {
                    // console.log(response.data);
                    this.mainLoading = false;
                    this.snackbar = true;
                })
                .catch(error => {
                    console.log(error);
                });
            }
        },
        getTravel () {
            axios.get('api/auth/travel/' + this.id,
            { headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest", "Authorization": "Bearer " + this.$auth.getToken() } }
            ).then(response => {
                // console.log(response.data.data);
                this.beginningDate = response.data.data.beginning_date;
                this.endingDate = response.data.data.ending_date;
                this.title = response.data.data.title;
                this.description = response.data.data.description;

                for (let image of response.data.data.images) {
                    this.attachedImages.push({ id: image.id, url:image.url, smallImageUrl: image.url + '?w=300&h=300&fit=crop', largeImageUrl: image.url + '?w=750&h=750&fit=crop', alt_text: image.alt_text, by: image.by, name: image.name, title: image.title, description: image.description, resolution: image.resolution, size: image.size, created_at: image.created_at, updated_at: image.updated_at, selected: false });
                }

                this.housings = response.data.data.housings;
                this.housings.forEach(element => { element.housing_categories.forEach(item => { this.availableHousingCategories.push(item) }) });
                response.data.data.housing_categories.forEach(element => {
                    this.housingCategories.push({ id: element.id, price: element.pivot.price.toString(), quantity: element.pivot.quantity})
                });
                this.categories = response.data.data.categories;
                this.services = response.data.data.services;
                this.tickets = response.data.data.tickets;

                if (this.housingsMounted) {
                    this.housingsDisabled = true;
                    for (let housing of this.availableHousings) {
                        if (housing.destination.id != this.housings[0].destination.id)
                            housing.disabled = true;
                    }
                    this.housingsDisabled = false;
                }

                this.travelMounted = true;
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
                this.availableHousings.forEach(element => { element.disabled = false });
                this.housingsMounted = true;

                if (this.travelMounted) {
                    this.housingsDisabled = true;
                    for (let housing of this.availableHousings) {
                        if (housing.destination.id != this.housings[0].destination.id)
                            housing.disabled = true;
                    }
                    this.housingsDisabled = false;
                }
            })
            .catch(error => {
                console.log(error);
            });
        },
        getCategories () {
            axios.get('api/auth/category',
            { headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest", "Authorization": "Bearer " + this.$auth.getToken() } }
            ).then(response => {
                // console.log(response.data.data);
                this.availableCategories = response.data;
                this.categoriesMounted = true;
            })
            .catch(error => {
                console.log(error);
            });
        },
        getServices () {
            axios.get('api/auth/service',
            { headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest", "Authorization": "Bearer " + this.$auth.getToken() } }
            ).then(response => {
                // console.log(response.data.data);
                this.availableServices = response.data.data;
                this.servicesMounted = true;
            })
            .catch(error => {
                console.log(error);
            });
        },
        getTickets () {
            axios.get('api/auth/ticket',
            { headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest", "Authorization": "Bearer " + this.$auth.getToken() } }
            ).then(response => {
                // console.log(response.data.data);
                this.availableTickets = response.data.data;
                this.ticketsMounted = true;
            })
            .catch(error => {
                console.log(error);
            });
        }
    },
    props: ['id'],
    components: {
        quillEditor,
        ImagePicker,
        AttachNewHousing,
        AttachNewService,
        AttachNewTicket
    },
    mounted() {
        this.getTravel();
        this.getHousings();
        this.getCategories();
        this.getServices();
        this.getTickets();
    }
}
</script>