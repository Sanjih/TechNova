// js/app.js

// === Fonctions globales pour les modales et les actions du header ===
// Ces fonctions doivent être en dehors de DOMContentLoaded pour être appelées par onclick=""

// Variables pour les modales
const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const modalTitle = document.getElementById('modalTitle');
const authBtn = document.getElementById('authBtn');
const navAuthBtn = document.getElementById('navAuthBtn');
const userMenu = document.getElementById('userMenu');
const logoutBtn = document.getElementById('logoutBtn');

// Ouvre la modale de connexion
function openModal() {
    if (loginModal) loginModal.classList.remove('hidden');
    if (loginForm) loginForm.classList.remove('hidden');
    if (signupForm) signupForm.classList.add('hidden');
    if (modalTitle) modalTitle.textContent = 'Connexion';
}

// Ferme la modale
function closeModal() {
    if (loginModal) loginModal.classList.add('hidden');
}

// === Écouteurs d'événements et initialisation ===
document.addEventListener('DOMContentLoaded', () => {

    // === GESTION DE L'AUTHENTIFICATION FIREBASE ===
    // S'assurer que le script de configuration Firebase a été chargé avant
    if (typeof firebase !== 'undefined' && firebase.auth) {
        
        // Gère le changement d'état de l'utilisateur (connexion/déconnexion)
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                // Utilisateur connecté
                if (authBtn) authBtn.classList.add('hidden');
                if (navAuthBtn) navAuthBtn.classList.add('hidden');
                if (userMenu) userMenu.classList.remove('hidden');
                localStorage.setItem('userLoggedIn', 'true');
                console.log('Utilisateur connecté:', user.email);
            } else {
                // Utilisateur déconnecté
                if (authBtn) authBtn.classList.remove('hidden');
                if (navAuthBtn) navAuthBtn.classList.remove('hidden');
                if (userMenu) userMenu.classList.add('hidden');
                localStorage.setItem('userLoggedIn', 'false');
                console.log('Utilisateur déconnecté');
            }
        });
        
        // Logique pour l'inscription
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('signup-email').value;
                const password = document.getElementById('signup-password').value;

                firebase.auth().createUserWithEmailAndPassword(email, password)
                    .then((cred) => {
                        console.log('Utilisateur inscrit :', cred.user);
                        closeModal();
                        window.location.reload();
                    })
                    .catch((err) => {
                        console.error('Erreur d\'inscription :', err.message);
                    });
            });
        }

        // Logique pour la connexion
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('login-email').value;
                const password = document.getElementById('login-password').value;
                
                firebase.auth().signInWithEmailAndPassword(email, password)
                    .then((cred) => {
                        console.log('Utilisateur connecté :', cred.user);
                        closeModal();
                        window.location.reload();
                    })
                    .catch((err) => {
                        console.error('Erreur de connexion :', err.message);
                    });
            });
        }

        // Gère la déconnexion
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                firebase.auth().signOut().then(() => {
                    console.log('Déconnexion réussie');
                    window.location.reload();
                }).catch((error) => {
                    console.error('Erreur de déconnexion :', error.message);
                });
            });
        }
    } else {
        console.error('Firebase SDK non trouvé ou non initialisé.');
    }

    // === GESTION DE LA NAVIGATION ET DES TUTORIELS ===
    const tutorialLinks = document.querySelectorAll('.tutorial-link');
    tutorialLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            const userIsLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
            if (!userIsLoggedIn) {
                event.preventDefault(); // Empêche la navigation
                openModal();
            }
        });
    });

    // Fonctions de bascule entre les formulaires
    const showSignupLink = document.getElementById('showSignupLink');
    if (showSignupLink) {
        showSignupLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (loginForm && signupForm) {
                loginForm.classList.add('hidden');
                signupForm.classList.remove('hidden');
                if (modalTitle) modalTitle.textContent = "Inscription";
            }
        });
    }

    const showLoginLink = document.getElementById('showLoginLink');
    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (signupForm && loginForm) {
                signupForm.classList.add('hidden');
                loginForm.classList.remove('hidden');
                if (modalTitle) modalTitle.textContent = "Connexion";
            }
        });
    }

    // === GESTION DES BOUTONS DE COMPLÉTION DE TUTORIELS ===
    // Pour chaque bouton "Marquer comme terminé", il faut écouter le clic
    document.querySelectorAll('[onclick="completeTutorial(...)"]').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const tutorialId = e.target.dataset.tutorialId; // Supposons que vous ayez un data-tutorial-id
            // TODO: implémenter la logique de complétion dans la base de données
            console.log(`Tutorial ${tutorialId} marked as complete.`);
            // Mettre à jour la progression dans le DOM
            // updateProgress(tutorialId, 100);
        });
    });

});

// Rendre la fonction globale accessible
window.openModal = openModal;
window.closeModal = closeModal;
