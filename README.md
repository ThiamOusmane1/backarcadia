# 🦁 Arcadia Zoo - Application de Gestion

![Arcadia Zoo Banner](https://via.placeholder.com/800x200/2E8B57/FFFFFF?text=Arcadia+Zoo)

[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?logo=javascript&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-brightgreen?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-lightgrey?logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Sequelize](https://img.shields.io/badge/Sequelize-6.x-52B0E7?logo=sequelize&logoColor=white)](https://sequelize.org/)
[![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel&logoColor=white)](https://vercel.com/)
[![Render](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render&logoColor=white)](https://render.com/)
[![Status](https://img.shields.io/badge/Production-✅%20En%20ligne-success)](https://arcadia-front-tau.vercel.app)

## 📝 À propos du projet

**Arcadia Zoo** est une application web complète développée dans le cadre de ma formation **Développeur Full Stack Web et Web Mobile** chez Studi. Ce projet met en pratique les technologies modernes du développement web pour créer une solution de gestion complète pour un zoo fictif situé en Bretagne.

L'application propose une interface publique pour les visiteurs et des espaces d'administration sécurisés pour différents types d'utilisateurs (employés, vétérinaires, administrateurs).

🌐 **Application en ligne** : [https://arcadia-front-tau.vercel.app](https://arcadia-front-tau.vercel.app)  
🔗 **Repository Backend** : [https://github.com/ThiamOusmane1/backarcadia](https://github.com/ThiamOusmane1/backarcadia)

## 🎯 Objectifs pédagogiques

Cette application démontre la maîtrise de :
- **Architecture MVC** avec séparation frontend/backend
- **API RESTful** avec authentification JWT
- **Base de données relationnelle** avec ORM
- **Déploiement cloud** multi-plateforme
- **Sécurité web** et gestion des rôles utilisateurs
- **Interface responsive** et accessibilité

## ✨ Fonctionnalités principales

### 👥 Interface Visiteur
- **Catalogue interactif** des animaux avec fiches détaillées
- **Exploration des habitats** avec descriptions et images
- **Système de réservation** pour les activités (train du zoo, immersions)
- **Formulaire de contact** avec validation côté client et serveur
- **Interface responsive** optimisée pour mobile et desktop

### 👨‍💼 Espace Employé
- **Tableau de bord** personnalisé avec tâches quotidiennes
- **Gestion des stocks** alimentaires avec alertes
- **Suivi des activités** et réservations
- **Interface de réponse** aux messages des visiteurs

### 👨‍⚕️ Espace Vétérinaire
- **Rapports de santé** détaillés pour chaque animal
- **Historique médical** avec système de recherche
- **Gestion des prescriptions** et traitements
- **Suivi nutritionnel** avec recommandations

### 👨‍💻 Panel Administrateur
- **Gestion complète des utilisateurs** avec attribution de rôles
- **CRUD complet** pour animaux, habitats et services
- **Système de modération** des avis visiteurs
- **Tableau de bord analytique** avec statistiques en temps réel

## 🏗️ Architecture technique

### Backend (API REST)
```
Node.js + Express.js
├── 🛡️ Authentification JWT
├── 🗄️ Sequelize ORM + MySQL
├── 🔐 Middleware de sécurité
├── 📝 Validation des données
└── 🚀 Déploiement sur Render
```

### Frontend (SPA Vanilla)
```
HTML5 + CSS3 + JavaScript
├── 📱 Design responsive (CSS Grid/Flexbox)
├── 🔄 Fetch API pour communication REST
├── 🎨 Interface moderne et intuitive
├── ♿ Accessibilité WCAG 2.1
└── 🚀 Déploiement sur Vercel
```

### Base de données
```
MySQL (AlwaysData)
├── 👤 Gestion des utilisateurs et rôles
├── 🦁 Catalogue des animaux
├── 🏞️ Habitats et services
├── 💬 Système d'avis et messages
└── 📊 Logs et analytics
```

## 🛠️ Installation et développement

### Prérequis
- Node.js (v18+)
- MySQL (v8.0+)
- Git

### Configuration locale

1. **Cloner le repository**
   ```bash
   git clone https://github.com/ThiamOusmane1/backarcadia.git
   cd backarcadia
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration environnement**
   ```bash
   # Créer un fichier .env
   DB_HOST=localhost
   DB_USER=votre_utilisateur
   DB_PASSWORD=votre_mot_de_passe
   DB_NAME=arcadia_zoo
   DB_PORT=3306
   JWT_SECRET=votre_clé_secrète_très_longue
   PORT=3000
   ```

4. **Démarrer le serveur de développement**
   ```bash
   npm run dev
   ```

5. **Accéder à l'application**
   - Backend API : `http://localhost:3000`
   - Frontend : [https://arcadia-front-tau.vercel.app](https://arcadia-front-tau.vercel.app)

## 🔐 Comptes de démonstration

| Rôle | Email | Mot de passe | Permissions |
|------|-------|--------------|-------------|
| **Administrateur** | admin@arcadia-zoo.fr | admin123 | Accès complet |
| **Vétérinaire** | vet@arcadia-zoo.fr | vet123 | Rapports médicaux |
| **Employé** | employee@arcadia-zoo.fr | emp123 | Gestion quotidienne |

## 🚀 Déploiement

### Production
- **Backend** : Render (auto-déploiement depuis GitHub)
- **Frontend** : Vercel (intégration continue)
- **Base de données** : AlwaysData (MySQL hébergé)

### Pipeline CI/CD
```
GitHub → Render/Vercel → Production
├── Tests automatisés
├── Build optimisé
├── Déploiement automatique
└── Monitoring en temps réel
```

## 📈 Évolutions futures

- [ ] **Application mobile** React Native
- [ ] **API GraphQL** pour optimiser les requêtes
- [ ] **Notifications push** WebSocket
- [ ] **Module de paiement** Stripe
- [ ] **Cache Redis** pour les performances
- [ ] **Tests automatisés** Jest/Cypress

## 🎓 Compétences développées

### Techniques
- **Développement Full Stack** JavaScript
- **Architecture API REST** sécurisée
- **Gestion de base de données** relationnelle
- **Déploiement cloud** multi-plateforme
- **Sécurité web** et authentification

### Transversales
- **Gestion de projet** agile
- **Documentation technique**
- **Debugging et optimisation**
- **UI/UX Design** responsive
- **Veille technologique**

## 👨‍💻 À propos

Ce projet a été réalisé par **Ousmane Thiam** dans le cadre de la formation **Développeur Full Stack Web et Web Mobile** chez Studi.

Après plus de 10 ans dans le bâtiment, cette reconversion professionnelle représente un défi personnel et technique que j'ai relevé avec détermination et passion pour le code.

**Contact :**
- 🐙 GitHub : [@ThiamOusmane1](https://github.com/ThiamOusmane1)
- 📧 Email : support@arcadia-zoo.fr
- 💼 LinkedIn : [Ousmane Thiam](https://linkedin.com/in/ousmane-thiam)

---

*Projet soutenu en Mai 2025 - Formation Développeur Full Stack Web et Web Mobile*