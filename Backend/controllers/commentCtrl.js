// Imports
const jwt = require('jsonwebtoken');
const models = require('../models');

// Decryptage du token pour récuper le userId
function getUserId(req) {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
  const userId = decodedToken.userId;
  return userId
}

// Creation d'un commentaire
exports.createComment = (req, res, next) => {
  // Params
  let comment = req.body.comment;
  let postId = parseInt(req.params.postId)

  // Test champs vides
  if (comment == null) {
    return res.status(400).json({error: 'missing parameters'})
  }
  // Test si le userId est valid
  if (postId <= 0) {
    return res.status(400).json({error: 'invalid parameters'})
  }

  // Recherche du Post
  models.Post.findOne({
    where: { id: postId }
  })
  .then(postFound => {
    if (postFound) { // Si Post trouvé on crée le comment
      models.Comment.create({
        userId: getUserId(req),
        postId: postFound.id,
        comment: comment
      })
      .then(newComment => {
        return res.status(200).json(newComment)
      })
      .catch(() => res.status(500).json({ 'error': 'cannot add comment'}))
    } else {
      return res.status(400).json({error : 'post not found'})
    }
  })
  .catch(() => res.status(500).json({error: 'unable to verify post'}))
}

// Récupération de tous les Commentaires
exports.getAllComments = (req, res, next) => {
  // Recherche des commentaires
  models.Comment.findAll({
    attributes: ['id', 'comment', 'postId', 'userId', 'createdAt'],
    order: [['id', 'DESC']],
    include: [
      {
      model: models.User,
      as: 'user',
      attributes: ['firstname', 'lastname', 'avatar']
      },
    ],
  })
  .then(allComments => {
    if (allComments) {
      res.status(200).json(allComments);
    } else {
      res.status(404).json({error: 'no comments found'})
    }
  })
  .catch(error => res.status(500).json(error))
}

// Suppression d'un commentaire
exports.deleteComment = (req, res, next) => {
  // Params
  let commentId = parseInt(req.params.commentId)
  // On supprime le commentaire
  models.Comment.destroy({
    where: { id: commentId },
    force: true
  })
  .then(() => res.status(201).json('comment deleted'))
  .catch(() => res.status(500).json({ error: 'unable to delete comment' }))
}
