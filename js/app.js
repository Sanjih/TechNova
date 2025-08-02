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
    if (themeToggle) {
        themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
        themeToggle.addEventListener('click', () => {
            const current = localStorage.getItem('theme') || 'light';
            const newTheme = current === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            document.documentElement.setAttribute('data-theme', newTheme);
            themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        });
    }
}

// === Mise à jour de l'interface utilisateur ===
function updateUserUI() {
    const userMenu = document.getElementById('userMenu');
    const authBtn = document.getElementById('authBtn');
    const navAuthBtn = document.getElementById('navAuthBtn');

    if (currentUser) {
        const firstName = currentUser.name.split(' ')[0];
        const userNameElem = document.getElementById('userName');
        const userLevelElem = document.getElementById('userLevel');
        const userInitialElem = document.getElementById('userInitial');

        if (userNameElem) userNameElem.textContent = firstName;
        if (userLevelElem) userLevelElem.textContent = currentUser.level;
        if (userInitialElem) userInitialElem.textContent = firstName[0].toUpperCase();

        if (userMenu) userMenu.classList.remove('hidden');
        if (authBtn) authBtn.classList.add('hidden');
        if (navAuthBtn) navAuthBtn.classList.add('hidden');

        updateProgressBars();
    } else {
        if (userMenu) userMenu.classList.add('hidden');
        if (authBtn) authBtn.classList.remove('hidden');
        if (navAuthBtn) navAuthBtn.classList.remove('hidden');
    }
}

// === Barres de progression ===
function updateProgressBars() {
    if (currentUser && currentUser.tutorials) {
        for (const [key, progress] of Object.entries(currentUser.tutorials)) {
            const bar = document.getElementById(`progress-${key}`);
            const text = document.getElementById(`progress-text-${key}`);
            if (bar) bar.style.width = progress + '%';
            if (text) text.textContent = progress + '%';
        }
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

    const existing = localStorage.getItem('techNovaUser');
    if (existing) {
        const user = JSON.parse(existing);
        if (user.email === email) {
            alert("Un compte avec cet email existe déjà.");
            return;
        }
    }

    currentUser = {
        name,
        email,
        password,
        level: 1,
        xp: 0,
        tutorials: { "mega-ai": 0, "ia": 0 }
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
            if (window.afterLogin) {
                window.afterLogin();
                window.afterLogin = null;
            }
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
    const authModal = document.getElementById('authModal');
    if (authModal) authModal.classList.remove('hidden');
}

function closeModal() {
    const authModal = document.getElementById('authModal');
    if (authModal) authModal.classList.add('hidden');
}

function showRegister() {
    closeModal();
    const registerModal = document.getElementById('registerModal');
    if (registerModal) registerModal.classList.remove('hidden');
}

function closeRegister() {
    const registerModal = document.getElementById('registerModal');
    if (registerModal) registerModal.classList.add('hidden');
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
    if (!currentUser) {
        openModal();
        return;
    }

    if (currentUser.tutorials[id] < 100) {
        currentUser.tutorials[id] = 100;
        currentUser.xp += 50;

        if (currentUser.xp >= 100 * currentUser.level) {
            currentUser.level++;
            alert(`🎉 Félicitations ! Vous êtes passé au niveau ${currentUser.level} !`);
        }

        saveUser();
        updateProgressBars();
        
        const moduleName = id === 'mega-ai' ? 'AI et Méga' : id === 'ia' ? 'IA Générative' : id;
        if (typeof html2pdf !== 'undefined') {
            generateCertificate(moduleName);
        } else {
            console.warn('html2pdf n\'est pas chargé. Impossible de générer le certificat.');
        }
        alert(`Tutoriel "${moduleName}" terminé ! +50 XP`);
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

// === Loader d'entrée ===
function hideLoader() {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.display = 'none';
        }
    }, 1200);
}

// === Écouteurs d'événements principaux ===
function setupEventListeners() {
    // Événements des boutons d'authentification
    const authBtn = document.getElementById('authBtn');
    const navAuthBtn = document.getElementById('navAuthBtn');
    const showRegisterLink = document.getElementById('showRegisterLink');
    const showLoginLink = document.getElementById('showLoginLink');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const closeRegisterBtn = document.getElementById('closeRegisterBtn');

    if (authBtn) authBtn.addEventListener('click', openModal);
    if (navAuthBtn) navAuthBtn.addEventListener('click', openModal);
    if (showRegisterLink) showRegisterLink.addEventListener('click', showRegister);
    if (showLoginLink) showLoginLink.addEventListener('click', showLogin);
    if (loginBtn) loginBtn.addEventListener('click', login);
    if (registerBtn) registerBtn.addEventListener('click', register);
    if (logoutBtn) logoutBtn.addEventListener('click', logout);
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (closeRegisterBtn) closeRegisterBtn.addEventListener('click', closeRegister);
    
    // GESTION DES CLICS SUR LES TUTORIELS (Logique corrigée)
    const tutorialLinks = document.querySelectorAll('.tutorial-link');
    tutorialLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            // Vérifier si le clic a eu lieu sur le bouton de complétion
            if (event.target.classList.contains('btn-outline')) {
                event.preventDefault();
                const tutorialId = link.getAttribute('data-tutorial-id');
                completeTutorial(tutorialId);
                return; // Empêche la redirection
            }

            // Si l'utilisateur n'est pas connecté, ouvrir la modale
            if (!currentUser) {
                event.preventDefault(); // Empêche le défilement
                openModal();
            } else {
                // Sinon, rediriger vers le tutoriel
                const tutorialPath = link.getAttribute('data-tutorial');
                if (tutorialPath) {
                    window.location.href = tutorialPath;
                }
            }
        });
    });

    // Événements pour les boutons d'exploration
    const heroExploreBtn = document.getElementById('heroExploreBtn');
    const aboutExploreBtn = document.getElementById('aboutExploreBtn');
    if (heroExploreBtn) heroExploreBtn.addEventListener('click', () => openModalIfGuest(() => window.location.href = '#tutorials'));
    if (aboutExploreBtn) aboutExploreBtn.addEventListener('click', () => openModalIfGuest(() => window.location.href = '#tutorials'));
    
    // Gestionnaire pour le slider
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
    });
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
