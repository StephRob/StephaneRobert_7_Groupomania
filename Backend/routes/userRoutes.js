// Import des packages
const express = require('express');
// Création d'un router
const router = express.Router();
// Import des middlewares
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
// Import du controller user
const userCtrl = require('../controllers/userCtrl');

// On crée les routes relatives aux uers
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

router.get('/user', auth, userCtrl.getUserData);
router.get('/users', auth, userCtrl.getAllUsers);
router.put('/user', auth, multer, userCtrl.updateUserData);
router.delete('/user', auth, multer, userCtrl.deleteUser);

// On export le router
module.exports = router;