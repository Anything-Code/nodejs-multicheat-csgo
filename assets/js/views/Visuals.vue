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
                <v-tab>
                    No-Flash
                    <v-icon>account_box</v-icon>
                </v-tab>
                    <v-tab-item value="tab-1">
                        <v-container>
                            <v-switch @change="sendVisualsConfig" color="primary" v-model="glow" label="Enable/disable glow outline" />
                        </v-container>
                    </v-tab-item>
                    <v-tab-item value="tab-2"></v-tab-item>
                    <v-tab-item value="tab-3" ></v-tab-item>
            </v-tabs>
        </v-flex>
    </v-card>
</template>
<script>
export default {
    data () {
        return {
            valid: null,
            glow: null
        }
    },
    methods: {
        sendVisualsConfig () {
            this.$socket.emit('visuals transmitted', { glow: this.glow })
        }
    },
    mounted () {
        this.sockets.subscribe('visuals transmitted', data => {
            this.glow = data
        })
    }
}
</script>