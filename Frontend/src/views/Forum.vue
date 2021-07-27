<template>
  <div class="forum" >
    <h1 class="title grey--text text--darken-2">Le forum</h1>
    <v-container class="my-5 px-0">
      <v-row>
        <!-- Zone de post -->
        <v-col sm="8" offset-sm="2" md="6" offset-md="3" xl="4" offset-xl="4">
          <v-card>
            <div class="pt-1">
              <!-- Formulaire de post -->
              <v-form ref="form" v-model="valid" lazy-validation class="pa-5">
                <v-text-field  type="url" outlined rounded dense :rules="gifUrlRules" hint="ex: https://media.giphy.com/media/..." label="Url du Gif" @focus="setGifRules" @blur="resetGifRules" v-model="gifUrl"></v-text-field>
                <v-text-field type="text" counter maxlength="200" outlined rounded dense label="Texte"  :rules="textRules" v-model="text"></v-text-field>
              </v-form>
            </div>
            <!-- Zone de d'actions -->
            <v-card-actions>
              <v-btn title="Lien vers Giphy" href="https://giphy.com/" target="_blank" text color="#283a57" class="mr-3">Chercher un GIF</v-btn>
              <!-- Import du composant GifManual -->
              <GifManual/>
              <v-spacer></v-spacer>
              <v-btn title="Poster un gif" text dark color="#d1515a" @click="addPost">POSTER</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <!-- Import du composant Postslist -->
      <PostsList/>
      <!-- Bouton backToTop -->
      <v-btn title="Retour en haut de la page" class="mx-2 back-to-top" fab dark color="#324673" v-if="this.scrollY >= 200" @click="backToTop">
        <v-icon dark>mdi-chevron-up</v-icon>
      </v-btn>
    </v-container>
    <!-- Message de confirmation -->
    <v-snackbar v-model="snackbar" :timeout="timeout" :color="snackbarColor" class="overline">
      {{ snackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn title="Fermer" color="white" text v-bind="attrs" @click="snackbar = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import PostsList from '../components/PostsList.vue'
import GifManual from '../components/GifManual.vue'
import { mapState, mapActions } from 'vuex'

  export default {
    name: 'Forum',
    components: { PostsList, GifManual },
    data: () => ({
      userToken: localStorage.getItem('userToken'),
      gifUrl: '',
      text: '',
      valid: false,
      gifUrlRules: [],
      textRules: [v => v.length <= 200 || 'Max 200 characters'],
      scrollY: 0,
      snackbar: false,
      snackbarText: '',
      snackbarColor: '',
      timeout: 4000,
    }),

    beforeCreate() {
      const ls = localStorage.getItem('userToken')
      if(ls == null ||ls == undefined) {
        this.$router.push({path: '/'})
      }
    },
    
    created () {
      this.getAllPosts()
      this.getAllComments()
      window.addEventListener('scroll', this.getScroll)
    },

    computed: {
    ...mapState(['userData', 'posts', 'comments']),
    },

    methods: {
      ...mapActions(['getAllPosts', 'getAllComments']),
      // Création de post
      addPost () {
        this.snackbar = true
        if(this.$refs.form.validate()) {
          const createPost = {
          gifUrl: this.gifUrl,
          text: this.text,
          }

          fetch('http://localhost:3000/api/post', {
          method: 'POST',
          headers: {'Content-Type': 'application/json' , 'Authorization': 'Bearer ' + this.userToken },
          body: JSON.stringify(createPost)
          })
          .then(response => response.json())
          .then(post => {
            console.log(post)
            if(post.error) {
              this.snackbarText = 'Echec du post'
              this.snackbarColor = 'red darken-4'
            } else {
              this.snackbarText = 'Post ajouté avec succès'
              this.snackbarColor = 'green darken-3'
            }
          })
          .then(() => this.getAllPosts())
          .catch(error => console.error(error));

          this.gifUrl = '';
          this.text = '';
          this.resetGifRules()
        }
      },
      // Application des regles de formulaire
      setGifRules(){
        this.gifUrlRules = [v => /^https:\/\/media\.giphy\.com\/media\/.*/.test(v) || 'Le lien doit provenir de Giphy']
      },
      // Reset des regles de formulaire
      resetGifRules(){
        this.gifUrlRules = []
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
  .back-to-top {
    position: fixed;
    bottom: 20px;
    right: 20px;

    @media screen and (max-width: 610px) {
      display: none;
    }
  }
</style>
