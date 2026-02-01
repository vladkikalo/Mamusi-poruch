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

const allMoms = [
    {
        name: "Олена", status: "🏃‍♀️ Йду в парк", dist: "300м", childAge: "1.2 р.", type: "walk", district: "Оболонь",
        img: "mom1.jpg",
        isOnline: true, isVerified: true
    },
    {
        name: "Марина", status: "☕ На каву", dist: "600м", childAge: "8 міс.", type: "coffee", district: "Позняки",
        img: "mom2.jpg",
        isOnline: false, isVerified: false
    },
    {
        name: "Світлана", status: "👶 Немовлята", dist: "1.2 км", childAge: "3 міс.", type: "baby", district: "Оболонь",
        img: "mom3.jpg",
        isOnline: true, isVerified: true
    }
];

let currentFilter = 'all';
const getAvatar = (name) => `https://ui-avatars.com{encodeURIComponent(name)}&background=ff85a2&color=fff`;

// ===================================================
// 2. ГОЛОВНИЙ ЕКРАН ТА ФІЛЬТРАЦІЯ
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
                <input type="text" id="searchInput" oninput="filterMoms(currentFilter)" placeholder="Пошук за ім'ям..."
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
                    <img src="${mom.img}" style="width:60px; height:60px; border-radius:50%; object-fit:cover; border: 2px solid ${mom.isOnline ? '#4CAF50' : '#eee'};">
                    ${mom.isVerified ? '<div style="position:absolute; top:-2px; right:-2px; background:#007bff; color:white; border-radius:50%; width:18px; height:18px; font-size:10px; display:flex; align-items:center; justify-content:center; border:2px solid white;">✔</div>' : ''}
                    ${mom.isOnline ? '<div style="position:absolute; bottom:2px; right:2px; width:12px; height:12px; background:#4CAF50; border:2px solid white; border-radius:50%;"></div>' : ''}
                </div>
                <div style="flex:1; margin-left:15px;">
                    <h4 style="margin:0;">${mom.name}, <small style="color:#888;">${mom.childAge}</small></h4>
                    <p style="color:#ff85a2; font-size:13px; margin:3px 0; font-weight:bold;">${mom.status}</p>
                </div>
            </div>
            <div style="display:flex; gap:8px; margin-top:12px; border-top:1px solid #f5f5f5; padding-top:10px;">
                <button onclick="quickMessage('${mom.name}', 'Привіт! 👋')" style="flex:1; background:#f0f0f0; border:none; padding:10px; border-radius:12px; font-size:12px; font-weight:bold; cursor:pointer;">Привіт! 👋</button>
                <button onclick="openChat('${mom.name}', '${mom.img}')" style="background:#ff85a2; color:white; border:none; padding:10px 20px; border-radius:12px; font-size:12px; font-weight:bold; cursor:pointer;">Чат</button>
            </div>
        </div>`).join('');
}

// ===================================================
// 3. ЧАТ, ВЕРИФІКАЦІЯ ТА ШВИДКІ ПОВІДОМЛЕННЯ
// ===================================================
function quickMessage(name, text) {
    const mom = allMoms.find(m => m.name === name);
    showToast(`Надіслано! 📩`);
    setTimeout(() => {
        openChat(name, mom.img);
        const msgBox = document.getElementById('chat-messages');
        msgBox.innerHTML += `<div style="align-self:flex-end; background:#ff85a2; color:white; padding:10px 15px; border-radius:15px; margin-bottom:10px; max-width:80%;">${text}</div>`;
        const typing = document.getElementById('typing-indicator');
        typing.style.display = 'block';
        setTimeout(() => {
            typing.style.display = 'none';
            msgBox.innerHTML += `<div style="align-self:flex-start; background:#f0f0f0; padding:10px 15px; border-radius:15px; margin-bottom:10px; max-width:80%;">Вітаю! 😊 Як справи?</div>`;
            msgBox.scrollTop = msgBox.scrollHeight;
        }, 1500);
    }, 400);
}

function openChat(name, img) {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="card" style="height: 85vh; display: flex; flex-direction: column;">
            <div style="display:flex; align-items:center; padding:15px; border-bottom:1px solid #eee;">
                <button onclick="changeTab('map')" style="background:none; border:none; color:#ff85a2; font-size:24px; cursor:pointer;">←</button>
                <img src="${img}" style="width:40px; height:40px; border-radius:50%; margin-left:10px; object-fit: cover;">
                <h4 style="margin-left:10px;">${name}</h4>
            </div>
            <div id="chat-messages" style="flex:1; overflow-y:auto; padding:15px; display:flex; flex-direction:column;"></div>
            <div id="typing-indicator" style="display:none; color:#888; font-size:12px; padding:0 15px 10px;">${name} друкує...</div>
            <div style="display:flex; padding:10px; gap:10px; border-top:1px solid #eee;">
                <input type="text" id="messageInput" placeholder="Повідомлення..." style="flex:1; padding:12px; border-radius:20px; border:1px solid #ddd;" onkeypress="if(event.key==='Enter') sendMessage('${name}')">
                <button onclick="sendMessage('${name}')" style="background:#ff85a2; color:white; border:none; width:45px; height:45px; border-radius:50%; cursor:pointer;">></button>
            </div>
        </div>`;
    document.getElementById('messageInput').focus();
}

function sendMessage(name) {
    const input = document.getElementById('messageInput');
    const msgBox = document.getElementById('chat-messages');
    if (!input.value.trim()) return;
    msgBox.innerHTML += `<div style="align-self:flex-end; background:#ff85a2; color:white; padding:10px 15px; border-radius:15px; margin-bottom:10px; max-width:80%;">${input.value}</div>`;
    input.value = "";
    msgBox.scrollTop = msgBox.scrollHeight;
    setTimeout(() => {
        msgBox.innerHTML += `<div style="align-self:flex-start; background:#f0f0f0; padding:10px 15px; border-radius:15px; margin-bottom:10px; max-width:80%;">Зрозуміло! До зустрічі 👋</div>`;
        msgBox.scrollTop = msgBox.scrollHeight;
    }, 2000);
}

function startDiiaVerification() {
    const btn = document.getElementById('diiaBtn');
    btn.innerHTML = "🌀 Обробка Дія...";
    setTimeout(() => {
        localStorage.setItem('userVerified', 'true');
        showToast("Верифіковано успішно! ✅");
        changeTab('profile');
    }, 2500);
}

// ===================================================
// 4. ПРОФІЛЬ ТА ДОДАТКИ
// ===================================================
function viewMomDetails(name) {
    const mom = allMoms.find(m => m.name === name);
    if (!mom) return;
    const content = document.getElementById('content');
    content.style.opacity = '0';
    setTimeout(() => {
        content.innerHTML = `
            <div class="card" style="padding: 0; position: relative;">
                <button onclick="changeTab('map')" style="position: absolute; top: 15px; left: 15px; background: white; border: none; border-radius: 50%; width: 40px; height: 40px; font-size: 20px; z-index: 10; cursor: pointer;">←</button>
                <img src="${mom.img}" style="width: 100%; height: 300px; object-fit: cover; border-radius: 20px 20px 0 0;">
                <div style="padding: 20px; text-align: left;">
                    <h2 style="margin: 0;">${mom.name}</h2>
                    <p style="color:#ff85a2; font-weight:bold; margin: 10px 0;">👶 Дитині: ${mom.childAge} • ${mom.status}</p>
                    <p style="color: #888;">📍 ${mom.district} • ${mom.dist}</p>
                    <p style="color: #666; margin-top: 15px;">${mom.about || "Рада знайомству з новими матусями!"}</p>
                    <button onclick="openChat('${mom.name}', '${mom.img}')" style="width:100%; margin-top:20px; padding:15px; background:#ff85a2; color:white; border:none; border-radius:12px; font-weight:bold; cursor:pointer;">Написати</button>
                </div>
            </div>`;
        content.style.opacity = '1';
    }, 200);
}

function renderProfile(content) {
    const name = localStorage.getItem('userName') || "Матуся";
    const isVerified = localStorage.getItem('userVerified') === 'true';
    const dist = localStorage.getItem('userDistrict') || "Всі райони";
    const age = localStorage.getItem('userChildAge') || "1 рік";
    const status = localStorage.getItem('userStatus') || "Йду гуляти";

    content.innerHTML = `
        <div class="card" style="text-align: center; padding: 25px 20px;">
            <img src="${getAvatar(name)}" style="width:110px; height:110px; border-radius:50%; border:4px solid #ff85a2; margin-bottom:15px;">
            ${isVerified ? '<p style="color:#007bff; font-weight:bold;">✅ Верифіковано Дія</p>' : `<button id="diiaBtn" onclick="startDiiaVerification()" style="width:100%; padding:14px; background:#fff; border:2px solid #000; border-radius:15px; font-weight:bold; cursor:pointer; margin-bottom:15px;">Верифікація через Дію</button>`}
            <input type="text" id="nameInput" value="${name}" placeholder="Ім'я" style="width:100%; padding:12px; margin-bottom:10px; border-radius:10px; border:1px solid #ddd;">
            <input type="text" id="childAgeInput" value="${age}" placeholder="Вік дитини" style="width:100%; padding:12px; margin-bottom:10px; border-radius:10px; border:1px solid #ddd;">
            <input type="text" id="statusInput" value="${status}" placeholder="Мій статус" style="width:100%; padding:12px; margin-bottom:15px; border-radius:10px; border:1px solid #ddd;">
            <select id="districtInput" style="width:100%; padding:12px; margin-bottom:20px; border-radius:10px; border:1px solid #ddd; background:white;">
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
    showToast("Дані збережено! ✨");
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
