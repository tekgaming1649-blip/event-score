const ADMIN_EMAIL = 'admin@summerevent.fr';
const ADMIN_PASSWORD = 'Summerevent16sa';
const ADMIN_SESSION_KEY = window.EVENT_SCORE_ADMIN_SESSION_KEY || 'eventScoreAdminAuthenticated';

const loginForm = document.getElementById('login-form');
const statusBox = document.getElementById('status');

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    statusBox.textContent = 'Connexion en cours...';

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem(ADMIN_SESSION_KEY, 'true');
      statusBox.textContent = 'Connexion réussie';
      window.location.href = 'dashboard.html';
      return;
    }

    statusBox.textContent = 'Identifiants invalides';
  });
}
