let currentProduct = {};
let selectedSleeve = 'Sleeveless';
let selectedSet = 'Jersey Only'; // 'Jersey Only' or 'Full Set'
let selectedDelivery = 'Pickup';
let selectedPayment = 'Cash on Delivery';
let savedShippingFee = null; // ← track shipping fee across handlers

// ─── PRICE SETTINGS ────────────────────────────────────────────────
// Jersey Only: JERSEY_PRICE. Full Set adds ₱100 on top.
const JERSEY_PRICE = 450; // ← base price per jersey (₱)
// ───────────────────────────────────────────────────────────────────

const SHIPPING_TABLE = [
  null,
  85, 102, 110, 119, 128,
  136, 144, 153, 162, 178,
  187, 196, 204, 212, 221,
  230, 238, 255
];

function getShippingFee(qty) {
  const q = parseInt(qty);
  if (!q || q < 1 || q > 18) return null;
  return SHIPPING_TABLE[q];
}

function updateShippingDisplay() {
  const qty = document.getElementById('input-qty').value;
  const estimateBox = document.getElementById('shipping-estimate');
  const feeText = document.getElementById('shipping-fee-text');
  if (selectedDelivery === 'Delivery' && qty) {
    const fee = getShippingFee(qty);
    if (fee) {
      feeText.textContent = `₱${fee}`;
      estimateBox.classList.remove('hidden');
      return;
    }
  }
  estimateBox.classList.add('hidden');
}

function showAlert(message) {
  const box = document.getElementById('alert-box');
  document.getElementById('alert-message').textContent = message;
  box.classList.remove('hidden');
  setTimeout(() => box.classList.add('hidden'), 3000);
}

// Open modal
document.querySelectorAll('.order-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.preventDefault();

    const sessionCheck = JSON.parse(localStorage.getItem('nxtplay-current-user') || 'null');
    if (!sessionCheck) {
      showAlert('Please log in to place an order.');
      setTimeout(() => { window.location.href = '/login.html'; }, 1500);
      return;
    }

    currentProduct = {
      name: this.closest('.product-card').querySelector('.product-name').textContent,
      colorway: this.closest('.product-card').querySelector('.colorway-label').textContent
    };

    selectedSleeve = 'Sleeveless';
    selectedSet = 'Jersey Only';
    selectedDelivery = 'Pickup';
    selectedPayment = 'Cash on Delivery';
    savedShippingFee = null;

    document.querySelectorAll('.sleeve-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-value="Sleeveless"]').classList.add('active');
    document.querySelectorAll('.set-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.set-btn[data-value="Jersey Only"]').classList.add('active');
    document.querySelectorAll('.qty-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.delivery-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.delivery-btn[data-value="Pickup"]').classList.add('active');
    document.querySelectorAll('.payment-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.payment-btn[data-value="Cash on Delivery"]').classList.add('active');

    document.getElementById('input-qty').value = '';
    document.getElementById('addon-sleeves').checked = false;
    document.getElementById('addon-tights').checked = false;
    document.getElementById('del-name').value = '';
    document.getElementById('del-phone').value = '';
    document.getElementById('del-address').value = '';
    document.getElementById('del-city').value = '';
    document.getElementById('del-zip').value = '';
    document.getElementById('del-gcash-ref').value = '';
    document.getElementById('delivery-fields').classList.add('hidden');
    document.getElementById('pickup-note').classList.remove('hidden');
    document.getElementById('gcash-fields').classList.add('hidden');

    document.getElementById('step-1').classList.remove('hidden');
    document.getElementById('step-2').classList.add('hidden');
    document.getElementById('step-3').classList.add('hidden');
    document.getElementById('modal-title').innerHTML = 'Customize Your <span>Order</span>';
    document.getElementById('modal-overlay').classList.remove('hidden');
  });
});

// Close modal
document.getElementById('modal-close').addEventListener('click', () => {
  document.getElementById('modal-overlay').classList.add('hidden');
});

// Sleeve selection
document.querySelectorAll('.sleeve-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.sleeve-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    selectedSleeve = this.dataset.value;
  });
});

// Set selection (Jersey Only / Full Set)
document.querySelectorAll('.set-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.set-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    selectedSet = this.dataset.value;
  });
});

// Quantity preset buttons
document.querySelectorAll('.qty-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.qty-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    document.getElementById('input-qty').value = this.dataset.value;
  });
});

// Manual quantity input
document.getElementById('input-qty').addEventListener('input', function() {
  document.querySelectorAll('.qty-btn').forEach(b => b.classList.remove('active'));
  if (parseInt(this.value) > 18) this.value = 18;
  if (parseInt(this.value) < 1) this.value = 1;
});

// Delivery selection
document.querySelectorAll('.delivery-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.delivery-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    selectedDelivery = this.dataset.value;

    if (selectedDelivery === 'Delivery') {
      document.getElementById('delivery-fields').classList.remove('hidden');
      document.getElementById('pickup-note').classList.add('hidden');
    } else {
      document.getElementById('delivery-fields').classList.add('hidden');
      document.getElementById('pickup-note').classList.remove('hidden');
    }
    updateShippingDisplay();
  });
});

// Payment selection
document.querySelectorAll('.payment-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.payment-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    selectedPayment = this.dataset.value;

    if (selectedPayment === 'GCash') {
      document.getElementById('gcash-fields').classList.remove('hidden');
    } else {
      document.getElementById('gcash-fields').classList.add('hidden');
    }
  });
});

// Next button — step 1 to step 2
document.getElementById('next-btn').addEventListener('click', () => {
  const qty = parseInt(document.getElementById('input-qty').value);

  if (!qty || qty < 1) {
    showAlert('Please enter a quantity first.');
    return;
  }

  const playerList = document.getElementById('player-list');
  playerList.innerHTML = '';

  for (let i = 1; i <= qty; i++) {
    const row = document.createElement('div');
    row.classList.add('player-row');

    if (selectedSleeve === 'Sleeved') {
      row.innerHTML = `
        <span>${i}.</span>
        <input type="text" placeholder="Player name" class="player-name">
        <div class="size-options">
          <button type="button" class="size-btn" data-value="XS">XS</button>
          <button type="button" class="size-btn" data-value="S">S</button>
          <button type="button" class="size-btn" data-value="M">M</button>
          <button type="button" class="size-btn" data-value="L">L</button>
          <button type="button" class="size-btn" data-value="XL">XL</button>
          <button type="button" class="size-btn" data-value="XXL">XXL</button>
        </div>
      `;
    } else {
      row.innerHTML = `
        <span>${i}.</span>
        <input type="text" placeholder="Name" class="player-name">
        <input type="number" placeholder="#" class="player-num-input" min="0" max="99">
        <div class="size-options">
          <button type="button" class="size-btn" data-value="XS">XS</button>
          <button type="button" class="size-btn" data-value="S">S</button>
          <button type="button" class="size-btn" data-value="M">M</button>
          <button type="button" class="size-btn" data-value="L">L</button>
          <button type="button" class="size-btn" data-value="XL">XL</button>
          <button type="button" class="size-btn" data-value="XXL">XXL</button>
        </div>
      `;
    }

    playerList.appendChild(row);

    row.querySelectorAll('.size-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        row.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
      });
    });
  }

  document.getElementById('step-1').classList.add('hidden');
  document.getElementById('step-2').classList.remove('hidden');
  document.getElementById('modal-title').innerHTML = 'Player <span>Details</span>';
});

// Back button step 2 to step 1
document.getElementById('back-btn').addEventListener('click', () => {
  document.getElementById('step-2').classList.add('hidden');
  document.getElementById('step-1').classList.remove('hidden');
  document.getElementById('modal-title').innerHTML = 'Customize Your <span>Order</span>';
});

// Confirm step 2 — validate players then go to step 3
document.getElementById('confirm-btn').addEventListener('click', () => {
  let valid = true;

  document.querySelectorAll('.player-row').forEach(row => {
    const name = row.querySelector('.player-name').value.trim();
    const numInput = row.querySelector('.player-num-input');
    const num = numInput ? numInput.value.trim() : null;
    const sizeBtn = row.querySelector('.size-btn.active');

    if (!name) valid = false;
    if (numInput && !num) valid = false;
    if (!sizeBtn) valid = false;
  });

  if (!valid) {
    showAlert('Please fill in all player names, jersey numbers, and sizes.');
    return;
  }

  document.getElementById('step-2').classList.add('hidden');
  document.getElementById('step-3').classList.remove('hidden');
  document.getElementById('modal-title').innerHTML = 'Delivery & <span>Payment</span>';

  updateShippingDisplay();

  const sessionUser = JSON.parse(localStorage.getItem('nxtplay-current-user') || 'null');
  if (sessionUser) {
    const users = JSON.parse(localStorage.getItem('nxtplay-users') || '[]');
    const profile = users.find(u => u.email === sessionUser.email);
    if (profile) {
      document.getElementById('del-name').value = profile.fullname || '';
      document.getElementById('del-phone').value = profile.phone || '';
      document.getElementById('del-address').value = profile.street || '';
      document.getElementById('del-city').value = profile.city || '';
      document.getElementById('del-zip').value = profile.zip || '';
    }
  }
});

// Back button step 3 to step 2
document.getElementById('back-btn-3').addEventListener('click', () => {
  document.getElementById('step-3').classList.add('hidden');
  document.getElementById('step-2').classList.remove('hidden');
  document.getElementById('modal-title').innerHTML = 'Player <span>Details</span>';
});

// Confirm step 3 — validate delivery fields then show summary
document.getElementById('confirm-btn-3').addEventListener('click', () => {
  if (selectedDelivery === 'Delivery') {
    const name = document.getElementById('del-name').value.trim();
    const phone = document.getElementById('del-phone').value.trim();
    const address = document.getElementById('del-address').value.trim();
    const city = document.getElementById('del-city').value.trim();
    const zip = document.getElementById('del-zip').value.trim();
    const gcashRef = document.getElementById('del-gcash-ref').value.trim();

    if (!name || !phone || !address || !city || !zip) {
      showAlert('Please fill in all delivery details.');
      return;
    }

    if (selectedPayment === 'GCash' && !gcashRef) {
      showAlert('Please enter your GCash reference number.');
      return;
    }
  }

  const qty = document.getElementById('input-qty').value;
  const players = [];

  document.querySelectorAll('.player-row').forEach((row, i) => {
    const name = row.querySelector('.player-name').value || '—';
    const numInput = row.querySelector('.player-num-input');
    const num = numInput ? (numInput.value || '—') : 'N/A';
    const size = row.querySelector('.size-btn.active')?.dataset.value || '—';
    players.push({ index: i + 1, name, num, size });
  });

  const playerSummary = players.map(p =>
    selectedSleeve === 'Sleeved'
      ? `${p.index}. ${p.name} — ${p.size}`
      : `${p.index}. ${p.name} — #${p.num} — ${p.size}`
  ).join('\n');

  // Add-ons
  const addonSleeves = document.getElementById('addon-sleeves').checked;
  const addonTights = document.getElementById('addon-tights').checked;
  const setExtra = selectedSet === 'Full Set' ? 100 : 0;
  let addonTotal = 0;
  const addons = [];

  if (addonSleeves) { addonTotal += 50; addons.push('Arm Sleeves (+₱50/pc)'); }
  if (addonTights) { addonTotal += 80; addons.push('Compression Tights (+₱80/pc)'); }

  const pricePerSet = JERSEY_PRICE + setExtra + addonTotal;
  const totalPrice = pricePerSet * parseInt(qty);

  // Address & payment summary
  let addressSummary = '—';
  let paymentSummary = 'Pay on the spot';

  if (selectedDelivery === 'Delivery') {
    const name = document.getElementById('del-name').value;
    const phone = document.getElementById('del-phone').value;
    const address = document.getElementById('del-address').value;
    const city = document.getElementById('del-city').value;
    const zip = document.getElementById('del-zip').value;
    const gcashRef = document.getElementById('del-gcash-ref').value;
    addressSummary = `${name} · ${phone}\n${address}, ${city} ${zip}`;
    paymentSummary = selectedPayment === 'GCash'
      ? `GCash (Ref: ${gcashRef})`
      : 'Cash on Delivery';
  }

  // Shipping fee & grand total
  savedShippingFee = selectedDelivery === 'Delivery' ? getShippingFee(qty) : null;
  const shippingText = savedShippingFee != null ? `₱${savedShippingFee}` : 'Free (Pickup)';
  const grandTotal = totalPrice + (savedShippingFee != null ? savedShippingFee : 0);
  const grandText = `₱${grandTotal.toLocaleString()}`;

  // Populate summary
  document.getElementById('sum-design').textContent = currentProduct.name;
  document.getElementById('sum-colorway').textContent = currentProduct.colorway;
  document.getElementById('sum-sleeve').textContent = selectedSleeve;
  document.getElementById('sum-set').textContent = selectedSet;
  document.getElementById('sum-qty').textContent = qty;
  document.getElementById('sum-addons').textContent = addons.length > 0 ? addons.join(', ') : 'None';
  document.getElementById('sum-price').textContent = `₱${pricePerSet} x ${qty} = ₱${totalPrice.toLocaleString()}`;
  document.getElementById('sum-shipping').textContent = shippingText;
  document.getElementById('sum-shipping-row').classList.toggle('hidden', selectedDelivery === 'Pickup');
  document.getElementById('sum-grand').textContent = grandText;
  document.getElementById('sum-grand-row').classList.remove('hidden');
  document.getElementById('sum-delivery').textContent = selectedDelivery;
  document.getElementById('sum-payment').textContent = paymentSummary;
  document.getElementById('sum-address').textContent = addressSummary;
  document.getElementById('sum-address').style.whiteSpace = 'pre-line';
  document.getElementById('sum-address-row').classList.toggle('hidden', selectedDelivery === 'Pickup');
  document.getElementById('sum-players').textContent = playerSummary;

  document.getElementById('modal-overlay').classList.add('hidden');
  document.getElementById('summary-overlay').classList.remove('hidden');
});

// Close summary
document.getElementById('summary-close').addEventListener('click', () => {
  document.getElementById('summary-overlay').classList.add('hidden');
});

// Order Now — save and redirect
document.getElementById('order-now-btn').addEventListener('click', () => {
  const currentUser = JSON.parse(localStorage.getItem('nxtplay-current-user') || 'null');

  if (!currentUser) {
    window.location.href = 'login.html';
    return;
  }

  const order = {
    id: Date.now(),
    design: document.getElementById('sum-design').textContent,
    colorway: document.getElementById('sum-colorway').textContent,
    sleeve: document.getElementById('sum-sleeve').textContent,
    set: document.getElementById('sum-set').textContent,
    qty: document.getElementById('sum-qty').textContent,
    addons: document.getElementById('sum-addons').textContent,
    price: document.getElementById('sum-price').textContent,
    shippingFee: savedShippingFee != null ? `₱${savedShippingFee}` : null,
    grandTotal: document.getElementById('sum-grand').textContent,
    delivery: document.getElementById('sum-delivery').textContent,
    payment: document.getElementById('sum-payment').textContent,
    address: document.getElementById('sum-address').textContent,
    players: document.getElementById('sum-players').textContent,
    status: 'Pending',
    date: new Date().toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })
  };

  const orderKey = `nxtplay-orders-${currentUser.email}`;
  const existing = JSON.parse(localStorage.getItem(orderKey) || '[]');
  existing.push(order);
  localStorage.setItem(orderKey, JSON.stringify(existing));

  document.getElementById('summary-overlay').classList.add('hidden');
  window.location.href = 'orders.html?success=1';
});

// Back on summary
document.getElementById('summary-back-btn').addEventListener('click', () => {
  document.getElementById('summary-overlay').classList.add('hidden');
  document.getElementById('modal-overlay').classList.remove('hidden');
  document.getElementById('step-3').classList.remove('hidden');
  document.getElementById('step-2').classList.add('hidden');
  document.getElementById('step-1').classList.add('hidden');
  document.getElementById('modal-title').innerHTML = 'Delivery & <span>Payment</span>';
});