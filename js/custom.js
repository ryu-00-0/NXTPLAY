let selectedSleeve = 'Sleeveless';
let selectedSet = 'Jersey Only'; // 'Jersey Only' or 'Full Set'

const SHIPPING_TABLE = [
  null,
  85, 102, 110, 119, 128,
  136, 144, 153, 162, 178,
  187, 196, 204, 212, 221,
  230, 238, 255
];

// ─── PRICE SETTINGS ────────────────────────────────────────────────
// Edit JERSEY_PRICE to change the base cost per jersey.
// Full Set adds ₱100 on top. Edit SHIPPING_TABLE for delivery fees.
const JERSEY_PRICE = 550; // ← base price per jersey (₱)
// ───────────────────────────────────────────────────────────────────

function getShippingFee(qty) {
  const q = parseInt(qty);
  if (!q || q < 1 || q > 18) return null;
  return SHIPPING_TABLE[q];
}

let uploadedFileName = '—';
let selectedDelivery = 'Pickup';
let selectedPayment = 'Cash on Delivery';
let savedShippingFee = null;

function showAlert(message) {
  const box = document.getElementById('alert-box');
  document.getElementById('alert-message').textContent = message;
  box.classList.remove('hidden');
  setTimeout(() => box.classList.add('hidden'), 3000);
}

document.getElementById('design-upload').addEventListener('change', function() {
  const file = this.files[0];
  if (!file) return;
  uploadedFileName = file.name;
  const reader = new FileReader();
  reader.onload = function(e) {
    const preview = document.getElementById('upload-preview');
    const placeholder = document.getElementById('upload-placeholder');
    preview.src = e.target.result;
    preview.classList.remove('hidden');
    placeholder.classList.add('hidden');
  };
  reader.readAsDataURL(file);
});

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

document.querySelectorAll('.qty-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.qty-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    document.getElementById('input-qty').value = this.dataset.value;
  });
});

document.getElementById('input-qty').addEventListener('input', function() {
  document.querySelectorAll('.qty-btn').forEach(b => b.classList.remove('active'));
  if (parseInt(this.value) > 18) this.value = 18;
  if (parseInt(this.value) < 1) this.value = 1;
});

// Step 1 -> Step 2
document.getElementById('custom-next-btn').addEventListener('click', () => {
  const sessionCheck = JSON.parse(localStorage.getItem('nxtplay-current-user') || 'null');
  if (!sessionCheck) {
    showAlert('Please log in to place an order.');
    setTimeout(() => { window.location.href = '../login.html'; }, 1500);
    return;
  }

  const qty = parseInt(document.getElementById('input-qty').value);
  if (!qty || qty < 1) { showAlert('Please enter a quantity first.'); return; }
  if (uploadedFileName === '—') { showAlert('Please upload your design first.'); return; }

  const playerList = document.getElementById('player-list');
  playerList.innerHTML = '';
  const sizeOptions = `
    <div class="size-options">
      <button type="button" class="size-btn" data-value="XS">XS</button>
      <button type="button" class="size-btn" data-value="S">S</button>
      <button type="button" class="size-btn" data-value="M">M</button>
      <button type="button" class="size-btn" data-value="L">L</button>
      <button type="button" class="size-btn" data-value="XL">XL</button>
      <button type="button" class="size-btn" data-value="XXL">XXL</button>
    </div>`;

  for (let i = 1; i <= qty; i++) {
    const row = document.createElement('div');
    row.classList.add('player-row');
    row.innerHTML = selectedSleeve === 'Sleeved'
      ? `<span>${i}.</span><input type="text" placeholder="Player name" class="player-name">${sizeOptions}`
      : `<span>${i}.</span><input type="text" placeholder="Name" class="player-name"><input type="number" placeholder="#" class="player-num-input" min="0" max="99">${sizeOptions}`;
    playerList.appendChild(row);
    row.querySelectorAll('.size-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        row.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
      });
    });
  }

  document.getElementById('custom-step-1').classList.add('hidden');
  document.getElementById('custom-step-2').classList.remove('hidden');
});

// Step 2 -> Step 1
document.getElementById('custom-back-btn').addEventListener('click', () => {
  document.getElementById('custom-step-2').classList.add('hidden');
  document.getElementById('custom-step-1').classList.remove('hidden');
});

// Step 2 -> Step 3
document.getElementById('custom-confirm-btn').addEventListener('click', () => {
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
  if (!valid) { showAlert('Please fill in all player names, jersey numbers, and sizes.'); return; }

  document.getElementById('custom-step-2').classList.add('hidden');
  document.getElementById('custom-step-3').classList.remove('hidden');

  const sessionUser = JSON.parse(localStorage.getItem('nxtplay-current-user') || 'null');
  if (sessionUser) {
    const users = JSON.parse(localStorage.getItem('nxtplay-users') || '[]');
    const profile = users.find(u => u.email === sessionUser.email);
    if (profile) {
      document.getElementById('custom-del-name').value = profile.fullname || '';
      document.getElementById('custom-del-phone').value = profile.phone || '';
      document.getElementById('custom-del-address').value = profile.street || '';
      document.getElementById('custom-del-city').value = profile.city || '';
      document.getElementById('custom-del-zip').value = profile.zip || '';
    }
  }
});

// Delivery toggle
document.querySelectorAll('.custom-delivery-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.custom-delivery-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    selectedDelivery = this.dataset.value;
    document.getElementById('custom-delivery-fields').classList.toggle('hidden', selectedDelivery !== 'Delivery');
    const qty = document.getElementById('input-qty').value;
    const estimateBox = document.getElementById('custom-shipping-estimate');
    const feeText = document.getElementById('custom-shipping-fee-text');
    if (selectedDelivery === 'Delivery' && qty) {
      const fee = getShippingFee(qty);
      if (fee != null) { feeText.textContent = `₱${fee}`; estimateBox.classList.remove('hidden'); }
    } else {
      estimateBox.classList.add('hidden');
    }
  });
});

// Payment toggle
document.querySelectorAll('.custom-payment-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.custom-payment-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    selectedPayment = this.dataset.value;
    document.getElementById('custom-gcash-field').classList.toggle('hidden', selectedPayment !== 'GCash');
  });
});

// Step 3 -> Step 2
document.getElementById('custom-back-btn-3').addEventListener('click', () => {
  document.getElementById('custom-step-3').classList.add('hidden');
  document.getElementById('custom-step-2').classList.remove('hidden');
});

// Step 3 -> Summary
document.getElementById('custom-review-btn').addEventListener('click', () => {
  if (selectedDelivery === 'Delivery') {
    const name = document.getElementById('custom-del-name').value.trim();
    const phone = document.getElementById('custom-del-phone').value.trim();
    const address = document.getElementById('custom-del-address').value.trim();
    const city = document.getElementById('custom-del-city').value.trim();
    const zip = document.getElementById('custom-del-zip').value.trim();
    if (!name || !phone || !address || !city || !zip) {
      showAlert('Please fill in all delivery details.');
      return;
    }
  }
  if (selectedPayment === 'GCash') {
    const ref = document.getElementById('custom-gcash-ref').value.trim();
    if (!ref) { showAlert('Please enter your GCash reference number.'); return; }
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
  let addonTotal = 0;
  const addons = [];
  if (addonSleeves) { addonTotal += 50; addons.push('Arm Sleeves (+₱50/pc)'); }
  if (addonTights)  { addonTotal += 80; addons.push('Compression Tights (+₱80/pc)'); }

  const paymentSummary = selectedPayment === 'GCash'
    ? `GCash (Ref: ${document.getElementById('custom-gcash-ref').value})`
    : selectedPayment;

  let addressSummary = '—';
  if (selectedDelivery === 'Delivery') {
    const n = document.getElementById('custom-del-name').value;
    const p = document.getElementById('custom-del-phone').value;
    const a = document.getElementById('custom-del-address').value;
    const c = document.getElementById('custom-del-city').value;
    const z = document.getElementById('custom-del-zip').value;
    addressSummary = `${n} · ${p}\n${a}, ${c} ${z}`;
  }

  // Pricing
  savedShippingFee = selectedDelivery === 'Delivery' ? getShippingFee(qty) : null;
  const shippingText = savedShippingFee != null ? `₱${savedShippingFee}` : 'Free (Pickup)';
  const setExtra = selectedSet === 'Full Set' ? 100 : 0;
  const effectivePrice = JERSEY_PRICE + setExtra + addonTotal;
  const jerseySubtotal = parseInt(qty) * effectivePrice;
  const grandTotal = jerseySubtotal + (savedShippingFee != null ? savedShippingFee : 0);

  document.getElementById('sum-sleeve').textContent = selectedSleeve;
  document.getElementById('sum-set').textContent = selectedSet;
  document.getElementById('sum-addons').textContent = addons.length > 0 ? addons.join(', ') : 'None';
  document.getElementById('sum-qty').textContent = qty + ' jerseys';
  document.getElementById('sum-players').textContent = playerSummary;
  document.getElementById('sum-file').textContent = uploadedFileName;
  document.getElementById('sum-price-per').textContent = `₱${effectivePrice}`;
  document.getElementById('sum-jersey-subtotal').textContent = `₱${jerseySubtotal.toLocaleString()}`;
  document.getElementById('sum-grand-total').textContent = `₱${grandTotal.toLocaleString()}`;
  document.getElementById('sum-delivery').textContent = selectedDelivery;
  document.getElementById('sum-payment').textContent = paymentSummary;
  document.getElementById('sum-address').textContent = addressSummary;
  document.getElementById('sum-address').style.whiteSpace = 'pre-line';
  document.getElementById('sum-address-row').classList.toggle('hidden', selectedDelivery === 'Pickup');
  document.getElementById('sum-shipping').textContent = shippingText;
  document.getElementById('sum-shipping-row').classList.toggle('hidden', selectedDelivery === 'Pickup');

  document.getElementById('custom-step-3').classList.add('hidden');
  document.getElementById('custom-form-wrapper').classList.add('hidden');
  document.getElementById('custom-summary').classList.remove('hidden');
});

// Summary -> Step 3
document.getElementById('summary-back-btn').addEventListener('click', () => {
  document.getElementById('custom-summary').classList.add('hidden');
  document.getElementById('custom-form-wrapper').classList.remove('hidden');
  document.getElementById('custom-step-3').classList.remove('hidden');
});

// Place Order
document.getElementById('place-order-btn').addEventListener('click', () => {
  const currentUser = JSON.parse(localStorage.getItem('nxtplay-current-user') || 'null');
  if (!currentUser) { window.location.href = '../login.html'; return; }

  const order = {
    id: Date.now(),
    design: 'Custom Design',
    colorway: 'Custom',
    sleeve: document.getElementById('sum-sleeve').textContent,
    set: document.getElementById('sum-set').textContent,
    addons: document.getElementById('sum-addons').textContent,
    qty: document.getElementById('sum-qty').textContent,
    price: document.getElementById('sum-jersey-subtotal').textContent,
    shippingFee: savedShippingFee != null ? `₱${savedShippingFee}` : null,
    grandTotal: document.getElementById('sum-grand-total').textContent,
    players: document.getElementById('sum-players').textContent,
    file: uploadedFileName,
    delivery: document.getElementById('sum-delivery').textContent,
    payment: document.getElementById('sum-payment').textContent,
    address: document.getElementById('sum-address').textContent,
    status: 'Pending',
    date: new Date().toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })
  };

  const orderKey = `nxtplay-orders-${currentUser.email}`;
  const existing = JSON.parse(localStorage.getItem(orderKey) || '[]');
  existing.push(order);
  localStorage.setItem(orderKey, JSON.stringify(existing));

  window.location.href = 'orders.html?success=1';
});