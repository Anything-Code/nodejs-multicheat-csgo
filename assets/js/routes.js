import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import Navigation from './components/Navigation';
import Nav from './components/Nav';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import MediaUploader from './components/MediaUploader';
import SocialMediaLinks from './components/SocialMediaLinks';

import CreateCountry from './components/countries/CreateCountry';
import Countries from './components/countries/Countries';
import EditCountry from './components/countries/EditCountry';

import CreateDestination from './components/destinations/CreateDestination';
import Destinations from './components/destinations/Destinations';
import EditDestination from './components/destinations/EditDestination';

import CreateHousing from './components/housings/CreateHousing';
import Housings from './components/housings/Housings';
import EditHousing from './components/housings/EditHousing';

import CreateHousingCategory from './components/housingCategories/CreateHousingCategory';
import HousingCategories from './components/housingCategories/HousingCategories';
import EditHousingCategory from './components/housingCategories/EditHousingCategory';

import CreateRoom from './components/rooms/CreateRoom';
import Rooms from './components/rooms/Rooms';
import EditRoom from './components/rooms/EditRoom';

import Categories from './components/categories/Categories';

import CreateService from './components/services/CreateService';
import Services from './components/services/Services';
import EditService from './components/services/EditService';

import CreateTicket from './components/tickets/CreateTicket';
import Tickets from './components/tickets/Tickets';
import EditTicket from './components/tickets/EditTicket';

import CreateTravel from './components/travels/CreateTravel';
import Travels from './components/travels/Travels';
import EditTravel from './components/travels/EditTravel';

import Users from './components/Users';
import User from './components/User';
import Customers from './components/Customers';
import NotFound from './components/NotFound';

const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/admin',
            name: 'login',
            component: Login,
            meta: { forVisitors: true }
        },
        {
            path: '/admin/backend',
            name: 'backend',
            component: Nav,
            meta: { forAuth: true },
            children: [
                {
                    path: 'dashboard',
                    name: 'dashboard',
                    component: Dashboard,
                    meta: { forAuth: true }
                },
                {
                    path: 'images',
                    name: 'images',
                    component: MediaUploader,
                    meta: { forAuth: true }
                },
                {
                    path: 'navigation',
                    name: 'navigation',
                    component: Navigation,
                    meta: { forAuth: true }
                },
                {
                    path: 'social',
                    name: 'social',
                    component: SocialMediaLinks,
                    meta: { forAuth: true }
                },
                {
                    path: 'country/create',
                    name: 'createCountry',
                    component: CreateCountry,
                    meta: { forAuth: true }
                },
                {
                    path: 'countries',
                    name: 'countries',
                    component: Countries,
                    meta: { forAuth: true }
                },
                {
                    path: 'country/:id',
                    name: 'editCountry',
                    component: EditCountry,
                    props: true,
                    meta: { forAuth: true }
                },
                {
                    path: 'destination/create',
                    name: 'createDestination',
                    component: CreateDestination,
                    meta: { forAuth: true }
                },
                {
                    path: 'destinations',
                    name: 'destinations',
                    component: Destinations,
                    meta: { forAuth: true }
                },
                {
                    path: 'destination/:id',
                    name: 'editDestination',
                    component: EditDestination,
                    props: true,
                    meta: { forAuth: true }
                },
                {
                    path: 'housing/create',
                    name: 'createHousing',
                    component: CreateHousing,
                    meta: { forAuth: true }
                },
                {
                    path: 'housings',
                    name: 'housings',
                    component: Housings,
                    meta: { forAuth: true }
                },
                {
                    path: 'housing/:id',
                    name: 'editHousing',
                    component: EditHousing,
                    props: true,
                    meta: { forAuth: true }
                },
                {
                    path: 'housing-category/create',
                    name: 'createHousingCategory',
                    component: CreateHousingCategory,
                    meta: { forAuth: true }
                },
                {
                    path: 'housing-categories',
                    name: 'housingCategories',
                    component: HousingCategories,
                    meta: { forAuth: true }
                },
                {
                    path: 'housing-category/:id',
                    name: 'editHousingCategory',
                    component: EditHousingCategory,
                    props: true,
                    meta: { forAuth: true }
                },
                {
                    path: 'room/create',
                    name: 'createRoom',
                    component: CreateRoom,
                    meta: { forAuth: true }
                },
                {
                    path: 'rooms',
                    name: 'rooms',
                    component: Rooms,
                    meta: { forAuth: true }
                },
                {
                    path: 'room/:id',
                    name: 'editRoom',
                    component: EditRoom,
                    props: true,
                    meta: { forAuth: true }
                },
                {
                    path: 'categories',
                    name: 'categories',
                    component: Categories,
                    meta: { forAuth: true }
                },
                {
                    path: 'service/create',
                    name: 'createService',
                    component: CreateService,
                    meta: { forAuth: true }
                },
                {
                    path: 'services',
                    name: 'services',
                    component: Services,
                    meta: { forAuth: true }
                },
                {
                    path: 'service/:id',
                    name: 'editService',
                    component: EditService,
                    props: true,
                    meta: { forAuth: true }
                },
                {
                    path: 'ticket/create',
                    name: 'createTicket',
                    component: CreateTicket,
                    meta: { forAuth: true }
                },
                {
                    path: 'tickets',
                    name: 'tickets',
                    component: Tickets,
                    meta: { forAuth: true }
                },
                {
                    path: 'ticket/:id',
                    name: 'editTicket',
                    component: EditTicket,
                    props: true,
                    meta: { forAuth: true }
                },
                {
                    path: 'travel/create',
                    name: 'createTravel',
                    component: CreateTravel,
                    meta: { forAuth: true }
                },
                {
                    path: 'travels',
                    name: 'travels',
                    component: Travels,
                    meta: { forAuth: true }
                },
                {
                    path: 'travel/:id',
                    name: 'editTravel',
                    component: EditTravel,
                    props: true,
                    meta: { forAuth: true }
                },
                {
                    path: 'users',
                    name: 'users',
                    component: Users,
                    meta: { forAuth: true }
                },
                {
                    path: 'user',
                    name: 'user',
                    component: User,
                    meta: { forAuth: true }
                },
                {
                    path: 'customers',
                    name: 'customers',
                    component: Customers,
                    meta: { forAuth: true }
                },
            ]
        },
        {
            path: '*',
            name: 'notFound',
            component: NotFound,
        },
    ],
});

export default router