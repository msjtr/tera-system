let mode = "";
let currentPage = 0;
let selectedPlan = null;
let swipeInitialized = false;

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

currentPage = 0;
renderSlider();
}

function renderSlider(){

let slider = document.getElementById("slider");
let pages = [];

for(let i=0;i<data.length;i+=2){

let items = data.slice(i,i+2);

let slide = `<div class="slide">`;

items.forEach((item,index)=>{

let realIndex = i+index;

let net = mode==="yes"
? item.total - item.fees
: item.total - item.down - item.fees;

slide += `
<div class="plan" onclick="selectPlan(${realIndex})" id="plan-${realIndex}">
<h3>${item.title}</h3>
<p>القيمة: ${item.total} ريال</p>
${mode==="no"? `<p>الدفعة: ${item.down} ريال</p>`:""}
<p>الرسوم: ${item.fees} ريال</p>
<strong>الصافي: ${net} ريال</strong>
</div>
`;
});

slide += `</div>`;
pages.push(slide);
}

slider.innerHTML = pages.join("");

updateSlider(true);
renderProgress();

if(!swipeInitialized){
initSwipe();
swipeInitialized = true;
}
}

function updateSlider(smooth=true){
let container = document.querySelector(".slider-container");
let slider = document.getElementById("slider");slider.style.transition = smooth ? "transform 0.4s ease" : "none";
slider.style.transform = `translateX(${currentPage * -100}%)`;
}

function renderProgress(){
let total = Math.ceil(data.length/2);

document.getElementById("pagination").innerHTML = `
<div class="progress-bar">
<div class="progress" style="width:${((currentPage+1)/total)*100}%"></div>
</div>
`;
}

function selectPlan(i){
selectedPlan = data[i];
document.querySelectorAll(".plan").forEach(p=>p.classList.remove("active"));
document.getElementById("plan-"+i).classList.add("active");
}

function next(){
let max = Math.ceil(data.length/2)-1;
if(currentPage < max){
currentPage++;
updateSlider();
renderProgress();
}
}

function prev(){
if(currentPage > 0){
currentPage--;
updateSlider();
renderProgress();
}
}

/* ===== SWIPE FIXED ===== */
function initSwipe(){

let container = document.querySelector(".slider-container");
let slider = document.getElementById("slider");

let startX = 0;
let currentX = 0;
let isDragging = false;

/* START */
function start(e){
isDragging = true;
startX = e.touches ? e.touches[0].clientX : e.clientX;
slider.style.transition = "none";
}

/* MOVE */
function move(e){
if(!isDragging) return;

currentX = (e.touches ? e.touches[0].clientX : e.clientX) - startX;

slider.style.transform =
`translateX(calc(${currentPage * -100}% + ${currentX}px))`;
}

/* END */
function end(){
if(!isDragging) return;

if(currentX < -60) next();
else if(currentX > 60) prev();
else updateSlider();

isDragging = false;
currentX = 0;
}

/* 👇 المهم: الربط على الكونتينر */
container.addEventListener("mousedown", start);
container.addEventListener("touchstart", start);

container.addEventListener("mousemove", move);
container.addEventListener("touchmove", move);

container.addEventListener("mouseup", end);
container.addEventListener("mouseleave", end);
container.addEventListener("touchend", end);
}

function confirmOrder(){

let fname = document.getElementById("fname").value;
let lname = document.getElementById("lname").value;
let phone = document.getElementById("phone").value;

if(!fname || !lname || !phone || !selectedPlan || !mode){
alert("أكمل البيانات");
return;
}

let net = mode==="yes"
? selectedPlan.total - selectedPlan.fees
: selectedPlan.total - selectedPlan.down - selectedPlan.fees;

let msg = `
طلب منصة تيرا

${selectedPlan.title}
القيمة: ${selectedPlan.total}
الصافي: ${net}
`;

window.open("https://wa.me/966555698774?text="+encodeURIComponent(msg));
}

function resetAll(){
location.reload();
}
