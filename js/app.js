let selectedPlan = null;

// اختيار باقة
function selectPlan(btn) {
  const card = btn.parentElement;
  selectedPlan = {
    name: card.dataset.plan,
    amount: card.dataset.amount,
    net: card.dataset.net
  };

  alert("تم اختيار " + selectedPlan.name);
}

// تغيير الدفعة
document.querySelectorAll('input[name="payment"]').forEach(radio => {
  radio.addEventListener('change', e => {
    const value = e.target.value;

    document.querySelectorAll('.down-payment, .fees').forEach(el => {
      if (value === "yes") {
        el.classList.add('hidden');
      } else {
        el.classList.remove('hidden');
      }
    });
  });
});

// تأكيد الطلب
function confirmOrder() {
  if (!selectedPlan) return alert("اختر باقة");

  const name = document.getElementById("firstName").value;
  const mobile = document.getElementById("mobile").value;

  const modal = document.getElementById("modal");
  const text = document.getElementById("modalText");
  const loader = document.getElementById("loader");

  modal.style.display = "block";
  loader.style.display = "block";
  text.innerText = "جاري إرسال الطلب...";

  setTimeout(() => {
    loader.style.display = "none";
    text.innerText = "تم إرسال الطلب بنجاح";

    sendWhatsApp(name, mobile);
  }, 2000);
}

// واتساب
function sendWhatsApp(name, mobile) {
  const phone = "966555698774";

  const msg = `طلب جديد منصة تيرا
الاسم: ${name}
الجوال: ${mobile}

الشريحة: ${selectedPlan.name}
القيمة: ${selectedPlan.amount}
الصافي: ${selectedPlan.net}`;

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  window.open(url);
}

// اغلاق
function closeModal() {
  document.getElementById("modal").style.display = "none";
  resetForm();
}

// إعادة
function resetForm() {
  location.reload();
}
