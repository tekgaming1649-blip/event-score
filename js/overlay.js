const params = new URLSearchParams(window.location.search);
const selectedId = params.get('streamer') || '';
const overlayScore = document.getElementById('overlay-score');

function updateOverlay(streamer) {
  if (!streamer) return;
  overlayScore.classList.remove('animate');
  void overlayScore.offsetWidth;
  overlayScore.textContent = streamer.score;
  overlayScore.classList.add('animate');
}

if (selectedId) {
  database.ref('streamers').child(selectedId).on('value', (snapshot) => {
    const value = snapshot.val();
    if (value) {
      updateOverlay({ id: selectedId, ...value });
    }
  });
} else {
  database.ref('streamers').on('value', (snapshot) => {
    const values = snapshot.val() || {};
    const streamers = Object.entries(values).map(([id, value]) => ({ id, ...value }));
    const top = [...streamers].sort((a, b) => b.score - a.score)[0];
    if (top) {
      updateOverlay(top);
    }
  });
}
