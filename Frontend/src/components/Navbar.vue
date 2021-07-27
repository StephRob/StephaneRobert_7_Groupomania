<template>
  <nav>
    <!-- Navbar -->
    <v-app-bar app color="white">
      <v-app-bar-nav-icon title="Ouvrir ou fermer la colonne de gauche" @click="drawer = !drawer" v-if="this.$route.path !== '/'"></v-app-bar-nav-icon>
      <v-app-bar-title class="mx-auto pl-0">
        <v-img contain max-height="200" max-width="200" src="../../public/images/logo/icon-left-font-monochrome-black.png"></v-img>
      </v-app-bar-title>
    </v-app-bar>
    <!-- Navbar Aside -->
    <v-navigation-drawer v-model="drawer" app dark color="#2A3B61" class="navigation-drawer" v-if="this.$route.path !== '/'">
    <!-- User zone -->
      <v-list color="#324673">
        <!-- Avatar -->
        <v-list-item class="justify-center">
          <v-list-item-avatar size="128" class="mr-0" >
            <v-img v-if="userData.avatar !== null" :src="userData.avatar"></v-img>
            <v-img v-else src="../../public/images/profil/icon.png"></v-img>
          </v-list-item-avatar>
        </v-list-item>
        <!-- Name -->
        <v-list-item  class="text-center">
          <v-list-item-content>
            <v-list-item-title class="text-h6">
              {{ userData.firstname}} {{ userData.lastname }}
            </v-list-item-title>
            <v-list-item-subtitle v-if="userData.isAdmin == true">Administrateur</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>
      <!-- Onglet -->
      <v-list nav dense rounded>
        <v-list-item-group v-model="selectedItem" color="pink lighten-3">
          <!-- Onglet actifs -->
          <v-list-item v-for="(item, i) in items" :key="i" router :to="item.route">
            <!-- Icon -->
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <!-- Text -->
            <v-list-item-content>
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <!-- Onglet inactifs -->
          <v-list-item v-for="(item, i) in itemsBeta" :key="'A'+ i" router disabled>
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <!-- Bouton deconnexion -->
      <v-btn title="Se déconnecter" text class="logout-btn mb-1" @click="logout">
        <span class="logout">Se déconnecter</span>
        <v-icon right>mdi-exit-to-app</v-icon>
      </v-btn>
    </v-navigation-drawer>
  </nav>
</template>

<script>
import { mapState, mapActions} from 'vuex'

export default {
  name: 'Navbar',
  data: () => ({
    drawer: true,
    selectedItem: 0,
    items: [
      { text: 'Forum', icon: 'mdi-post', route: '/forum' },
      { text: 'Mon profil', icon: 'mdi-account', route: '/profil' },
      { text: 'La team', icon: 'mdi-account-group', route: '/team' },
    ],
    itemsBeta: [
      { text: 'Groupes de discussion', icon: 'mdi-forum'},
      { text: 'Team building', icon: 'mdi-office-building'},
    ],
  }),

  beforeCreate() {
    const ls = localStorage.getItem('userToken')
    if(ls == null ||ls == undefined) {
      this.$router.push({path: '/'})
    }
  },

  created() {
    this.getUserData()
  },

  computed: {
    ...mapState(['userData', 'userToken'])
  },

  methods: {
    ...mapActions(['getUserData', 'logoutSession']),

    logout() {
      document.querySelector('.logout').textContent = "deconnexion..."
      setTimeout(() => {
        this.logoutSession()
        this.$router.push({path: '/'})
      }, 2000)
    }
  }
}
</script>

<style lang="scss" scoped>
.logout-btn {
    position: absolute;
    bottom: 0;
    width: 100%;
  }
</style>
