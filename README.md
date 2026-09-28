# Portfolio · Stephen Akiyemi

Portfolio d'un étudiant en L3 cybersécurité. C'est un site statique en HTML, CSS et JS, sans framework ni build : il suffit de l'ouvrir dans un navigateur ou de le publier avec GitHub Pages.

## Mettre à jour le contenu

Tout le contenu se trouve dans **`data.js`**. En général, c'est le seul fichier à modifier.

| Tu veux…                     | Dans `data.js`, modifie…                                |
| ---------------------------- | ------------------------------------------------------- |
| Ajouter un projet            | `projets` (un modèle à copier est donné en commentaire) |
| Ajouter une certification    | `certifications` (+ le PDF dans `certificats/`)         |
| Annoncer une certif à venir  | `certifications` avec `verrouille: true`                |
| Changer une compétence       | `competences` (niveau 1, 2 ou 3)                        |
| LinkedIn, CV, profil CTF     | `profil`                                                |

Les onglets de la section Projets (Cybersécurité, Sites web, Automatisation IA) se remplissent selon le champ `categorie` de chaque projet : `"cyber"`, `"web"` ou `"ia"`.

## Structure

```
index.html          page principale (textes de présentation)
data.js             ← contenu à modifier
assets/style.css    styles (thème sombre et clair)
assets/main.js      affichage des données, onglets, thème
assets/moi.jpg      photo de profil (640×640)
certificats/        PDF des certifications
archive/            anciennes versions du site
```

## Publier avec GitHub Pages

Dans le dépôt, ouvre **Settings → Pages**, choisis la source *Deploy from a branch*, puis la branche `main` et le dossier `/ (root)`.
Le site sera en ligne sur `https://akis01.github.io/portfolio.stephen.github.io/`.

Petit bonus : tape le code Konami sur le site (↑ ↑ ↓ ↓ ← → ← → B A).
