// app.js

// Assurez-vous que l'importation se fait depuis votre fichier de configuration Firebase
// Si vous avez un fichier séparé, importez-le ainsi:
// import { auth } from './firebase-config.js';
// Si la configuration est dans index.html, cette ligne est à adapter
// ou à retirer si vous utilisez firebase.auth() directement

// Logique pour gérer la modale (ouverture/fermeture et changement de formulaire)
const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const modalTitle = document.getElementById('modalTitle');

function openModal() {
    if (loginModal) loginModal.classList.remove('hidden');
    if (loginForm) loginForm.classList.remove('hidden');
    if (signupForm) signupForm.classList.add('hidden');
    if (modalTitle) modalTitle.textContent = 'Connexion';
}

function closeModal() {
    if (loginModal) loginModal.classList.add('hidden');
}

// Ajoutez ces écouteurs pour basculer entre les formulaires
document.getElementById('showSignupLink').addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
    modalTitle.textContent = "Inscription";
});

document.getElementById('showLoginLink').addEventListener('click', (e) => {
    e.preventDefault();
    signupForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
    modalTitle.textContent = "Connexion";
});

document.addEventListener('DOMContentLoaded', () => {
    // ... Votre code existant pour le chargement du blog
    // ... Votre code existant pour la gestion du thème

    // Logique pour la redirection des tutoriels (réutilise openModal)
    const tutorialLinks = document.querySelectorAll('.tutorial-link');
    tutorialLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const userIsLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
            if (userIsLoggedIn) {
                const tutorialPath = link.getAttribute('data-tutorial');
                if (tutorialPath) {
                    window.location.href = tutorialPath;
                }
            } else {
                openModal();
            }
        });
    });

    // ----------------------------------------------------
    // NOUVEAU CODE POUR L'AUTHENTIFICATION AVEC FIREBASE
    // ----------------------------------------------------

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
                localStorage.setItem('userLoggedIn', 'true');
                window.location.reload();
            })
            .catch((err) => {
                console.log('Erreur d\'inscription :', err.message);
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
                localStorage.setItem('userLoggedIn', 'true');
                window.location.reload();
            })
            .catch((err) => {
                console.log('Erreur de connexion :', err.message);
            });
        });
    }

    // Gestion de la déconnexion
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            firebase.auth().signOut().then(() => {
                console.log('Déconnexion réussie');
                localStorage.setItem('userLoggedIn', 'false');
                window.location.reload();
            }).catch((error) => {
                console.log('Erreur de déconnexion :', error.message);
            });
        });
    }

    // Gestion du changement d'état de l'utilisateur (connexion/déconnexion)
    firebase.auth().onAuthStateChanged((user) => {
        const authBtn = document.getElementById('authBtn');
        const navAuthBtn = document.getElementById('navAuthBtn');
        const userMenu = document.getElementById('userMenu');

        if (user) {
            if (authBtn) authBtn.classList.add('hidden');
            if (navAuthBtn) navAuthBtn.classList.add('hidden');
            if (userMenu) userMenu.classList.remove('hidden');
            localStorage.setItem('userLoggedIn', 'true');
            // Vous pouvez ajouter une logique pour afficher le nom de l'utilisateur
            // Ex: document.getElementById('userName').textContent = user.email;
        } else {
            if (authBtn) authBtn.classList.remove('hidden');
            if (navAuthBtn) navAuthBtn.classList.remove('hidden');
            if (userMenu) userMenu.classList.add('hidden');
            localStorage.setItem('userLoggedIn', 'false');
        }
    });

});
