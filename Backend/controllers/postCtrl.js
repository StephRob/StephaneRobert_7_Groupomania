// Imports
const jwt = require('jsonwebtoken');
const models = require('../models');

//Regex
const GIPHY_REGEX = /^https:\/\/media\.giphy\.com\/media\/.*/;

// Decryptage du token pour récuper le userId
function getUserId(req) {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
  const userId = decodedToken.userId;
  return userId
}

// Creation d'un post
exports.createPost = (req, res, next) => {
  // Params
  let gifUrl = req.body.gifUrl;
  let text = req.body.text;

  // Test champs vides
  if (gifUrl == null) {
    return res.status(400).json({error: 'missing parameters'})
  }
  // Test Gif expression
  if (!GIPHY_REGEX.test(gifUrl)) {
      return res.status(400).json({ error: 'giphy url is not valid' });
  }

  // On crée le post
  models.Post.create({
    gifUrl: gifUrl,
    text: text,
    userId: getUserId(req)
  })
  .then(newPost => res.status(201).json(newPost))
  .catch(() => res.status(500).json({error: 'cannot post newpost'}))
}

// Récupération des Posts
exports.getAllPosts = (req, res, next) => {
  // On recherche tous les posts par ordre décroissant d'id
  models.Post.findAll({
    order: [['id', 'DESC']],
    include: [
      {
      model: models.User,
      as: 'user',
      attributes: ['firstname', 'lastname', 'avatar']
      },
    ]
  })
  .then(allPosts => res.status(200).json(allPosts))
  .catch(error => res.status(500).json(error))
}

// Récupération de mes propres Posts
exports.getMyPosts = (req, res, next) => {
  // On recherche tous les posts par ordre décroissant d'id
  models.Post.findAll({
    where: {userId: getUserId(req)},
    order: [['id', 'DESC']],
    include: [
      {
      model: models.User,
      as: 'user',
      attributes: ['firstname', 'lastname', 'avatar']
      }
    ]
  })
  .then(allMyPosts => { res.status(200).json(allMyPosts)})
  .catch(error => res.status(500).json(error))
}

// Suppression d'un post
exports.deletePost = (req, res, next) => {
  // Params
  let postId = parseInt(req.params.postId)

  // Test si le post existe
  if (postId <= 0) {
    return res.status(400).json({error: 'invalid parameters'})
  }
  // On supprime les commentaires liés au pots
  models.Comment.destroy({
    where: { postId: postId },
    force: true
  })
  // On supprime le post
  models.Post.findOne({
    where: { id: postId }
  })
  .then(postFound => {
    postFound.destroy({
      force: true
    })
    .then(() => res.status(201).json('The post has been deleted successfully'))
    .catch(() => res.status(500).json({ error: 'unable to delete post' }))
  })
  .catch(() => res.status(500).json({error}))
}
