# TP4 - Suivi des commandes

Application frontend (HTML, Bootstrap, JavaScript modulaire) qui relie trois fichiers JSON : clients, produits et commandes.

## Structure
```
tp4/
├── index.html
├── css/style.css
├── data/ (customers.json, products.json, orders.json)
└── js/
    ├── app.js          initialisation, événements, render()
    ├── state.js        état central (données, filtres, commande sélectionnée)
    ├── dataService.js  chargement des JSON (fetch, async/await, try/catch)
    ├── selectors.js    relations, filtres, calculs
    └── view.js         affichage dans le DOM
```

## Fonctionnalités
- Chargement de 3 sources JSON liées par `customerId` et `productId`
- Indicateurs calculés : clients, produits, commandes, montant cumulé, commandes en attente
- Recherche par nom de client, filtre par statut et par catégorie (combinables), bouton de réinitialisation
- Détail d'une commande (client, ville, date, statut, lignes, montants, total)
- Message d'erreur clair si un fichier JSON ne se charge pas

## Lancer le projet
Les modules ES et `fetch()` exigent un serveur local (pas de double-clic sur index.html) :
- VS Code : extension Live Server, puis « Go Live »
- ou `python -m http.server 8000` puis http://localhost:8000