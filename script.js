// ===================================================
// 1. КОНФІГУРАЦІЯ, БАЗА ТА ЗВУКИ
// ===================================================
const districtCoords = {
    "Всі райони": "50.4501,30.5234",
    "Оболонь": "50.5050,30.5030",
    "Позняки": "50.3980,30.6330",
    "Центр": "50.4500,30.5230",
    "Голосієво": "50.3950,30.5070"
};

// Звук сповіщення
const notificationSound = new Audio('https://assets.mixkit.co');

const allMoms = [
    { 
        name: "Олена", status: "🏃‍♀️ Йду в парк", dist: "300м", childAge: "1.2 р.", type: "walk", district: "Оболонь", 
        img: "mom1.jpg", backup: "https://images.unsplash.com",
        isOnline: true, isVerified: true 
    },
    { 
        name: "Марина", status: "☕ На каву", dist: "600м", childAge: "8 міс.", type: "coffee", district: "Позняки", 
        img: "mom2.jpg", backup: "https://images.unsplash.com",
        isOnline: false, isVerified: false 
    },
    { 
        name: "Світлана", status: "👶 Немовлята", dist: "1.2 км", childAge: "3 міс.", type: "baby", district: "Оболонь", 
        img: "mom3.jpg", backup: "https://images.unsplash.com",
        isOnline: true, isVerified: true 
    }
];

let currentFilter = 'all';
const getAvatar = (name) => `https://ui-avatars.com{encodeURIComponent(name)}&background=ff85a2&color=fff`;

// ===================================================
// 2. СИСТЕМА ЛАЙКІВ (ПОДВІЙНИЙ КЛІК)
// ===================================================
function likeAnimation(el) {
    const heart = el.querySelector('.heart-overlay');
    if (!heart) return;
    
    heart.style.opacity = '1';
    heart.style.transform = 'translate(-50%, -50%) scale(1.5)';
    
    setTimeout(() => {
        heart.style.opacity = '0';
        heart.style.transform = 'translate(-50%, -50%) scale(0)';
    }, 800);
    
    showToast("Вам сподобалось! ❤️");
}

// ===================================================
// 3. ФІЛЬТРАЦІЯ ТА МАПА
// ===================================================
function changeTab(tabName) {
    const content = document.getElementById('content');
    if (!content) return;
    content.style.opacity = '0';
    setTimeout(() => {
        window.scrollTo(0, 0);
        if (tabName === 'map') renderMap(content);
        else if (tabName === 'profile') renderProfile(content);
        content.style.transition = 'opacity 0.3s ease-in-out';
        content.style.opacity = '1';
    }, 200);
}

function renderMap(content) {
    const myDist = localStorage.getItem('userDistrict') || "Всі райони";
    const coords = districtCoords[myDist] || districtCoords["Всі райони"];
    const mapUrl = `https://staticmap.ie{coords}&zoom=14&size=400x250&maptype=mapnik&markers=${coords},red-pushpin`;
    
    content.innerHTML = `
        <div class="card" style="padding: 0; background: none; box-shadow: none;">
            <h3 style="margin: 15px 10px;">${myDist === 'Всі райони' ? 'Матусі Києва' : 'Поруч ('+myDist+')'}</h3>
            <div style="padding: 0 10px 15px;">
                <img src="${mapUrl}" style="width: 100%; height: 180px; border-radius: 20px; border: 2px solid #ff85a2; object-fit: cover;">
            </div>
            <div style="padding: 0 10px 10px;">
                <input type="text" id="searchInput" oninput="filterMoms(currentFilter)" placeholder="Пошук..." 
                       style="width: 100%; padding: 15px; border-radius: 25px; border: 1px solid #ddd; box-sizing: border-box;">
            </div>
            <div id="moms-list"></div>
        </div>`;
    filterMoms(currentFilter);
}

function filterMoms(type) {
    const list = document.getElementById('moms-list');
    const selectedDist = localStorage.getItem('userDistrict') || "Всі райони";
    const query = document.getElementById('searchInput')?.value.toLowerCase() || "";

    const filtered = allMoms.filter(mom => {
        const matchesDistrict = (selectedDist === "Всі райони" || mom.district === selectedDist);
        const matchesSearch = mom.name.toLowerCase().includes(query);
        return matchesDistrict && matchesSearch;
    }).sort((a, b) => b.isOnline - a.isOnline);
    
    list.innerHTML = filtered.map(mom => `
        <div class="mom-card" style="background:white; margin:12px 0; padding:15px; border-radius:20px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
            <div style="display:flex; align-items:center; cursor:pointer;" onclick="viewMomDetails('${mom.name}')">
                <div style="position:relative;">
                    <img src="${mom.img}" onerror="this.src='${mom.backup}';" style="width:60px; height:60px; border-radius:50%; object-fit:cover; border: 2px solid ${mom.isOnline ? '#4CAF50' : '#eee'};">
                    ${mom.isVerified ? '<div style="position:absolute; top:-2px; right:-2px; background:#007bff; color:white; border-radius:50%; width:18px; height:18px; font-size:10px; display:flex; align-items:center; justify-content:center; border:2px solid white;">✔</div>' : ''}
                </div>
                <div style="flex:1; margin-left:15px;">
                    <h4 style="margin:0;">${mom.name}, <small>${mom.childAge}</small></h4>
                    <p style="color:#ff85a2; font-size:13px; margin:3px 0; font-weight:bold;">${mom.status}</p>
                </div>
            </div>
            <div style="display:flex; gap:8px; margin-top:12px; border-top:1px solid #f5f5f5; padding-top:10px;">
                <button onclick="quickMessage('${mom.name}', 'Привіт! 👋')" style="flex:1; background:#f0f0f0; border:none; padding:10px; border-radius:12px; font-size:12px; font-weight:bold; cursor:pointer;">Привіт! 👋</button>
                <button onclick="openChat('${mom.name}', '${mom.img}', '${mom.backup}')" style="background:#ff85a2; color:white; border:none; padding:10px 20px; border-radius:12px; font-size:12px; font-weight:bold; cursor:pointer;">Чат</button>
            </div>
        </div>`).join('');
}

// ===================================================
// 4. СТОРІНКА МАТУСІ ТА ВЕРИФІКАЦІЯ ДІЯ
// ===================================================
function viewMomDetails(name) {
    const mom = allMoms.find(m => m.name === name);
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="card" style="padding: 0; position: relative;">
            <button onclick="changeTab('map')" style="position: absolute; top: 15px; left: 15px; background: white; border: none; border-radius: 50%; width: 40px; height: 40px; font-size: 20px; z-index: 10; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">←</button>
            <div class="avatar-container" ondblclick="likeAnimation(this)" style="width: 100%; height: 350px; overflow: hidden; border-radius: 20px 20px 0 0; position: relative; cursor: pointer;">
                <img src="${mom.img}" onerror="this.src='${mom.backup}'" style="width: 100%; height: 100%; object-fit: cover;">
                <div class="heart-overlay" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0); color: white; font-size: 80px; opacity: 0; pointer-events: none; transition: 0.3s;">❤️</div>
            </div>
            <div style="padding: 20px; text-align: left;">
                <h2>${mom.name}, ${mom.childAge}</h2>
                <p style="color:#ff85a2; font-weight:bold; margin: 10px 0;">${mom.status}</p>
                <p style="color: #666;">📍 ${mom.district} • ${mom.isVerified ? 'Верифіковано Дія 🔵' : ''}</p>
                <button onclick="openChat('${mom.name}', '${mom.img}', '${mom.backup}')" style="width: 100%; margin-top: 20px; padding: 15px; background: #ff85a2; color: white; border: none; border-radius: 12px; font-weight: bold; cursor: pointer;">Написати матусі</button>
            </div>
        </div>`;
}

function startDiiaVerification() {
    const btn = document.getElementById('diiaBtn');
    btn.innerHTML = "🌀 Очікування підпису Дія...";
    setTimeout(() => {
        localStorage.setItem('userVerified', 'true');
        showToast("Успішно верифіковано! ✅");
        notificationSound.play().catch(()=>{});
        changeTab('profile');
    }, 2500);
}

// ===================================================
// 5. ЧАТ (ENTER + ТИПІНГ + ЗВУК)
// ===================================================
function quickMessage(name, text) {
    const mom = allMoms.find(m => m.name === name);
    showToast("Надсилаю швидку відповідь...");
    setTimeout(() => {
        openChat(name, mom.img, mom.backup);
        const msgBox = document.getElementById('chat-messages');
        msgBox.innerHTML += `<div style="align-self:flex-end; background:#ff85a2; color:white; padding:10px 15px; border-radius:15px; margin-bottom:10px;">${text}</div>`;
        msgBox.scrollTop = msgBox.scrollHeight;
        
        simulateResponse(name);
    }, 500);
}

function openChat(name, img, backup) {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="card" style="height: 85vh; display: flex; flex-direction: column;">
            <div style="display:flex; align-items:center; padding:15px; border-bottom:1px solid #eee;">
                <button onclick="changeTab('map')" style="background:none; border:none; color:#ff85a2; font-size:24px; cursor:pointer;">←</button>
                <img src="${img}" onerror="this.src='${backup}'" style="width:40px; height:40px; border-radius:50%; margin-left:10px; object-fit: cover;">
                <h4 style="margin-left:15px;">${name}</h4>
            </div>
            <div id="chat-messages" style="flex:1; overflow-y:auto; padding:15px; display:flex; flex-direction:column; gap:10px;"></div>
            <div id="typing-indicator" style="display:none; color:#888; font-size:12px; padding:5px 20px;">${name} друкує...</div>
            <div style="display:flex; padding:10px; gap:10px; border-top:1px solid #eee;">
                <input type="text" id="messageInput" placeholder="Напишіть..." style="flex:1; padding:12px; border-radius:20px; border:1px solid #ddd;" onkeypress="if(event.key==='Enter') sendMessage('${name}')">
                <button onclick="sendMessage('${name}')" style="background:#ff85a2; color:white; border:none; width:45px; height:45px; border-radius:50%; cursor:pointer;">></button>
            </div>
        </div>`;
    document.getElementById('messageInput').focus();
}

function sendMessage(name) {
    const input = document.getElementById('messageInput');
    const msgBox = document.getElementById('chat-messages');
    if (!input.value.trim()) return;

    msgBox.innerHTML += `<div style="align-self:flex-end; background:#ff85a2; color:white; padding:10px 15px; border-radius:15px;">${input.value}</div>`;
    input.value = "";
    msgBox.scrollTop = msgBox.scrollHeight;
    simulateResponse(name);
}

function simulateResponse(name) {
    const typing = document.getElementById('typing-indicator');
    const msgBox = document.getElementById('chat-messages');
    setTimeout(() => {
        typing.style.display = 'block';
        msgBox.scrollTop = msgBox.scrollHeight;
        setTimeout(() => {
            typing.style.display = 'none';
            notificationSound.play().catch(()=>{});
            msgBox.innerHTML += `<div style="align-self:flex-start; background:#f0f0f0; padding:10px 15px; border-radius:15px;">Зрозуміло! До зустрічі 👋</div>`;
            msgBox.scrollTop = msgBox.scrollHeight;
        }, 1800);
    }, 600);
}

// ===================================================
// 6. ПРОФІЛЬ ТА ЗБЕРЕЖЕННЯ
// ===================================================
function renderProfile(content) {
    const name = localStorage.getItem('userName') || "Матуся";
    const isVerified = localStorage.getItem('userVerified') === 'true';
    const dist = localStorage.getItem('userDistrict') || "Всі райони";
    const childAge = localStorage.getItem('userChildAge') || "1 рік";
    const status = localStorage.getItem('userStatus') || "Йду гуляти";

    content.innerHTML = `
        <div class="card" style="text-align:center; padding:25px 20px;">
            <div ondblclick="likeAnimation(this)" style="position:relative; display:inline-block; cursor:pointer;">
                <img src="${getAvatar(name)}" style="width:110px; height:110px; border-radius:50%; border:4px solid #ff85a2;">
                ${isVerified ? '<div style="position: absolute; bottom: 5px; right: 5px; background: #007bff; color: white; border-radius: 50%; width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; border: 3px solid white;">✔</div>' : ''}
                <div class="heart-overlay" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0); color: white; font-size: 50px; opacity: 0; pointer-events: none; transition: 0.3s;">❤️</div>
            </div>
            <h3>Мій профіль</h3>
            ${!isVerified ? `<button id="diiaBtn" onclick="startDiiaVerification()" style="width:100%; padding:14px; background:#fff; border:2px solid #000; border-radius:15px; font-weight:bold; cursor:pointer; margin-bottom:15px;">Верифікація Дія</button>` : ''}
            <input type="text" id="nameInput" value="${name}" placeholder="Ім'я" style="width:100%; padding:12px; margin-bottom:10px; border-radius:10px; border:1px solid #ddd;">
            <input type="text" id="childAgeInput" value="${childAge}" placeholder="Вік дитини" style="width:100%; padding:12px; margin-bottom:10px; border-radius:10px; border:1px solid #ddd;">
            <input type="text" id="statusInput" value="${status}" placeholder="Мій статус" style="width:100%; padding:12px; margin-bottom:15px; border-radius:10px; border:1px solid #ddd;">
            <select id="districtInput" style="width:100%; padding:12px; margin-bottom:20px; border-radius:10px; border:1px solid #ddd;">
                ${Object.keys(districtCoords).map(d => `<option value="${d}" ${dist === d ? 'selected' : ''}>${d}</option>`).join('')}
            </select>
            <button onclick="saveProfile()" style="width:100%; padding:16px; background:#ff85a2; color:white; border:none; border-radius:15px; font-weight:bold; cursor:pointer;">Зберегти</button>
        </div>`;
}

function saveProfile() {
    localStorage.setItem('userName', document.getElementById('nameInput').value);
    localStorage.setItem('userDistrict', document.getElementById('districtInput').value);
    localStorage.setItem('userChildAge', document.getElementById('childAgeInput').value);
    localStorage.setItem('userStatus', document.getElementById('statusInput').value);
    showToast("Дані оновлено! ✨");
    setTimeout(() => changeTab('map'), 800);
}

function showToast(msg) {
    const t = document.createElement('div');
    t.innerText = msg;
    t.style.cssText = "position:fixed; bottom:90px; left:50%; transform:translateX(-50%); background:rgba(0,0,0,0.8); color:white; padding:10px 20px; border-radius:20px; font-size:12px; z-index:10000;";
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2500);
}

window.onload = () => changeTab('map');
