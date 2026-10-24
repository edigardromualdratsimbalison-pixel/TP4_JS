// app.js : initialise et orchestre l'application et ses événements.
import { state, setData, setFilter, setSelectedOrder, setError } from "./state.js";
import { loadAllData } from "./dataService.js";
import {
  filterOrders, getOrderDetails, getSelectedOrderDetails,
  getIndicators, getCategories, getStatuses,
} from "./selectors.js";
import {
  afficherErreur, afficherIndicateurs, afficherCommandes,
  afficherDetail, remplirListe,
} from "./view.js";

// state -> traitement -> DOM ; peut être rappelée après chaque modification du state
function render() {
  afficherErreur(state.error);
  if (state.error) return; // pas de rendu avec des données invalides

  afficherIndicateurs(getIndicators(state));

  const commandesVisibles = filterOrders(state).map(order => getOrderDetails(state, order));
  afficherCommandes(commandesVisibles, state.selectedOrderId, choisirCommande);
  afficherDetail(getSelectedOrderDetails(state));
}

function choisirCommande(id) {
  setSelectedOrder(id);
  render();
}

function brancherEvenements() {
  const recherche = document.getElementById("search");
  const statut = document.getElementById("status-filter");
  const categorie = document.getElementById("category-filter");

  recherche.addEventListener("input", () => {
    setFilter("search", recherche.value);
    render();
  });

  statut.addEventListener("change", () => {
    setFilter("status", statut.value);
    render();
  });

  categorie.addEventListener("change", () => {
    setFilter("category", categorie.value);
    render();
  });

  document.getElementById("reset-filters").addEventListener("click", () => {
    recherche.value = "";
    statut.value = "all";
    categorie.value = "all";
    setFilter("search", "");
    setFilter("status", "all");
    setFilter("category", "all");
    render();
  });

  document.getElementById("detail-close").addEventListener("click", () => {
    choisirCommande(null);
  });
}

// Chargement initial des trois sources, puis premier rendu complet
async function init() {
  brancherEvenements();
  try {
    const donnees = await loadAllData();
    setData(donnees);
    remplirListe("status-filter", getStatuses(state.orders), "Tous les statuts");
    remplirListe("category-filter", getCategories(state.products), "Toutes les catégories");
  } catch (error) {
    setError(`Les données n'ont pas pu être chargées. ${error.message}. Vérifiez le dossier data/ et lancez le site depuis un serveur local.`);
  }
  render();
}

init();
