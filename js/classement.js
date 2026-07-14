function renderPublicRanking() {
  const container = document.getElementById('public-ranking');
  if (!container) return;
  database.ref('streamers').on('value', (snapshot) => {
    const values = snapshot.val() || {};
    const streamers = Object.entries(values).map(([id, value]) => ({ id, ...value }));
    const sorted = [...streamers].sort((a, b) => b.score - a.score);
    container.innerHTML = '';
    sorted.forEach((streamer, index) => {
      const card = document.createElement('div');
      card.className = 'rank-item';
      card.innerHTML = `<div><strong>#${index + 1} ${streamer.name}</strong></div><div class="score">${streamer.score}</div>`;
      container.appendChild(card);
    });
  });
}

renderPublicRanking();
