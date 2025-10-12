# ShopJS v2 - Backend API

Une API REST complète pour une application e-commerce développée avec Node.js, Express et MongoDB.

## Description

Cette API backend fournit toutes les fonctionnalités nécessaires pour une boutique en ligne moderne :

- Gestion des utilisateurs avec authentification sécurisée
- Catalogue de produits avec système de recherche
- Gestion des commandes et du panier
- Interface d'administration pour le suivi des commandes

## Technologies utilisées

- **Backend** : Node.js, Express.js
- **Base de données** : MongoDB avec Mongoose
- **Authentification** : JWT avec chiffrement sécurisé (crypto-js, uid2)
- **Configuration** : Variables d'environnement (dotenv)
- **Autres** : CORS pour l'intégration frontend

## Structure du projet

```
├── index.js                # Point d'entrée du serveur
├── models/                 # Modèles de données MongoDB
│   ├── User.js             # Modèle utilisateur
│   ├── Product.js          # Modèle produit
│   └── Order.js            # Modèle commande
├── routes/                 # Routes de l'API
│   ├── user.js             # Authentification utilisateur
│   ├── product.js          # Gestion des produits
│   └── order.js            # Gestion des commandes
├── middlewares/            # Middlewares de sécurité
│   ├── isAuthenticated.js  # Vérification de l'authentification
│   └── isAdmin.js          # Vérification des droits admin
├── assets/
│   └── products.json       # Données de produits pour l'initialisation
├── .env.example            # Template des variables d'environnement
└── .env                    # Variables d'environnement (local, ignoré par git)
```

## Installation et configuration

### Prérequis

- Node.js (v14 ou supérieur)
- MongoDB (local ou MongoDB Atlas)
- Yarn (recommandé) ou npm

### Installation

1. Clonez le dépôt

```bash
git clone <votre-repo>
cd Shopjsv2-Backend
```

2. Installez les dépendances

```bash
yarn install
```

3. Configurez les variables d'environnement

```bash
# Copiez le template
cp .env.example .env

# Éditez .env avec vos valeurs
vim .env
```

4. Démarrez le serveur

```bash
# Développement
yarn dev

# Production
yarn start
```

Le serveur démarre sur le port configuré dans `.env` (4000 par défaut).

## Configuration des variables d'environnement

### Fichier `.env` (développement local)

```bash
# Configuration de la base de données
MONGODB_URI=mongodb://localhost:27017/shopjsv2

# Configuration du serveur
PORT=4000
NODE_ENV=development
```

### Variables pour la production (Northflank)

```bash
# Dans l'interface Northflank, configurez :
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shopjsv2-backend
NODE_ENV=production
# PORT est géré automatiquement par Northflank
```

## Initialisation de la base de données

Pour peupler la base de données avec des produits de démonstration :

```bash
POST /create-db
```

Cette route supprime tous les produits existants et les remplace par les données du fichier `assets/products.json`.

## API en production

**URL de l'API déployée :** https://site--shopjsv2-backend-api--sf5bwjrkc9fw.code.run/

### Test rapide

```bash
# Vérification du statut
GET https://site--shopjsv2-backend-api--sf5bwjrkc9fw.code.run/

# Récupérer les produits
GET https://site--shopjsv2-backend-api--sf5bwjrkc9fw.code.run/products
```

## Scripts disponibles

```bash
# Démarrage en développement
yarn dev

# Démarrage en production
yarn start

# Tests (non configurés)
yarn test
```

## Documentation de l'API

### Route de bienvenue

#### Statut de l'API

```
GET /
```

**Réponse :**

```json
{
  "name": "🛒 ShopJS v2 - Backend API",
  "version": "1.0.0",
  "status": "✅ Running",
  "environment": "production",
  "endpoints": {
    "products": "/products",
    "auth": "/user/signup, /user/login",
    "orders": "/orders",
    "init": "POST /create-db"
  },
  "database": "Connected"
}
```

### Authentification

#### Inscription

```
POST /user/signup
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

#### Connexion

```
POST /user/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}
```

### Produits

#### Récupérer tous les produits

```
GET /products?search=terme_recherche
```

#### Récupérer un produit par ID

```
GET /products/:id
```

#### Initialiser la base de données

```
POST /create-db
```

### Commandes

> **Note** : Toutes les routes de commandes nécessitent une authentification (Bearer Token)

#### Créer une commande

```
POST /orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "products": [
    {
      "product": "product_id",
      "quantity": number
    }
  ],
  "address": "string",
  "price": number
}
```

#### Récupérer toutes les commandes (Admin uniquement)

```
GET /orders
Authorization: Bearer <admin_token>
```

#### Marquer une commande comme livrée (Admin uniquement)

```
PUT /orders/mark-delivered/:id
Authorization: Bearer <admin_token>
```

## Authentification et sécurité

- **Chiffrement des mots de passe** : SHA256 avec salt unique
- **Tokens JWT** : Génération automatique pour l'authentification
- **Middlewares de sécurité** : Vérification d'authentification et de droits admin
- **CORS** : Configuré pour permettre les requêtes cross-origin

## Modèles de données

### User

- `username` : Nom d'utilisateur
- `email` : Adresse email (unique)
- `token` : Token d'authentification
- `admin` : Droits administrateur (booléen)
- `hash` / `salt` : Données de chiffrement du mot de passe

### Product

- Informations complètes du produit (titre, description, prix, etc.)
- Images et miniatures
- Système de reviews et ratings
- Informations logistiques (stock, expédition, garantie)

### Order

- `owner` : Référence vers l'utilisateur
- `products` : Liste des produits avec quantités
- `address` : Adresse de livraison
- `price` : Prix total
- `delivered` : Statut de livraison

## CORS

L'API est configurée avec CORS pour permettre les requêtes depuis n'importe quel domaine. En production, il est recommandé de restreindre les origines autorisées.

## Développement

### Gestion des erreurs

L'API retourne des erreurs au format JSON :

```json
{
  "message": "Description de l'erreur"
}
```

### Logs informatifs

```bash
🚀 Serveur démarré sur le port 4000
📍 Environnement: development
🌐 URL locale: http://localhost:4000
✅ MongoDB connecté avec succès
📍 Database: shopjsv2
```

### Bonnes pratiques

- Utilisez `.env` pour la configuration locale
- Ne commitez jamais le fichier `.env`
- Testez avec Postman ou curl
- Vérifiez les logs en cas d'erreur

## Déploiement sur Northflank

### Étapes de déploiement

1. **Créer un projet** sur [Northflank](https://northflank.com)
2. **Créer un service** depuis un dépôt Git
3. **Connecter le dépôt** GitHub
4. **Configurer les variables d'environnement** :
   ```
   MONGODB_URI=mongodb+srv://...
   NODE_ENV=production
   ```
5. **Déployer** : Northflank utilisera automatiquement `yarn start`

### Configuration automatique

- **Port** : Géré automatiquement par Northflank
- **Build** : Détection automatique de `package.json`
- **Start** : Utilise le script `yarn start`
- **SSL** : HTTPS activé par défaut

### Variables d'environnement requises

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shopjsv2-backend
NODE_ENV=production
```
