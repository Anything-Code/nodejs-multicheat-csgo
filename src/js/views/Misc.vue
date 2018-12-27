<template>
    <v-card class="ma-3">
        <v-flex xs12>
            <v-tabs centered icons-and-text>
                <v-tabs-slider color="primary" />

                <v-tab href="#tab-1">
                    Autopistol
                    <v-icon>phone</v-icon>
                </v-tab>
                <v-tab>
                    Playerinfo
                    <v-icon>favorite</v-icon>
                </v-tab>
                <v-tab href="#tab-3">
                    Bunnyhop
                    <v-icon>account_box</v-icon>
                </v-tab>
                    <v-tab-item value="tab-1">
                        <v-container>
                            <v-switch @change="sendMiscConfig('autopistol')" color="primary" v-model="autopistol" label="Enable/disable autopistol" />
                        </v-container>
                    </v-tab-item>
                    <v-tab-item value="tab-2"></v-tab-item>
                    <v-tab-item value="tab-3" >
                        <v-container>
                            <v-switch @change="sendMiscConfig('bunnyhop')" color="primary" v-model="bunnyhop" label="Enable/disable bunnyhop" />
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
            autopistol: null,
            bunnyhop: null
        }
    },
    methods: {
        sendMiscConfig (typeOfMisc) {
            if (typeOfMisc == 'autopistol')
                this.$socket.emit('misc transmitted', { autopistol: true })
            else if (typeOfMisc == 'bunnyhop')
                this.$socket.emit('misc transmitted', { bunnyhop: true })
        }
    },
    mounted () {
        this.$socket.emit('route changed', true)
        this.sockets.subscribe('config transmitted', data => {
            this.autopistol = data.misc.autopistol
            this.bunnyhop = data.misc.bunnyhop
        })
    }
}
</script>