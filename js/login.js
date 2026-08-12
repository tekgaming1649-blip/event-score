const AUTHORIZED_EMAIL = 'admin@summerevent.fr';
const statusBox = document.getElementById('status');
const googleSignInContainer = document.getElementById('google-signin-container');

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
googleButton.onclick = handleGoogleSignIn;

googleSignInContainer.appendChild(googleButton);

function handleGoogleSignIn(e) {
  e.preventDefault();
  
  const provider = new firebase.auth.GoogleAuthProvider();
  
  statusBox.textContent = 'Redirection vers Google...';
  statusBox.style.color = '#ffd869';
  
  auth.signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      
      // Verify email is authorized
      if (user.email !== AUTHORIZED_EMAIL) {
        statusBox.textContent = `❌ Accès refusé. Seul ${AUTHORIZED_EMAIL} peut se connecter.`;
        statusBox.style.color = '#ff6b6b';
        
        // Sign out the unauthorized user
        auth.signOut();
        return;
      }
      
      statusBox.textContent = '✅ Connexion réussie';
      statusBox.style.color = '#4ade80';
    })
    .catch((error) => {
      console.error('Login error:', error);
      const message = error && error.message ? error.message : 'Erreur inconnue';
      const code = error && error.code ? error.code : 'unknown';
      
      // Handle specific error codes
      if (code === 'auth/popup-closed-by-user') {
        statusBox.textContent = 'Connexion annulée';
      } else {
        statusBox.textContent = `❌ Erreur ${code}: ${message}`;
      }
      statusBox.style.color = '#ff6b6b';
    });
}
