function isAdminAuthenticated() {
  return !!auth.currentUser;
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
    if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
      window.location.href = 'dashboard.html';
    }
  } else {
    redirectIfNeeded();
  }
});
