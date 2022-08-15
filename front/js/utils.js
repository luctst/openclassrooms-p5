window.baseApiUrl = 'http://localhost:3000/api/products';
window.fetchProducts = async function () {
  const res = await fetch(window.baseApiUrl);
  return res.json();
}
window.fetchProduct = async function (id) {
  const res = await fetch(window.baseApiUrl + `/${id}`);
  return res.json();
}