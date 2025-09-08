# Portfolio Architecte Sophie Bluel

Projet 3 formation Développeur Web - OpenClassrooms.

## 📁 Architecture Frontend

```
FrontEnd/
├── 📄 pages/                      # Pages HTML
│   ├── homePage.html             # Page d'accueil avec portfolio
│   └── login.html                # Page de connexion admin
│
├── 🎨 css/                        # Styles CSS modulaires
│   ├── global.css                # Styles globaux et variables
│   ├── navbar.css                # Navigation principale
│   ├── introduction.css          # Section présentation
│   ├── gallery.css               # Galerie de projets
│   ├── contact.css               # Formulaire de contact
│   ├── footer.css                # Pied de page
│   ├── login.css                 # Styles page connexion
│   ├── homePageEdit.css          # Styles mode édition
│   └── modals.css                # Styles des modales
│
├── 🖼️ assets/                     # Ressources statiques
│   ├── images/                   # Images du portfolio
│   │   ├── sophie-bluel.png
│   │   ├── abajour-tahina.png
│   │   └── ... (autres projets)
│   └── icons/                    # Icônes
│       ├── instagram.png
│       └── add-photo.png
│
└── ⚙️ js/                         # Logique JavaScript modulaire
    ├── 📋 main.js                # Orchestrateur principal
    ├── 🔐 login.js               # Gestion authentification
    │
    ├── 🌐 api/                   # Couche d'accès aux données
    │   ├── api.js                # Appels API génériques
    │   │   ├── fetchWorks()      # Récupération projets
    │   │   └── fetchCategories() # Récupération catégories
    │   ├── authApi.js            # API authentification
    │   │   ├── login()           # Connexion utilisateur
    │   │   ├── logout()          # Déconnexion
    │   │   └── saveAuth()        # Sauvegarde token
    │   └── config.js             # Configuration API
    │
    └── 📦 modules/               # Modules métier
        ├── 🖼️ gallery.js         # Affichage galerie
        │   └── displayProjects() # Rendu des projets
        │
        ├── 🔘 filters.js         # Système de filtrage
        │   ├── createButtons()   # Création boutons filtres
        │   └── setUpButtonListeners() # Gestion clics
        │
        ├── 🧭 navbar.js          # Navigation
        │   └── clickNavbarLinks() # Gestion liens actifs et navigation
        │
        ├── ✏️ editMode.js        # Mode édition administrateur
        │   ├── editPage()        # Activation mode édition
        │   ├── displayBanner()   # Bannière "Mode édition"
        │   ├── updateNavbar()    # Login → Logout
        │   ├── setupEditButton() # Bouton "Modifier"
        │   └── hideFilterButtons() # Cache filtres
        │
        └── 🪟 modals.js          # Gestion des modales
            ├── loadModalGallery() # Modale galerie
            ├── loadModalAddPhoto() # Modale ajout photo
            ├── deleteProjectFromAPI() # Suppression projet
            └── refreshAllProjects() # Mise à jour galerie
```

## 🏗️ Architecture JavaScript

### Flux d'initialisation

```mermaid
sequenceDiagram
    participant DOM as DOMContentLoaded
    participant M as main.js
    participant A as api.js
    participant G as gallery.js
    participant F as filters.js
    participant N as navbar.js
    participant E as editMode.js
    participant MOD as modals.js

    DOM->>M: init()

    Note over M: 1. Récupération des données
    M->>A: fetchWorks()
    A-->>M: projectsArray[]
    M->>G: displayProjects(projectsArray)

    M->>A: fetchCategories()
    A-->>M: categories[]

    Note over M: 2. Configuration des filtres
    M->>F: createButtons(categories)
    M->>F: setUpButtonListeners(projectsArray)

    Note over M: 3. Configuration des modales
    M->>MOD: injectCategoriesInSelect(categories)

    Note over M: 4. Configuration de l'interface
    M->>N: clickNavbarLinks()

    Note over M: 5. Mode édition (si connecté)
    M->>E: editPage(() => loadModalGallery(projectsArray))
```

## 🚀 Installation et lancement

### Prérequis

- Un éditeur de code (VSCode recommandé)
- Extension Live Server (pour le frontend)

### Frontend

1. **Ouvrir le dossier FrontEnd**

   ```bash
   cd FrontEnd
   ```

2. **Lancer avec Live Server**

   - Clic droit sur `pages/HomePage.html`
   - "Open with Live Server"

   L'application s'ouvre sur `http://localhost:5500`

## 🔑 Authentification

**Compte administrateur :**

- Email : `sophie.bluel@test.tld`
- Mot de passe : `S0phie`

## 🎯 Fonctionnalités

### Mode visiteur

- ✅ Affichage du portfolio
- ✅ Filtrage par catégories
- ✅ Navigation responsive
- ✅ Formulaire de contact

### Mode administrateur

- ✅ Connexion sécurisée
- ✅ Bannière "Mode édition"
- ✅ Suppression de projets
- ✅ Ajout de nouveaux projets
- ✅ Upload d'images
- ✅ Gestion des catégories

## 🛠️ Technologies utilisées

### Frontend

- **JavaScript ES6+** (modules)
- **HTML5** + **CSS3**
- **Fetch API** (requêtes HTTP)
- **LocalStorage** (persistance token)

## 📝 Notes de développement

### Architecture modulaire

- **main.js** : Point d'entrée unique, orchestration
- **api/** : Couche d'abstraction des données
- **modules/** : Logique métier séparée par fonctionnalité

### Sécurité

- Validation des tokens côté client
- Protection des routes sensibles

### Performance

- Chargement asynchrone des données
- Gestion optimisée des événements
- Mise à jour ciblée de l'interface

## 🔧 Astuces de développement

> **💡 Conseil** : Ouvrir le backend et le frontend dans deux instances VSCode séparées pour éviter les conflits de ports et faciliter le développement.

## 🆕 Améliorations récentes

### Navigation améliorée

- ✅ Gestion automatique des liens actifs dans la navbar
- ✅ Support des ancres (#portfolio, #contact) avec scroll fluide
- ✅ Navigation entre pages (homePage ↔ login) avec état persistant

### Interface utilisateur

- ✅ Icône Instagram remplacée par image locale pour une meilleure compatibilité
- ✅ Effets de hover optimisés sur les éléments interactifs
- ✅ Gestion des erreurs améliorée avec messages utilisateur

### Architecture

- ✅ Flux d'initialisation optimisé et documenté
- ✅ Gestion modulaire des événements de navigation
- ✅ Code plus maintenable avec séparation des responsabilités

## 📄 Licence

Projet réalisé dans le cadre de la formation Développeur Web - OpenClassrooms.
