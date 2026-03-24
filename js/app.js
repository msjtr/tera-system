let selectedPlan = null;

document.addEventListener("DOMContentLoaded", () => {

  window.selectPlan = function(btn) {
    document.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));

    const card = btn.parentElement;
    card.classList.add('selected');

    selectedPlan = {
      name: card.dataset.plan,
      amount: card.dataset.amount,
      net: card.dataset.net
    };

    btn.innerText = "تم الاختيار ✓";
  };

  // التحكم في الدفعة
  document.querySelectorAll('input[name="payment"]').forEach(radio => {
    radio.addEventListener('change', e => {
      const value = e.target.value;

      document.querySelectorAll('.down-payment').forEach(el => {
        if (value === "yes") {
          el.classList.add('hidden'); // نخفي الدفعة فقط
        } else {
          el.classList.remove('hidden');
        }
      });
    });
  });

  window.confirmOrder = function() {

    if (!selectedPlan) {
      alert("اختر باقة");
      return;
    }

    const name = document.getElementById("firstName").value;
    const mobile = document.getElementById("mobile").value;

    if (!name || !mobile) {
      alert("أكمل البيانات");
      return;
    }

    const modal = document.getElementById("modal");
    const text = document.getElementById("modalText");
    const loader = document.getElementById("loader");

    modal.style.display = "flex";
    loader.style.display = "block";
    text.innerText = "جاري إرسال الطلب...";

    setTimeout(() => {
      loader.style.display = "none";
      text.innerText = "تم إرسال الطلب بنجاح ✅";

      const phone = "966555698774";

      const msg = `طلب جديد - منصة تيرا

الاسم: ${name}
الجوال: ${mobile}

الشريحة: ${selectedPlan.name}
القيمة: ${selectedPlan.amount}
الصافي: ${selectedPlan.net}`;

      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`);
    }, 2000);
  };

  window.closeModal = function() {
    document.getElementById("modal").style.display = "none";
    location.reload();
  };

  window.resetForm = function() {
    location.reload();
  };

});
