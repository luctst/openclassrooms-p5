( function () {
  const orderId = new URLSearchParams(window.location.search).get('orderId');

  if (!orderId) return false;

  const span = document.getElementById('orderId');
  span.textContent = orderId;
})()