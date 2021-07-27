import Vue from 'vue'
import VueRouter from 'vue-router'
import Forum from '../views/Forum.vue'
import Profil from '../views/Profil.vue'
import Team from '../views/Team.vue'
import Auth from '../views/Auth.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Auth',
    component: Auth
  },
  {
    path: '/forum',
    name: 'Forum',
    component: Forum
  },
  {
    path: '/profil',
    name: 'Profil',
    component: Profil
  },
  {
    path: '/team',
    name: 'Team',
    component: Team
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
