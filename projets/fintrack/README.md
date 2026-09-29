# FinTrack · Gestionnaire de dépenses

Application web pour enregistrer ses dépenses et ses revenus, gérer un budget mensuel et visualiser ses habitudes financières.

**Démo :** https://akis01.github.io/portfolio.stephen.github.io/projets/fintrack/

**Stack :** HTML · CSS · JavaScript (vanilla, aucune librairie) · LocalStorage

## Fonctionnalités

- Ajout, modification et suppression d'opérations (dépense ou revenu), avec possibilité d'annuler une suppression.
- Tableau de bord mensuel : solde, revenus, dépenses et budget restant, avec comparaison au mois précédent.
- Budgets par catégorie avec alertes : OK, attention à partir de 80 %, dépassé à partir de 100 %.
- Graphiques dessinés en SVG à la main : dépenses par jour, revenus et dépenses sur 6 mois, répartition par catégorie. Infobulles au survol et au clavier.
- Historique filtrable : recherche, type et catégorie.
- Navigation entre les mois.
- Devises F CFA, EUR et USD (formatage avec `Intl.NumberFormat`).
- Export JSON et CSV (compatible Excel), import d'une sauvegarde JSON.
- Données d'exemple pour tester en un clic.
- Thème clair et thème sombre, interface responsive et accessible (dialogues natifs, navigation au clavier, libellés ARIA).
- Raccourci : touche `N` pour ajouter une opération.

## Ce que j'ai appris

- Structurer une application sans framework : un état unique, une fonction `save()` et une fonction `render()`.
- Persister des données côté client avec `localStorage`, et valider les fichiers importés.
- Dessiner des graphiques en SVG : échelles, axes, graduations « rondes », zones de survol.
- Éviter les failles XSS en insérant les textes saisis par l'utilisateur avec `textContent`, jamais avec `innerHTML`.

## Lancer en local

Ouvre `index.html` dans un navigateur, sans installation.

## Structure

```
index.html   structure de la page et dialogues
style.css    thèmes clair et sombre, mise en page responsive
app.js       état, stockage, rendu, graphiques, formulaires
```
