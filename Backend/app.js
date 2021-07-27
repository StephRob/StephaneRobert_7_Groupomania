// Import des packages
const express = require('express');
const helmet = require("helmet");
const bodyParser = require('body-parser');
const path = require('path');

// Import des routeurs
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');

// Création de l'application express
const app = express();

// Ajout des headers sur l'objet reponse pour autoriser la communication entre le serveurs
// Gestion CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json());

// Utilisation du middleware Helmet protéger les cookies
app.use(helmet());

// Gestionnaire de routage pour les images
app.use('/images', express.static(path.join(__dirname, 'images')));

// On associe les routes aux routers correspondant
app.use('/api/auth', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);

// Export de l'application express
module.exports = app;