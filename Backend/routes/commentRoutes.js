// Import des packages
const express = require('express');
// Création d'un router
const router = express.Router();
// Import des middlewares
const auth = require('../middleware/auth');
// Import du controller comment
const commentCtrl = require('../controllers/commentCtrl');

// On crée les routes relatives aux comments
router.post('/:postId', auth, commentCtrl.createComment);
router.get('/', auth, commentCtrl.getAllComments);
router.delete('/:commentId', auth, commentCtrl.deleteComment);

// On export le router
module.exports = router;