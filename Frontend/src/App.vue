<template>
  <v-app class="app">
    <Navbar/>
    <v-main class="ma-4">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import Navbar from './components/Navbar.vue';

export default {
  name: 'App',
  components: { Navbar },
};
</script>

<style lang="scss" scoped>
.app {
  background-color: #e3e8f3 !important;
}
</style>
