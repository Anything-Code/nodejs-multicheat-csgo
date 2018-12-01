<template>
    <div>
        <v-progress-linear height="4" class="ma-0" v-if="mounted === ''" :indeterminate="true" />
        <v-snackbar :timeout="6000" bottom right v-model="snackbar">
            "Bildattribute bearbeiten" und "Bilder durchsuchen" ist Inhalt des nächsten Updates
        </v-snackbar>
        <v-snackbar :timeout="6000" bottom right class="error--text" v-model="wrongImageTypeAlert">
            Die ausgewählte Datei darf nur vom Typ "jpeg", "png" oder "gif" sein!
        </v-snackbar>
        <v-snackbar :timeout="6000" bottom right class="success--text" v-model="imageChangedAlert">
            Bild erfolgreich bearbeitet.
        </v-snackbar>
        <v-dialog transition="slide-y-transition" scrollable v-model="editImageDialog" :max-width="$vuetify.breakpoint.lgAndUp ? '70vw' : '500px'">
        <v-card>
            <v-card-title>
            <span class="title">Metadaten dieses Bildes</span>
            </v-card-title>
            <v-card-text class="pt-0">
                <v-layout row wrap align-top>
                    <v-flex :class="$vuetify.breakpoint.lgAndUp ? 'pr-2' : ''" xs12 lg6>
                        <div class="display-flex w-100 overflow-hidden background-image mb-3" :style="$vuetify.breakpoint.lgAndUp ? 'height: 488px' : 'height: 50vw'">
                            <img class="min-max-w-100 min-max-h-100 object-fit-cover" draggable="false" :src="currentImage.largeImageUrl">
                        </div>
                    </v-flex>
                    <v-flex :class="$vuetify.breakpoint.lgAndUp ? 'pl-2' : ''" xs12 lg6>
                        <p class="word-break">ID: {{ currentImage.id }}</p>
                        <p class="word-break">hochgeladen von: {{ currentImage.by }}</p>
                        <p class="word-break">Auflösung: {{ currentImage.resolution }}</p>
                        <p class="word-break">Dateigröße: {{ currentImage.size }}</p>
                        <p class="word-break">Name: {{ currentImage.name }}</p>
                        <p class="word-break">URL: <a :href="currentImage.url" target="_blank">{{ currentImage.url }}</a></p>
                        <p class="word-break">hochgeladen am: {{ currentImage.created_at }}</p>
                        <p class="word-break">zuletzt geupdatet am: {{ currentImage.updated_at }}</p>
                        <v-flex xs12>
                            <v-text-field
                                type="text"
                                label="Titel"
                                v-model="currentImage.title"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field
                                type="text"
                                label="Alternativ Text"
                                v-model="currentImage.alt_text"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field
                                type="text"
                                label="Beschreibung"
                                v-model="currentImage.description"
                            ></v-text-field>
                        </v-flex>
                    </v-flex>
                </v-layout>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
            <v-btn color="error" flat @click="deleteImage(currentImage.id); editImageDialog = !editImageDialog;" :data-id="currentImage.id">Löschen</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="error" flat @click="editImageDialog = !editImageDialog;">Abbrechen</v-btn>
            <v-btn color="primary" flat @click="editimage();">Speichern</v-btn>
            </v-card-actions>
        </v-card>
        </v-dialog>
        
        <v-container fluid v-if="mounted == 'mounted'">
            <v-layout row>
                <v-flex xs12>
                    <v-card class="transparent elevation-0">
                        <v-layout row wrap align-center>
                            <v-flex xs6 sm3 md2>
                                <h1 class="title">Medienbibliothek</h1>
                            </v-flex>
                            <v-flex xs6 sm5 md7>
                                <v-btn flat color="primary" @click="$refs.uploadInput.click()">Bild/er hochladen</v-btn>
                                <input class="d-none" type="file" ref="uploadInput" multiple @change="selectImages($event, 'input')">
                            </v-flex>
                            <v-flex xs12 sm4 md3>
                                <v-text-field
                                    type="text"
                                    append-icon="search"
                                    label="Bildtitel"
                                    v-model="searchInput"
                                ></v-text-field>
                            </v-flex>
                        </v-layout>
                        <small v-if="$vuetify.breakpoint.mdAndUp" class="caption">*Wählen Sie den Button zum hochladen oder ziehen Sie einfach per Drag & Drop Bilder von ihrem Computer (jpeg/png/gif) in die Gallerie</small>
                        <v-layout justify-end>
                            <v-btn v-if="!multiSelect" @click="multiSelect = !multiSelect;" flat>
                                mehrere Auswählen
                                <v-icon right>done_all</v-icon>
                            </v-btn>
                            <v-btn v-if="multiSelect" @click="multiSelect = !multiSelect; imgsToDelete = []" flat>
                                Abbrechen
                                <v-icon right>block</v-icon>
                            </v-btn>
                            <v-btn v-if="multiSelect" @click="deleteImages" flat>
                                Löschen
                                <v-icon right>delete</v-icon>
                            </v-btn>
                        </v-layout>
                        <p v-if="noImagesFound" class="text-xs-center mt-5">keine Bilder mit dem Titel "{{ searchInput }}" gefunden</p>
                        <v-container :class="dragging ? 'dropzone' : ''" class="px-0 pre-dropzone position-relative" fluid grid-list-sm @dragenter="dragging = true" @dragover="dragging = true">
                            <v-layout row wrap>
                            <v-flex v-for="image in mountImages" v-if="image.title.includes(searchInput)" :key="image.id" xs6 sm3 md2>
                                <div :style="`background-image: url(${image.smallImageUrl})`" class="background-image overflow-hidden image-card position-relative" :class="[multiSelect ? 'multi-select' : '', image.selected && multiSelect ? 'selected' : '']" :data-id="image.id" @click="multiSelect ? image.selected = !image.selected : ''" @mouseover="image.show = true" @mouseout="image.show = false">
                                    <div class="filler" />
                                    <div class="position-absolute flex-center bg-dark" v-if="image.newImage">
                                        <v-progress-circular size="100" :width="15" :rotate="-90" :value="uploadProgress" color="primary">
                                            {{ uploadProgress }} %
                                        </v-progress-circular>
                                    </div>
                                    <transition v-if="!multiSelect || image.newImage" name="fade">
                                        <div v-if="image.show" class="dark-overlay position-absolute flex-center">
                                            <v-btn icon :data-id="image.id" @click="getTheData($event); editImageDialog = true">
                                                <v-icon color="primary">edit</v-icon>
                                            </v-btn>
                                            <v-btn @click="deleteImage(image.id)" icon :data-id="image.id">
                                                <v-icon color="pink">delete</v-icon>
                                            </v-btn>
                                        </div>
                                    </transition>
                                </div>
                            </v-flex>
                            </v-layout>
                            <div 
                                v-if="dragging"
                                :class="dragging ? 'position-absolute primary-bg flex-center' : ''"
                                @dragenter="dragging = true"
                                @dragover="dragging = true; $event.preventDefault();"
                                @dragleave="dragging = false"
                                @dragend="selectImages"
                                @drop="selectImages($event, 'drop')"
                            >
                                <h1 class="title grey--text">Drop-Zone</h1>
                            </div>
                        </v-container>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>

    </div>

</template>

<style scoped>

.word-break { word-break: break-all }
.selected { opacity: 1!important; border: dashed 3px #000; }
.selected>.filler { display: block; position: absolute; width: 100%; height: 100%; background-color: rgba(255, 0, 0, 0.75); }
.filler { display: none; }
.bg-dark { background-color: rgba(0, 0, 0, 0.75); }
.overflow-hidden { overflow: hidden; }
.display-flex { display: flex; justify-content: center; align-items: center; }
.w-100 { width: 100%; }
.h-100 { height: 100%; }
.min-max-h-100 { min-height: 100%; max-height: 100% }
.min-max-w-100 { min-width: 100%; max-width: 100% }
.object-fit-cover { object-fit: cover }

.fade-enter, .fade-leave-to {
  opacity: 0;
}
.fade-enter-to, .fade-leave {
  opacity: 1;
}
.fade-enter-active, .fade-leave-active {
  transition: all 500ms;
}

.multi-select { opacity: 0.5; }
.flex-center { display: flex; align-items: center; justify-content: center; }
.dark-overlay { background-color: rgba(0, 0, 0, 0.75); width: 100%; height: 100%; }

.background-image { background-size: cover; background-repeat: no-repeat; background-position: center; background-color: #000; }

.image-card { width: 100%; cursor: pointer; }

@media screen and (min-width: 220px) { .image-card { height: 40vw; } }
@media screen and (min-width: 600px) { .image-card { height: 22vw; } }
@media screen and (min-width: 960px) { .image-card { height: 15vw; } }
@media screen and (min-width: 1264px) { .image-card { height: 12vw; } }

.d-none { display: none; }
/*
.image{
    user-drag: none; 
    user-select: none;
    -moz-user-select: none;
    -webkit-user-drag: none;
    -webkit-user-select: none;
    -ms-user-select: none;
}
*/
.position-relative{ position: relative; }
.position-absolute{ position: absolute; top: 0; left: 0; right: 0; bottom: 0; }
.primary-bg{ background-color: rgba(0, 188, 212, 0.9); }
.dropzone{ border: dashed 3px #9E9E9E; }
.pre-dropzone{ min-height: 65vh; }

</style>


<script>
import axios from "axios";

export default {

    data () {
        return {
            uploadProgress: 0,
            snackbar: false,
            mounted: '',
            searchInput: '',
            dragging: false,
            imagesToUpload: [],
            mountImages: [],
            multiSelect: false,
            wrongImageType: false,
            wrongImageTypeAlert: false,
            imageChangedAlert: false,
            editImageDialog: false,

            currentImage: {
                id: null,
                name: '',
                title: '',
                url: '',
                smallImageUrl: '',
                largeImageUrl: '',
                alt_text: '',
                description: '',
                by: '',
                resolution: '',
                size: '',
                created_at: '',
                updated_at: ''
            }
        };
    },

    computed: {
        noImagesFound () {
            let nothingFound = false;
            if (this.searchInput.length > 0) {
                if (this.mountImages.length == 0)
                    nothingFound = true;
                for (let mountImage of this.mountImages) {
                    if (!mountImage.title.includes(this.searchInput)) {
                        nothingFound = true;
                    } else {
                        nothingFound = false;
                    }
                }
            }
            return nothingFound;
        }
    },

    methods: {
        editimage () {
            for (let mountImage of this.mountImages) {
                if (mountImage.id == this.currentImage.id) {
                    if (mountImage.description != this.currentImage.description || mountImage.title != this.currentImage.title || mountImage.alt_text != this.currentImage.alt_text) {
                        axios.put('api/auth/image/' + this.currentImage.id,
                        { title: this.currentImage.title, alt_text: this.currentImage.alt_text, description: this.currentImage.description },
                        { headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest', 'Authorization': 'Bearer ' + this.$auth.getToken(), } }
                        ).then(
                            (response) => {
                                // console.log(response.data);
                                for (let mountImage of this.mountImages) {
                                    if (mountImage.id == this.currentImage.id) {
                                        mountImage.description = this.currentImage.description;
                                        mountImage.title = this.currentImage.title;
                                        mountImage.alt_text = this.currentImage.alt_text;
                                    }
                                }
                                this.imageChangedAlert = true;
                            }
                        ).catch(
                            (error) => {
                                //console.log(error);
                            }
                        );
                    }
                }
            }
        },

        getTheData (event) {
            for (let mountImage of this.mountImages) {
                if (mountImage.id == event.target.parentElement.parentElement.dataset.id || mountImage.id == event.target.parentElement.dataset.id) {
                    this.currentImage.id = mountImage.id;
                    this.currentImage.description = mountImage.description;
                    this.currentImage.name = mountImage.name;
                    this.currentImage.title = mountImage.title;
                    this.currentImage.url = mountImage.url;
                    this.currentImage.smallImageUrl = mountImage.smallImageUrl;
                    this.currentImage.largeImageUrl = mountImage.largeImageUrl;
                    this.currentImage.alt_text = mountImage.alt_text;
                    this.currentImage.by = mountImage.by;
                    this.currentImage.resolution = mountImage.resolution;
                    this.currentImage.size = mountImage.size;
                    this.currentImage.created_at = mountImage.created_at;
                    this.currentImage.updated_at = mountImage.updated_at;
                }
            }
        },
        deleteImage (id) {
            if (confirm("Sind Sie sicher, dass Sie das Bild löschen wollen?")) {
                let data = { ids: [id] };
                axios.post('api/auth/deleteImages', data, 
                { headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest", "Authorization": "Bearer " + this.$auth.getToken() }})
                .then(response => {
                    //console.log(response);
                    for (let i = this.mountImages.length - 1; i >= 0; i--)
                        if (this.mountImages[i].id == id)
                            this.mountImages.splice(i, 1);
                    this.multiSelect = false;
                })
                .catch(error => {
                    console.log(error);
                });
            }
        },
        deleteImages () {
            if (confirm("Sind Sie sicher, dass Sie das/die Bild/er löschen wollen?")) {
                let data = { ids: [] };
                for (let mountImage of this.mountImages)
                    if (mountImage.selected)
                        data.ids.push(mountImage.id);
                axios.post('api/auth/deleteImages',
                data,
                { headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest", "Authorization": "Bearer " + this.$auth.getToken() }})
                .then(response => {
                    //console.log(response);
                    for (let i = this.mountImages.length - 1; i >= 0; i--)
                        if (this.mountImages[i].selected)
                            this.mountImages.splice(i, 1);
                    this.multiSelect = false;
                })
                .catch(error => {
                    console.log(error);
                });
            }
        },

        selectImages (e, kind) {
            if (kind == 'input') {
                e.preventDefault();
                if (e.target.files.length > 0) {
                    for (let file of e.target.files) {
                        if (file.type == 'image/jpeg' || file.type == 'image/png' || file.type == 'image/gif') {
                            this.imagesToUpload.push(file);
                        } else {
                            this.wrongImageType = true;
                        }
                    }
                    if (this.imagesToUpload.length > 0) {
                        let formData = new FormData();

                        for (let image of this.imagesToUpload) {
                            formData.append('images[]', image);
                        }

                        this.sendImages(formData);
                    }
                    if (this.wrongImageType == true) {
                        this.wrongImageType = false;
                        this.wrongImageTypeAlert = true;
                    }
                }
            } else {
                this.dragging = false;
                e.preventDefault();

                if (e.dataTransfer.files.length > 0) {
                    for (let file of e.dataTransfer.files) {
                        if (file.type == 'image/jpeg' || file.type == 'image/png' || file.type == 'image/gif') {
                            this.imagesToUpload.push(file);
                        } else {
                            this.wrongImageType = true;
                        }
                    }
                    if (this.imagesToUpload.length > 0) {
                        let formData = new FormData();

                        for (let image of this.imagesToUpload) {
                            formData.append('images[]', image);
                        }

                        this.sendImages(formData);
                    } 
                    if (this.wrongImageType == true) {
                        this.wrongImageType = false;
                        this.wrongImageTypeAlert = true;
                    }
                }
            }
        },

        sendImages (formData) {
            for (let i of this.imagesToUpload) {
                this.mountImages.unshift({ title: '', newImage: true, visible: true, show: false });
            }
            
            let config = { 
                headers: { "Content-Type": "multipart/form-data", "X-Requested-With": "XMLHttpRequest", "Authorization": "Bearer " + this.$auth.getToken() } ,
                onUploadProgress: uploadEvent => {
                    setTimeout(_ => {
                        this.uploadProgress = Math.round(uploadEvent.loaded / uploadEvent.total * 100)
                        //console.log('Upload Progess: ' + this.uploadProgress + '%');
                    }, 100);
                }
            }

            axios.post('api/auth/images', formData, config )
            .then(response => {
                // console.log(response);
                let newImgs = [];
                for (let img of response.data.newIMGs) {
                    newImgs.push(JSON.parse(img));
                }
                // console.log(newImgs);
                setTimeout(_ => {
                    newImgs.forEach((newImg, key) => {
                        this.mountImages.splice(key, 1);
                        this.mountImages.unshift({ id: newImg.id, url: newImg.url, smallImageUrl: newImg.url + '?w=300&h=300&fit=crop', largeImageUrl: newImg.url + '?w=750&h=750&fit=crop', alt_text: newImg.alt_text, by: newImg.by, name: newImg.name, title: newImg.title, description: newImg.description, resolution: newImg.resolution, size: newImg.size, created_at: newImg.created_at, updated_at: newImg.updated_at, newImage: false, visible: true, show: false, selected: false });
                    });
                    for (let mountImage of this.mountImages) {
                        mountImage.newImage = false;
                    }
                    this.uploadProgress = 0;
                }, 1000);
                this.imagesToUpload = [];
                this.$refs.uploadInput.value = '';
            })
            .catch(error => {
                console.log(error);
                this.imagesToUpload = [];
                this.$refs.uploadInput.value = '';
                this.uploadProgress = 0;
            });
        },

        getImages () {
            this.mounted = "";
            axios.get('api/auth/images', {
                headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
                "Authorization": "Bearer " + this.$auth.getToken()
                }
            })
            .then(response => {
                // console.log(response.data);
                for (let i in response.data) {
                    this.mountImages.unshift({ id: response.data[i].id, url: response.data[i].url, smallImageUrl: response.data[i].url + '?w=300&h=300&fit=crop', largeImageUrl: response.data[i].url + '?w=750&h=750&fit=crop', alt_text: response.data[i].alt_text, by: response.data[i].by, name: response.data[i].name, title: response.data[i].title, description: response.data[i].description, resolution: response.data[i].resolution, size: response.data[i].size, created_at: response.data[i].created_at, updated_at: response.data[i].updated_at, newImage: false, visible: true, show: false, selected: false });
                }
                this.mounted = "mounted";
            })
            .catch(error => {
                console.log(error);
                this.mounted = "notMounted";
            });
        }
    },

    mounted () {
        this.getImages();
    }
};
</script>