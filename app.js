// js/app.js

document.addEventListener('DOMContentLoaded', () => {
    // Variables globales
    const loginModal = document.getElementById('loginModal'); // Corrigé pour correspondre à l'ID de votre HTML
    const authBtn = document.getElementById('authBtn');
    const navAuthBtn = document.getElementById('navAuthBtn');
    const userMenu = document.getElementById('userMenu');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // Fonctions d'ouverture/fermeture des modales
    window.openLoginModal = () => {
        if (loginModal) {
            loginModal.classList.remove('hidden');
        }
    };

    window.closeModal = () => {
        if (loginModal) {
            loginModal.classList.add('hidden');
        }
    };
    
    // Fonction de compatibilité pour les boutons qui appellent openModal()
    window.openModal = window.openLoginModal;

    // Rendre les fonctions d'ouverture de modal accessibles au HTML
    window.showLogin = openLoginModal;
    window.showRegister = openRegisterModal;

    // Fonctions d'authentification (à lier à Firebase)
    window.login = () => {
        // Logique de connexion ici
        console.log('Tentative de connexion...');
        // Simuler une connexion réussie
        localStorage.setItem('userLoggedIn', 'true');
        window.location.reload();
    };

    window.register = () => {
        // Logique d'inscription ici
        console.log('Tentative d\'inscription...');
        // Simuler une inscription réussie
        localStorage.setItem('userLoggedIn', 'true');
        window.location.reload();
    };

    window.logout = () => {
        // Logique de déconnexion ici
        console.log('Déconnexion...');
        localStorage.setItem('userLoggedIn', 'false');
        window.location.reload();
    };

    // Fonction pour gérer les redirections en fonction de l'état de l'utilisateur
    window.openModalIfGuest = (callback) => {
        const userIsLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
        if (userIsLoggedIn) {
            if (typeof callback === 'function') {
                callback();
            }
        } else {
            openLoginModal();
        }
    };

    // Fonction pour marquer un tutoriel comme terminé
    window.completeTutorial = (tutorialId) => {
        console.log(`Tutoriel ${tutorialId} marqué comme terminé.`);
        // Mettez à jour la progression dans le DOM
        const progressBar = document.getElementById(`progress-${tutorialId}`);
        const progressText = document.getElementById(`progress-text-${tutorialId}`);
        if (progressBar && progressText) {
            progressBar.style.width = '100%';
            progressText.textContent = '100%';
            // TODO: Enregistrer la progression dans Firebase/la base de données
        }
    };
    
    // Mettre à jour l'état de l'interface utilisateur en fonction de l'état de connexion
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

    // Gestionnaire de clic pour le thème
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        const isDark = document.body.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
      });
    }

    // Appliquer le thème sauvegardé
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
      document.body.classList.add('dark');
    }

    // Écouteur d'événement pour tous les liens de tutoriels
    const tutorialLinks = document.querySelectorAll('.tutorial-link');
    tutorialLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            const userIsLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
            if (!userIsLoggedIn) {
                event.preventDefault(); 
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

});
