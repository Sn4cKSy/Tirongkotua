// Fungsi untuk menggulir ke formulir pemesanan
function scrollToOrderForm() {
  document.getElementById('orderFormSection').scrollIntoView({ behavior: 'smooth' });
}

// Data harga produk
const productPrices = {
  "Gula Aren Bubuk": 25000,
  "Kripik Pisang Karamel - 100gr": 7000, // Harga untuk 100 gram
  "Kripik Pisang Karamel - 250gr": 17500, // Harga untuk 250 gram
  "Pia Mirah - Coklat": 20000, // Pia Mirah dengan rasa Coklat
  "Pia Mirah - Keju": 20000, // Pia Mirah dengan rasa Keju
  "Pia Mirah - Kacang Ijo": 20000, // Pia Mirah dengan rasa Kacang Ijo
};

// Inisialisasi event listener untuk baris produk pertama saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
  const initialRow = document.querySelector('.product-row');
  if (initialRow) {
    const productSelect = initialRow.querySelector('.product-select');
    const quantityInput = initialRow.querySelector('.quantity');

    // Tambahkan event listener untuk baris pertama
    productSelect.addEventListener('change', calculateTotal);
    quantityInput.addEventListener('input', calculateTotal);
  }
});

// Tambah baris produk
document.getElementById('addProduct').addEventListener('click', addProductRow);

function addProductRow() {
  // Cek apakah produk sudah ada di baris lain
  const existingProducts = Array.from(document.querySelectorAll('.product-select')).map(select => select.value);

  const newRow = document.createElement('div');
  newRow.className = 'product-row';
  newRow.innerHTML = `
      <select class="product-select">
          <option value="">Pilih Produk</option>
          <option value="Gula Aren Bubuk">Gula Aren Bubuk (Rp25,000)</option>
          <option value="Kripik Pisang Karamel - 100gr">Kripik Pisang Karamel - 100gr (Rp7,000)</option>
          <option value="Kripik Pisang Karamel - 250gr">Kripik Pisang Karamel - 250gr (Rp17,500)</option>
          <option value="Pia Mirah - Coklat">Pia Mirah - Coklat (Rp20,000)</option>
          <option value="Pia Mirah - Keju">Pia Mirah - Keju (Rp20,000)</option>
          <option value="Pia Mirah - Kacang Ijo">Pia Mirah - Kacang Ijo (Rp20,000)</option>
      </select>
      <input type="number" class="quantity" min="1" placeholder="Jumlah">
  `;
  document.getElementById('productRows').appendChild(newRow);

  // Tambah event listener untuk update total
  const productSelect = newRow.querySelector('.product-select');
  const quantityInput = newRow.querySelector('.quantity');

  productSelect.addEventListener('change', function () {
    const selectedProduct = this.value;
    if (existingProducts.includes(selectedProduct)) {
      alert('Produk ini sudah ditambahkan. Silakan pilih produk lain.');
      this.value = ''; // Reset pilihan produk
    } else {
      existingProducts.push(selectedProduct); // Tambahkan produk ke daftar
      calculateTotal(); // Hitung ulang total harga
    }
  });

  quantityInput.addEventListener('input', calculateTotal);
}

// Hitung total
function calculateTotal() {
  let grandTotal = 0;

  // Iterasi semua baris produk
  document.querySelectorAll('.product-row').forEach(row => {
    const productSelect = row.querySelector('.product-select');
    const quantityInput = row.querySelector('.quantity');

    const product = productSelect.value;
    const quantity = parseInt(quantityInput.value) || 0;

    if (product && quantity > 0) {
      grandTotal += productPrices[product] * quantity;
    }
  });

  // Update total harga
  document.getElementById('grandTotal').textContent = `Rp${grandTotal.toLocaleString()}`;
}

// Submit pesanan
function submitOrder() {
  const customerName = document.getElementById('customerName').value.trim();
  const orderDate = new Date().toLocaleDateString();
  const orderItems = [];

  // Kumpulkan data pesanan
  document.querySelectorAll('.product-row').forEach(row => {
    const product = row.querySelector('.product-select').value;
    const quantity = parseInt(row.querySelector('.quantity').value);
    if (product && quantity > 0) {
      orderItems.push({
        product,
        quantity,
        subtotal: productPrices[product] * quantity,
      });
    }
  });

  // Validasi
  if (!customerName || orderItems.length === 0) {
    alert('Harap isi nama pembeli dan minimal 1 produk!');
    return;
  }

  // Format pesan WhatsApp
  let message = `Halo, saya ingin memesan:\n\nNama: ${customerName}\n`;
  orderItems.forEach((item, index) => {
    message += `\n${index + 1}. ${item.product}\n`
             + `   Jumlah: ${item.quantity} pack\n`
             + `   Subtotal: Rp${item.subtotal.toLocaleString()}\n`;
  });
  message += `\nTotal Harga: Rp${document.getElementById('grandTotal').textContent.split('Rp')[1]}\n`
           + `Tanggal Pemesanan: ${orderDate}\n\nTerima kasih!`;

  // Copy pesan ke clipboard
  navigator.clipboard.writeText(message).then(() => {
    alert('Pesan telah disalin ke clipboard. Silakan paste di WhatsApp.');
  }).catch(err => {
    console.error('Gagal menyalin pesan: ', err);
    alert('Gagal menyalin pesan. Silakan coba lagi.');
  });

  // Buka WhatsApp dengan pesan yang diformat
  const whatsappUrl = `https://wa.me/6285245415605?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
}