<template>
  <v-container>
    <v-card>
      <v-card-title class="headline">
        Misc
      </v-card-title>

      <v-card-text>
        <v-layout row wrap>
          <v-flex xs6>
            <v-switch
              @change="submitConfig('bunnyhop')"
              color="primary"
              v-model="bunnyhop"
              label="Bunnyhop"
            />
          </v-flex>
          <v-flex xs6>
            <v-switch
              @change="submitConfig('autopistol')"
              color="primary"
              v-model="autopistol"
              label="Autopistol"
            />
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>

    <v-card class="mt-3">
      <v-card-title>
        <h1 class="title">Glow Object</h1>
      </v-card-title>
      
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs6>
            <v-switch
              @change="submitConfig('glow')"
              color="primary"
              v-model="glow.active"
              label="Render when occluded"
            />
          </v-flex>
          <v-flex v-if="glow.active" xs6>
            <v-switch
              @change="submitConfig('glow')"
              v-model="glow.fullBloom"
              color="primary"
              label="Full bloom"
            />
          </v-flex>
        </v-layout>

        <div v-if="glow.active">
          <v-layout row wrap>
            <v-flex xs11 class="pr-3">
              <v-slider
                @change="submitConfig('glow')"
                v-model="glow.style"
                label="Glow style"
                ticks="always"
                always-dirty
                :max="3"
              />
            </v-flex>
            <v-flex xs1>
              <v-text-field
                v-model="glow.style"
                disabled
                class="mt-0"
                type="number"
                max="3"
              />
            </v-flex>
          </v-layout>

          <v-layout row wrap>
            <v-flex class="pr-2" xs6>

              <v-expansion-panel expand>
                <v-expansion-panel-content :style="{ backgroundColor: `rgba(${ glow.teamColor.r }, ${ glow.teamColor.g }, ${ glow.teamColor.b }, ${ glow.teamColor.a })` }">
                  <template v-slot:header>
                    <b slot="header">Team color</b>
                  </template>

                    <v-card class="grey darken-4">

                      <v-card-text>
                        <v-container
                          fluid
                          grid-list-lg
                        >
                          <v-layout
                            row
                            wrap
                          >
                            <v-flex xs9>
                              <v-slider
                                @change="submitConfig('glow')"
                                color="#ff0000"
                                always-dirty
                                v-model="glow.teamColor.r"
                                :max="255"
                                label="R"
                              />
                            </v-flex>

                            <v-flex xs3>
                              <v-text-field
                                disabled
                                v-model="glow.teamColor.r"
                                class="mt-0"
                                type="number"
                              />
                            </v-flex>

                            <v-flex xs9>
                              <v-slider
                                @change="submitConfig('glow')"
                                color="#00ff00"
                                always-dirty
                                v-model="glow.teamColor.g"
                                :max="255"
                                label="G"
                              />
                            </v-flex>

                            <v-flex xs3>
                              <v-text-field
                                disabled
                                v-model="glow.teamColor.g"
                                class="mt-0"
                                type="number"
                              />
                            </v-flex>

                            <v-flex xs9>
                              <v-slider
                                @change="submitConfig('glow')"
                                color="#0000ff"
                                always-dirty
                                v-model="glow.teamColor.b"
                                :max="255"
                                label="B"
                              />
                            </v-flex>

                            <v-flex xs3>
                              <v-text-field
                                disabled
                                v-model="glow.teamColor.b"
                                class="mt-0"
                                type="number"
                              />
                            </v-flex>

                            <v-flex xs9>
                              <v-slider
                                @change="submitConfig('glow')"
                                color="grey"
                                always-dirty
                                v-model="teamAlphaUInt"
                                :max="100"
                                label="A"
                              />
                            </v-flex>

                            <v-flex xs3>
                              <v-text-field
                                disabled
                                v-model="glow.teamColor.a"
                                class="mt-0"
                                type="number"
                              />
                            </v-flex>
                          </v-layout>
                        </v-container>
                      </v-card-text>
                    </v-card>

                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-flex>

            <v-flex class="pl-2" xs6>

              <v-expansion-panel expand>
                <v-expansion-panel-content :style="{ backgroundColor: `rgba(${ glow.enemyColor.r }, ${ glow.enemyColor.g }, ${ glow.enemyColor.b }, ${ glow.enemyColor.a })` }">
                  <template v-slot:header>
                    <b slot="header">Enemy color</b>
                  </template>

                  <v-card class="grey darken-4">

                    <v-card-text>
                      <v-container
                        fluid
                        grid-list-lg
                      >
                        <v-layout
                          row
                          wrap
                        >
                          <v-flex xs9>
                            <v-slider
                              @change="submitConfig('glow')"
                              color="#ff0000"
                              always-dirty
                              v-model="glow.enemyColor.r"
                              :max="255"
                              label="R"
                            />
                          </v-flex>

                          <v-flex xs3>
                            <v-text-field
                              disabled
                              v-model="glow.enemyColor.r"
                              class="mt-0"
                              type="number"
                            />
                          </v-flex>

                          <v-flex xs9>
                            <v-slider
                              @change="submitConfig('glow')"
                              color="#00ff00"
                              always-dirty
                              v-model="glow.enemyColor.g"
                              :max="255"
                              label="G"
                            />
                          </v-flex>

                          <v-flex xs3>
                            <v-text-field
                              disabled
                              v-model="glow.enemyColor.g"
                              class="mt-0"
                              type="number"
                            />
                          </v-flex>

                          <v-flex xs9>
                            <v-slider
                              @change="submitConfig('glow')"
                              color="#0000ff"
                              always-dirty
                              v-model="glow.enemyColor.b"
                              :max="255"
                              label="B"
                            />
                          </v-flex>

                          <v-flex xs3>
                            <v-text-field
                              disabled
                              v-model="glow.enemyColor.b"
                              class="mt-0"
                              type="number"
                            />
                          </v-flex>

                          <v-flex xs9>
                            <v-slider
                              @change="submitConfig('glow')"
                              color="grey"
                              always-dirty
                              v-model="enemyAlphaUInt"
                              :max="100"
                              label="A"
                            />
                          </v-flex>

                          <v-flex xs3>
                            <v-text-field
                              disabled
                              v-model="glow.enemyColor.a"
                              class="mt-0"
                              type="number"
                            />
                          </v-flex>
                        </v-layout>
                      </v-container>
                    </v-card-text>
                  </v-card>

                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-flex>
          </v-layout>
        </div>
      </v-card-text>
    </v-card>

    <v-card class="mt-3">
      <v-card-title>
        <h1 class="title">More visuals</h1>
      </v-card-title>

      <v-card-text>
        <v-layout row wrap>
          <v-flex xs6>
            <v-switch
              @change="submitConfig('radar')"
              color="primary"
              v-model="radar"
              label="Enemies spotted on radar"
            />
          </v-flex>
          <v-flex xs6>
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

  </v-container>
</template>

<script>
export default {
  data: () => ({
    panel: [true],
    teamAlphaUInt: 100,
    enemyAlphaUInt: 100,

    glow: {
      active: false,
      style: 0,
      teamColor: {
        r: 0,
        g: 0,
        b: 255,
        a: 1
      },
      enemyColor: {
        r: 255,
        g: 0,
        b: 0,
        a: 1
      },
      fullBloom: false
    },
    radar: false,
    noFlash: false,
    autopistol: false,
    bunnyhop: false
  }),
  watch: {
    teamAlphaUInt (newVal, oldVal) {
      this.glow.teamColor.a = newVal / 100
    },
    enemyAlphaUInt (newVal, oldVal) {
      this.glow.enemyColor.a = newVal / 100
    }
  },
  methods: {
    submitConfig (type) {
      if (type === "glow")
        this.$socket.emit("config transmitted", { glow: this.glow })
      else if (type === "radar")
        this.$socket.emit("config transmitted", { radar: true })
      else if (type === "noFlash")
        this.$socket.emit("config transmitted", { noFlash: true })
      else if (type === "autopistol")
        this.$socket.emit("config transmitted", { autopistol: true })
      else if (type === "bunnyhop")
        this.$socket.emit("config transmitted", { bunnyhop: true })
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