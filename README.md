# Event Score

Site web complet pour gérer un classement de streamers avec interface d’administration, overlay OBS et classement public en temps réel.

## Fonctionnalités
- Connexion administrateur avec Firebase Authentication
- Ajout, modification et suppression de streamers
- Contrôle du score avec boutons rapides et valeur personnalisée
- Reset du score
- Génération d’un lien OBS unique par streamer
- Overlay OBS avec fond transparent et police Shrikhand
- Classement public en temps réel

## Structure
- index.html : page de connexion administrateur
- dashboard.html : tableau de bord de gestion
- classement.html : classement public
- overlay.html : overlay OBS
- css/ : styles HTML/CSS
- js/ : logique Firebase et interactions

## Déploiement Netlify
1. Créer un projet Firebase et activer Authentication + Realtime Database.
2. Ajouter un utilisateur administrateur dans Firebase Authentication.
3. Publier le dépôt sur GitHub et connecter le repo à Netlify.
4. Déployer le site depuis la racine du projet.

Le site est prêt pour un déploiement statique sans étape de build supplémentaire.