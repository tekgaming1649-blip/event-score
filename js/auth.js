window.EVENT_SCORE_ADMIN_SESSION_KEY = 'eventScoreAdminAuthenticated';

function getAdminSessionKey() {
  return window.EVENT_SCORE_ADMIN_SESSION_KEY || 'eventScoreAdminAuthenticated';
}

function isAdminAuthenticated() {
  return localStorage.getItem(getAdminSessionKey()) === 'true';
}

function redirectIfNeeded() {
  const path = window.location.pathname.split('/').pop();
  if (path === 'index.html' || path === '') {
    if (isAdminAuthenticated()) {
      window.location.href = 'dashboard.html';
    }
    return;
  }
  if (!isAdminAuthenticated()) {
    window.location.href = 'index.html';
  }
}

function logoutAdmin() {
  localStorage.removeItem(getAdminSessionKey());
  window.location.href = 'index.html';
}

function initializeAdminSession() {
  if (isAdminAuthenticated()) {
    if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
      window.location.href = 'dashboard.html';
    }
  } else {
    redirectIfNeeded();
  }
}

initializeAdminSession();
