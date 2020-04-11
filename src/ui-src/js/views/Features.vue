<template>
  <v-container>
    <v-card>
      <v-card-title class="headline">
        Visuals
      </v-card-title>

      <v-card-text>
        <v-layout row wrap>
          <v-flex>
            <v-switch
              @change="submitConfig('glow')"
              color="primary"
              v-model="glow"
              label="Player glow outline"
            />
          </v-flex>
          <v-flex>
            <v-switch
              @change="submitConfig('radar')"
              color="primary"
              v-model="radar"
              label="Enemies spotted on Radar"
            />
          </v-flex>
          <v-flex>
            <v-switch
              @change="submitConfig('noFlash')"
              color="primary"
              v-model="noFlash"
              label="No Flash"
            />
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
    
    <v-card class="mt-3">
      <v-card-title class="headline">
        Misc
      </v-card-title>

      <v-card-text>
        <v-layout row wrap>
          <v-flex>
            <v-switch
              @change="submitConfig('autopistol')"
              color="primary"
              v-model="autopistol"
              label="Autopistol"
            />
          </v-flex>
          <v-flex>
            <v-switch
              @change="submitConfig('bunnyhop')"
              color="primary"
              v-model="bunnyhop"
              label="Bunnyhop"
            />
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    glow: null,
    radar: null,
    noFlash: null,
    autopistol: null,
    bunnyhop: null
  }),
  methods: {
    submitConfig (type) {
      if (type == "glow")
        this.$socket.emit("visuals transmitted", { glow: true })
      else if (type == "radar")
        this.$socket.emit("visuals transmitted", { radar: true })
      else if (type == "noFlash")
        this.$socket.emit("visuals transmitted", { noFlash: true })
      else if (type == "autopistol")
        this.$socket.emit("misc transmitted", { autopistol: true })
      else if (type == "bunnyhop")
        this.$socket.emit("misc transmitted", { bunnyhop: true })
    }
  },
  mounted () {
    this.$socket.emit("route changed", true);
    this.sockets.subscribe("config transmitted", data => {
      this.glow = data.visuals.glow
      this.radar = data.visuals.radar
      this.noFlash = data.visuals.noFlash
      this.autopistol = data.misc.autopistol
      this.bunnyhop = data.misc.bunnyhop
    });
  }
};
</script>