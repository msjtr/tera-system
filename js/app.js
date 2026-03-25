let mode = "";
let currentPage = 0;
let selectedPlan = null;

const data = [
{title:"الشريحة الأولى", total:500, down:125, fees:125},
{title:"الشريحة الثانية", total:1000, down:250, fees:250},
{title:"الشريحة الثالثة", total:1500, down:375, fees:325},
{title:"الشريحة الرابعة", total:1880, down:470, fees:410},
{title:"الشريحة الخامسة", total:2000, down:500, fees:450},
{title:"الشريحة السادسة", total:2500, down:625, fees:575}
];

function setMode(m, el){
mode = m;

document.querySelectorAll(".question button").forEach(b=>b.classList.remove("active"));
el.classList.add("active");

currentPage = 0;
render();
}

function render(){

let start = currentPage * 2;
let items = data.slice(start, start+2);

let html = "";

items.forEach((item,i)=>{

let realIndex = start + i;

let net = mode==="yes"
? item.total - item.fees
: item.total - item.down - item.fees;

html += `
<div class="plan" onclick="selectPlan(${realIndex})" id="plan-${realIndex}">
<h3>${item.title}</h3>
<p>القيمة: ${item.total}</p>
${mode==="no" ? `<p>الدفعة: ${item.down}</p>` : ""}
<p>الرسوم: ${item.fees}</p>
<strong>الصافي: ${net}</strong>
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

function next(){
if(currentPage < Math.ceil(data.length/2)-1){
currentPage++;
render();
}
}

function prev(){
if(currentPage > 0){
currentPage--;
render();
}
}

/* تشغيل تلقائي */
window.onload = () => {
let btn = document.querySelector('.question button:last-child');
setMode('no', btn);
};
