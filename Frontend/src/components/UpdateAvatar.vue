<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <!-- Bouton -->
    <template v-slot:activator="{ on, attrs }">
      <v-btn title="Modifier mon avatar" outlined fab v-bind="attrs" v-on="on" color="#2A3B61" class="avatar-btn ma-2">
        <v-icon class="avatar-btn__icon">mdi-image</v-icon>
      </v-btn>
    </template>
    <!-- Contenu de la modal -->
    <v-card>
      <v-card-title>
        <span class="text-h5">Modifier l'avatar</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <input type="file" name="avatar" accept="image/*" label="Importez votre avatar" @change="updateAvatar">
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <!-- Bouton fermer-->
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn title="Fermer" color="black" text  @click="dialog = false">fermer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'

export default {
  name: 'UpdateAvatar',
  data: () => ({
    dialog: false,
  }),
  computed: {
    ...mapState(['userToken']),
  },
  methods: {
    updateAvatar(e) {
      let updateAvatar = new FormData()
      updateAvatar.append('image', e.target.files[0]);

      axios.put('http://localhost:3000/api/auth/user', updateAvatar,{
        headers: {'Authorization': 'Bearer ' + this.userToken }
      })
      .then(response => response.json())
      .then(data => {this.$emit('avatarUpdate', data.avatar)})
      .catch(error => console.error(error))

      this.dialog = false
      window.location.reload()
    },
  }
}
</script>

<style lang="scss" scoped>
  .avatar-btn {
    height: 50px;
    width: 50px;

    &__icon {
    font-size: 30px !important;
    }
  }
</style>
