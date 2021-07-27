// Import des packages
const express = require('express');
// Création d'un router
const router = express.Router();
// Import des middlewares
const auth = require('../middleware/auth');
// Import du controller post
const postCtrl = require('../controllers/postCtrl');

// On crée les routes relatives aux posts
router.post('/', auth, postCtrl.createPost);
router.get('/', auth, postCtrl.getAllPosts);
router.get('/my-posts', auth, postCtrl.getMyPosts);
router.delete('/:postId', auth, postCtrl.deletePost);

// On export le router
module.exports = router;