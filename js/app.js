let mode = "";
let selectedPlan = null;
let currentPage = 0;

const data = [
{title:"الشريحة الأولى", total:500, down:125, fees:125},
{title:"الشريحة الثانية", total:1000, down:250, fees:250},
{title:"الشريحة الثالثة", total:1500, down:375, fees:325},
{title:"الشريحة الرابعة", total:1880, down:470, fees:410},
{title:"الشريحة الخامسة", total:2000, down:500, fees:450},
{title:"الشريحة السادسة", total:2500, down:625, fees:575}
];

const perPage = 2;

function setMode(m,e){
    mode = m;

    document.querySelectorAll(".question button").forEach(b=>b.classList.remove("active"));
    e.target.classList.add("active");

    currentPage = 0;
    renderPlans();
}

function renderPlans(){

    let start = currentPage * perPage;
    let end = start + perPage;
    let items = data.slice(start, end);

    let html = "";

    items.forEach((item,index)=>{

        let realIndex = start + index;

        let net = mode==="yes"
        ? item.total - item.fees
        : item.total - item.down - item.fees;

        html += `
        <div class="plan" onclick="selectPlan(${realIndex})" id="plan-${realIndex}">
            <h3>${item.title}</h3>
            <p>القيمة: ${item.total} ريال</p>

            ${mode==="no" ? `<p>الدفعة: ${item.down} ريال</p>` : ""}

            <p>الرسوم: ${item.fees} ريال</p>
            <strong>الصافي: ${net} ريال</strong>
        </div>
        `;
    });

    document.getElementById("plans").innerHTML = html;
    renderPagination();
}

function selectPlan(i){
    selectedPlan = data[i];
    document.querySelectorAll(".plan").forEach(p=>p.classList.remove("active"));
    document.getElementById("plan-"+i).classList.add("active");
}

function renderPagination(){

    let totalPages = Math.ceil(data.length / perPage);

    let html = `
    <div class="pagination">

        <button onclick="goTo(0)">⏮</button>
        <button onclick="prev()">◀</button>

        <div class="dots">
    `;

    for(let i=0;i<totalPages;i++){
        html += `<span class="${i===currentPage?'active-dot':''}" onclick="goTo(${i})"></span>`;
    }

    html += `
        </div>

        <button onclick="next()">▶</button>
        <button onclick="goTo(${totalPages-1})">⏭</button>

    </div>
    `;

    document.getElementById("plans").innerHTML += html;
}

function next(){
    let max = Math.ceil(data.length / perPage) -1;
    if(currentPage < max){
        currentPage++;
        renderPlans();
    }
}

function prev(){
    if(currentPage > 0){
        currentPage--;
        renderPlans();
    }
}

function goTo(i){
    currentPage = i;
    renderPlans();
}
