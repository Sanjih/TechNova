// js/app.js - TechNova Application
let currentUser = null;

// === Initialisation ===
function init() {
  loadUser();
  setupTheme();
  updateUserUI();
  setupEventListeners();
  hideLoader();
}

// === Chargement utilisateur ===
function loadUser() {
  const saved = localStorage.getItem('techNovaUser');
  if (saved) {
    currentUser = JSON.parse(saved);
  } else {
    // Initialiser un utilisateur vide
    currentUser = null;
  }
}

function saveUser() {
  localStorage.setItem('techNovaUser', JSON.stringify(currentUser));
}

// === Thème clair/sombre ===
function setupTheme() {
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
}

// === Mise à jour de l'interface utilisateur ===
function updateUserUI() {
  const userMenu = document.getElementById('userMenu');
  const authBtn = document.getElementById('authBtn');
  const navAuthBtn = document.getElementById('navAuthBtn');

  if (currentUser) {
    const firstName = currentUser.name.split(' ')[0];
    document.getElementById('userName').textContent = firstName;
    document.getElementById('userLevel').textContent = currentUser.level;
    document.getElementById('userInitial').textContent = firstName[0].toUpperCase();

    userMenu.classList.remove('hidden');
    authBtn?.classList.add('hidden');
    navAuthBtn?.classList.add('hidden');

    updateProgressBars();
  } else {
    userMenu.classList.add('hidden');
    authBtn?.classList.remove('hidden');
    navAuthBtn?.classList.remove('hidden');
  }
}

// === Barres de progression ===
function updateProgressBars() {
  for (const [key, progress] of Object.entries(currentUser.tutorials)) {
    const bar = document.getElementById(`progress-${key}`);
    const text = document.getElementById(`progress-text-${key}`);
    if (bar) bar.style.width = progress + '%';
    if (text) text.textContent = progress + '%';
  }
}

// === Connexion & Inscription ===
function register() {
  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;

  if (!name || !email || !password) {
    alert("Tous les champs sont requis");
    return;
  }

  // Vérifier si l'email existe déjà
  const existing = localStorage.getItem('techNovaUser');
  if (existing) {
    const user = JSON.parse(existing);
    if (user.email === email) {
      alert("Un compte avec cet email existe déjà.");
      return;
    }
  }

  // Créer un nouvel utilisateur
  currentUser = {
    name,
    email,
    password,
    level: 1,
    xp: 0,
    tutorials: { web3: 0, ia: 0 }
  };

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
  window.location.href = 'index.html';
}

// === Modals ===
function openModal() {
  document.getElementById('authModal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('authModal').classList.add('hidden');
}

function showRegister() {
  closeModal();
  document.getElementById('registerModal').classList.remove('hidden');
}

function closeRegister() {
  document.getElementById('registerModal').classList.add('hidden');
}

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

// === Compléter un tutoriel + certificat PDF ===
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

// === Slider Tutoriels ===
function setupEventListeners() {
  const slider = document.querySelector('.slider');
  const prevBtn = document.querySelector('.prev');
  const nextBtn = document.querySelector('.next');
  const cardWidth = 320 + 24; // w-80 + gap-6
  let index = 0;

  if (nextBtn && slider) {
    nextBtn.addEventListener('click', () => {
      if (index < 1) {
        index++;
        slider.style.transform = `translateX(-${index * cardWidth}px)`;
      }
    });
  }

  if (prevBtn && slider) {
    prevBtn.addEventListener('click', () => {
      if (index > 0) {
        index--;
        slider.style.transform = `translateX(-${index * cardWidth}px)`;
      }
    });
  }
}

// === Loader d'entrée ===
function hideLoader() {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.style.display = 'none';
    }
  }, 1200);
}

// === Service Worker pour PWA ===
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('SW registered: ', reg))
      .catch(err => console.log('SW registration failed: ', err));
  });
}

// === Lancer l'app ===
document.addEventListener('DOMContentLoaded', init);
