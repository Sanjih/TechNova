// js/app.js - TechNova Application
let currentUser = null;

// === Initialisation au chargement ===
document.addEventListener('DOMContentLoaded', init);

function init() {
  // Cacher le loader
  hideLoader();

  // Charger l'utilisateur
  loadUser();

  // Appliquer le thème
  setupTheme();

  // Mettre à jour l'interface
  updateUserUI();
}

// === Charger l'utilisateur depuis localStorage ===
function loadUser() {
  const saved = localStorage.getItem('techNovaUser');
  if (saved) {
    try {
      currentUser = JSON.parse(saved);
    } catch (e) {
      console.error('Erreur de parsing utilisateur', e);
      currentUser = null;
    }
  }
}

// === Sauvegarder l'utilisateur ===
function saveUser() {
  if (currentUser) {
    localStorage.setItem('techNovaUser', JSON.stringify(currentUser));
  }
}

// === Gestion du thème clair/sombre ===
function setupTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('theme') || 'light';

  document.documentElement.setAttribute('data-theme', savedTheme);
  themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

  themeToggle?.addEventListener('click', () => {
    const current = localStorage.getItem('theme') || 'light';
    const newTheme = current === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
  });
}

// === Mettre à jour l'interface utilisateur ===
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

// === Mettre à jour les barres de progression ===
function updateProgressBars() {
  const tutorials = ['web3', 'ia'];
  tutorials.forEach(key => {
    const progress = currentUser?.tutorials?.[key] || 0;
    const bar = document.getElementById(`progress-${key}`);
    const text = document.getElementById(`progress-text-${key}`);
    if (bar) bar.style.width = `${progress}%`;
    if (text) text.textContent = `${progress}%`;
  });
}

// === Inscription ===
function register() {
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
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

  // Créer utilisateur
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

// === Connexion ===
function login() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  const saved = localStorage.getItem('techNovaUser');
  if (saved) {
    const user = JSON.parse(saved);
    if (user.email === email && user.password === password) {
      currentUser = user;
      saveUser();
      closeModal();
      updateUserUI();
      if (window.afterLogin) {
        window.afterLogin();
        window.afterLogin = null;
      }
      return;
    }
  }
  alert("Email ou mot de passe incorrect");
}

// === Déconnexion ===
function logout() {
  currentUser = null;
  localStorage.removeItem('techNovaUser');
  updateUserUI();
  window.location.href = 'index.html';
}

// === Gestion des modales ===
function openModal() {
  document.getElementById('authModal').classList.remove('hidden');
  document.getElementById('registerModal').classList.add('hidden');
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

// === Ouvrir la modale si non connecté ===
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

  if (!currentUser.tutorials[id]) {
    currentUser.tutorials[id] = 0;
  }

  if (currentUser.tutorials[id] < 100) {
    currentUser.tutorials[id] = 100;
    currentUser.xp += 50;

    // Niveau supérieur ?
    const newLevel = Math.floor(currentUser.xp / 100) + 1;
    if (newLevel > currentUser.level) {
      currentUser.level = newLevel;
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

// === Générer un certificat PDF (sans eval) ===
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
    filename: `certificat-${moduleName.replace(' ', '-')}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'cm', format: 'a4', orientation: 'landscape' }
  };

  html2pdf().from(certHTML).set(opt).save();
}

// === Cacher le loader d'entrée ===
function hideLoader() {
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      loader.style.display = 'none';
    }, 1200);
  }
}

// === Service Worker (PWA) ===
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('SW registered: ', reg))
      .catch(err => console.log('SW registration failed: ', err));
  });
}
