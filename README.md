# ATI Tech Gabon

Site vitrine professionnel pour **ATI Tech Gabon**, entreprise de solutions informatiques basée à Libreville (Gabon).

## 🚀 Fonctionnalités

- Design moderne, responsive et animé (CSS/JS)
- Carrousel d’arrière-plan dans la section Hero
- Section "Nos Réalisations" avec projets mis en avant
- Formulaire de contact fonctionnel avec :
  - Envoi du message à l’entreprise
  - Accusé de réception automatique au client
  - Backend serverless via **Resend** + **Netlify Functions**
- Popups détaillés pour chaque service
- Navigation fluide avec scroll smooth et menu mobile

## 🛠️ Technologies utilisées

- HTML5 / CSS3 (variables, grid, animations)
- JavaScript moderne (ES6+, classes, fetch API)
- [Resend](https://resend.com) pour l’envoi d’emails
- [Netlify Functions](https://docs.netlify.com/functions/) (serverless)
- Hébergement gratuit sur [Netlify](https://netlify.app)

## 📦 Structure du projet
atitech-gabon/
├── index.html
├── assets/
│ ├── css/style.css
│ └── js/main.js
└── netlify/functions/contact.js


## 🚀 Déploiement

1. Créer un compte [Resend](https://resend.com) et obtenir une clé API
2. Ajouter la variable d’environnement dans Netlify :
   - **Key**: `RESEND_API_KEY`
   - **Value**: `re_...`
3. Lier le dépôt GitHub à Netlify → déploiement automatique

✅ Site live : [https://atitech-gabon.netlify.app](https://atitech-gabon.netlify.app)

---

Développé avec ❤️ pour les professionnels de l’IT au Gabon.