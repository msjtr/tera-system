let mode = "";
let selectedPlan = null;

const data = [
{title:"الشريحة الأولى", total:500, down:125, fees:125},
{title:"الشريحة الثانية", total:1000, down:250, fees:250},
{title:"الشريحة الثالثة", total:1500, down:375, fees:325},
{title:"الشريحة الرابعة", total:1880, down:470, fees:410},
{title:"الشريحة الخامسة", total:2000, down:500, fees:450},
{title:"الشريحة السادسة", total:2500, down:625, fees:575}
];

function setMode(m,e){
mode = m;
document.querySelectorAll(".question button").forEach(b=>b.classList.remove("active"));
e.target.classList.add("active");
renderPlans();
}

function renderPlans(){

let html = "";

data.forEach((item,index)=>{

let net = mode==="yes"
? item.total - item.down - item.fees
: item.total - item.fees;

let badge = index === 2 ? `<div class="badge">⭐ الأكثر طلباً</div>` : "";

html += `
<div class="plan" onclick="selectPlan(${index})" id="plan-${index}">
${badge}
<h3>${item.title}</h3>
<p>القيمة: ${item.total} ريال</p>
${mode==="yes"? `<p>الدفعة: ${item.down}</p>`:""}
<p>الرسوم: ${item.fees}</p>
<strong>الصافي: ${net} ريال</strong>
</div>
`;
});

document.getElementById("plans").innerHTML = html;
}

function selectPlan(i){
selectedPlan = data[i];
document.querySelectorAll(".plan").forEach(p=>p.classList.remove("active"));
document.getElementById("plan-"+i).classList.add("active");
}

function confirmOrder(){

let fname = document.getElementById("fname").value;
let mname = document.getElementById("mname").value;
let lname = document.getElementById("lname").value;
let phone = document.getElementById("phone").value;

if(!fname || !lname || !phone || !selectedPlan || !mode){
alert("يرجى تعبئة البيانات واختيار الشريحة");
return;
}

if(!phone.startsWith("5") || phone.length !== 9){
alert("رقم الجوال غير صحيح");
return;
}

document.getElementById("modal").classList.remove("hidden");
document.getElementById("status").innerText = "جاري التحويل...";

let net = mode==="yes"
? selectedPlan.total - selectedPlan.down - selectedPlan.fees
: selectedPlan.total - selectedPlan.fees;

let msg = `
طلب جديد - منصة تيرا

الاسم: ${fname} ${mname} ${lname}
الجوال: ${phone}

${selectedPlan.title}
القيمة: ${selectedPlan.total}
الصافي: ${net} ريال

الدفع: ${mode==="yes"?"دفعة أولى":"دفع كامل"}
`;

let url = "https://wa.me/966555698774?text="+encodeURIComponent(msg);

setTimeout(()=>{
window.open(url);
closeModal();
},1500);

}

function resetAll(){
location.reload();
}

function closeModal(){
document.getElementById("modal").classList.add("hidden");
location.reload();
}
