const AUTHORIZED_EMAIL = 'adminsummerevent@gmail.com';
let isAuthenticationInProgress = false;

// Wait for DOM to be ready
function initGoogleSignIn() {
  const statusBox = document.getElementById('status');
  const googleSignInContainer = document.getElementById('google-signin-container');
  
  if (!googleSignInContainer) {
    console.error('google-signin-container not found');
    return;
  }
  
  // Create custom Google Sign-In button
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
  googleButton.onclick = (e) => handleGoogleSignIn(e, statusBox, googleButton);
  
  googleSignInContainer.appendChild(googleButton);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGoogleSignIn);
} else {
  initGoogleSignIn();
}

function handleGoogleSignIn(e, statusBox, googleButton) {
  e.preventDefault();
  
  if (isAuthenticationInProgress) {
    return;
  }
  
  isAuthenticationInProgress = true;
  googleButton.disabled = true;
  googleButton.style.opacity = '0.6';
  
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  
  statusBox.textContent = '⏳ Redirection vers Google...';
  statusBox.style.color = '#ffd869';
  
  auth.signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      
      console.log('User email:', user.email, 'Authorized email:', AUTHORIZED_EMAIL);
      
      // Verify email is authorized
      if (user.email !== AUTHORIZED_EMAIL) {
        statusBox.textContent = `❌ Accès refusé. Seul ${AUTHORIZED_EMAIL} peut se connecter. Vous avez utilisé: ${user.email}`;
        statusBox.style.color = '#ff6b6b';
        
        // Sign out the unauthorized user immediately
        auth.signOut().then(() => {
          isAuthenticationInProgress = false;
          googleButton.disabled = false;
          googleButton.style.opacity = '1';
        });
        return;
      }
      
      // User is authorized - connection is successful
      statusBox.textContent = '✅ Connexion réussie - Redirection en cours...';
      statusBox.style.color = '#4ade80';
      
      // Redirect will be handled by auth.js onAuthStateChanged
    })
    .catch((error) => {
      isAuthenticationInProgress = false;
      googleButton.disabled = false;
      googleButton.style.opacity = '1';
      
      console.error('Login error:', error);
      const message = error && error.message ? error.message : 'Erreur inconnue';
      const code = error && error.code ? error.code : 'unknown';
      
      // Handle specific error codes
      if (code === 'auth/popup-closed-by-user') {
        statusBox.textContent = '❌ Connexion annulée';
      } else {
        statusBox.textContent = `❌ Erreur ${code}: ${message}`;
      }
      statusBox.style.color = '#ff6b6b';
    });
}
      } else {
        statusBox.textContent = `❌ Erreur ${code}: ${message}`;
      }
      statusBox.style.color = '#ff6b6b';
    });
}
