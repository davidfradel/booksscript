# BooksScript

BooksScript est un outil de script pour ajouter automatiquement des livres à partir d'un dossier de livres numérisés à une base de données MongoDB via une API REST. 

Ce script est conçu pour fonctionner avec le projet Scriptura, qui comprend des services express-server et fastify-server pour gérer une collection de livres numériques.

## Prérequis
 - Node.js (version recommandée: 16.x)
 - Un dossier ebook contenant des livres numérisés avec des métadonnées et des fichiers texte pour les pages
- Accès à une instance MongoDB en cours d'exécution
- Accès à l'API du projet scriptura en cours d'exécution

## Installation

Clonez le dépôt Git du projet scriptura :

```bash
git clone git@github.com:davidfradel/scriptura.git
cd scriptura
```

Assurez-vous que les services express-server et fastify-server sont en cours d'exécution, soit localement soit via Docker.

## Configuration

Avant d'exécuter le script, assurez-vous que l'URL de l'API dans le script index.js correspond à l'URL de votre serveur scriptura. Par défaut, l'URL est configurée pour http://localhost:3000/books.

Si nécessaire, modifiez la variable apiUrl dans le script pour qu'elle corresponde à l'URL de votre serveur :
```javascript
const apiUrl = 'http://localhost:3000/books'; 
// Remplacez par l'URL de votre serveur
```

## Utilisation

Pour exécuter le script, naviguez vers le répertoire booksscript et lancez le script avec Node.js :

```bash
cd chemin/vers/booksscript
node index.js
```

#### Le script effectuera les actions suivantes :
- Récupérer les identifiants de tous les livres existants dans la base de données via l'API.
- Supprimer chaque livre en utilisant son identifiant.
- Créer un nouveau livre à partir des informations trouvées dans le dossier ebook.

