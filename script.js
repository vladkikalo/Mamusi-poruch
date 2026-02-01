// ===================================================
// 1. БАЗА ДАНИХ ТА КОНФІГУРАЦІЯ
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
        name: "Олена", status: "🏃‍♀️ Йду в парк", dist: "300м", age: "1.2 р.", type: "walk", district: "Оболонь", 
        img: "mom1.jpg", backup: "https://images.unsplash.com",
        about: "Любимо активні ігри та еко-товари.", interests: ["Йога", "Еко"], isOnline: true 
    },
    { 
        name: "Марина", status: "☕ На каву", dist: "600м", age: "8 міс.", type: "coffee", district: "Позняки", 
        img: "mom2.jpg", backup: "https://images.unsplash.com",
        about: "Шукаю подруг для спілкування за кавою.", interests: ["Книги", "Психологія"], isOnline: false 
    },
    { 
        name: "Світлана", status: "👶 Немовлята", dist: "1.2 км", age: "3 міс.", type: "baby", district: "Оболонь", 
        img: "mom3.jpg", backup: "https://images.unsplash.com",
        about: "Гуляємо повільно біля озера.", interests: ["Фото", "ГВ"], isOnline: true 
    }
];

let currentFilter = 'all';
const getAvatar = (name) => `https://ui-avatars.com{encodeURIComponent(name)}&background=ff85a2&color=fff`;

// ===================================================
// 2. ГОЛОВНИЙ ЕКРАН ТА ФІЛЬТРАЦІЯ ЗА РАЙОНОМ
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
            <div class="filter-container" style="display: flex; gap: 10px; padding: 10px; overflow-x: auto; white-space: nowrap;">
                <button class="filter-tag ${currentFilter==='all'?'active':''}" onclick="filterMoms('all')">Всі</button>
                <button class="filter-tag" onclick="filterMoms('walk')">🏃‍♀️</button>
                <button class="filter-tag" onclick="filterMoms('coffee')">☕</button>
                <button class="filter-tag" onclick="filterMoms('baby')">👶</button>
            </div>
            <div id="moms-list"></div>
        </div>`;
    filterMoms(currentFilter);
}

function filterMoms(type) {
    currentFilter = type;
    const list = document.getElementById('moms-list');
    if (!list) return;

    const selectedDistrict = localStorage.getItem('userDistrict') || "Всі райони";
    const searchQuery = document.getElementById('searchInput')?.value.toLowerCase() || "";

    const filtered = allMoms.filter(mom => {
        const matchesType = (type === 'all' || mom.type === type);
        const matchesSearch = mom.name.toLowerCase().includes(searchQuery);
        const matchesDistrict = (selectedDistrict === "Всі райони" || mom.district === selectedDistrict);
        return matchesType && matchesSearch && matchesDistrict;
    }).sort((a, b) => b.isOnline - a.isOnline);
    
    list.innerHTML = filtered.map(mom => `
        <div class="mom-card" style="background:white; margin:12px 5px; padding:15px; border-radius:25px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
            <div style="display:flex; align-items:center; cursor: pointer;" onclick="viewMomDetails('${mom.name}')">
                <div style="position: relative;">
                    <img src="${mom.img}" onerror="this.src='${mom.backup}';" style="width:60px; height:60px; border-radius:50%; object-fit: cover; border: 2px solid ${mom.isOnline ? '#4CAF50' : '#eee'};">
                    ${mom.isOnline ? '<div style="position: absolute; bottom: 3px; right: 3px; width: 12px; height: 12px; background: #4CAF50; border: 2px solid white; border-radius: 50%;"></div>' : ''}
                </div>
                <div style="flex:1; margin-left: 15px;">
                    <h4 style="margin:0;">${mom.name}</h4>
                    <p style="color:#ff85a2; font-size:13px; margin:3px 0; font-weight:bold;">${mom.status}</p>
                </div>
                <div style="color:#ccc;">›</div>
            </div>
            <div style="display:flex; gap:8px; margin-top:12px; border-top:1px solid #f5f5f5; padding-top:12px;">
                <button onclick="quickMessage('${mom.name}', 'Привіт! 👋')" style="flex:1; background:#f0f0f0; border:none; padding:8px; border-radius:12px; font-size:12px; cursor:pointer;">Привіт! 👋</button>
                <button onclick="quickMessage('${mom.name}', 'Йдеш гуляти? 🏃‍♀️')" style="flex:1; background:#f0f0f0; border:none; padding:8px; border-radius:12px; font-size:12px; cursor:pointer;">Гуляти? 🏃‍♀️</button>
                <button onclick="openChat('${mom.name}', '${mom.img}', '${mom.backup}')" style="background:#ff85a2; color:white; border:none; padding:8px 15px; border-radius:12px; font-size:12px; font-weight:bold; cursor:pointer;">Чат</button>
            </div>
        </div>`).join('');
}

// ===================================================
// 3. СТОРІНКА МАТУСІ ТА ЛАЙКИ
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
                <div class="avatar-container" ondblclick="likeAnimation(this)" style="width: 100%; height: 300px; overflow: hidden; border-radius: 20px 20px 0 0; position: relative;">
                    <img src="${mom.img}" onerror="this.src='${mom.backup}'" style="width: 100%; height: 100%; object-fit: cover;">
                    <div class="heart-overlay" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-size: 70px; opacity: 0; transition: 0.3s; pointer-events: none;">❤️</div>
                    ${mom.isOnline ? '<div style="position: absolute; bottom: 15px; left: 15px; background: #4CAF50; color: white; padding: 5px 12px; border-radius: 15px; font-size: 12px; font-weight: bold;">ЗАРАЗ ОНЛАЙН</div>' : ''}
                </div>
                <div style="padding: 20px; text-align: left;">
                    <h2>${mom.name}, ${mom.age}</h2>
                    <p style="color: #ff85a2; font-weight: bold; margin: 10px 0;">📍 ${mom.district} • ${mom.dist}</p>
                    <p style="color: #666; line-height: 1.6;">${mom.about || "Рада новим знайомствам!"}</p>
                    <div style="display:flex; gap:8px; margin-top:10px;">
                        ${(mom.interests || []).map(i => `<span style="background:#eee; padding:5px 10px; border-radius:15px; font-size:12px;">#${i}</span>`).join('')}
                    </div>
                    <button onclick="openChat('${mom.name}', '${mom.img}', '${mom.backup}')" 
                            style="width: 100%; margin-top: 25px; padding: 18px; background: #ff85a2; color: white; border: none; border-radius: 15px; font-weight: bold; font-size: 16px;">
                        Написати матусі
                    </button>
                </div>
            </div>`;
        content.style.opacity = '1';
    }, 200);
}

// ===================================================
// 4. ПОВНОЦІННИЙ ЧАТ ТА ШВИДКІ ПОВІДОМЛЕННЯ
// ===================================================
function openChat(name, img, backup) {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="card" style="height: 85vh; display: flex; flex-direction: column;">
            <div style="display: flex; align-items: center; padding: 15px; border-bottom: 1px solid #eee;">
                <button onclick="changeTab('map')" style="background: none; border: none; font-size: 24px; color: #ff85a2; cursor: pointer;">←</button>
                <img src="${img}" onerror="this.src='${backup}'" style="width:40px; height:40px; border-radius:50%; margin-left:10px; object-fit: cover;">
                <h4 style="margin-left: 10px;">${name}</h4>
            </div>
            <div id="chat-messages" style="flex: 1; overflow-y: auto; padding: 15px; display: flex; flex-direction: column;">
                <div style="align-self: flex-start; background: #f0f0f0; padding: 10px 15px; border-radius: 15px; margin-bottom:10px; max-width: 80%;">Привіт! 😊 Рада поспілкуватися!</div>
                <div id="typing-indicator" style="display:none; color:#888; font-size:12px; margin-bottom:10px;">${name} друкує...</div>
            </div>
            <div style="display: flex; gap: 10px; padding: 10px;">
                <input type="text" id="messageInput" placeholder="Ваше повідомлення..." style="flex: 1; padding: 12px; border-radius: 20px; border: 1px solid #ddd;">
                <button onclick="sendMessage('${name}')" style="background:#ff85a2; color:white; border:none; border-radius:50%; width:45px; height:45px;">></button>
            </div>
        </div>`;
}

function sendMessage(name) {
    const input = document.getElementById('messageInput');
    const msgBox = document.getElementById('chat-messages');
    const typing = document.getElementById('typing-indicator');
    if (!input || !input.value.trim()) return;

    msgBox.innerHTML += `<div style="align-self: flex-end; background:#ff85a2; color:white; padding:10px 15px; border-radius:15px; margin-bottom:10px; max-width:80%;">${input.value}</div>`;
    input.value = "";
    msgBox.scrollTop = msgBox.scrollHeight;
    
    setTimeout(() => {
        typing.style.display = 'block';
        msgBox.scrollTop = msgBox.scrollHeight;
        setTimeout(() => {
            typing.style.display = 'none';
            msgBox.innerHTML += `<div style="align-self: flex-start; background:#f0f0f0; padding:10px 15px; border-radius:15px; margin-bottom:10px; max-width:80%;">Чудово! Спишемося пізніше 👋</div>`;
            msgBox.scrollTop = msgBox.scrollHeight;
        }, 1500);
    }, 1000);
}

function quickMessage(name, text) {
    showToast(`Повідомлення надіслано! 📩`);
    setTimeout(() => {
        const mom = allMoms.find(m => m.name === name);
        openChat(name, mom.img, mom.backup);
        const msgBox = document.getElementById('chat-messages');
        msgBox.innerHTML += `<div style="align-self: flex-end; background:#ff85a2; color:white; padding:10px 15px; border-radius:15px; margin-bottom:10px; max-width:80%;">${text}</div>`;
        msgBox.scrollTop = msgBox.scrollHeight;
    }, 800);
}

// ===================================================
// 5. ПРОФІЛЬ ТА НАЛАШТУВАННЯ
// ===================================================
function renderProfile(content) {
    const name = localStorage.getItem('userName') || "Матуся";
    const dist = localStorage.getItem('userDistrict') || "Всі райони";
    const status = localStorage.getItem('userStatus') || "Планую прогулянку";
    content.innerHTML = `
        <div class="card" style="text-align: center; padding: 30px 20px;">
            <div class="avatar-container" ondblclick="likeAnimation(this)" style="position: relative; display: inline-block;">
                <img src="${getAvatar(name)}" style="width:120px; height:120px; border-radius:50%; border:4px solid #ff85a2;">
                <div class="heart-overlay" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-size: 50px; opacity: 0; transition: 0.3s;">❤️</div>
            </div>
            <h3 style="margin-top:15px;">Налаштування</h3>
            <input type="text" id="nameInput" value="${name}" placeholder="Ім'я" style="width:100%; padding:12px; margin-bottom:10px; border-radius:12px; border:1px solid #ddd;">
            <select id="districtInput" style="width:100%; padding:12px; margin-bottom:10px; border-radius:12px; border:1px solid #ddd; background:white;">
                ${Object.keys(districtCoords).map(d => `<option value="${d}" ${dist === d ? 'selected' : ''}>${d}</option>`).join('')}
            </select>
            <input type="text" id="statusInput" value="${status}" placeholder="Статус" style="width:100%; padding:12px; margin-bottom:20px; border-radius:12px; border:1px solid #ddd;">
            <button class="main-btn" onclick="saveProfile()" style="width:100%; padding:18px; background:#ff85a2; color:white; border:none; border-radius:15px; font-weight:bold;">Зберегти зміни</button>
        </div>`;
}

function saveProfile() {
    localStorage.setItem('userName', document.getElementById('nameInput').value);
    localStorage.setItem('userDistrict', document.getElementById('districtInput').value);
    localStorage.setItem('userStatus', document.getElementById('statusInput').value);
    showToast("Дані оновлено! ✨");
    setTimeout(() => changeTab('map'), 800);
}

// ===================================================
// 6. СЕРВІСНІ ФУНКЦІЇ (ТОСТИ, ЛАЙКИ)
// ===================================================
function showToast(msg) {
    const t = document.createElement('div');
    t.innerText = msg;
    t.style.cssText = "position:fixed; bottom:90px; left:50%; transform:translateX(-50%); background:rgba(0,0,0,0.8); color:white; padding:10px 20px; border-radius:20px; font-size:14px; z-index:10000;";
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2500);
}

function likeAnimation(el) {
    const heart = el.querySelector('.heart-overlay');
    heart.style.opacity = '1';
    heart.style.transform = 'translate(-50%, -50%) scale(1.3)';
    setTimeout(() => { heart.style.opacity = '0'; heart.style.transform = 'translate(-50%, -50%) scale(1)'; }, 700);
    showToast("Вам сподобалось! ❤️");
}

window.onload = () => changeTab('map');
