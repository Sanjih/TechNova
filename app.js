// js/app.js

document.addEventListener('DOMContentLoaded', () => {

    // === GESTION DES MODALES ET DE L'AUTHENTIFICATION ===
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    const authBtn = document.getElementById('authBtn');
    const navAuthBtn = document.getElementById('navAuthBtn');
    const userMenu = document.getElementById('userMenu');

    const showRegisterLink = document.getElementById('showRegisterLink');
    const showLoginLink = document.getElementById('showLoginLink');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const closeRegisterBtn = document.getElementById('closeRegisterBtn');

    // Fonctions d'ouverture/fermeture des modales
    const openLoginModal = () => {
        if (loginModal) {
            loginModal.classList.remove('hidden');
            if (registerModal) registerModal.classList.add('hidden');
        }
    };

    const openRegisterModal = () => {
        if (registerModal) {
            registerModal.classList.remove('hidden');
            if (loginModal) loginModal.classList.add('hidden');
        }
    };

    const closeModal = () => {
        if (loginModal) loginModal.classList.add('hidden');
        if (registerModal) registerModal.classList.add('hidden');
    };

    // Événements d'ouverture de modale
    if (authBtn) authBtn.addEventListener('click', openLoginModal);
    if (navAuthBtn) navAuthBtn.addEventListener('click', openLoginModal);
    if (showRegisterLink) showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        openRegisterModal();
    });
    if (showLoginLink) showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        openLoginModal();
    });

    // Événements de fermeture de modale
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (closeRegisterBtn) closeRegisterBtn.addEventListener('click', closeModal);

    // Actions d'authentification
    if (loginBtn) loginBtn.addEventListener('click', () => {
        // TODO: Mettre le code de connexion Firebase ici
        console.log('Connexion simulée');
        localStorage.setItem('userLoggedIn', 'true');
        closeModal();
        window.location.reload();
    });

    if (registerBtn) registerBtn.addEventListener('click', () => {
        // TODO: Mettre le code d'inscription Firebase ici
        console.log('Inscription simulée');
        localStorage.setItem('userLoggedIn', 'true');
        closeModal();
        window.location.reload();
    });

    if (logoutBtn) logoutBtn.addEventListener('click', () => {
        // TODO: Mettre le code de déconnexion Firebase ici
        console.log('Déconnexion simulée');
        localStorage.setItem('userLoggedIn', 'false');
        window.location.reload();
    });

    // === GESTION DE LA REDIRECTION DES TUTORIELS ===
    const tutorialLinks = document.querySelectorAll('.tutorial-link');
    tutorialLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            const userIsLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
            if (!userIsLoggedIn) {
                event.preventDefault(); // Empêche le défilement
                openLoginModal();
            } else {
                // Rediriger si l'utilisateur est connecté
                const tutorialPath = link.getAttribute('data-tutorial');
                if (tutorialPath) {
                    window.location.href = tutorialPath;
                }
            }
        });
    });

    // === GESTION DES BOUTONS D'EXPLORATION ===
    const heroExploreBtn = document.getElementById('heroExploreBtn');
    const aboutExploreBtn = document.getElementById('aboutExploreBtn');
    
    if (heroExploreBtn) {
        heroExploreBtn.addEventListener('click', () => {
            const userIsLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
            if (!userIsLoggedIn) {
                openLoginModal();
            } else {
                window.location.href = "#tutorials"; // Redirige vers la section tutoriels
            }
        });
    }

    if (aboutExploreBtn) {
        aboutExploreBtn.addEventListener('click', () => {
            const userIsLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
            if (!userIsLoggedIn) {
                openLoginModal();
            } else {
                window.location.href = "#tutorials"; // Redirige vers la section tutoriels
            }
        });
    }

    // === GESTION DU THÈME ===
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark');
            const isDark = document.body.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
    }

    // Mise à jour de l'état de l'interface utilisateur
    const userIsLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    if (userIsLoggedIn) {
        if (authBtn) authBtn.classList.add('hidden');
        if (navAuthBtn) navAuthBtn.classList.add('hidden');
        if (userMenu) userMenu.classList.remove('hidden');
    } else {
        if (authBtn) authBtn.classList.remove('hidden');
        if (navAuthBtn) navAuthBtn.classList.remove('hidden');
        if (userMenu) userMenu.classList.add('hidden');
    }
});
