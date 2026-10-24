// Retrouver le client d'une commande à partir de order.customerId
export function getCustomer(customers, customerId) {
  return customers.find(customer => customer.id === customerId);
}
 
// Retrouver un produit à partir de item.productId
export function getProduct(products, productId) {
  return products.find(product => product.id === productId);
}
 
// montant ligne = prix du produit x quantité
export function getLineAmount(products, item) {
  const product = getProduct(products, item.productId);
  return product ? product.price * item.quantity : 0;
}
 
// montant total = somme des montants de toutes les lignes
export function getOrderTotal(products, order) {
  let total = 0;
  order.items.forEach(item => {
    total += getLineAmount(products, item);
  });
  return total;
}
 
// Reconstruit une commande complète à partir des trois sources
export function getOrderDetails(state, order) {
  const customer = getCustomer(state.customers, order.customerId);
  const lines = order.items.map(item => {
    const product = getProduct(state.products, item.productId);
    return {
      name: product ? product.name : `Produit #${item.productId} introuvable`,
      price: product ? product.price : 0,
      quantity: item.quantity,
      amount: getLineAmount(state.products, item),
    };
  });
  return {
    id: order.id,
    date: order.date,
    status: order.status,
    customerName: customer ? customer.name : "Client inconnu",
    city: customer ? customer.city : "-",
    lines,
    total: getOrderTotal(state.products, order),
  };
}
 
// Détail de la commande sélectionnée, ou null si aucune
export function getSelectedOrderDetails(state) {
  const order = state.orders.find(o => o.id === state.selectedOrderId);
  return order ? getOrderDetails(state, order) : null;
}
 
// Recherche par nom de client + statut + catégorie : les trois critères fonctionnent ensemble
export function filterOrders(state) {
  const search = state.search.trim().toLowerCase();
  return state.orders.filter(order => {
    const customer = getCustomer(state.customers, order.customerId);
    const matchSearch =
      search === "" || (customer && customer.name.toLowerCase().includes(search));
    const matchStatus = state.status === "all" || order.status === state.status;
    const matchCategory =
      state.category === "all" ||
      order.items.some(item => {
        const product = getProduct(state.products, item.productId);
        return product && product.category === state.category;
      });
    return matchSearch && matchStatus && matchCategory;
  });
}
 
function valeursUniques(valeurs) {
  const resultat = [];
  valeurs.forEach(valeur => {
    if (!resultat.some(existante => existante === valeur)) {
      resultat.push(valeur);
    }
  });
  return resultat;
}
 
export function getCategories(products) {
  return valeursUniques(products.map(product => product.category));
}
 
export function getStatuses(orders) {
  return valeursUniques(orders.map(order => order.status));
}
 
export function getIndicators(state) {
  let totalAmount = 0;
  state.orders.forEach(order => {
    totalAmount += getOrderTotal(state.products, order);
  });
  return {
    customers: state.customers.length,
    products: state.products.length,
    orders: state.orders.length,
    totalAmount,
    pending: state.orders.filter(order => order.status === "En attente").length,
  };
}