const packages = [
  {id:1,total:500,net:250},
  {id:2,total:1000,net:500},
  {id:3,total:1500,net:800},
  {id:4,total:1880,net:1000},
  {id:5,total:2000,net:1050},
  {id:6,total:2500,net:1300}
];

let selectedPackage = null;

document.getElementById("packageSelect").addEventListener("change", function(){
  const pkg = packages.find(p => p.id == this.value);
  if(!pkg) return;

  selectedPackage = pkg;

  document.getElementById("result").innerHTML = `
    <p>القيمة: ${pkg.total} ريال</p>
    <p class="net">الربح: ${pkg.net} ريال</p>
  `;
});

function confirmOrder() {

  const first = document.getElementById("firstName").value;
  const second = document.getElementById("secondName").value;
  const third = document.getElementById("thirdName").value;
  const phone = document.getElementById("phone").value;

  if (!first || !second || !third || !phone || !selectedPackage) {
    alert("أكمل البيانات");
    return;
  }

  const fullName = `${first} ${second} ${third}`;

  if (!confirm("هل ترغب بإرسال الطلب؟")) return;

  generatePDF(fullName, phone);

  setTimeout(() => {
    sendWhatsApp(fullName, phone);
  }, 3000);
}

function cancelOrder() {
  location.reload();
}

function generatePDF(name, phone) {
  const element = document.querySelector(".card");
  html2pdf().from(element).save("tera-order.pdf");
}

function sendWhatsApp(name, phone) {
  const msg = `
طلب جديد

الاسم: ${name}
الجوال: 966${phone}

الشريحة: ${selectedPackage.id}
القيمة: ${selectedPackage.total}
الربح: ${selectedPackage.net}
  `;

  window.open("https://wa.me/966555698774?text=" + encodeURIComponent(msg));
}
