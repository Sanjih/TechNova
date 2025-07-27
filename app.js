// js/app.js - TechNova Application
let currentUser = null;

document.addEventListener('DOMContentLoaded', init);

function init() {
  hideLoader();
  loadUser();
  setupTheme();
  updateUserUI();
}

function loadUser() {
  const saved = localStorage.getItem('techNovaUser');
  if (saved) {
    try {
      currentUser = JSON.parse(saved);
    } catch (e) {
      currentUser = null;
    }
  }
}

function saveUser() {
  if (currentUser) {
    localStorage.setItem('techNovaUser', JSON.stringify(currentUser));
  }
}

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

function updateProgressBars() {
  ['web3', 'ia'].forEach(id => {
    const progress = currentUser?.tutorials?.[id] || 0;
    const bar = document.getElementById(`progress-${id}`);
    const text = document.getElementById(`progress-text-${id}`);
    if (bar) bar.style.width = `${progress}%`;
    if (text) text.textContent = `${progress}%`;
  });
}

function register() {
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;

  if (!name || !email || !password) return alert("Tous les champs sont requis");

  const existing = localStorage.getItem('techNovaUser');
  if (existing && JSON.parse(existing).email === email) {
    return alert("Un compte avec cet email existe déjà.");
  }

  currentUser = {
    name, email, password, level: 1, xp: 0, tutorials: { web3: 0, ia: 0 }
  };

  saveUser();
  closeRegister();
  updateUserUI();
  alert(`Bienvenue, ${name} !`);
}

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

function openModalIfGuest(callback) {
  if (!currentUser) {
    openModal();
    window.afterLogin = callback;
  } else {
    callback();
  }
}

function completeTutorial(id) {
  if (!currentUser) return openModal();
  if (!currentUser.tutorials[id]) currentUser.tutorials[id] = 0;
  if (currentUser.tutorials[id] < 100) {
    currentUser.tutorials[id] = 100;
    currentUser.xp += 50;
    const newLevel = Math.floor(currentUser.xp / 100) + 1;
    if (newLevel > currentUser.level) {
      currentUser.level = newLevel;
      alert(`🎉 Félicitations ! Vous êtes passé au niveau ${currentUser.level} !`);
    }
    saveUser();
    updateProgressBars();
    generateCertificate(id === 'web3' ? 'Web3' : 'IA Générative');
    alert(`Tutoriel terminé ! +50 XP`);
  }
}

function generateCertificate(moduleName) {
  const certHTML = `
    <div style="font-family: 'Orbitron'; text-align: center; padding: 50px; background: #000; color: white; border: 15px solid #a2ff00; border-radius: 20px;">
      <h1 style="color: #a2ff00;">Certificat de Réussite</h1>
      <h2>${currentUser.name}</h2>
      <h3 style="color: #0077ff;">${moduleName}</h3>
    </div>
  `;
  html2pdf().from(certHTML).save(`certificat-${moduleName}.pdf`);
}

function hideLoader() {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'none';
  }, 1200);
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}
