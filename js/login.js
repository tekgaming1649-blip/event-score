const loginForm = document.getElementById('login-form');
const statusBox = document.getElementById('status');

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    statusBox.textContent = 'Connexion en cours...';
    auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        statusBox.textContent = 'Connexion réussie';
      })
      .catch((error) => {
        console.error('Login error:', error);
        const message = error && error.message ? error.message : 'Erreur inconnue';
        const code = error && error.code ? error.code : 'unknown';
        statusBox.textContent = `Erreur ${code}: ${message}`;
        console.log('Firebase config used:', firebase.app().options);
      });
  });
}
