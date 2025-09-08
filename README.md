# Portfolio Architecte Sophie Bluel

Projet 3 formation Développeur Web - OpenClassrooms.

## 📸 Aperçu de l'application

![Portfolio Sophie Bluel - Version Desktop](FrontEnd/assets/images/screenshot_desktop.png)

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
            └── injectCategoriesInSelect() # Injection catégories dans select
```

## 🏗️ Architecture JavaScript

### Gestion des données

L'application utilise un **tableau global** `projectsArray` comme source unique de vérité :

```javascript
// main.js - Source unique de vérité
export let projectsArray = [];

async function init() {
  projectsArray = await fetchWorks(); // Récupération initiale
  displayProjects(projectsArray); // Affichage galerie
  // ... autres initialisations
}
```

**Avantages :**

- ✅ Synchronisation automatique entre galerie et modales
- ✅ Les projets sont récupérés une seul fois (main.js) au lancement de l'application: Pas de rechargement inutile des données
- ✅ Gestion centralisée de l'état des projets

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
- ✅ Formulaire de contact

### Mode administrateur

- ✅ Connexion sécurisée
- ✅ HomePage en "Mode édition" (bannière noire, bouton "modifier", lien "logout"..)
- ✅ Ouverture d'une modale pour gèrer les projets
- ✅ Suppression de projets
- ✅ Ajout de nouveaux projets avec :
- ✅ Upload d'images
- ✅ Sélection d'une catégorie pour le nouveau projet ajouté

## 🛠️ Technologies utilisées

### Frontend

- **JavaScript ES6+** (modules)
- **HTML5** + **CSS3**
- **Fetch API** (requêtes HTTP)
- **LocalStorage** (persistance token)

## 📝 Notes de développement

### Architecture modulaire

- **main.js** : Point d'entrée unique, orchestration
- **login.js**: Gestion de la page de connexion
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
- ✅ Navigation entre pages (homePage ↔ login) avec état persistant

### Interface utilisateur

- ✅ Messages utilisateur pour confirmer la fermeture de la modale qui permet d'ajouter un projet (click sur la croix, l'overlay et touche escape du clavier)

## 🚀 Déploiement

### Expérience Netlify

J'ai tenté de déployer ce site sur Netlify mais j'ai rencontré une erreur 404. Le problème vient du fait que Netlify cherche automatiquement un fichier `index.html` à la racine pour lancer le site, alors que mon fichier principal se trouve dans `pages/homePage.html`.

### Solutions possibles

Pour résoudre ce problème, deux approches sont viables :

1. **Renommer le fichier principal :**

   - `pages/homePage.html` → `index.html`
   - Mettre `index.html` à la racine du projet

2. **Créer un fichier de redirection :**
   - Créer un `index.html` à la racine
   - Ajouter une redirection automatique vers `pages/homePage.html`

Ces solutions permettraient un déploiement réussi sur Netlify ou d'autres plateformes d'hébergement statique.

**Note :** Ce déploiement sera certainement réalisé plus tard, mais pour le moment je préfère me recentrer sur les fonctionnalités demandées pour ce projet de formation.

## 📄 Licence

Projet réalisé dans le cadre de la formation Développeur Web - OpenClassrooms.
