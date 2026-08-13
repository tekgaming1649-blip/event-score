const AUTHORIZED_EMAIL = 'adminsummerevent@gmail.com';
const ADMIN_ACCESS_KEY = 'admin123'; // Simple admin key
let isAuthenticationInProgress = false;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLogin);
} else {
  initLogin();
}

function initLogin() {
  // Check if Firebase is ready
  if (typeof auth === 'undefined') {
    console.warn('Firebase not yet loaded, retrying in 500ms...');
    setTimeout(initLogin, 500);
    return;
  }
  
  initGoogleSignIn();
  initAdminForm();
}

// ============ GOOGLE SIGN-IN ============
function initGoogleSignIn() {
  const googleSignInContainer = document.getElementById('google-signin-container');
  
  if (!googleSignInContainer) {
    console.error('google-signin-container not found');
    return;
  }
  
  const googleButton = document.createElement('button');
  googleButton.innerHTML = '🔐 Se connecter avec Google';
  googleButton.style.width = '100%';
  googleButton.style.padding = '13px 14px';
  googleButton.style.borderRadius = '12px';
  googleButton.style.border = 'none';
  googleButton.style.fontSize = '1rem';
  googleButton.style.fontWeight = '700';
  googleButton.style.background = 'linear-gradient(90deg, #00d7ff, #ff4f9b)';
  googleButton.style.color = 'white';
  googleButton.style.cursor = 'pointer';
  googleButton.style.marginTop = '20px';
  googleButton.type = 'button';
  googleButton.id = 'google-signin-btn';
  googleButton.onclick = (e) => handleGoogleSignIn(e, googleButton);
  
  googleSignInContainer.appendChild(googleButton);
}

function handleGoogleSignIn(e, googleButton) {
  e.preventDefault();
  
  if (isAuthenticationInProgress || typeof auth === 'undefined') {
    return;
  }
  
  isAuthenticationInProgress = true;
  googleButton.disabled = true;
  googleButton.style.opacity = '0.6';
  
  const statusBox = document.getElementById('status');
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  
  statusBox.textContent = '⏳ Redirection vers Google...';
  statusBox.style.color = '#ffd869';
  
  auth.signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      
      console.log('User email:', user.email, 'Authorized email:', AUTHORIZED_EMAIL);
      
      if (user.email !== AUTHORIZED_EMAIL) {
        statusBox.textContent = `❌ Accès refusé. Vous avez utilisé: ${user.email}`;
        statusBox.style.color = '#ff6b6b';
        
        auth.signOut().then(() => {
          isAuthenticationInProgress = false;
          googleButton.disabled = false;
          googleButton.style.opacity = '1';
        });
        return;
      }
      
      statusBox.textContent = '✅ Connexion réussie - Redirection...';
      statusBox.style.color = '#4ade80';
    })
    .catch((error) => {
      isAuthenticationInProgress = false;
      googleButton.disabled = false;
      googleButton.style.opacity = '1';
      
      console.error('Google login error:', error);
      statusBox.textContent = '⚠️ Google Sign-in non disponible - utilisez le formulaire ci-dessous';
      statusBox.style.color = '#ff9500';
      
      // Show admin form as fallback
      document.getElementById('admin-form').style.display = 'grid';
    });
}

// ============ ADMIN FORM (FALLBACK) ============
function initAdminForm() {
  const adminForm = document.getElementById('admin-form');
  
  if (!adminForm) {
    console.error('admin-form not found');
    return;
  }
  
  adminForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleAdminFormSubmit();
  });
}

function handleAdminFormSubmit() {
  const email = document.getElementById('admin-email').value.trim();
  const key = document.getElementById('admin-key').value;
  const statusBox = document.getElementById('status');
  const submitBtn = document.querySelector('#admin-form button');
  
  submitBtn.disabled = true;
  statusBox.textContent = '⏳ Vérification...';
  statusBox.style.color = '#ffd869';
  
  // Verify email and key
  if (email !== AUTHORIZED_EMAIL) {
    statusBox.textContent = `❌ Email incorrect. Utilisez: ${AUTHORIZED_EMAIL}`;
    statusBox.style.color = '#ff6b6b';
    submitBtn.disabled = false;
    return;
  }
  
  if (key !== ADMIN_ACCESS_KEY) {
    statusBox.textContent = '❌ Clé d\'accès incorrecte';
    statusBox.style.color = '#ff6b6b';
    submitBtn.disabled = false;
    return;
  }
  
  // Authentication successful with admin credentials
  auth.signInAnonymously()
    .then(() => {
      // Override user email for consistency
      auth.currentUser.email = AUTHORIZED_EMAIL;
      
      statusBox.textContent = '✅ Connexion réussie - Redirection...';
      statusBox.style.color = '#4ade80';
      
      // Manually trigger redirect since anonymous auth won't trigger onAuthStateChanged redirect
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 500);
    })
    .catch((error) => {
      console.error('Admin auth error:', error);
      statusBox.textContent = '❌ Erreur de connexion';
      statusBox.style.color = '#ff6b6b';
      submitBtn.disabled = false;
    });
}
