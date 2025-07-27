// tailwind.config.js
module.exports = {
  content: [
    "./index.html",    // Indique à Tailwind de scanner index.html
    "./profile.html",  // Indique à Tailwind de scanner profile.html
    "./js/**/*.js",    // (Optionnel) Si vous avez des classes Tailwind dans vos fichiers JS
  ],
  theme: {
    extend: {
      colors: {
        // Assurez-vous que vos couleurs personnalisées de votre `:root` dans style.css sont définies ici
        // Ceci est crucial pour que Tailwind reconnaisse des classes comme "text-noir" ou "bg-bleu"
        noir: '#0f172a',
        fluorescent: '#a2ff00',
        bleu: '#0077ff',
        // Ajoutez d'autres couleurs personnalisées si vous en avez dans votre CSS
      }
    },
  },
  plugins: [],
}
