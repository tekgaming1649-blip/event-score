const AUTHORIZED_EMAIL = 'adminsummerevent@gmail.com';

function isAdminAuthenticated() {
  return !!auth.currentUser && auth.currentUser.email === AUTHORIZED_EMAIL;
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
    // Verify user has authorized email
    if (user.email === AUTHORIZED_EMAIL) {
      if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
        window.location.href = 'dashboard.html';
      }
    } else {
      // Unauthorized user - sign them out
      console.warn(`Unauthorized access attempt from ${user.email}`);
      auth.signOut().then(() => {
        window.location.href = 'index.html';
      });
    }
  } else {
    redirectIfNeeded();
  }
});
