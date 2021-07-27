<template>
  <v-row>
    <v-dialog v-model="dialog" scrollable max-width="500">
      <!-- Bouton -->
      <template v-slot:activator="{ on, attrs }">
        <v-btn title="Comment ça marche ?" text color="primary" dark v-bind="attrs" v-on="on" fab small>
          <v-icon>mdi-help-circle-outline</v-icon>
        </v-btn>
      </template>
      <!-- Contenu de la modal -->
      <v-card>
        <v-card-title class="word-break">Comment importer un Gif depuis Giphy ?</v-card-title>
        <v-divider></v-divider>
        <div v-for="(step, i) in steps" :key="'F'+i" class="pl-4 pr-4 white">
          <v-card-title class="word-break">
            {{ step.step }}
          </v-card-title>
          <v-card-text class="">
            {{ step.text }}
          </v-card-text>
          <v-divider></v-divider>
        </div>
        <!-- Bouton fermer -->
        <v-card-actions class="white justify-center">
          <v-btn title="Fermer" color="blue darken-1" text @click="dialog = false">fermer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>

export default {
  name: 'GifManual',
  data: () => ({
    dialog: false,
    steps: [
        {
          step: '1. Se rendre sur Giphy',
          text: "Clique sur le bouton 'Chercher un gif'",
        },
        {
          step: ' 2. Rechercher un Gif',
          text: 'Tape ton mot clé puis selectionne ton Gif',
        },
        {
          step: '3. Copier le lien du Gif',
          text: "Clique sur 'Media' puis copie le lien 'Social'",
        },
        {
          step: '4. Poster le Gif',
          text: 'Coller le lien dans le champ réservé à l\'url du Gif',
        },
      ],
  }),
}
</script>

<style lang="scss" scoped>
  .word-break {
    word-break: normal;
  }
</style>
