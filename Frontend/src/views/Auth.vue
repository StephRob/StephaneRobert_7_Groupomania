<template>
  <div class="auth">
    <!-- Titre -->
    <h1 class="text-center font-weight-regular">Bienvenue sur Groupomania</h1>
    <v-container class="my-5">
      <v-row>
        <!-- Formulaire -->
        <v-col cols="12" md="6" offset-md="3" class="edit-form">
          <v-card elevation="6">
            <v-form ref="form" v-model="valid" lazy-validation class="pa-5">
              <!-- Titre du formulaire Connexion/Inscription -->
              <v-card-title class="justify-center" v-if="mode === 'login'">Connexion</v-card-title>
              <v-card-title class="justify-center" v-else>Inscription</v-card-title>
              <!-- Bouton switch -->
              <v-card-actions class="d-flex justify-center mb-3 subtitle-1 text-center flex-column flex-lg-row" v-if="mode === 'login'">Tu n'as pas encore de compte ? 
                <v-btn color="#d1515a" small text class="ml-2" @click="switchToCreateAccount()">Créer un compte</v-btn>
              </v-card-actions>
              <v-card-actions class="d-flex justify-center mb-3 subtitle-1  text-center align-center flex-column flex-lg-row" v-if="mode === 'create'">Tu as déjà un compte ? 
                <v-btn color="#d1515a" small text class="ml-2" @click="switchToLogin()">Se connecter</v-btn>
              </v-card-actions>
              <!-- Champ email -->
              <v-text-field type="email" dense outlined rounded :rules="emailRules" label="Email" v-model="email" required></v-text-field>
              <!-- Champ firstname -->
              <v-text-field type="text" dense outlined rounded :rules="firstnameRules" label="Prénom" v-model="firstname" required v-if="mode === 'create'"></v-text-field>
              <!-- Champ lastname -->
              <v-text-field type="text" dense outlined rounded :rules="lastnameRules" label="Nom" v-model="lastname" required v-if="mode === 'create'"></v-text-field>
              <!-- Champ password -->
              <v-text-field dense outlined rounded :rules="passwordRules" label="Mot de passe" v-model="password" required
                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'" :type="show ? 'text' : 'password'"  @click:append="show = !show">
              </v-text-field>
              <!-- Bouton Connexion/Inscription -->
              <v-btn rounded block dark color="#2A3B61" class="mr-4" v-if="mode === 'login'" @click="login">Connexion</v-btn>
              <v-btn rounded block dark color="#2A3B61" class="mr-4" v-else @click="createAccount()">Inscription</v-btn>
            </v-form>
            <!-- Message confirmation -->
          <v-card-text color="#d1515a" class="account-status text-overline py-0 text-center"></v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>

export default {
  name: 'Auth',
  data: () => ({
    email: '',
    firstname: '',
    lastname: '',
    password:'',
    mode: 'login',
    show: false,
    valid: false,
    emailRules: [
      v => !!v || 'E-mail requis',
      v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail doit être valide',
    ],
    firstnameRules: [
      v => !!v || 'Prénom requis',
    ],
    lastnameRules: [
      v => !!v || 'Nom requis',
    ],
    passwordRules: [
      v => !!v || 'Mot de passe requis',
      v => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*^[^=']+$).{8,}$/g.test(v) || 'Le mot de passe doit faire au moins 8 caractères et contenir au moins 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère special',
    ],
  }),

  created() {
      const ls = localStorage.getItem('userToken')
      if(ls) {
        this.$router.push({path: '/forum'})
      }
  },

  methods: {
    // switch mode create
    switchToCreateAccount () {
      this.mode = 'create',
      this.email = '',
      this.password = ''
      document.querySelector('.account-status').textContent = ""
    },
    // switch mode login
    switchToLogin () {
      this.mode = 'login'
      this.firstname = '',
      this.lastname = '',
      this.password = ''
      document.querySelector('.account-status').textContent = ""
    },
    // Crétaion du compte
    createAccount() {
      let accountStatus = document.querySelector('.account-status')
      if(this.$refs.form.validate()) {
        const createUserForm = {
          email: this.email,
          firstname: this.firstname,
          lastname: this.lastname,
          password: this.password,
        }

        fetch('http://localhost:3000/api/auth/signup', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(createUserForm)
        })
        .then(response => response.json())
        .then(user => {
          if(user.error == 'user already exist') {
            accountStatus.classList.remove("green")
            accountStatus.classList.add("red")
            accountStatus.textContent = "ce compte existe déjà"
          } else {
            accountStatus.classList.remove("red")
            accountStatus.classList.add("green")
            accountStatus.textContent = "Compte créé"
            setTimeout(() => {
              this.login()
            }, 2000)
          }
        })
        .catch(error => console.error(error));
      }
    },
    // Login
    login() {
      let accountStatus = document.querySelector('.account-status')

      if(this.$refs.form.validate()) {
        const loginUserForm = {
          email: this.email,
          password: this.password,
        }

        fetch('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: {'Content-Type': 'application/json; charset=utf-8'},
          body: JSON.stringify(loginUserForm)
        })
        .then(response => response.json())
        .then(user => {
          if (user.error == 'user not exist in DB') {
            accountStatus.classList.remove("green")
            accountStatus.classList.add("red")
            accountStatus.textContent = "Compte non trouvé"
          }else if(user.error == 'invalid password !'){
            accountStatus.classList.remove("green")
            accountStatus.classList.add("red")
            accountStatus.textContent = "mot de passe incorrect"
          } else {
            accountStatus.classList.remove("red")
            accountStatus.classList.add("green")
            accountStatus.textContent = "connexion..."
            localStorage.setItem('userToken', user.token)
            setTimeout(() => {
              this.$router.push({path: '/forum'})
              document.location.reload()
            }, 2000)
          }
        })
        .catch(error => console.error(error));
      }
    }
  },
}
</script>
