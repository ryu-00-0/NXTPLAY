const ordersUser = JSON.parse(localStorage.getItem('nxtplay-current-user') || 'null');

if (!ordersUser) {
  window.location.href = '../login.html';
} else {

  const orderKey = `nxtplay-orders-${ordersUser.email}`;
  let orders = JSON.parse(localStorage.getItem(orderKey) || '[]');
  const grid = document.getElementById('orders-grid');
  const noOrders = document.getElementById('no-orders');

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('success') === '1') {
    document.getElementById('success-overlay').classList.remove('hidden');
    window.history.replaceState({}, '', '../pages/orders.html');
  }

  document.getElementById('success-overlay').addEventListener('click', function(e) {
    if (e.target === this) this.classList.add('hidden');
  });

  let orderToCancel = null;

  document.getElementById('cancel-confirm-btn').addEventListener('click', () => {
    if (orderToCancel === null) return;
    orders = orders.filter(o => o.id !== orderToCancel);
    localStorage.setItem(orderKey, JSON.stringify(orders));
    document.getElementById('cancel-modal').classList.add('hidden');
    renderOrders();
  });

  document.getElementById('cancel-dismiss-btn').addEventListener('click', () => {
    document.getElementById('cancel-modal').classList.add('hidden');
    orderToCancel = null;
  });

  document.getElementById('cancel-modal').addEventListener('click', function(e) {
    if (e.target === this) {
      this.classList.add('hidden');
      orderToCancel = null;
    }
  });

  function getDeliveryEstimate(orderId) {
    const orderDate = new Date(orderId); // id is Date.now() timestamp
    const earliest = new Date(orderDate);
    const latest = new Date(orderDate);
    earliest.setDate(earliest.getDate() + 3);
    latest.setDate(latest.getDate() + 5);
    const fmt = { month: 'long', day: 'numeric', year: 'numeric' };
    return `${earliest.toLocaleDateString('en-PH', fmt)} – ${latest.toLocaleDateString('en-PH', fmt)}`;
  }

  function renderOrders() {
    grid.innerHTML = '';
    orders = JSON.parse(localStorage.getItem(orderKey) || '[]');

    if (orders.length === 0) {
      grid.classList.add('hidden');
      noOrders.classList.remove('hidden');
      return;
    }

    grid.classList.remove('hidden');
    noOrders.classList.add('hidden');

    [...orders].reverse().forEach(order => {
      const statusClass = order.status.toLowerCase();
      const card = document.createElement('article');
      card.classList.add('order-card');
      card.innerHTML = `
        <div class="order-card-header">
          <div>
            <h3 class="order-design">${order.design}</h3>
            <span class="order-colorway">${order.colorway}</span>
          </div>
          <span class="order-status ${statusClass}">${order.status}</span>
        </div>

        <div class="order-details">
          <div class="order-row">
            <p class="order-label">Sleeve Type</p>
            <p class="order-value">${order.sleeve}</p>
          </div>
          <div class="order-row">
            <p class="order-label">Order Type</p>
            <p class="order-value">${order.set || 'Jersey Only'}</p>
          </div>
          <div class="order-row">
            <p class="order-label">Add-ons</p>
            <p class="order-value">${order.addons || 'None'}</p>
          </div>
          <div class="order-row">
            <p class="order-label">Quantity</p>
            <p class="order-value">${order.qty} jerseys</p>
          </div>
          <div class="order-row">
            <p class="order-label">Jersey Subtotal</p>
            <p class="order-value">${order.price}</p>
          </div>
          ${order.delivery === 'Delivery' && order.grandTotal ? `
          <div class="order-row">
            <p class="order-label">Shipping Fee</p>
            <p class="order-value">${order.shippingFee || '—'}</p>
          </div>` : ''}
          <div class="order-row">
            <p class="order-label">Grand Total</p>
            <p class="order-value gold">${order.grandTotal || order.price}</p>
          </div>
          <div class="order-row">
            <p class="order-label">Delivery</p>
            <p class="order-value">${order.delivery}</p>
          </div>
          ${order.delivery === 'Delivery' ? `
          <div class="order-row">
            <p class="order-label">Estimated Arrival</p>
            <p class="order-value" style="color: #F5A800; font-weight: 600;">${getDeliveryEstimate(order.id)}</p>
          </div>` : ''}
          <div class="order-row">
            <p class="order-label">Payment</p>
            <p class="order-value">${order.payment}</p>
          </div>
          ${order.delivery === 'Delivery' && order.address && order.address !== '—' ? `
          <div class="order-row">
            <p class="order-label">Address</p>
            <p class="order-value" style="white-space: pre-line; text-align: right;">${order.address}</p>
          </div>` : ''}
          <div class="order-row">
            <p class="order-label">Date Ordered</p>
            <p class="order-value">${order.date}</p>
          </div>
          <div class="order-row">
            <p class="order-label">Players</p>
            <p class="order-value" style="white-space: pre-line; text-align: right;">${order.players}</p>
          </div>
        </div>

        <button class="cancel-btn" data-id="${order.id}">Cancel Order</button>
      `;

      card.querySelector('.cancel-btn').addEventListener('click', () => {
        orderToCancel = order.id;
        document.getElementById('cancel-modal').classList.remove('hidden');
      });

      grid.appendChild(card);
    });
  }

  renderOrders();
}