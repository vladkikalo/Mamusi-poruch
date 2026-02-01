const allMoms = [
    { 
        name: "Олена", status: "🏃‍♀️ Йду в парк", dist: "300м", age: "1.2 р.", type: "walk", img: "mom1.jpg",
        about: "Любимо активні ігри та довгі прогулянки. Шукаємо компанію!", interests: ["Еко", "Йога"]
    },
    { 
        name: "Марина", status: "☕ На каву", dist: "600м", age: "8 міс.", type: "coffee", img: "mom2.jpg",
        about: "Спокійні прогулянки з кавою. Буду рада знайомству.", interests: ["Книги", "Психологія"]
    },
    { 
        name: "Світлана", status: "👶 Немовлята", dist: "1.2 км", age: "3 міс.", type: "baby", img: "mom3.jpg",
        about: "Ми ще маленькі, гуляємо повільно біля озера.", interests: ["ГВ", "Фото"]
    }
];

let currentFilter = 'all';

function changeTab(tabName) {
    const content = document.getElementById('content');
    window.scrollTo(0, 0);

    if (tabName === 'map') {
        content.innerHTML = `
            <div class="card" style="width: 100%; max-width: 380px; background: none; box-shadow: none; padding: 0;">
                <h3 style="text-align: left; margin-left: 10px;">Хто поруч?</h3>
                <div style="padding: 0 10px 15px 10px;">
                    <div style="position: relative;">
                        <i class="fas fa-search" style="position: absolute; left: 15px; top: 15px; color: #888;"></i>
                        <input type="text" id="searchInput" oninput="filterMoms(currentFilter)" placeholder="Пошук матусі..." 
                               style="width: 100%; padding: 12px 12px 12px 40px; border-radius: 25px; border: 1px solid #ddd; font-size: 16px; box-sizing: border-box;">
                    </div>
                </div>
                <div class="filter-container">
                    <button class="filter-tag active" onclick="filterMoms('all')">Всі</button>
                    <button class="filter-tag" onclick="filterMoms('walk')">🏃‍♀️ Гуляють</button>
                    <button class="filter-tag" onclick="filterMoms('coffee')">☕ На каву</button>
                    <button class="filter-tag" onclick="filterMoms('baby')">👶 Немовлята</button>
                </div>
                <div id="moms-list"></div>
            </div>`;
        filterMoms('all');
    } 
    else if (tabName === 'chats') {
        content.innerHTML = `
            <div class="card">
                <h3><i class="fas fa-comments"></i> Повідомлення</h3>
                <p style="color: #888; margin-top: 15px;">Немає активних діалогів.</p>
            </div>`;
    }
    else if (tabName === 'profile') {
        const savedName = localStorage.getItem('userName') || "Матуся";
        const savedStatus = localStorage.getItem('userStatus') || "Планую прогулянку";
        const savedDistrict = localStorage.getItem('userDistrict') || "Оболонь";

        content.innerHTML = `
            <div class="card">
                <div class="avatar-container" style="margin: 0 auto 15px; width: 100px; height: 100px; position: relative;">
                    <img src="https://ui-avatars.com{encodeURIComponent(savedName)}&background=ff85a2&color=fff&size=128" 
                         style="width: 100px; height: 100px; border-radius: 50%; border: 3px solid #ff85a2; object-fit: cover;">
                </div>
                <h3>Мій профіль</h3>
                <input type="text" id="nameInput" value="${savedName}" placeholder="Ім'я" style="padding: 12px; border-radius: 12px; border: 1px solid #ddd; width: 90%; margin-bottom: 10px; font-size: 16px;">
                
                <select id="districtInput" style="padding: 12px; border-radius: 12px; border: 1px solid #ddd; width: 90%; margin-bottom: 10px; background: white; font-size: 16px;">
                    <option value="Оболонь" ${savedDistrict === 'Оболонь' ? 'selected' : ''}>Оболонь</option>
                    <option value="Позняки" ${savedDistrict === 'Позняки' ? 'selected' : ''}>Позняки</option>
                    <option value="Центр" ${savedDistrict === 'Центр' ? 'selected' : ''}>Центр</option>
                    <option value="Голосієво" ${savedDistrict === 'Голосієво' ? 'selected' : ''}>Голосієво</option>
                </select>

                <input type="text" id="statusInput" value="${savedStatus}" placeholder="Статус" style="padding: 12px; border-radius: 12px; border: 1px solid #ddd; width: 90%; margin-bottom: 15px; font-size: 16px;">
                <button class="main-btn" onclick="saveProfile()" style="width: 90%; padding: 15px;">Зберегти профіль</button>
            </div>`;
    }
}

function filterMoms(type) {
    currentFilter = type;
    const list = document.getElementById('moms-list');
    const query = document.getElementById('searchInput')?.value.toLowerCase() || "";
    if (!list) return;

    document.querySelectorAll('.filter-tag').forEach(btn => {
        btn.classList.remove('active');
        if (btn.innerText.toLowerCase().includes(type) || (type === 'all' && btn.innerText === 'Всі')) btn.classList.add('active');
    });

    const filtered = allMoms.filter(mom => (type === 'all' || mom.type === type) && mom.name.toLowerCase().includes(query));

    list.innerHTML = filtered.map(mom => `
        <div class="mom-item">
            <div class="avatar-wrapper" onclick="viewMomDetails('${mom.name}')" style="cursor:pointer">
                <img src="${mom.img}" onerror="this.src='https://ui-avatars.com{mom.name}&background=ff85a2&color=fff'">
                <div class="status-online"></div>
            </div>
            <div class="mom-info" onclick="viewMomDetails('${mom.name}')" style="flex:1; cursor:pointer">
                <h4>${mom.name}</h4>
                <p style="color: #ff85a2; font-weight: bold;">${mom.status}</p>
                <p>${mom.dist} • ${mom.age}</p>
            </div>
            <button class="chat-btn" onclick="openChat('${mom.name}')">Написати</button>
        </div>`).join('');
}

function viewMomDetails(name) {
    const mom = allMoms.find(m => m.name === name);
    document.getElementById('content').innerHTML = `
        <div class="card" style="padding:0; overflow:hidden; border-radius:25px; text-align:left;">
            <img src="${mom.img}" onerror="this.src='https://ui-avatars.com{mom.name}&background=ff85a2&color=fff'" style="width:100%; height:250px; object-fit:cover;">
            <div style="padding:20px;">
                <button onclick="changeTab('map')" class="main-btn" style="padding:8px 15px; margin-bottom:15px; background:#eee; color:#333;">← Назад</button>
                <h2>${mom.name}, ${mom.age}</h2>
                <p style="color:#ff85a2; font-weight:bold;">${mom.status}</p>
                <p style="color:#555; line-height:1.6; margin:15px 0;">${mom.about}</p>
                <div style="display:flex; gap:8px; flex-wrap:wrap;">
                    ${mom.interests.map(i => `<span style="background:#f0f0f0; padding:5px 12px; border-radius:15px; font-size:12px;">#${i}</span>`).join('')}
                </div>
                <button class="main-btn" style="width:100%; margin-top:25px; padding:18px; font-size:18px;" onclick="openChat('${mom.name}')">Почати чат</button>
            </div>
        </div>`;
}

function openChat(name) {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="card" style="width: 100%; max-width: 380px; height: 500px; display: flex; flex-direction: column; padding:0; overflow:hidden;">
            <div style="display: flex; align-items: center; border-bottom: 1px solid #eee; padding: 15px;">
                <button onclick="changeTab('map')" style="background: none; border: none; color: #ff85a2; cursor:pointer;"><i class="fas fa-arrow-left fa-lg"></i></button>
                <h3 style="margin-left: 15px;">${name}</h3>
            </div>
            <div id="chat-box" style="flex: 1; overflow-y: auto; padding: 15px; background: #fafafa; text-align:left; position: relative;">
                <div style="background: #eee; padding: 10px 15px; border-radius: 18px; display: inline-block; max-width: 80%; font-size: 15px; margin-bottom: 10px;">Привіт! Як справи? 😊</div>
                <!-- ОСЬ ЦЕЙ БЛОК ДЛЯ ДРУКУ -->
                <div id="typing-indicator" style="display:none; font-size: 12px; color: #888; margin: 10px 0;">${name} друкує...</div>
            </div>
            <div style="display: flex; gap: 8px; padding: 15px; border-top: 1px solid #eee; background:white;">
                <input type="text" id="msgInput" placeholder="Повідомлення..." style="flex: 1; padding: 12px; border-radius: 25px; border: 1px solid #ddd; font-size: 16px;">
                <button class="main-btn" style="margin:0; width: 45px; height: 45px; border-radius: 50%;" onclick="sendMessage('${name}')"><i class="fas fa-paper-plane"></i></button>
            </div>
        </div>`;

    // Ефект: матуся починає "друкувати" через 1.5 сек
    setTimeout(() => {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.style.display = 'block';
    }, 1500);
}


function saveProfile() {
    localStorage.setItem('userName', document.getElementById('nameInput').value);
    localStorage.setItem('userStatus', document.getElementById('statusInput').value);
    localStorage.setItem('userDistrict', document.getElementById('districtInput').value);
    alert("Збережено! ✨");
    changeTab('profile');
}

function sendMessage(name) {
    const input = document.getElementById('msgInput');
    const chatBox = document.getElementById('chat-box');
    const indicator = document.getElementById('typing-indicator');

    if (input && input.value.trim() !== "") {
        // Твоє повідомлення
        const msg = document.createElement('div');
        msg.style = "background: #ff85a2; color: white; padding: 10px 15px; border-radius: 18px; margin: 8px 0; margin-left: auto; max-width: 80%; font-size: 15px; text-align:left;";
        msg.innerText = input.value;
        chatBox.appendChild(msg);
        input.value = "";
        chatBox.scrollTop = chatBox.scrollHeight;

        // Повертаємо ефект "друкує" перед відповіддю
        if (indicator) indicator.style.display = 'block';

        setTimeout(() => {
            if (indicator) indicator.style.display = 'none';
            const reply = document.createElement('div');
            reply.style = "background: #eee; padding: 10px 15px; border-radius: 18px; margin: 8px 0; max-width: 80%; font-size: 15px; text-align:left;";
            reply.innerText = "Звучить круто! Ми теж скоро вийдемо. До зустрічі! ✨";
            chatBox.appendChild(reply);
            chatBox.scrollTop = chatBox.scrollHeight;
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if (splash) splash.classList.add('fade-out');
        changeTab('map');
    }, 2000);
});
