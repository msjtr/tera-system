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

/* MODE */
function setMode(m, el){
mode = m;

document.querySelectorAll(".question button").forEach(b=>b.classList.remove("active"));
el.classList.add("active");

currentPage = 0;
renderSlider();
}

/* RENDER */
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
<p>${item.total} ريال</p>
${mode==="no"? `<p>دفعة: ${item.down}</p>`:""}
<p>رسوم: ${item.fees}</p>
<strong>${net} ريال</strong>
</div>
`;
});

slide += `</div>`;
pages.push(slide);
}

slider.innerHTML = pages.join("");
updateSlider();
renderProgress();

if(!swipeInitialized){
initSwipe();
swipeInitialized = true;
}
}

/* SLIDE MOVE */
function updateSlider(){
document.getElementById("slider").style.transform =
`translateX(${currentPage * -100}%)`;
}

/* PROGRESS */
function renderProgress(){
let total = Math.ceil(data.length/2);
document.getElementById("pagination").innerHTML = `
<div class="progress-bar">
<div class="progress" style="width:${((currentPage+1)/total)*100}%"></div>
</div>`;
}

/* SELECT */
function selectPlan(i){
selectedPlan = data[i];
document.querySelectorAll(".plan").forEach(p=>p.classList.remove("active"));
document.getElementById("plan-"+i).classList.add("active");
}

/* NAV */
function next(){
if(currentPage < Math.ceil(data.length/2)-1){
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

/* SWIPE */
function initSwipe(){

let container = document.querySelector(".slider-container");
let slider = document.getElementById("slider");

let startX = 0;
let currentX = 0;
let isDragging = false;

container.addEventListener("mousedown", start);
container.addEventListener("touchstart", start);

container.addEventListener("mousemove", move);
container.addEventListener("touchmove", move);

container.addEventListener("mouseup", end);
container.addEventListener("mouseleave", end);
container.addEventListener("touchend", end);

function start(e){
isDragging = true;
startX = e.touches ? e.touches[0].clientX : e.clientX;
slider.style.transition = "none";
}

function move(e){
if(!isDragging) return;
currentX = (e.touches ? e.touches[0].clientX : e.clientX) - startX;
slider.style.transform =
`translateX(calc(${currentPage * -100}% + ${currentX}px))`;
}

function end(){
if(!isDragging) return;

if(currentX < -60) next();
else if(currentX > 60) prev();
else updateSlider();

isDragging = false;
currentX = 0;
}
}

/* CONFIRM */
function confirmOrder(){
if(!selectedPlan || !mode){
alert("اختر الشريحة وطريقة الدفع");
return;
}

let msg = `طلب منصة تيرا
${selectedPlan.title}
القيمة: ${selectedPlan.total}`;

window.open("https://wa.me/966555698774?text="+encodeURIComponent(msg));
}

/* RESET */
function resetAll(){
location.reload();
}

/* AUTO START */
window.onload = () => {
let btn = document.querySelector('.question button:last-child');
setMode('no', btn);
};
