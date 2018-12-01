<template>

    <v-container fluid fill-height>
        <v-layout row wrap>
        <v-flex xs12 md6>
            <v-container class="pa-0">
                <h1 class="title pb-3">Changelog</h1>
                <v-expansion-panel :value="0">
                    <v-expansion-panel-content>
                    <div slot="header">Version 0.9.6 <code class="transparent elevation-0">alpha</code><span class="ml-4">20.11.2018</span></div>
                    <v-card class="pl-4">
                        <v-card-text>
                        <ul>
                            <li>"Navigation-Builder" geupdated (Kategorien und Länder eingefügt)</li>
                        </ul>
                        </v-card-text>
                    </v-card>
                    </v-expansion-panel-content>
                    <v-expansion-panel-content>
                    <div slot="header">Version 0.9.5 <code class="transparent elevation-0">alpha</code><span class="ml-4">19.11.2018</span></div>
                    <v-card class="pl-4">
                        <v-card-text>
                        <ul>
                            <li>"freie Plätze" aus den Reisekomponenten entfernt, da nicht nötig</li>
                            <li>Unterbringungsmöglichkeiten-Auswahl gefixt</li>
                        </ul>
                        </v-card-text>
                    </v-card>
                    </v-expansion-panel-content>
                    <v-expansion-panel-content>
                    <div slot="header">Version 0.9.4 <code class="transparent elevation-0">alpha</code><span class="ml-4">13.11.2018</span></div>
                    <v-card class="pl-4">
                        <v-card-text>
                        <ul>
                            <li>Verkomplizierende Komponenten vom "Reise erstellen/bearbeiten Vorgang" entfernt</li>
                        </ul>
                        </v-card-text>
                    </v-card>
                    </v-expansion-panel-content>
                    <v-expansion-panel-content>
                    <div slot="header">Version 0.9.3 <code class="transparent elevation-0">alpha</code><span class="ml-4">09.11.2018</span></div>
                    <v-card class="pl-4">
                        <v-card-text>
                        <ul>
                            <li>Frontend für CRUD operations hinzugefügt</li>
                            <li>UI & Backend Updates und Bugfixes</li>
                        </ul>
                        </v-card-text>
                    </v-card>
                    </v-expansion-panel-content>
                    <v-expansion-panel-content>
                    <div slot="header">Version 0.9.2 <code class="transparent elevation-0">alpha</code><span class="ml-4">21.08.2018</span></div>
                    <v-card class="pl-4">
                        <v-card-text>
                        <ul>
                            <li>Performance Update für Media-Uploader</li>
                            <li>Darkmode in der Toolbar hinzugefügt</li>
                        </ul>
                        </v-card-text>
                    </v-card>
                    </v-expansion-panel-content>
                    <v-expansion-panel-content>
                    <div slot="header">Version 0.9.1 <code class="transparent elevation-0">alpha</code><span class="ml-4">18.08.2018</span></div>
                    <v-card class="pl-4">
                        <v-card-text>
                        <ul>
                            <li>.gif Datei Support für Media-Uploader</li>
                            <li>Media-Uploader Bufix beim wiederholten hochladen der selben Datei</li>
                            <li>Social-media-links error Popups</li>
                        </ul>
                        </v-card-text>
                    </v-card>
                    </v-expansion-panel-content>
                    <v-expansion-panel-content>
                    <div slot="header">Version 0.9 <code class="transparent elevation-0">alpha</code><span class="ml-4">17.08.2018</span></div>
                    <v-card class="pl-4">
                        <v-card-text>
                        <ul>
                            <li>Navigation-builder *release*</li>
                            <li>Social-media-links *release*</li>
                        </ul>
                        </v-card-text>
                    </v-card>
                    </v-expansion-panel-content>
                    <v-expansion-panel-content>
                    <div slot="header">Version 0.8 <code class="transparent elevation-0">alpha</code><span class="ml-4">27.07.2018</span></div>
                    <v-card class="pl-4">
                        <v-card-text>
                        <ul>
                            <li>Asset Updates</li>
                            <li>Bugfixes</li>
                            <li>Menüpunkte geupdatet</li>
                        </ul>
                        </v-card-text>
                    </v-card>
                    </v-expansion-panel-content>
                    <v-expansion-panel-content>
                    <div slot="header">Version 0.7 <code class="transparent elevation-0">alpha</code><span class="ml-4">30.06.2018</span></div>
                    <v-card class="pl-4">
                        <v-card-text>
                        <ul>
                            <li>Medienbibliothek fertiggestellt</li>
                            <li>noch fehlende Menüpunkte hinzugefügt (grau)</li>
                        </ul>
                        </v-card-text>
                    </v-card>
                    </v-expansion-panel-content>
                    <v-expansion-panel-content>
                    <div slot="header">Version 0.6 <code class="transparent elevation-0">alpha</code><span class="ml-4">11.06.2018</span></div>
                    <v-card class="pl-4">
                        <v-card-text>
                        <ul>
                            <li>Medienbibliothek hinzugefügt</li>
                        </ul>
                        </v-card-text>
                    </v-card>
                    </v-expansion-panel-content>
                    <v-expansion-panel-content>
                    <div slot="header">Version 0.5 <code class="transparent elevation-0">alpha</code><span class="ml-4">27.05.2018</span></div>
                    <v-card class="pl-4">
                        <v-card-text>
                        <ul>
                            <li>Kunden API + Backend/Frontend</li>
                            <li>"Passwort ändern" Funktion</li>
                        </ul>
                        </v-card-text>
                    </v-card>
                    </v-expansion-panel-content>
                    <v-expansion-panel-content>
                    <div slot="header">Version 0.4 <code class="transparent elevation-0">alpha</code><span class="ml-4">06.05.2018</span></div>
                    <v-card class="pl-4">
                        <v-card-text>
                        <ul>
                            <li>"Eigenen Benutzer bearbeiten" Funktion</li>
                        </ul>
                        </v-card-text>
                    </v-card>
                    </v-expansion-panel-content>
                    <v-expansion-panel-content>
                    <div slot="header">Version 0.3 <code class="transparent elevation-0">alpha</code><span class="ml-4">28.04.2018</span></div>
                    <v-card class="pl-4">
                        <v-card-text>
                        <ul>
                            <li>UI/UX Framework *neu*</li>
                            <li>"Angemeldet bleiben" Funktion</li>
                            <li>JWT-Token wird bei Aktivität erneuert</li>
                        </ul>
                        </v-card-text>
                    </v-card>
                    </v-expansion-panel-content>
                    <v-expansion-panel-content>
                    <div slot="header">Version 0.2 <code class="transparent elevation-0">alpha</code><span class="ml-4">07.04.2018</span></div>
                    <v-card class="pl-4">
                        <v-card-text>
                        <ul>
                            <li>GUI zum Erstellen und Entfernen von Nutzern</li>
                        </ul>
                        </v-card-text>
                    </v-card>
                    </v-expansion-panel-content>
                    <v-expansion-panel-content>
                    <div slot="header">Version 0.1 <code class="transparent elevation-0">alpha</code><span class="ml-4">28.03.2018</span></div>
                    <v-card class="pl-4">
                        <v-card-text>
                        <ul>
                            <li>JSON-Web-Token Single-Page-Application security authentication</li>
                            <li>Back-End SPA</li>
                            <li>Benutzer API</li>
                        </ul>
                        </v-card-text>
                    </v-card>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-container>
        </v-flex>
        </v-layout>
    </v-container>

</template>

<script>

export default {

}

</script>