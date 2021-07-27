<template>
  <div class="team">
    <h1 class="title grey--text text--darken-2">La team</h1>
    <v-container class="my-5">
      <v-row>
        <v-col cols="12" sm="6" md="4" lg="3" v-for="(user, i) in users" :key="'D'+ i">
          <!-- Card team -->
          <v-card elevation="2" class="text-center">
            <!-- Avatar -->
            <v-list-item-avatar size="100" rounded="true" class="mr-0" v-if="user.avatar !== null">
              <v-img v-if="user.avatar !== null" :src="user.avatar"></v-img>
              <v-img v-else src="../../public/images/profil/icon.png"></v-img>
            </v-list-item-avatar>
            <v-list-item two-line>
              <v-list-item-content>
                <!-- Fullname -->
                <v-list-item-title class="text-h5 mb-1">
                  {{ user.firstname }} {{ user.lastname }}
                </v-list-item-title>
                <!-- Email -->
                <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

  export default {
    name: 'Team',
    data: () => ({
      //
    }),

    created () {
      this.getAllUsers()
    },

    computed: {
    ...mapState(['users'])
    },

    methods: {
      ...mapActions(['getAllUsers'])
    }
  }
</script>