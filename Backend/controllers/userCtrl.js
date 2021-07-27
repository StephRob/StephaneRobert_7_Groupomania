// Imports
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const models = require('../models');

//Regex
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

// Decryptage du token pour récuper le userId
function getUserId(req) {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
  const userId = decodedToken.userId;
  return userId
}

// Creation d'un compte
exports.signup = (req, res, next) => {
  // Params
  let email = req.body.email;
  let firstname = req.body.firstname;
  let lastname = req.body.lastname;
  let password = req.body.password;
  let avatar = req.body.avatar;

  // Test champs vides
  if (email === '' || firstname === '' || lastname === '' || password === '') {
    return res.status(400).json({error: 'missing parameters'})
  }
  // Test nombre de lettre champ firstname
  if (firstname.length <= 1) {
    return res.status(400).json({ error: 'firstname must be longer'})
  }
  // Test nombre de lettre champ lastname
  if (lastname.length <= 1) {
    return res.status(400).json({ error: 'lastname must be longer'})
  }
  // Test email expression
  if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: 'email is not valid' });
  }
  // Test password expression
  if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({ 'error': 'password invalid (must length 8 minimum and include 1 number 1 uppercase at least)' });
    }

  // Recherche si email existe
  models.User.findOne({
    attributes: ['email'],
    where: {email: email}
  })
    .then(userFound => {
    // Si email existe n'existe pas
      if (!userFound) {
      // Création du compte en cryptant le mdp
      bcrypt.hash(password, 10, function (err, bcryptedPassword) {
        const newUser = models.User.create({
          email: email,
          firstname: firstname,
          lastname: lastname,
          password: bcryptedPassword,
          avatar: avatar,
          isAdmin: 0
        })
        .then(newUser => { return res.status(201).json({'Utilisateur créer, id': newUser.id})})
        .catch(() => { return res.status(500).json({ 'error': 'cannot add user'})})
      })
    } else {
      return res.status(409).json({ 'error': 'user already exist'})
    }
  })
    .catch(() => {
    return res.status(500).json({ 'error': 'unable to verify user'})
  })
};

// Connexion
exports.login = (req, res, next) => {
  // Params
  let email = req.body.email;
  let password = req.body.password;

  // Test champs vides
  if (email === '' || password === '') {
    return res.status(400).json({error: 'missing parameters'})
  }

  // Recherche si le mail existe
  models.User.findOne({
    where: {email: email}
  })
  .then(userFound => {
    // Si le mail existe on compare le mdp 
    if (userFound) {
      bcrypt.compare(password, userFound.password, function (errBycrypt, resBycrypt) {
        // Si le mdp correct on crée le Token
        if (resBycrypt) {
          res.status(200).json({
          userId: userFound.id,
            token: jwt.sign(
              {userId: userFound.id},
              'RANDOM_TOKEN_SECRET',
              { expiresIn: '24h' }
            )
          });
        } else {
          return res.status(401).json({ error: 'invalid password !' });
        }
      })
    } else {
      return res.status(401).json({ error: 'user not exist in DB'})
    }
  })
  .catch(() => { res.status(500).json({ 'error': 'unable to verify user'})})
};

// Récupération des infos utilisateur
exports.getUserData = (req, res, next) => {
  // Recherche des infos par l'id
  models.User.findOne({
    attributes: ['id', 'email', 'firstname', 'lastname', 'avatar', 'isAdmin'],
    where: { id: getUserId(req) }
  }).then(user => { // Si utilisateur trouvé
      if(user) {
        return res.status(201).json(user);
      } else {
        return res.status(404).json({ error: 'user not found' });
      }
    })
    .catch(() => res.status(500).json({ error: 'cannot fetch user' }));
}

// Récupération des infos des utilisateurs
exports.getAllUsers = (req, res, next) => {
  models.User.findAll({
    order: [['id', 'ASC']],
    attributes: ['id', 'email', 'firstname', 'lastname', 'avatar', 'isAdmin']
  })
  .then(allUsers => res.status(200).json(allUsers))
  .catch(error => res.status(500).json(error))
}

// Modification utilisateur
exports.updateUserData = (req, res, next) => {
  // Params
  let avatarFile = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;

  // Recherche de l'utilisteur par son id
  models.User.findOne({
    attributes: ['id', 'avatar'],
    where: { id: getUserId(req)}
  })
  .then(userFound => {
    // On verifie si l'utilsateur à un avatar
    if (userFound.avatar !== null) {
      const userFoundAvatar = userFound.avatar.split('/images/')[1];
      fs.unlink('images/' + userFoundAvatar, () => {});
    }
    // On met à jour l'utilisateur
    userFound.update({
      avatar: avatarFile
    })
    .then(() => res.status(200).json({message: 'avatar updated'}))
    .catch((error) => res.status(500).json({ error, error: 'cannot update user'}))
  })
  .catch(() => res.status(500).json({ error: 'unable to verify user' }));
}

// Suppression de compte
exports.deleteUser = (req, res, next) => {
  // On supprime les commentaires liés à l'utilisateur
  models.Comment.destroy({
    where: { userId: getUserId(req) },
    force: true
  })
  // On supprime les posts liés à l'utilisateur
  models.Post.destroy({
    where: { userId: getUserId(req) },
    force: true
  })

  models.User.findOne({
    where: {id: getUserId(req)}
  })
  .then(userFound => {
    if (userFound.avatar !== null) {
        const userFoundAvatar = userFound.avatar.split('/images/')[1];
      fs.unlink('images/' + userFoundAvatar, () => {})
    }
    userFound.destroy({
      where: {id: getUserId(req)},
      force: true
    })
    .then(() => res.status(200).json('The user has been deleted successfully'))
    .catch(() => res.status(500).json({ error: 'unable to delete user' }))
  })
  .catch(error => res.status(500).json({ error}))
}
