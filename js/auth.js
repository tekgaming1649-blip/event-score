const AUTHORIZED_EMAIL = 'adminsummerevent@gmail.com';

function isAdminAuthenticated() {
  // Allow both regular users and anonymous users with the correct email
  if (!auth.currentUser) return false;
  
  // Check email property
  if (auth.currentUser.email === AUTHORIZED_EMAIL) return true;
  
  // For anonymous auth, we set the email manually, so check that too
  if (auth.currentUser.isAnonymous && auth.currentUser.email === AUTHORIZED_EMAIL) return true;
  
  return false;
}

function redirectIfNeeded() {
  const path = window.location.pathname.split('/').pop();
  if (path === 'index.html' || path === '') {
    return;
  }
  if (!isAdminAuthenticated()) {
    window.location.href = 'index.html';
  }
}

function logoutAdmin() {
  auth.signOut().then(() => {
    window.location.href = 'index.html';
  });
}

auth.onAuthStateChanged((user) => {
  if (user) {
    // Verify user has authorized email or is anonymous with correct email
    if (user.email === AUTHORIZED_EMAIL || (user.isAnonymous && user.email === AUTHORIZED_EMAIL)) {
      if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
        window.location.href = 'dashboard.html';
      }
    } else if (!user.isAnonymous) {
      // Unauthorized non-anonymous user - sign them out
      console.warn(`Unauthorized access attempt from ${user.email}`);
      auth.signOut().then(() => {
        window.location.href = 'index.html';
      });
    }
  } else {
    redirectIfNeeded();
  }
});
