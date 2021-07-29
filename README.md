# Projet : Groupomania

Projet 7 du parcours Développeur Web d'OpenClassrooms

Groupomania est une entreprise spécialisée dans la grande distribution qui souhaite construire un réseau social interne pour ses employés.

## Mission

- Réaliser le frontend 
- Réaliser le backend et l'API de l'application en respectant de sécurités

### Exigences:

- la présentation des fonctionnalités doit être simple
- la création d’un compte doit être simple et possible depuis un téléphone mobile
- le profil doit contenir très peu d’informations pour que sa complétion soit rapide
- la suppression du compte doit être possible
- l’accès à un forum où les salariés publient des contenus multimédias doit être présent
- l’accès à un forum où les salariés publient des textes doit être présent
- les utilisateurs doivent pouvoir facilement repérer les dernières participations des employés
- le ou la chargé-e de communication Groupomania doit pouvoir modérer les interactions entre le ou la chargé-e de communication Groupomania doit pouvoir afficher les dernières participations des employés salariés

## Technologies utilisées

JavaScript, NodeJs, ExpressJs, MySQL, Sequelize, VueJs, Vuetify

## Compétences évaluées

- Personnaliser le contenu envoyé à un client web
- Authentifier un utilisateur et maintenir sa session
- Gérer un stockage de données à l'aide de SQL
- Implémenter un stockage de données sécurisé en utilisant SQL

## Prérequis pour ce projet

Vous devrez avoir Node et `npm` installés localement sur votre machine.

### Installation

Clonez ce repo.
- exécutez `npm install`

### Backend
À partir du dossier du projet:
- exécutez cd Backend/
- exécutez `nodemon server`

#### Base de données
À partir du dossier config:
- Renomer le fichier `config-sample.json` en `config.json`
- Dans `config.json` remplir les champs avec vos propres informations:
   - "username": "",
   - "password": "",
   - "database": "",
   - "host": "localhost"
- Ensuite dans la console toujours depuis Backend/ :
   - exécutez: `sequelize db:create`
   - exécutez: `sequelize db:migrate`
- Pour créer un administrateur: 
   - créez un utilisateur ou utiliser un utilisateur déjà créé
   - via mySQL tapez la commande : UPDATE users SET isAdmin = 1 WHERE id = `?`;
   - `?` = l'id de l'utilisateur à passer en tant qu'administrateur

### Frontend
À partir du dossier du projet:
- exécutez cd Frontend/
- exécutez `npm run serve`

Puis se rendre sur: http://localhost:8080/
## Auteur

Stéphane ROBERT, développeur web en formation chez [OpenClassrooms](https://openclassrooms.com/)

[![forthebadge](http://forthebadge.com/images/badges/built-with-love.svg)](http://forthebadge.com)

[![Generic badge](https://img.shields.io/badge/STATUS-PENDING-orange)](https://shields.io/)
