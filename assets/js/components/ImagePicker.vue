<template>
    <div>
        <v-layout row>
            <v-flex xs1 align-center>
                <v-layout fill-height align-center>
                    <h1 class="title">Bild/er</h1>
                    <v-btn @click="dialog = true" color="primary" flat>hinzufügen</v-btn>
                </v-layout>
            </v-flex>
        </v-layout>
        <small class="caption">*Wählen Sie den Button "Hinzufügen" zum zuteilen von Bildern aus der Medienbibliothek und geben Sie den Bildern mit Drag & Drop eine gewünschte Reihenfolge</small>
        <v-layout class="my-3" justify-end>
            <v-btn :disabled="attachedImages.length == 0" v-if="!multiSelect" @click="multiSelect = !multiSelect" flat>
                zum Entfernen auswählen
                <v-icon right>done_all</v-icon>
            </v-btn>
            <v-btn v-if="multiSelect" @click="multiSelect = !multiSelect" flat>
                Abbrechen
                <v-icon right>block</v-icon>
            </v-btn>
            <v-btn :disabled="attachedImages.length > 0 ? false : true" v-if="multiSelect" @click="removeAttachedImages" flat>
                Entfernen
                <v-icon right>delete</v-icon>
            </v-btn>
        </v-layout>
        <v-layout row>
            <v-container class="pa-0" grid-list-sm fluid>
                <draggable class="layout row wrap" :list="attachedImages" :options="{ draggable: '.cursor-move', animation: 100 }">
                    <v-flex @click="selectMountImageToDelete(attachedImage)" :class="multiSelect ? 'cursor-pointer' : 'cursor-move'" v-for="(attachedImage, index) in attachedImages" :key="index" xs6 sm3 lg2 xl1>
                        <v-card flat tile class="d-flex">
                            <v-img class="grey lighten-2" :src="attachedImage.smallImageUrl" aspect-ratio="1">
                                <div :class="[multiSelect ? 'selectable' : 'd-none', attachedImage.selected ? 'selected-image' : '']">
                                    <div />
                                </div>
                            </v-img>
                        </v-card>
                    </v-flex>
                </draggable>
            </v-container>
            <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
                <v-card v-if="dialog">
                    <v-toolbar dark>
                        <v-toolbar-title>Bilder auswählen</v-toolbar-title>
                        <v-spacer />
                        <v-toolbar-items>
                            <v-btn dark flat @click.native="dialog = false">Abbrechen</v-btn>
                        </v-toolbar-items>
                        <v-divider vertical />
                        <v-toolbar-items>
                            <v-btn dark flat @click.native="addImages">Hinzufügen</v-btn>
                        </v-toolbar-items>
                    </v-toolbar>
                    <v-container grid-list-sm fluid>
                        <v-layout row wrap>
                            <v-flex v-for="image in images" :key="image.id" xs6 sm4 md3 lg2 xl1 d-flex>
                                <v-card flat tile class="d-flex">
                                    <v-img @click="image.selected = !image.selected" class="cursor-pointer grey lighten-2" :src="image.smallImageUrl" aspect-ratio="1">
                                        <div :class="image.selected ? 'selected' : 'd-none'">
                                            <div />
                                        </div>
                                        <v-layout slot="placeholder" fill-height align-center justify-center ma-0>
                                            <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                                        </v-layout>
                                    </v-img>
                                </v-card>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card>
            </v-dialog>
        </v-layout>
    </div>
</template>

<style>
.selectable { width: 100%; height: 100%; background-color: rgba(255, 255, 255, 0.5)}
.selected-image { width: 100%; height: 100%; border: dashed 3px #000; }
.selected-image>div { width: 100%; height: 100%; background-color: rgba(255, 0, 0, 0.75) }
.cursor-move { cursor: move; }
.cursor-pointer { cursor: pointer; }
.image-button { border: dashed 1px #00bcd4; border-radius: 2%; }
.primary-bg{ transition: all 500ms; }
.primary-bg:hover{ background-color: rgba(0, 188, 212, 0.2); }
.selected { position: absolute; background-color: rgba(0, 188, 212, 0.5); width: 100%; height: 100%; border: dashed 3px #000; }
.selected>div { position: absolute; background-color: rgba(0, 188, 212, 0.5); width: 100%; height: 100%; }
.d-none { display: none; }
.ghostborder { border: dashed 1px #00BCD4; background-color: rgba(0,188,212, 0.1) }
</style>

<script>
import draggable from 'vuedraggable';
export default {
    data () {
        return {
            dialog: false,
            multiSelect: false,
            images: []
        }
    },
    components: {
        draggable
    },
    props: {
        attachedImages: Array
    },
    methods: {
        addImages () {
            for (let image of this.images) {
                if (image.selected) {
                    this.attachedImages.push(image);
                    image.selected = false;
                }
            }
            this.dialog = false;
        },
        selectMountImageToDelete (attachedImage) {
            if(this.multiSelect)
                attachedImage.selected = !attachedImage.selected;
        },
        removeAttachedImages () {
            this.multiSelect = false;
            if (this.attachedImages.length > 0)
                for (let i = this.attachedImages.length - 1; i >= 0; i--)
                    if (this.attachedImages[i].selected)
                        this.attachedImages.splice(i, 1);
        },
        getImages () {
            axios.get('api/auth/images',
            { headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest", "Authorization": "Bearer " + this.$auth.getToken() } })
            .then(response => {
                // console.log(response.data);
                for (let image of response.data) {
                    this.images.unshift({ id: image.id, url: image.url, smallImageUrl: image.url + '?w=300&h=300&fit=crop', largeImageUrl: image.url + '?w=750&h=750&fit=crop', alt_text: image.alt_text, by: image.by, name: image.name, title: image.title, description: image.description, resolution: image.resolution, size: image.size, created_at: image.created_at, updated_at: image.updated_at, selected: false });
                }
            })
            .catch(error => {
                console.log(error);
            });
        }
    },
    mounted () {
        this.getImages();
    }
}
</script>