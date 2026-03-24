
const packages = [
  {id:1,cards:25,total:500,down:125,fees:125,net:250},
  {id:2,cards:50,total:1000,down:250,fees:250,net:500},
  {id:3,cards:75,total:1500,down:375,fees:325,net:800},
  {id:4,cards:94,total:1880,down:470,fees:410,net:1000},
  {id:5,cards:100,total:2000,down:500,fees:450,net:1050},
  {id:6,cards:125,total:2500,down:625,fees:575,net:1300}
];

let selectedPackage = null;

document.getElementById("packageSelect").addEventListener("change", function(){
  const pkg = packages.find(p => p.id == this.value);
  if(!pkg) return;

  selectedPackage = pkg;

  document.getElementById("result").innerHTML = `
    <p>عدد البطاقات: ${pkg.cards}</p>
    <p>القيمة: ${pkg.total} ريال</p>
    <p>الدفعة الأولى: ${pkg.down} ريال</p>
    <p>الرسوم: ${pkg.fees} ريال</p>
    <hr>
    <p class="net">الربح: ${pkg.net} ريال</p>
  `;
});

function sendWhatsApp() {
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phoneInput").value;

  if (!name || !phone || !selectedPackage) {
    alert("أكمل البيانات");
    return;
  }

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

function generatePDF() {
  const element = document.querySelector(".card");

  html2pdf().from(element).save("tera-order.pdf");
}
