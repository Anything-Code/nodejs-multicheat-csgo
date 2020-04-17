<template>
  <div>
    <v-navigation-drawer :mobile-break-point="600" app dark floating fixed v-model="drawer">
      <v-list dense expand>
        <v-list-tile :to="{ name: 'features' }">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Features</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile class="grey--text">
          <v-list-tile-action>
            <v-icon>settings</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Config</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar dense fixed app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>
        <span class="primary--text">Csgo Cheat Menu</span>
      </v-toolbar-title>
    </v-toolbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      drawer: true
    };
  }
};
</script>