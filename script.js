const menu = document.querySelector(".menu");
const totalPrice = document.querySelector("#total-price");
const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

function calculateTotal() {
  if (!menu) return 0;

  return [...menu.querySelectorAll(".menu-item")].reduce((sum, item) => {
    const priceText = item.querySelector("p")?.textContent ?? "";
    const price = Number(priceText.replace(/\D/g, "")) || 0;
    const quantity = Number(item.querySelector(".quantity")?.value) || 0;
    return sum + price * quantity;
  }, 0);
}

function getDiscountRate(total) {
  if (total >= 100000) {
    return 0.2;
  } else if (total >= 50000) {
    return 0.1;
  } else {
    return 0;
  }
}

function updateTotal() {
  if (!totalPrice) return;
  totalPrice.textContent = rupiah.format(calculateTotal());
}

function normalizeQuantity(input) {
  const quantity = Number.parseInt(input.value, 10);
  const boundedQuantity = Math.min(99, Math.max(0, quantity || 0));
  input.value = boundedQuantity;
  return boundedQuantity;
}

document.addEventListener("click", (event) => {
  const button = event.target.closest(".qty-btn");
  if (!button) return;

  const input = button.closest(".item")?.querySelector(".quantity");
  if (!input) return;

  const current = normalizeQuantity(input);
  input.value = button.dataset.action === "increase"
    ? Math.min(99, current + 1)
    : Math.max(0, current - 1);
  updateTotal();
});

document.addEventListener("input", (event) => {
  if (!event.target.matches(".quantity")) return;

  normalizeQuantity(event.target);
  updateTotal();
});

updateTotal();

document.querySelectorAll(".navigation [data-alert]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    alert(link.dataset.alert);
  });
});

const checkoutButton = document.querySelector("#checkout-btn");
checkoutButton?.addEventListener("click", () => {
  const selectedItems = [...menu.querySelectorAll(".menu-item")].flatMap((item) => {
    const quantity = Number.parseInt(item.querySelector(".quantity")?.value, 10) || 0;
    if (quantity === 0) return [];

    const name = item.querySelector("h3")?.textContent?.trim() ?? "Menu";
    return [`${name}: ${quantity}`];
  });

  if (selectedItems.length === 0) {
    alert("Pilih minimal satu menu terlebih dahulu!");
    return;
  }

  const total = calculateTotal();
  const discountRate = getDiscountRate(total);
  const discount = total * discountRate;
  const payableTotal = total - discount;
  const discountText = discountRate === 0
    ? "Tidak ada diskon"
    : `${discountRate * 100}% (-${rupiah.format(discount)})`;

  alert(`PESANAN DITERIMA SILAKAN TUNGGU\nTerima kasih telah berbelanja!\n\nRingkasan pesanan:\n${selectedItems.join("\n")}\n\nTotal belanja: ${rupiah.format(total)}\nDiskon: ${discountText}\nTotal bayar: ${rupiah.format(payableTotal)}`);
});
