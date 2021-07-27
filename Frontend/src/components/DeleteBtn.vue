<template>
  <v-dialog v-model="dialog" persistent max-width="400">
    <!-- Bouton -->
    <template v-slot:activator="{ on, attrs }">
      <v-btn title="Supprimer le compte" outlined fab color="red" v-bind="attrs" v-on="on" class="delete-btn ma-2">
        <v-icon class="delete-btn__icon">mdi-delete</v-icon>
      </v-btn>
    </template>
    <!-- Contenu de la modal -->
    <v-card>
      <v-card-title class="text-h5">
        Supprimer votre compte?
      </v-card-title>
      <v-card-text>Votre choix sera définitif</v-card-text>
      <!-- Boutons -->
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn title="J'accepte" color="red darken-1" text @click="dialog = false">Je refuse</v-btn>
        <v-btn title="Je refuse" color="green darken-1" text @click="deleteUser">J'accepte</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'DeleteBtn',
  data: () => ({
    dialog: false,
  }),
  methods: {
    ...mapActions(['deleteUser'])
  }
}
</script>

<style lang="scss" scoped>
  .delete-btn {
    height: 50px;
    width: 50px;

    &__icon {
    font-size: 30px !important;
    }
  }
</style>
