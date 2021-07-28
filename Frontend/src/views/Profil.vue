<template>
  <div class="profil">
    <h1 class="title grey--text text--darken-2">Mon profil</h1>
    <v-container class="my-5 px-0">
      <!-- Zone profil -->
      <v-row>
        <v-col sm="8" offset-sm="2" md="6" offset-md="3" xl="4" offset-xl="4">
          <v-card>
            <div class="d-flex flex-column flex-sm-row align-center">
              <!-- Avatar -->
              <v-avatar size="108" class="ma-3">
                <v-img v-if="userData.avatar !== null" :src="userData.avatar"></v-img>
                <v-img v-else src="../../public/images/profil/icon.png"></v-img>
              </v-avatar>
              <v-list-item two-line class="text-center">
                <v-list-item-content>
                  <!-- Fullname -->
                  <v-list-item-title class="text-h5 mb-1">
                    {{ userData.firstname }} {{ userData.lastname }}
                  </v-list-item-title>
                  <!-- Role -->
                  <v-list-item-subtitle v-if="userData.isAdmin == true">Administrateur</v-list-item-subtitle>
                  <!-- Email -->
                  <v-list-item-subtitle>{{ userData.email }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </div>

            <v-divider></v-divider>
            <!-- Zone action -->
            <div class="d-flex justify-space-between">
              <!-- Bouton retour -->
              <router-link title="Retour au forum" class="back-btn d-flex justify-center" to="/forum">
                <v-btn title="Retour au forum" outlined fab color="black" class="back-btn__size ma-2">
                  <v-icon class="back-btn__icon">mdi-arrow-left</v-icon>
                </v-btn>
              </router-link>
              <div class="d-flex justify-space-between">
                <!-- Import composant UpdateAvatar -->
                <UpdateAvatar @avatarUpdate="avatarProfilUpdate"/>
                <!-- Import composant DeleteBtn -->
                <DeleteBtn/>
              </div>
              <router-view/>
            </div>
          </v-card>
        </v-col>
      </v-row>
      <!-- Import composant PostsList -->
      <PostsList />
      <!-- Bouton backToTop -->
      <v-btn title="Retour en haut de la page" class="mx-2 back-to-top" fab dark color="#324673" v-if="this.scrollY >= 200" @click="backToTop">
        <v-icon dark>
          mdi-chevron-up
        </v-icon>
      </v-btn>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios'
import DeleteBtn from '../components/DeleteBtn.vue'
import UpdateAvatar from '../components/UpdateAvatar.vue'
import PostsList from '../components/PostsList.vue'
import { mapState, mapActions } from 'vuex'

  export default {
    name: 'Profil',
    components: { DeleteBtn, UpdateAvatar, PostsList },
    data: () => ({
      userToken: localStorage.getItem('userToken'),
      dialog: false,
      avatar: '',
      valid: false,
      scrollY: 0,
    }),

    created() {
      this.$store.dispatch('getUserData')
      this.getMyPosts()
      this.getAllComments()
      window.addEventListener('scroll', this.getScroll)
    },

    computed: {
    ...mapState(['userData', 'posts'])
    },

    methods: {
      ...mapActions(['deleteUser', 'getMyPosts', 'getAllComments']),
      // Mise a jour de l'avatar
      avatarProfilUpdate(newAvatar) {
        this.avatar = newAvatar; 
        },
      // Suppression du post
      deletePost(i){
        axios.delete('http://localhost:3000/api/post/' + this.posts[i].id, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.userToken
        }
        })
        .then(response => {
          if (response.status == 201) {
            this.getMyPosts()
          }
        })
        .catch(error => console.log(error))
      },
      // Détection de l'état du scroll sur la page
      getScroll() {
        this.scrollY = window.scrollY
      },
      // Back to top
      backToTop() {
        window.scrollTo({top: 0, behavior: 'smooth'})
      }
    }
  }
</script>

<style lang="scss" scoped>

  .back-btn {
    text-decoration: none;

    &__size {
      height: 50px;
      width: 50px;
    }

    &__icon {
      font-size: 30px !important;
    }
  }

  .back-to-top {
    position: fixed;
    bottom: 20px;
    right: 20px;

    @media screen and (max-width: 610px) {
      display: none;
    }
  }
</style>
