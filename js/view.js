// view.js : produit et met à jour l'affichage dans le DOM. Aucun fetch ici.
const $ = id => document.getElementById(id);
 
const classesStatut = {
  "Livree": "text-bg-success",
  "En attente": "text-bg-warning",
  "Annulee": "text-bg-secondary",
};
 
function badgeStatut(statut) {
  return `<span class="badge ${classesStatut[statut] || "text-bg-light"}">${statut}</span>`;
}
 
export function afficherErreur(message) {
  const boite = $("error-box");
  boite.textContent = message || "";
  if (message) {
    boite.classList.remove("d-none");
    // données invalides : on vide l'interface plutôt que d'afficher du contenu faux
    $("indicators").innerHTML = "";
    $("orders-body").innerHTML = "";
    $("orders-count").textContent = "";
    afficherDetail(null);
  } else {
    boite.classList.add("d-none");
  }
}
 
export function afficherIndicateurs(indicateurs) {
  const elements = [
    ["Clients", indicateurs.customers],
    ["Produits", indicateurs.products],
    ["Commandes", indicateurs.orders],
    ["Montant cumulé", `${indicateurs.totalAmount} MAD`],
    ["Commandes en attente", indicateurs.pending],
  ];
  let html = "";
  elements.forEach(([libelle, valeur], index) => {
    const principal = index === 3;
    html += `
      <div class="${principal ? "col-12 col-lg-3" : "col-6 col-lg"}">
        <div class="indicator${principal ? " indicator-main" : ""}">
          <div class="indicator-value">${valeur}</div>
          <div class="indicator-label">${libelle}</div>
        </div>
      </div>`;
  });
  $("indicators").innerHTML = html;
}
 
export function remplirListe(id, valeurs, libelleTous) {
  let html = `<option value="all">${libelleTous}</option>`;
  valeurs.forEach(valeur => {
    html += `<option value="${valeur}">${valeur}</option>`;
  });
  $(id).innerHTML = html;
}
 
// auDetail(id) est un callback fourni par app.js : view.js ne gère pas la logique.
export function afficherCommandes(commandes, idSelectionne, auDetail) {
  const corps = $("orders-body");
  $("orders-count").textContent = `${commandes.length} commande(s)`;
 
  if (commandes.length === 0) {
    corps.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">Aucune commande ne correspond à votre recherche. Modifiez le nom ou les filtres.</td></tr>`;
    return;
  }
 
  let html = "";
  commandes.forEach(commande => {
    html += `
      <tr class="${commande.id === idSelectionne ? "table-active" : ""}">
        <td class="fw-semibold">#${commande.id}</td>
        <td>${commande.customerName}<div class="small text-muted">${commande.city}</div></td>
        <td>${commande.date}</td>
        <td>${badgeStatut(commande.status)}</td>
        <td class="text-end">${commande.total} MAD</td>
        <td class="text-end"><button type="button" class="btn btn-sm btn-outline-primary btn-detail">Voir le détail</button></td>
      </tr>`;
  });
  corps.innerHTML = html;
 
  const boutons = corps.querySelectorAll(".btn-detail");
  boutons.forEach((bouton, index) => {
    bouton.addEventListener("click", () => auDetail(commandes[index].id));
  });
}
 
// detail = commande reconstruite, ou null pour revenir à l'état vide
export function afficherDetail(detail) {
  if (detail === null) {
    $("detail-empty").classList.remove("d-none");
    $("detail-content").classList.add("d-none");
    return;
  }
 
  $("detail-title").textContent = `Commande #${detail.id}`;
  $("detail-customer").textContent = detail.customerName;
  $("detail-city").textContent = detail.city;
  $("detail-date").textContent = detail.date;
  $("detail-status").innerHTML = badgeStatut(detail.status);
 
  let lignes = "";
  detail.lines.forEach(ligne => {
    lignes += `
      <tr>
        <td>${ligne.name}</td>
        <td class="text-end">${ligne.price} MAD</td>
        <td class="text-end">${ligne.quantity}</td>
        <td class="text-end">${ligne.amount} MAD</td>
      </tr>`;
  });
  $("detail-lines").innerHTML = lignes;
  $("detail-total").textContent = `${detail.total} MAD`;
 
  $("detail-empty").classList.add("d-none");
  $("detail-content").classList.remove("d-none");
}