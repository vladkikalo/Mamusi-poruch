// 1. БАЗА ДАНИХ МАТУСЬ (Перевір, щоб назви файлів на GitHub були малими літерами)
const allMoms = [
    { name: "Олена", status: "🏃‍♀️ Йду в парк", dist: "300м", age: "1.2 р.", type: "walk", img: "mom1.jpg" },
    { name: "Марина", status: "☕ На каву", dist: "600м", age: "8 міс.", type: "coffee", img: "mom2.jpg" },
    { name: "Світлана", status: "👶 Немовлята", dist: "1.2 км", age: "3 міс.", type: "baby", img: "mom3.jpg" }
];

function changeTab(tabName) {
    const content = document.getElementById('content');
    
    if (tabName === 'map') {
        content.innerHTML = `
            <div class="card" style="width: 100%; max-width: 380px; background: none; box-shadow: none; padding: 0;">
                <h3 style="text-align: left; margin-left: 10px;">Хто поруч?</h3>
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
                         class="avatar" style="width: 100px; height: 100px; border-radius: 50%; border: 3px solid #ff85a2; object-fit: cover;">
                </div>
                <h3>Мій профіль</h3>
                <input type="text" id="nameInput" value="${savedName}" placeholder="Ім'я" style="padding: 12px; border-radius: 12px; border: 1px solid #ddd; width: 85%; margin-bottom: 10px;">
                
                <select id="districtInput" style="padding: 12px; border-radius: 12px; border: 1px solid #ddd; width: 85%; margin-bottom: 10px; background: white;">
                    <option value="Оболонь" ${savedDistrict === 'Оболонь' ? 'selected' : ''}>Оболонь</option>
                    <option value="Позняки" ${savedDistrict === 'Позняки' ? 'selected' : ''}>Позняки</option>
                    <option value="Центр" ${savedDistrict === 'Центр' ? 'selected' : ''}>Центр</option>
                    <option value="Голосієво" ${savedDistrict === 'Голосієво' ? 'selected' : ''}>Голосієво</option>
                </select>

                <input type="text" id="statusInput" value="${savedStatus}" placeholder="Статус" style="padding: 12px; border-radius: 12px; border: 1px solid #ddd; width: 85%; margin-bottom: 15px;">
                <button class="main-btn" onclick="saveProfile()" style="width: 90%; padding: 15px;">Зберегти профіль</button>
            </div>`;
    }

}
function filterMoms(type) {
    const list = document.getElementById('moms-list');
    if (!list) return;

    // Оновлюємо активну кнопку фільтра
    document.querySelectorAll('.filter-tag').forEach(btn => btn.classList.remove('active'));
    if (event && event.target && event.target.classList.contains('filter-tag')) {
        event.target.classList.add('active');
    }

    const filtered = type === 'all' ? allMoms : allMoms.filter(mom => mom.type === type);

    list.innerHTML = filtered.map(mom => `
        <div class="mom-item" style="padding: 20px; margin-bottom: 15px;">
            <div class="avatar-wrapper" ondblclick="likeMom(this)" style="position: relative; width: 65px; height: 65px; margin-right: 15px;">
                <img src="${mom.img}" 
                     onerror="this.src='https://ui-avatars.com{encodeURIComponent(mom.name)}&background=ff85a2&color=fff&size=128'" 
                     style="width: 65px; height: 65px; border-radius: 50%; object-fit: cover; border: 2px solid #ff85a2; background: #eee;">
                <div class="status-online"></div>
                <i class="fas fa-heart heart-animation"></i>
            </div>
            <div class="mom-info" style="flex: 1;">
                <h4 style="font-size: 18px; margin: 0;">${mom.name}</h4>
                <p style="color: #ff85a2; font-weight: bold; font-size: 14px; margin: 3px 0;">${mom.status}</p>
                <p style="font-size: 13px; color: #888;">${mom.dist} • дитина ${mom.age}</p>
            </div>
            <button class="chat-btn" onclick="openChat('${mom.name}')">Написати</button>
        </div>
    `).join('');
}

function openChat(name) {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="card" style="width: 100%; max-width: 380px; height: 500px; display: flex; flex-direction: column;">
            <div style="display: flex; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                <button onclick="changeTab('map')" style="background: none; border: none; color: #ff85a2; padding: 10px;"><i class="fas fa-arrow-left fa-lg"></i></button>
                <h3 style="margin-left: 10px;">${name}</h3>
            </div>
            <div id="chat-box" style="flex: 1; overflow-y: auto; padding: 15px; background: #fafafa; margin: 10px 0; border-radius: 10px;">
                <div style="background: #eee; padding: 10px 15px; border-radius: 18px; display: inline-block; max-width: 80%; font-size: 15px;">Привіт! Як справи? 😊</div>
            </div>
            <div style="display: flex; gap: 8px; padding: 10px;">
                <input type="text" id="msgInput" placeholder="Повідомлення..." style="flex: 1; padding: 12px; border-radius: 25px; border: 1px solid #ddd; font-size: 16px;">
                <button class="main-btn" style="margin:0; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center;" onclick="sendMessage()"><i class="fas fa-paper-plane"></i></button>
            </div>
        </div>`;
}

function saveProfile() {
    const name = document.getElementById('nameInput').value;
    const status = document.getElementById('statusInput').value;
    const district = document.getElementById('districtInput').value;
    
    localStorage.setItem('userName', name);
    localStorage.setItem('userStatus', status);
    localStorage.setItem('userDistrict', district);
    
    showToast("Профіль та район збережено! ✨");
    changeTab('profile');
}

function sendMessage() {
    const input = document.getElementById('msgInput');
    const chatBox = document.getElementById('chat-box');
    if (input.value.trim() !== "") {
        const msg = document.createElement('div');
        msg.style = "background: #ff85a2; color: white; padding: 10px 15px; border-radius: 18px; margin: 8px 0; margin-left: auto; max-width: 80%; font-size: 15px;";
        msg.innerText = input.value;
        chatBox.appendChild(msg);
        input.value = "";
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

function showToast(message) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.innerText = message;
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 3000);
}

function likeMom(element) {
    const heart = element.querySelector('.heart-animation');
    heart.classList.add('animate-heart');
    setTimeout(() => { heart.classList.remove('animate-heart'); }, 800);
    showToast("Вам сподобався профіль! ❤️");
}

window.addEventListener('load', () => {
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if (splash) splash.classList.add('fade-out');
    }, 2000);
});
