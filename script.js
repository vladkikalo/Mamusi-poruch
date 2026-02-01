// ===================================================
// 1. БАЗА ДАНИХ (БЕЗ ЗМІН)
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
        about: "Любимо активні ігри.", interests: ["Йога", "Еко"]
    },
    { 
        name: "Марина", status: "☕ На каву", dist: "600м", age: "8 міс.", type: "coffee", district: "Позняки", 
        img: "mom2.jpg", backup: "https://images.unsplash.com",
        about: "Люблю читати.", interests: ["Книги", "Психологія"]
    },
    { 
        name: "Світлана", status: "👶 Немовлята", dist: "1.2 км", age: "3 міс.", type: "baby", district: "Оболонь", 
        img: "mom3.jpg", backup: "https://images.unsplash.com",
        about: "Гуляємо повільно.", interests: ["Фото", "ГВ"]
    }
];

let currentFilter = 'all';
const getAvatar = (name) => `https://ui-avatars.com{encodeURIComponent(name)}&background=ff85a2&color=fff`;

// ===================================================
// 2. ВИПРАВЛЕНА ФІЛЬТРАЦІЯ ЗА РАЙОНОМ (ОСНОВНИЙ ФІКС)
// ===================================================
function filterMoms(type) {
    currentFilter = type;
    const list = document.getElementById('moms-list');
    if (!list) return;

    // Отримуємо район, який вибрав користувач (або за замовчуванням "Всі райони")
    const selectedDistrict = localStorage.getItem('userDistrict') || "Всі райони";
    const searchQuery = document.getElementById('searchInput')?.value.toLowerCase() || "";

    const filtered = allMoms.filter(mom => {
        // 1. Фільтр за типом (прогулянка/кава)
        const matchesType = (type === 'all' || mom.type === type);
        
        // 2. Фільтр за пошуком імені
        const matchesSearch = mom.name.toLowerCase().includes(searchQuery);
        
        // 3. Фільтр за РАЙОНОМ (Якщо не обрано "Всі райони", то показуємо тільки збіги)
        const matchesDistrict = (selectedDistrict === "Всі райони" || mom.district === selectedDistrict);

        return matchesType && matchesSearch && matchesDistrict;
    });
    
    list.innerHTML = filtered.length ? filtered.map(mom => `
        <div class="mom-item" onclick="viewMomDetails('${mom.name}')" style="display:flex; align-items:center; background:white; margin:10px 5px; padding:12px; border-radius:20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); cursor: pointer;">
            <img src="${mom.img}" onerror="this.onerror=null; this.src='${mom.backup}';" 
                 style="width:55px; height:55px; border-radius:50%; object-fit: cover; background:#f0f0f0;">
            <div style="flex:1; margin-left: 12px;">
                <h4 style="margin:0;">${mom.name}</h4>
                <p style="color:#ff85a2; font-size:13px; margin:2px 0;">${mom.status}</p>
                <p style="color:#888; font-size:11px; margin:0;">📍 ${mom.district}</p>
            </div>
            <div style="font-size: 18px; color: #ccc;">›</div>
        </div>`).join('') : `<p style="text-align:center; padding:20px; color:#888;">У цьому районі поки нікого немає 📍</p>`;
}

// ===================================================
// 3. ПЕРЕГЛЯД ТАБІВ ТА ПРОФІЛЮ
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

function renderProfile(content) {
    const name = localStorage.getItem('userName') || "Матуся";
    const dist = localStorage.getItem('userDistrict') || "Всі райони";
    const status = localStorage.getItem('userStatus') || "Планую прогулянку";
    content.innerHTML = `
        <div class="card" style="text-align: center; padding: 30px 20px;">
            <div class="avatar-container" ondblclick="likeAnimation(this)" style="position: relative; display: inline-block; cursor: pointer;">
                <img src="${getAvatar(name)}" style="width:120px; height:120px; border-radius:50%; border:4px solid #ff85a2; object-fit: cover;">
                <div class="heart-overlay" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-size: 50px; opacity: 0; transition: 0.3s; pointer-events: none;">❤️</div>
            </div>
            <h3 style="margin-top:15px;">Налаштування</h3>
            <input type="text" id="nameInput" value="${name}" placeholder="Ім'я" style="width:100%; padding:12px; margin-bottom:10px; border-radius:10px; border:1px solid #ddd; box-sizing: border-box;">
            <select id="districtInput" style="width:100%; padding:12px; margin-bottom:10px; border-radius:10px; border:1px solid #ddd; background: white;">
                ${Object.keys(districtCoords).map(d => `<option value="${d}" ${dist === d ? 'selected' : ''}>${d}</option>`).join('')}
            </select>
            <input type="text" id="statusInput" value="${status}" placeholder="Статус" style="width:100%; padding:12px; margin-bottom:20px; border-radius:10px; border:1px solid #ddd; box-sizing: border-box;">
            <button class="main-btn" onclick="saveProfile()" style="width:100%; padding:15px; background:#ff85a2; color:white; border:none; border-radius:12px; font-weight:bold; cursor:pointer;">Зберегти</button>
        </div>`;
}

// ===================================================
// 4. СТОРІНКА МАТУСІ ТА ЧАТ
// ===================================================
function viewMomDetails(name) {
    const mom = allMoms.find(m => m.name === name);
    if (!mom) return;
    const content = document.getElementById('content');
    content.style.opacity = '0';
    setTimeout(() => {
        content.innerHTML = `
            <div class="card" style="padding: 0; position: relative;">
                <button onclick="changeTab('map')" style="position: absolute; top: 15px; left: 15px; background: rgba(255,255,255,0.8); border: none; border-radius: 50%; width: 40px; height: 40px; font-size: 20px; z-index: 10; cursor: pointer;">←</button>
                <div style="width: 100%; height: 250px; overflow: hidden; border-radius: 20px 20px 0 0;">
                    <img src="${mom.img}" onerror="this.src='${mom.backup}'" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div style="padding: 20px; text-align: left;">
                    <h2 style="margin: 0;">${mom.name}</h2>
                    <p style="color: #ff85a2; font-weight: bold; margin: 10px 0;">📍 ${mom.district} • ${mom.dist}</p>
                    <p style="color: #666; line-height: 1.5;">${mom.about || "Рада знайомству з новими матусями!"}</p>
                    <button onclick="openChat('${mom.name}', '${mom.img}', '${mom.backup}')" 
                            style="width: 100%; margin-top: 20px; padding: 15px; background: #ff85a2; color: white; border: none; border-radius: 12px; font-weight: bold; cursor: pointer;">
                        Написати
                    </button>
                </div>
            </div>`;
        content.style.opacity = '1';
    }, 200);
}

function openChat(name, img, backup) {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="card" style="height: 85vh; display: flex; flex-direction: column;">
            <div style="display: flex; align-items: center; padding: 15px; border-bottom: 1px solid #eee;">
                <button onclick="changeTab('map')" style="background: none; border: none; font-size: 24px; color: #ff85a2; cursor: pointer;">←</button>
                <img src="${img}" onerror="this.src='${backup}'" style="width:40px; height:40px; border-radius:50%; margin-left:10px; object-fit: cover;">
                <h4 style="margin-left: 10px;">${name}</h4>
            </div>
            <div id="chat-messages" style="flex: 1; overflow-y: auto; padding: 15px; display: flex; flex-direction: column; gap: 10px;">
                <div style="align-self: flex-start; background: #f0f0f0; padding: 10px 15px; border-radius: 15px; max-width: 80%;">Привіт! Як справи? 😊</div>
                <div id="typing-indicator" style="display:none; color:#888; font-size:12px;">${name} друкує...</div>
            </div>
            <div style="display: flex; gap: 10px; padding: 10px;">
                <input type="text" id="messageInput" placeholder="Пишіть..." style="flex: 1; padding: 12px; border-radius: 20px; border: 1px solid #ddd;">
                <button onclick="sendMessage('${name}')" style="background:#ff85a2; color:white; border:none; border-radius:50%; width:45px; height:45px; cursor: pointer;">></button>
            </div>
        </div>`;
}

function sendMessage(name) {
    const input = document.getElementById('messageInput');
    const msgBox = document.getElementById('chat-messages');
    const typing = document.getElementById('typing-indicator');
    if (!input.value.trim()) return;
    msgBox.innerHTML += `<div style="align-self: flex-end; background:#ff85a2; color:white; padding:10px 15px; border-radius:15px; max-width:80%;">${input.value}</div>`;
    input.value = "";
    msgBox.scrollTop = msgBox.scrollHeight;
    setTimeout(() => {
        typing.style.display = 'block';
        msgBox.scrollTop = msgBox.scrollHeight;
        setTimeout(() => {
            typing.style.display = 'none';
            msgBox.innerHTML += `<div style="align-self: flex-start; background:#f0f0f0; padding:10px 15px; border-radius:15px; max-width:80%;">Звучить круто! Давайте списатися пізніше 👋</div>`;
            msgBox.scrollTop = msgBox.scrollHeight;
        }, 1500);
    }, 800);
}

// ===================================================
// 5. ДОДАТКОВІ ФУНКЦІЇ
// ===================================================
function saveProfile() {
    localStorage.setItem('userName', document.getElementById('nameInput').value);
    localStorage.setItem('userDistrict', document.getElementById('districtInput').value);
    localStorage.setItem('userStatus', document.getElementById('statusInput').value);
    showToast("Профіль оновлено! ✨");
    setTimeout(() => changeTab('map'), 800);
}

function showToast(msg) {
    const t = document.createElement('div');
    t.innerText = msg;
    t.style.cssText = "position:fixed; bottom:90px; left:50%; transform:translateX(-50%); background:rgba(0,0,0,0.8); color:white; padding:10px 20px; border-radius:20px; font-size:14px; z-index:1000;";
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2000);
}

function likeAnimation(el) {
    const heart = el.querySelector('.heart-overlay');
    heart.style.opacity = '1';
    setTimeout(() => heart.style.opacity = '0', 700);
    showToast("Вам сподобалось! ❤️");
}

window.onload = () => changeTab('map');
