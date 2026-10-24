// state.js : conserve l'état actuel de l'application.
// Au démarrage, les trois tableaux de données sont vides.
export const state = {
  customers: [],
  products: [],
  orders: [],
  search: "",
  status: "all",
  category: "all",
  selectedOrderId: null,
  error: null,
};
export function setData({ customers, products, orders }) {
  state.customers = customers;
  state.products = products;
  state.orders = orders;
}

export function setFilter(name, value) {
  state[name] = value;
}

export function setSelectedOrder(id) {
  state.selectedOrderId = id;
}

export function setError(message) {
  state.error = message;
}
