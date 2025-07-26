// js/app.js
let currentUser = null;

function init() {
  loadUser();
  setupEventListeners();
}

function loadUser() {
  const saved = localStorage.getItem('techNovaUser');
  if (saved) {
    currentUser = JSON.parse(saved);
    updateUserUI();
  }
}

function saveUser() {
  localStorage.setItem('techNovaUser', JSON.stringify(currentUser));
}

function register() {
  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;

  if (!name || !email || !password) return alert("Tous les champs sont requis");

  currentUser = {
    name,
    email,
    password,
    level: 1,
    xp: 0,
    tutorials: {}
  };

  const tutorials = document.querySelectorAll('[id^="progress-"]');
  tutorials.forEach(tut => {
    const id = tut.id.replace('progress-', '');
    currentUser.tutorials[id] = 0;
  });

  saveUser();
  closeRegister();
  updateUserUI();
  alert(`Bienvenue, ${name} !`);
}

function login() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  const saved = localStorage.getItem('techNovaUser');
  if (saved) {
    const user = JSON.parse(saved);
    if (user.email === email && user.password === password) {
      currentUser = user;
      saveUser();
      closeModal();
      updateUserUI();
      if (window.afterLogin) window.afterLogin();
      return;
    }
  }
  alert("Email ou mot de passe incorrect");
}

function logout() {
  currentUser = null;
  localStorage.removeItem('techNovaUser');
  updateUserUI();
}

function updateUserUI() {
  const userMenu = document.getElementById('userMenu');
  const authBtn = document.getElementById('authBtn');
  const navAuthBtn = document.getElementById('navAuthBtn');

  if (currentUser) {
    document.getElementById('userName').textContent = currentUser.name.split(' ')[0];
    document.getElementById('userInitial').textContent = currentUser.name[0].toUpperCase();
    document.getElementById('userLevel').textContent = currentUser.level;

    userMenu.innerHTML = `
      <a href="profile.html" class="text-sm text-gray-600 hover:underline">
        <span>${currentUser.name.split(' ')[0]}</span>
        <div class="text-xs">Niveau <span>${currentUser.level}</span></div>
      </a>
      <div class="w-9 h-9 rounded-full bg-bleu text-white flex items-center justify-center font-bold">
        ${currentUser.name[0].toUpperCase()}
      </div>
      <button onclick="logout()" class="text-sm text-gray-500 hover:text-red-500">Déconnexion</button>
    `;
    authBtn.classList.add('hidden');
    navAuthBtn.classList.add('hidden');
    updateProgressBars();
  } else {
    userMenu.classList.add('hidden');
    authBtn.classList.remove('hidden');
    navAuthBtn.classList.remove('hidden');
  }
}

function updateProgressBars() {
  for (const [key, progress] of Object.entries(currentUser.tutorials)) {
    const bar = document.getElementById(`progress-${key}`);
    const text = document.getElementById(`progress-text-${key}`);
    if (bar) bar.style.width = progress + '%';
    if (text) text.textContent = progress + '%';
  }
}

function completeTutorial(id) {
  if (!currentUser) return openModal();

  if (currentUser.tutorials[id] < 100) {
    currentUser.tutorials[id] = 100;
    currentUser.xp += 50;

    if (currentUser.xp >= 100 * currentUser.level) {
      currentUser.level++;
      alert(`🎉 Félicitations ! Vous êtes passé au niveau ${currentUser.level} !`);
    }

    saveUser();
    updateProgressBars();
    alert("Tutoriel terminé ! +50 XP");
  }
}

function openModal() { document.getElementById('authModal').classList.remove('hidden'); }
function closeModal() { document.getElementById('authModal').classList.add('hidden'); }
function showRegister() {
  closeModal();
  document.getElementById('registerModal').classList.remove('hidden');
}
function closeRegister() { document.getElementById('registerModal').classList.add('hidden'); }
function showLogin() {
  closeRegister();
  openModal();
}

function openModalIfGuest(callback) {
  if (!currentUser) {
    openModal();
    window.afterLogin = callback;
  } else {
    callback();
  }
}

function setupEventListeners() {
  const slider = document.querySelector('.slider');
  const prevBtn = document.querySelector('.prev');
  const nextBtn = document.querySelector('.next');
  const cardWidth = 320 + 24;
  let index = 0;

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (index < 1) {
        index++;
        slider.style.transform = `translateX(-${index * cardWidth}px)`;
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (index > 0) {
        index--;
        slider.style.transform = `translateX(-${index * cardWidth}px)`;
      }
    });
  }
}

window.onload = init;
// Thème
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme') || 'light';

document.documentElement.setAttribute('data-theme', savedTheme);
themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

themeToggle.addEventListener('click', () => {
  const current = localStorage.getItem('theme') || 'light';
  const newTheme = current === 'light' ? 'dark' : 'light';
  
  localStorage.setItem('theme', newTheme);
  document.documentElement.setAttribute('data-theme', newTheme);
  themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
});
function generateCertificate(moduleName) {
  const certHTML = `
    <div style="
      font-family: 'Orbitron', sans-serif;
      text-align: center;
      padding: 50px;
      background: linear-gradient(135deg, #000000, #1e293b);
      color: white;
      border: 15px solid #a2ff00;
      border-radius: 20px;
      max-width: 800px;
      margin: 20px auto;
    ">
      <h1 style="font-size: 3rem; color: #a2ff00;">Certificat de Réussite</h1>
      <p style="font-size: 1.2rem; margin: 20px 0;">Délivré à</p>
      <h2 style="font-size: 2.5rem; margin: 10px 0;">${currentUser.name}</h2>
      <p style="font-size: 1.3rem;">Pour avoir terminé le tutoriel :</p>
      <h3 style="font-size: 2rem; color: #0077ff; margin: 20px 0;">${moduleName}</h3>
      <p style="margin-top: 30px; font-size: 1rem; opacity: 0.8;">TechNova • ${new Date().toLocaleDateString()}</p>
    </div>
  `;

  const opt = {
    margin: 1,
    filename: `certificat-${moduleName}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'cm', format: 'a4', orientation: 'landscape' }
  };

  html2pdf().from(certHTML).set(opt).save();
}
function completeTutorial(id) {
  if (!currentUser) return openModal();

  if (currentUser.tutorials[id] < 100) {
    currentUser.tutorials[id] = 100;
    currentUser.xp += 50;

    // Level up
    if (currentUser.xp >= 100 * currentUser.level) {
      currentUser.level++;
      alert(`🎉 Félicitations ! Vous êtes passé au niveau ${currentUser.level} !`);
    }

    saveUser();
    updateProgressBars();

    // Générer certificat
    const moduleName = id === 'web3' ? 'Web3' : id === 'ia' ? 'IA Générative' : id;
    generateCertificate(moduleName);
    alert(`Tutoriel "${moduleName}" terminé ! +50 XP\nUn certificat va être téléchargé.`);
  }
}
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}