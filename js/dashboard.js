const streamerForm = document.getElementById('streamer-form');
const streamerNameInput = document.getElementById('streamer-name');
const streamerScoreInput = document.getElementById('streamer-score');
const streamerList = document.getElementById('streamer-list');
const selectedStreamerSelect = document.getElementById('selected-streamer');
const currentScoreEl = document.getElementById('current-score');
const rankingList = document.getElementById('ranking-list');
const obsLinkEl = document.getElementById('obs-link');
const logoutBtn = document.getElementById('logout-btn');
const clearFormBtn = document.getElementById('clear-form');
const resetBtn = document.getElementById('reset-btn');
const setScoreBtn = document.getElementById('set-score-btn');
const setScoreInput = document.getElementById('set-score-input');
const obsLinkBtn = document.getElementById('obs-link-btn');

let streamers = [];
let editingId = null;
let selectedStreamerId = null;

function sanitizeScore(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function getStreamersRef() {
  return database.ref('streamers');
}

function renderStreamers() {
  if (!streamerList) return;
  streamerList.innerHTML = '';
  streamers.forEach((streamer) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${streamer.name}</td>
      <td>${streamer.score}</td>
      <td>
        <button class="ghost edit-btn" data-id="${streamer.id}">Modifier</button>
        <button class="ghost delete-btn" data-id="${streamer.id}">Supprimer</button>
      </td>`;
    streamerList.appendChild(row);
  });
}

function renderSelection() {
  if (!selectedStreamerSelect) return;
  selectedStreamerSelect.innerHTML = '';
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = 'Choisir un streamer';
  selectedStreamerSelect.appendChild(defaultOption);
  streamers.forEach((streamer) => {
    const option = document.createElement('option');
    option.value = streamer.id;
    option.textContent = streamer.name;
    selectedStreamerSelect.appendChild(option);
  });
  if (selectedStreamerId && streamers.some((s) => s.id === selectedStreamerId)) {
    selectedStreamerSelect.value = selectedStreamerId;
  } else if (streamers[0]) {
    selectedStreamerId = streamers[0].id;
    selectedStreamerSelect.value = selectedStreamerId;
  }
  updateCurrentScore();
}

function updateCurrentScore() {
  const selected = streamers.find((streamer) => streamer.id === selectedStreamerId);
  if (currentScoreEl) {
    currentScoreEl.textContent = selected ? selected.score : 0;
  }
}

function renderRanking() {
  if (!rankingList) return;
  const sorted = [...streamers].sort((a, b) => b.score - a.score);
  rankingList.innerHTML = '';
  sorted.forEach((streamer, index) => {
    const item = document.createElement('div');
    item.className = 'rank-item';
    item.innerHTML = `<div><strong>#${index + 1} ${streamer.name}</strong></div><div class="score">${streamer.score}</div>`;
    rankingList.appendChild(item);
  });
}

function saveStreamer(payload) {
  const ref = getStreamersRef();
  const id = payload.id || ref.push().key;
  const updates = {};
  updates[id] = payload;
  return ref.update(updates);
}

function resetForm() {
  editingId = null;
  streamerForm.reset();
  streamerScoreInput.value = '0';
  document.getElementById('save-streamer').textContent = 'Ajouter / modifier';
}

function loadStreamers() {
  getStreamersRef().on('value', (snapshot) => {
    const values = snapshot.val() || {};
    streamers = Object.entries(values).map(([id, value]) => ({ id, ...value }));
    renderStreamers();
    renderSelection();
    renderRanking();
    updateCurrentScore();
  });
}

if (streamerForm) {
  streamerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = streamerNameInput.value.trim();
    const score = sanitizeScore(streamerScoreInput.value);
    if (!name) return;
    const payload = { name, score };
    if (editingId) {
      payload.id = editingId;
    }
    saveStreamer(payload).then(() => {
      resetForm();
    });
  });
}

if (streamerList) {
  streamerList.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    const id = button.getAttribute('data-id');
    const streamer = streamers.find((item) => item.id === id);
    if (!streamer) return;
    if (button.classList.contains('edit-btn')) {
      editingId = id;
      streamerNameInput.value = streamer.name;
      streamerScoreInput.value = streamer.score;
      document.getElementById('save-streamer').textContent = 'Enregistrer';
      streamerNameInput.focus();
    }
    if (button.classList.contains('delete-btn')) {
      getStreamersRef().child(id).remove();
    }
  });
}

if (selectedStreamerSelect) {
  selectedStreamerSelect.addEventListener('change', (event) => {
    selectedStreamerId = event.target.value;
    updateCurrentScore();
  });
}

document.querySelectorAll('[data-action]').forEach((button) => {
  button.addEventListener('click', () => {
    if (!selectedStreamerId) return;
    const value = sanitizeScore(button.getAttribute('data-value'));
    const action = button.getAttribute('data-action');
    const current = streamers.find((item) => item.id === selectedStreamerId);
    if (!current) return;
    const next = action === 'add' ? current.score + value : current.score - value;
    getStreamersRef().child(selectedStreamerId).update({ score: next });
  });
});

if (setScoreBtn) {
  setScoreBtn.addEventListener('click', () => {
    if (!selectedStreamerId) return;
    const next = sanitizeScore(setScoreInput.value);
    getStreamersRef().child(selectedStreamerId).update({ score: next });
    setScoreInput.value = '';
  });
}

if (resetBtn) {
  resetBtn.addEventListener('click', () => {
    if (!selectedStreamerId) return;
    getStreamersRef().child(selectedStreamerId).update({ score: 0 });
  });
}

if (obsLinkBtn) {
  obsLinkBtn.addEventListener('click', () => {
    const url = `${window.location.origin}/overlay.html?streamer=${encodeURIComponent(selectedStreamerId || '')}`;
    obsLinkEl.textContent = url;
  });
}

if (clearFormBtn) {
  clearFormBtn.addEventListener('click', resetForm);
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', logoutAdmin);
}

loadStreamers();
