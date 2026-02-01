const allMoms = [
    { name: "Олена", status: "🏃‍♀️ Йду в парк", dist: "300м", age: "1.2 р.", type: "walk" },
    { name: "Марина", status: "☕ На каву", dist: "600м", age: "8 міс.", type: "coffee" },
    { name: "Світлана", status: "👶 Немовлята", dist: "1.2 км", age: "3 міс.", type: "baby" }
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

        content.innerHTML = `
            <div class="card">
                <!-- ТУТ ТЕПЕР НАДІЙНА ІКОНКА ПРОФІЛЮ -->
                <div class="avatar-container" style="display: flex; align-items: center; justify-content: center; width: 100px; height: 100px; border-radius: 50%; background: #ffeef2; border: 3px solid #ff85a2; color: #ff85a2; font-size: 45px; margin: 0 auto 15px; position: relative;">
                    <i class="fas fa-user"></i>
                    <div class="upload-btn" style="position: absolute; bottom: 0; right: 0; background: #ff85a2; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; border: 2px solid white;">
                        <i class="fas fa-camera"></i>
                    </div>
                </div>
                <h3>Мій профіль</h3>
                <input type="text" id="nameInput" value="${savedName}" style="padding: 10px; border-radius: 10px; border: 1px solid #ddd; width: 85%; margin-bottom: 10px;">
                <input type="text" id="statusInput" value="${savedStatus}" style="padding: 10px; border-radius: 10px; border: 1px solid #ddd; width: 85%; margin-bottom: 15px;">
                <button class="main-btn" onclick="saveProfile()">Зберегти профіль</button>
            </div>`;
    }
}

function filterMoms(type) {
    const list = document.getElementById('moms-list');
    if (!list) return;

    const filtered = type === 'all' ? allMoms : allMoms.filter(mom => mom.type === type);

    list.innerHTML = filtered.map(mom => `
        <div class="mom-item">
            <!-- ТУТ ТЕПЕР НАДІЙНІ ІКОНКИ В СПИСКУ -->
            <div class="avatar-wrapper" ondblclick="likeMom(this)" style="display: flex; align-items: center; justify-content: center; width: 50px; height: 50px; border-radius: 50%; background: #ffeef2; border: 2px solid #ff85a2; color: #ff85a2; font-size: 24px; position: relative; margin-right: 12px;">
                <i class="fas fa-female"></i>
                <div class="status-online"></div>
                <i class="fas fa-heart heart-animation"></i>
            </div>
            <div class="mom-info">
                <h4>${mom.name}</h4>
                <p style="color: #ff85a2; font-weight: bold;">${mom.status}</p>
                <p>${mom.dist} • дитина ${mom.age}</p>
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
                <button onclick="changeTab('map')" style="background: none; border: none; color: #ff85a2;"><i class="fas fa-arrow-left"></i></button>
                <h3 style="margin-left: 15px;">Чат з: ${name}</h3>
            </div>
            <div id="chat-box" style="flex: 1; overflow-y: auto; padding: 15px; background: #fafafa; margin: 10px 0; border-radius: 10px;">
                <div style="background: #eee; padding: 8px 12px; border-radius: 15px; display: inline-block; max-width: 80%;">Привіт! Як справи? 😊</div>
                <div id="typing-indicator" class="typing" style="display:none; margin-top:10px;">${name} друкує...</div>
            </div>
            <div style="display: flex; gap: 5px;">
                <input type="text" id="msgInput" placeholder="Повідомлення..." style="flex: 1; padding: 10px; border-radius: 20px; border: 1px solid #ddd;">
                <button class="main-btn" style="margin:0; padding: 10px 15px;" onclick="sendMessage('${name}')"><i class="fas fa-paper-plane"></i></button>
            </div>
        </div>`;
    
    setTimeout(() => {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.style.display = 'block';
    }, 1500);
}

function saveProfile() {
    const name = document.getElementById('nameInput').value;
    const status = document.getElementById('statusInput').value;
    localStorage.setItem('userName', name);
    localStorage.setItem('userStatus', status);
    showToast("Профіль успішно оновлено! ✨");
    changeTab('profile');
}

function sendMessage(name) {
    const input = document.getElementById('msgInput');
    const chatBox = document.getElementById('chat-box');
    if (input.value.trim() !== "") {
        const msg = document.createElement('div');
        msg.style = "background: #ff85a2; color: white; padding: 8px 12px; border-radius: 15px; margin: 5px 0; margin-left: auto; max-width: 80%;";
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
