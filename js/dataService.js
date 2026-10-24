// dataService.js : charge les fichiers JSON. Aucune manipulation du DOM ici.
async function chargerJson(chemin) {
  const response = await fetch(chemin);
  if (!response.ok) {
    throw new Error(`Le fichier ${chemin} n'a pas pu être chargé (HTTP ${response.status})`);
  }
  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error(`Le fichier ${chemin} doit contenir un tableau`);
  }
  return data;
}

export async function loadAllData() {
  try {
    const customers = await chargerJson("data/customers.json");
    const products = await chargerJson("data/products.json");
    const orders = await chargerJson("data/orders.json");
    return { customers, products, orders };
  } catch (error) {
    console.error("Erreur de chargement des données :", error);
    throw error; // app.js décide de ce qui est affiché à l'écran
  }
}
