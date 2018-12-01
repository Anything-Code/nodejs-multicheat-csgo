<template>
    <div>
        <v-progress-linear height="4" class="ma-0" v-if="!mounted" :indeterminate="true"></v-progress-linear>
        <div v-if="mounted">
            <v-container class="pb-3" fluid>
                <h1 class="headline">Navigation builder</h1>
            </v-container>
            <v-container class="py-0" fluid fill-height>
                <v-snackbar :timeout="3000" bottom right class="success--text" v-model="saveSuccess">Navigation gespeichert!</v-snackbar>
                <v-layout row wrap>
                <v-flex :class="$vuetify.breakpoint.mdAndUp ? 'pr-1' : ''" xs12 md6>
                    <h1 class="subheading">Geben Sie den Seiten eine gewünschte Hirarchie</h1>
                    <small class="caption"><b>*Es ist nur eine einstufiege Hierarchie möglich</b></small>
                    <v-container class="px-0 pb-0 h-100">
                        <draggable 
                            class="list-fix pa-0"
                            :class="{ 'marked-area': pages.length == 0 && dragginOver, 'mb-3 h-120px': $vuetify.breakpoint.smAndDown,  'h-100': $vuetify.breakpoint.mdAndUp }"
                            :move="onMoveCallback"
                            :element="'ul'"
                            :list="pages"
                            :options="{ group: { name: 'nested' }, animation: 100, ghostClass: 'ghostborder', forceFallback: true }"
                        >
                            <li v-for="(page, index) in pages" :key="index">
                                <div class="strip relative">
                                    <span class="line-height ml-2">{{ page.name }}</span>
                                    <v-btn icon class="absolute right ma-0" @click="deleteMenuItem(page, false)">
                                        <v-icon color="pink">close</v-icon>
                                    </v-btn>
                                </div>
                                <draggable
                                    :element="'ul'"
                                    :list="page.children"
                                    class="list-fix droparea"
                                    :options="{ group: { name: 'nested' }, animation: 100, ghostClass: 'ghostborder', forceFallback: true }"
                                > 
                                    <li v-for="(child, i) in page.children" :key="i">
                                        <div class="strip relative my-2">
                                            <span class="line-height ml-2">{{child.name}}</span>
                                            <v-btn icon class="absolute right ma-0" @click="deleteMenuItem(child, true)">
                                                <v-icon color="pink">close</v-icon>
                                            </v-btn>
                                        </div>
                                    </li>
                                </draggable>
                            </li>
                        </draggable>
                    </v-container>
                </v-flex>
                <v-flex :class="$vuetify.breakpoint.mdAndUp ? 'pl-1' : ''" xs12 md6>
                    <h1 class="subheading">Verfügbare Seiten</h1>
                    <small class="caption"><b>*Die Seiten lassen sich per Drag & Drop bewegen</b></small>
                    <v-container class="px-0 pb-0">
                        <v-expansion-panel :value="0">
                            <v-expansion-panel-content>
                            <div slot="header">Seiten</div>
                            <v-card>
                                <draggable class="list-fix px-4 pb-3" @start="dragginOver = false" @end="dragginOver = true" :element="'ul'" :list="links" :options="{ sort: false, group: { name: 'nested',  put: false }, animation: 100, ghostClass: 'ghostborder', forceFallback: true }">
                                    <li class="mb-2" v-for="link in links" :key="link.name">
                                        <div class="strip relative">
                                            <span class="line-height ml-2">{{link.name}}</span>
                                        </div>
                                    </li>
                                </draggable>
                                <p v-if="links.length == 0" class="text-align-center ma-0 px-4 pb-4 caption">
                                    <b>Sie haben entweder keine Seiten angelegt, oder es befinden sich bereits alle in der Navigation</b>
                                </p>
                            </v-card>
                            </v-expansion-panel-content>
                            <v-expansion-panel-content>
                            <div slot="header">Länder</div>
                            <v-card>
                                <draggable class="list-fix px-4 pb-3" @start="dragginOver = false" @end="dragginOver = true" :element="'ul'" :list="countries" :options="{ sort: false, group: { name: 'nested',  put: false }, animation: 100, ghostClass: 'ghostborder', forceFallback: true }">
                                    <li class="mb-2" v-for="country in countries" :key="country.name">
                                        <div class="strip relative">
                                            <span class="line-height ml-2">{{country.name}}</span>
                                        </div>
                                    </li>
                                </draggable>
                                <p v-if="countries.length == 0" class="text-align-center ma-0 px-4 pb-4 caption">
                                    <b>Sie haben entweder keine Länder angelegt, oder es befinden sich bereits alle in der Navigation</b>
                                </p>
                            </v-card>
                            </v-expansion-panel-content>
                            <v-expansion-panel-content>
                            <div slot="header">Kategorien</div>
                            <v-card>
                                <draggable class="list-fix px-4 pb-3" @start="dragginOver = false" @end="dragginOver = true" :element="'ul'" :list="categories" :options="{ sort: false, group: { name: 'nested',  put: false }, animation: 100, ghostClass: 'ghostborder', forceFallback: true }">
                                    <li class="mb-2" v-for="category in categories" :key="category.name">
                                        <div class="strip relative">
                                            <span class="line-height ml-2">{{category.name}}</span>
                                        </div>
                                    </li>
                                </draggable>
                                <p v-if="categories.length == 0" class="text-align-center ma-0 px-4 pb-4 caption">
                                    <b>Sie haben entweder keine Kategorien angelegt, oder es befinden sich bereits alle in der Navigation</b>
                                </p>
                            </v-card>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-container>
                </v-flex>
                </v-layout>
            </v-container>
            <v-container class="py-0" fluid>
                <v-btn
                    :large="$vuetify.breakpoint.smAndDown ? true : false"
                    :class="$vuetify.breakpoint.smAndDown ? 'w-100 mt-3' : 'mt-1'"
                    class="ma-0 mb-3 rounded-0 elevation-0"
                    color="primary"
                    :loading="loading"
                    :disabled="loading"
                    @click="saveNavigation"
                >
                    Navigation abspeichern
                    <span slot="loader" class="custom-loader">
                        <v-icon light>cached</v-icon>
                    </span>
                </v-btn>
            </v-container>
        </div>
    </div>
</template>

<style>
.relative { position: relative; border: solid 1px #adadad; cursor: move; }
.absolute { position: absolute!important; }
.right { right: 0; }
.droparea {  }
.h-100 { height: 90% }
.w-100 { width: 100% }
.h-120px { min-height: 120px!important }
.line-height { line-height: 36px; }
.list-fix { list-style-type: none; min-height: 8px; }
.ghostborder .strip { border: dashed 1px #00BCD4; background-color: rgba(0,188,212, 0.1) }
.marked-area { border: dashed 2px #00BCD4; background-color: rgba(0,188,212, 0.1)  }

.custom-loader { animation: loader 1s infinite; display: flex; }
@-moz-keyframes loader { from { transform: rotate(0); } to { transform: rotate(360deg); } }
@-webkit-keyframes loader { from { transform: rotate(0); } to { transform: rotate(360deg); } }
@-o-keyframes loader { from { transform: rotate(0); } to { transform: rotate(360deg); } }
@keyframes loader { from { transform: rotate(0); } to { transform: rotate(360deg); } }
</style>

<script>
import draggable from 'vuedraggable';

export default {
    components: {
        draggable
    },
    data () {
        return {
            mounted: false,

            loader: null,
            loading: false,
            saveSuccess: false,
            dragginOver: true,
            links: [],
            countries: [],
            categories: [],
            pages: [],
        }
    },
    watch: {
        loader () {
        const l = this.loader
        this[l] = !this[l]

        setTimeout(() => { this[l] = false; this.saveSuccess = true }, 500)

        this.loader = null
        }
    },
    methods: {
        saveNavigation () {
            this.loading = true;
            axios.post('api/auth/navigation',
            { navigation: this.pages },
            { headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest", "Authorization": "Bearer " + this.$auth.getToken() } }
            ).then(response => {
                // console.log(response.data);
                this.saveSuccess = true;
                this.loading = false;
            })
            .catch(error => {
                console.log(error);
            });
        },
        getNavigation () {
            axios.get('api/auth/navigation',
            { headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest", "Authorization": "Bearer " + this.$auth.getToken() } }
            ).then(response => {
                // console.log(response.data);
                this.getData().then(success => {
                    response.data.forEach(element => {
                        let currentPageItem =  new Object;
                        if (element.page != null) {
                            currentPageItem.id = element.page.id;
                            currentPageItem.name = element.page.title;
                            currentPageItem.type = 'page';
                            currentPageItem.children = new Array;
                        }
                        if (element.country != null) {
                            currentPageItem.id = element.country.id;
                            currentPageItem.name = element.country.name;
                            currentPageItem.type = 'country';
                            currentPageItem.children = new Array;
                        }
                        if (element.category != null) {
                            currentPageItem.id = element.category.id;
                            currentPageItem.name = element.category.name;
                            currentPageItem.type = 'category';
                            currentPageItem.children = new Array;
                        }
                        if (element.pages.length > 0) {
                            element.pages.forEach(element => {
                                currentPageItem.children.push({
                                    id: element.id,
                                    name: element.title,
                                    type: 'page',
                                    children: [],
                                    order: element.pivot.order
                                });
                            });
                        }
                        if (element.countries.length > 0) {
                            element.countries.forEach(element => {
                                currentPageItem.children.push({
                                    id: element.id,
                                    name: element.name,
                                    type: 'country',
                                    children: [],
                                    order: element.pivot.order
                                });
                            });
                        }
                        if (element.categories.length > 0) {
                            element.categories.forEach(element => {
                                currentPageItem.children.push({
                                    id: element.id,
                                    name: element.name,
                                    type: 'category',
                                    children: [],
                                    order: element.pivot.order
                                });
                            });
                        }
                        currentPageItem.children.sort((a, b) => {
                            if (a.order > b.order) {
                                return 1;
                            }
                            if (a.order < b.order) {
                                return -1;
                            }
                            return 0;
                        });
                        currentPageItem.children.forEach(element => {
                            delete element.order;
                            this.removeInitialElements(element);
                        });
                        this.removeInitialElements(currentPageItem);
                        this.pages.push(currentPageItem);
                    });
                    this.mounted = true;
                }).catch(error => {
                    console.log(error)
                });
            })
            .catch(error => {
                console.log(error);
            });
        },
        removeInitialElements (item) {
            for (let i = this.links.length - 1; i >= 0; i--)
                if (this.links[i].name == item.name && item.type == 'page')
                    this.links.splice(i, 1);
            for (let i = this.countries.length - 1; i >= 0; i--)
                if (this.countries[i].name == item.name && item.type == 'country')
                    this.countries.splice(i, 1);
            for (let i = this.categories.length - 1; i >= 0; i--)
                if (this.categories[i].name == item.name && item.type == 'category')
                    this.categories.splice(i, 1);
        },
        getData () {
            return new Promise((resolve, reject) => {
                let pagesMounted = false,
                    countriesMounted = false,
                    categoriesMaounted = false;
                axios.get('api/auth/pages',
                { headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest", "Authorization": "Bearer " + this.$auth.getToken() } }
                ).then(response => {
                    // console.log(response.data);
                    response.data.forEach(element => { this.links.push({ id: element.id, name: element.title, type: 'page', children: [] }) });
                    pagesMounted = true;
                    if (pagesMounted && countriesMounted && categoriesMaounted)
                        resolve('Erfolg');
                }).catch(error => {
                    console.log(error);
                    reject(error);
                });
                axios.get('api/auth/country',
                { headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest", "Authorization": "Bearer " + this.$auth.getToken() } }
                ).then(response => {
                    // console.log(response.data);
                    response.data.forEach(element => { this.countries.push({ id: element.id, name: element.name, type: 'country', children: [] }) });
                    countriesMounted = true;
                    if (pagesMounted && countriesMounted && categoriesMaounted)
                        resolve('Erfolg');
                }).catch(error => {
                    console.log(error);
                    reject(error);
                });
                axios.get('api/auth/category',
                { headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest", "Authorization": "Bearer " + this.$auth.getToken() } }
                ).then(response => {
                    // console.log(response.data);
                    response.data.forEach(element => { this.categories.push({ id: element.id, name: element.name, type: 'category', children: [] }) });
                    categoriesMaounted = true;
                    if (pagesMounted && countriesMounted && categoriesMaounted)
                        resolve('Erfolg');
                }).catch(error => {
                    console.log(error);
                    reject(error);
                });
            });
        },
        deleteMenuItem (menuItem, isChild) {
            switch (menuItem.type) {
                case 'page':
                    if (menuItem.children.length > 0) {
                        menuItem.children.forEach(element => {
                            switch (element.type) {
                                case 'page':
                                    this.links.push(element);
                                    break;
                                case 'country':
                                    this.countries.push(element);
                                    break;
                                case 'category':
                                    this.categories.push(element);
                                    break;
                            }
                        });
                        menuItem.children = [];
                        this.links.push(menuItem);
                    } else
                        this.links.push(menuItem);
                    if (!isChild)
                        this.pages.splice(this.pages.findIndex(element => { return element == menuItem }), 1);
                    else {
                        let children = new Array;
                        for (let page of this.pages)
                            if (page.children.length > 0)
                                for (let child of page.children)
                                    if (child == menuItem)
                                        children = page.children;
                        children.splice(children.findIndex(element => { return element == menuItem }), 1);
                    }
                    break;
                case 'country':
                    if (menuItem.children.length > 0) {
                        menuItem.children.forEach(element => {
                            switch (element.type) {
                                case 'page':
                                    this.links.push(element);
                                    break;
                                case 'country':
                                    this.countries.push(element);
                                    break;
                                case 'category':
                                    this.categories.push(element);
                                    break;
                            }
                        });
                        menuItem.children = [];
                        this.countries.push(menuItem);
                    } else
                        this.countries.push(menuItem);
                    if (!isChild)
                        this.pages.splice(this.pages.findIndex(element => { return element == menuItem }), 1);
                    else {
                        let children = new Array;
                        for (let page of this.pages)
                            if (page.children.length > 0)
                                for (let child of page.children)
                                    if (child == menuItem)
                                        children = page.children;
                        children.splice(children.findIndex(element => { return element == menuItem }), 1);
                    }
                    break;
                case 'category':
                    if (menuItem.children.length > 0) {
                        menuItem.children.forEach(element => {
                            switch (element.type) {
                                case 'page':
                                    this.links.push(element);
                                    break;
                                case 'country':
                                    this.countries.push(element);
                                    break;
                                case 'category':
                                    this.categories.push(element);
                                    break;
                            }
                        });
                        menuItem.children = [];
                        this.categories.push(menuItem);
                    } else
                        this.categories.push(menuItem);
                    if (!isChild)
                        this.pages.splice(this.pages.findIndex(element => { return element == menuItem }), 1);
                    else {
                        let children = new Array;
                        for (let page of this.pages)
                            if (page.children.length > 0)
                                for (let child of page.children)
                                    if (child == menuItem)
                                        children = page.children;
                        children.splice(children.findIndex(element => { return element == menuItem }), 1);
                    }
                    break;
            }
        },
        onMoveCallback (event, originalEvent) {
            if (event.dragged.children[1].children.length > 0 && event.to.classList.contains('droparea'))
                return false;
        },
    },
    mounted () {
        this.getNavigation();
    }

}
</script>