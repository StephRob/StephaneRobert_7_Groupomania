<template>
  <v-row>
    <v-col sm="8" offset-sm="2" md="6" offset-md="3" xl="4" offset-xl="4"
      v-for="(post, i) in posts" :key="'B'+ i">
      <v-card elevation="2">
        <!-- Card header -->
        <v-list-item>
          <!-- Avatar -->
          <v-list-item-avatar size="40" color="grey" rounded="true" class="mr-0" >
            <v-img  v-if="post.user.avatar !== null" contain :src="post.user.avatar"></v-img>
            <v-img contain v-else src="../../public/images/profil/icon.png"></v-img>
          </v-list-item-avatar>
          <!-- Name -->

            <v-card-title class="post-username">
              {{ post.user.firstname }} {{ post.user.lastname }} 
              <br> 
              <v-card-subtitle class="datetime mb-0 pa-0 grey--text text--darken-2">{{ postDateFormat(post.createdAt) }}</v-card-subtitle>
            </v-card-title>
          <v-spacer></v-spacer>
          <!-- Option suppression  -->
          <v-menu bottom left v-if="userData.isAdmin == true || post.userId === userData.id">
            <template v-slot:activator="{ on, attrs }">
              <v-btn title="Option" icon v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-btn title="Supprimer le post" dark color="#d1515a" @click="deletePost(i)">Supprimer</v-btn>
          </v-menu>
        </v-list-item>
        <!-- Text du post -->
        <p class="px-4 mb-2" v-if="post.text !== ''">{{ post.text }}</p>
        <!-- Gif du post -->
        <v-img :src="post.gifUrl" max-height="350" class="white--text align-end"></v-img>

        <!-- Zone ouverture commentaires -->
        <v-card-actions>
          <v-card-title text class="overline py-0" v-if="filterCommentsByPost(post).length > 1">
            {{ filterCommentsByPost(post).length }} Commentaires
          </v-card-title>
          <v-card-title text class="overline py-0" v-else>
            {{filterCommentsByPost(post).length }} Commentaire
          </v-card-title>
          <v-spacer></v-spacer>
        </v-card-actions>
        <!-- Zone commentaires -->
        <v-expand-transition>
          <div v-if="show">
            <v-divider></v-divider>
            <!-- Zone écriture des commentaires -->
            <v-card-actions class="align-center">
              <v-avatar size="36" class="mr-3">
                <v-img v-if="userData.avatar !== null " contain :src="userData.avatar"></v-img>
                <v-img v-else contain src="../../public/images/profil/icon.png"></v-img>
              </v-avatar>
              <!-- Input -->
              <v-textarea label="Votre commentaire" auto-grow outlined hide-details dense rounded rows="1" row-height="20" 
                v-model="posts[i].comment">
              </v-textarea>
              <!-- Bouton d'envoi -->
              <v-btn title="Envoyer le commentaire" large icon @click="createComment(i)">
                <v-icon>mdi-send</v-icon>
              </v-btn>
            </v-card-actions>

            <v-divider></v-divider>
            <!-- Zone affichage des commentaires -->
            <v-card-actions v-if="filterCommentsByPost(post).length > 0" class="comment-area grey lighten-3 align-start d-flex flex-column">
              <!-- Commentaire -->
              <v-card shaped v-for="(comment, i) in filterCommentsByPost(post)" :key="'E'+i" class="mb-3 d-flex align-center">
                <!-- Avatar -->
                <v-avatar size="30" class="ma-2">
                  <v-img contain v-if="comment.user.avatar !== null" :src="comment.user.avatar"></v-img>
                  <v-img contain v-else src="../../public/images/profil/icon.png"></v-img>
                </v-avatar>
                <div class="mr-1">
                  <!-- Nom du propriétaire -->
                  <v-card-subtitle v-if="comment.userId === userData.id" class="comment-are__username font-weight-medium pl-1 pt-2 pb-0 pr-3 grey--text text--darken-1">Moi <span class="font-weight-light">{{ commentDateFormat(comment.createdAt) }}</span></v-card-subtitle>
                  <v-card-subtitle v-else class="comment-username font-weight-medium pl-1 pt-2 pb-0 pr-3 grey--text text--darken-1">
                    {{ comment.user.firstname }} {{ comment.user.lastname }} <span class="font-weight-light">{{ commentDateFormat(comment.createdAt) }}</span>
                  </v-card-subtitle>
                  <!-- Text du commentaire -->
                  <v-card-text class="pa-1 pt-0 pb-2 pr-3 mb-0 black--text">{{ comment.comment }}</v-card-text>
                  <!--<v-card-subtitle class="datetime mb-0 pa-0 grey--text text--darken-2">{{ commentDateFormat(comment.createdAt) }}</v-card-subtitle>-->
                </div >
                <!-- Option de suppression -->
                <v-menu bottom left v-if="userData.isAdmin == true || comment.userId === userData.id">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn title="Option" icon v-bind="attrs" v-on="on">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-btn title="Supprimer le commentaire" dark color="#d1515a" @click="deleteComment(filterCommentsByPost(post)[i].id)"><v-icon>mdi-delete</v-icon></v-btn>
                </v-menu>
              </v-card>
            </v-card-actions>
          </div>
        </v-expand-transition>
      </v-card>
    </v-col>
    <!-- Message de confirmation -->
    <v-snackbar v-model="snackbar" :timeout="timeout" :color="snackbarColor" class="overline">
      {{ snackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn title="Fermer" color="white" text v-bind="attrs" @click="snackbar = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-row>
</template>

<script>
import axios from 'axios'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'PostsList',
  data: () => ({
    show: true,
    snackbar: false,
    snackbarText: '',
    snackbarColor: '',
    timeout: 3000,
  }),

  computed: {
    ...mapState(['userData', 'userToken', 'posts', 'comments']),
    
  },

  methods: {
    ...mapActions(['getAllComments', 'getAllPosts']),

    postDateFormat(timestamp) {
      const d = new Date(timestamp)
      let mounth = d.getMonth() + 1
      let hours = d.getHours()
      let minutes = d.getMinutes()
      switch (mounth) {
        case 7: mounth = 'juillet'; break;
        case 8: mounth = 'août'; break;
        case 9: mounth = 'septembre'; break;
        case 10: mounth = 'octobre'; break;
      }

      if(hours < 10) {
        hours = '0' + hours
      }

      if(minutes < 10) {
        minutes = '0' + minutes
      }
      const date =`le ${d.getDate()} ${mounth} à ${hours}h${minutes}`
      return date
    },

    commentDateFormat(timestamp) {
      const d = new Date(timestamp)
      let mounth = d.getMonth() + 1
      let hours = d.getHours()
      let minutes = d.getMinutes()

      if(mounth < 10) {
        mounth = '0' + mounth
      }

      if(hours < 10) {
        hours = '0' + hours
      }

      if(minutes < 10) {
        minutes = '0' + minutes
      }
      const date =`le ${d.getDate()}/${mounth} à ${hours}h${minutes}`
      return date
    },



    filterCommentsByPost(post) {
      return this.comments.filter(comment => comment.postId === post.id)
    },

    // Suppression de post
    deletePost(i){
      this.snackbar = true
      axios.delete('http://localhost:3000/api/post/' + this.posts[i].id, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.userToken
      }
      })
      .then(response => {
        if (response.status == 201) {
          this.snackbarText = 'Post supprimé avec succès'
          this.snackbarColor = 'green darken-3'
          this.getAllPosts()
        } else {
          this.snackbarText = 'Echec de la suppression du post'
          this.snackbarColor = 'red darken-4'
        }
      })
      .catch(error => console.log(error))
    },

    showComment(i) {
      this.posts[i].show = !this.posts[i].show
    },

    // Création de commentaire
    createComment(i) {
      if(this.posts[i].comment !== '') {
        const createComment = {
        comment: this.posts[i].comment,
      }
        fetch('http://localhost:3000/api/comment/' + this.posts[i].id, {
        method: 'POST',
        headers: {'Content-Type': 'application/json' , 'Authorization': 'Bearer ' + this.userToken },
        body: JSON.stringify(createComment)
        })
        .then(response => {
          if (response.status == 200) {
            this.getAllComments()
          }
        })
        .catch(error => console.error(error));
        }
      
      this.posts[i].comment = '';
    },

    // Suppression de commentaire
    deleteComment(commentId){
      this.snackbar = true
      axios.delete('http://localhost:3000/api/comment/' + commentId, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.userToken
      }
      })
      .then(response => {
        if (response.status == 201) {
          this.snackbarText = 'Commentaire supprimé avec succès'
          this.snackbarColor = 'green darken-3'
          this.getAllComments()
        } else {
          this.snackbarText = 'Echec de la suppression du commentaire'
          this.snackbarColor = 'red darken-4'
        }
      })
      .catch(error => console.log(error))
    },

  }
}
</script>

<style lang="scss" scoped>
  .post-username {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #324673;
  }

  .datetime {
    line-height: 1;
  }

  .comment-area {
    max-height: 300px;
    overflow-y: auto;

    &__comment-username {
    line-height: 1;
    }
  }
</style>
