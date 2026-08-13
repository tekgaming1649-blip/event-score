const LOCAL_DB_KEY = 'eventScoreLocalDatabase';

function readLocalDatabase() {
  try {
    const raw = localStorage.getItem(LOCAL_DB_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    console.warn('Lecture du stockage local impossible :', error);
    return {};
  }
}

function writeLocalDatabase(data) {
  localStorage.setItem(LOCAL_DB_KEY, JSON.stringify(data));
}

function getLocalValue(path) {
  const db = readLocalDatabase();
  if (!path) return db;
  return path.split('/').filter(Boolean).reduce((current, segment) => {
    if (current && typeof current === 'object' && Object.prototype.hasOwnProperty.call(current, segment)) {
      return current[segment];
    }
    return undefined;
  }, db);
}

function setLocalValue(path, value) {
  const db = readLocalDatabase();
  const segments = path.split('/').filter(Boolean);
  if (!segments.length) {
    writeLocalDatabase(value);
    return;
  }
  let current = db;
  const lastSegment = segments.pop();
  segments.forEach((segment) => {
    if (!current[segment] || typeof current[segment] !== 'object') {
      current[segment] = {};
    }
    current = current[segment];
  });
  if (typeof lastSegment !== 'undefined') {
    current[lastSegment] = value;
  }
  writeLocalDatabase(db);
}

function removeLocalValue(path) {
  const db = readLocalDatabase();
  const segments = path.split('/').filter(Boolean);
  if (!segments.length) {
    writeLocalDatabase({});
    return;
  }
  const lastSegment = segments.pop();
  let current = db;
  segments.forEach((segment) => {
    if (!current[segment] || typeof current[segment] !== 'object') {
      return;
    }
    current = current[segment];
  });
  if (current && typeof current === 'object') {
    delete current[lastSegment];
  }
  writeLocalDatabase(db);
}

class LocalSnapshot {
  constructor(value) {
    this._value = value;
  }

  val() {
    return this._value;
  }

  child(key) {
    const value = this._value && typeof this._value === 'object' ? this._value[key] : null;
    return new LocalSnapshot(value);
  }
}

class LocalRef {
  constructor(path = '') {
    this.path = path;
  }

  child(key) {
    const nextPath = this.path ? `${this.path}/${key}` : key;
    return new LocalRef(nextPath);
  }

  on(eventType, callback) {
    if (eventType !== 'value' || typeof callback !== 'function') return;
    callback(new LocalSnapshot(getLocalValue(this.path)));
  }

  update(data) {
    const current = getLocalValue(this.path) || {};
    const merged = typeof current === 'object' && !Array.isArray(current)
      ? { ...current, ...data }
      : data;
    setLocalValue(this.path, merged);
    return Promise.resolve();
  }

  remove() {
    removeLocalValue(this.path);
    return Promise.resolve();
  }

  push() {
    const key = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    return { key };
  }
}

const fallbackDatabase = {
  ref(path = '') {
    return new LocalRef(path);
  }
};

let auth = null;
let database = fallbackDatabase;

if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length) {
  auth = firebase.auth();
  database = firebase.database();
  window.firebaseAuthReady = true;
  console.log('Firebase initialized successfully.');
} else {
  window.firebaseAuthReady = false;
  console.warn('Firebase indisponible : utilisation du stockage local pour les permissions et le score.');
}

if (typeof window !== 'undefined') {
  window.eventScoreLocalDatabase = fallbackDatabase;
}

if (typeof window !== 'undefined' && !window.localDatabaseFallback) {
  window.localDatabaseFallback = fallbackDatabase;
}
