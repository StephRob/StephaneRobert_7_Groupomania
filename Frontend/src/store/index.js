import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userData: '',
    userToken: localStorage.getItem('userToken'),
    posts: '',
    users: '',
    comments: ''
  },

  mutations: {
    GET_USER(state, user) {
      state.userData = user
    },

    GET_ALL_USERS(state, users) {
      state.users = users
    },

    GET_ALL_POSTS(state, posts) {
      state.posts = posts
    },

    GET_MY_POSTS(state, posts) {
      state.posts = posts
    },

    GET_ALL_COMMENTS(state, comments) {
      state.comments = comments
    },

    LOGOUT(state, user) {
      state.userData = user
    },
  },

  actions: {
    getUserData(context) {
      axios.get('http://localhost:3000/api/auth/user', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + context.state.userToken
        }
      })
      .then(response => {
        context.commit('GET_USER', response.data)
      })
      .catch(error => console.log(error))
    },

    getAllUsers(context) {
      axios.get('http://localhost:3000/api/auth/users', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + context.state.userToken
        }
      })
      .then(response => {
        context.commit('GET_ALL_USERS', response.data)
      })
      .catch(error => console.error(error))
    },

    deleteUser(context) {
      axios.delete('http://localhost:3000/api/auth/user', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + context.state.userToken
        }
      })
      .then(response => {
        if (response.status == 200) {
          localStorage.removeItem('userToken')
          window.location.reload()
        }
      })
      .catch(error => console.log(error))
    },

    getAllPosts(context) {
      axios.get('http://localhost:3000/api/post', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + context.state.userToken
        }
      })
      .then(response => {
        context.commit('GET_ALL_POSTS', response.data)
      })
      .catch(error => console.error(error))
    },

    getMyPosts(context) {
      axios.get('http://localhost:3000/api/post/my-posts', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + context.state.userToken
        }
      })
      .then(response => {
        context.commit('GET_MY_POSTS', response.data)
      })
      .catch(error => console.error(error))
    },

    getAllComments(context) {
      axios.get('http://localhost:3000/api/comment', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + context.state.userToken
        }
      })
      .then(response => {
        context.commit('GET_ALL_COMMENTS', response.data)
      })
      .catch(error => console.error(error))
    },

    logoutSession(context) {
      context.commit('LOGOUT', context.state.userData = '')
      localStorage.removeItem('userToken')
    },
  }
})
