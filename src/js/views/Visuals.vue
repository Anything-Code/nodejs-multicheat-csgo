<template>
    <v-card class="ma-3">
        <v-flex xs12>
            <v-tabs centered icons-and-text>
                <v-tabs-slider color="primary" />
                    <v-tab href="#tab-1">
                        Glow
                        <v-icon>phone</v-icon>
                    </v-tab>
                    <v-tab>
                        Radar
                        <v-icon>favorite</v-icon>
                    </v-tab>
                    <v-tab href="#tab-3">
                        No-Flash
                        <v-icon>account_box</v-icon>
                    </v-tab>
                    <v-tab-item value="tab-1">
                        <v-container>
                            <v-switch @change="sendVisualsConfig('glow')" color="primary" v-model="glow" label="Enable/disable glow outline" />
                        </v-container>
                    </v-tab-item>
                    <v-tab-item value="tab-2"></v-tab-item>
                    <v-tab-item value="tab-3" >
                        <v-container>
                            <v-switch @change="sendVisualsConfig('noFlash')" color="primary" v-model="noFlash" label="Enable/disable noFlash functionality" />
                        </v-container>
                    </v-tab-item>
            </v-tabs>
        </v-flex>
    </v-card>
</template>
<script>
export default {
    data () {
        return {
            glow: null,
            noFlash: null
        }
    },
    methods: {
        sendVisualsConfig (typeOfVisual) {
            if (typeOfVisual == 'glow')
                this.$socket.emit('visuals transmitted', { glow: true })
            else if (typeOfVisual == 'noFlash')
                this.$socket.emit('visuals transmitted', { noFlash: true })
        }
    },
    mounted () {
        this.$socket.emit('route changed', true)
        this.sockets.subscribe('config transmitted', data => {
            this.glow = data.visuals.glow
            this.noFlash = data.visuals.noFlash
        })
    }
}
</script>