function renderPublicRanking() {
  const container = document.getElementById('public-ranking');
  if (!container) return;
  database.ref('streamers').on('value', (snapshot) => {
    const values = snapshot.val() || {};
    const streamers = Object.entries(values).map(([id, value]) => ({ id, ...value }));
    const sorted = [...streamers].sort((a, b) => b.score - a.score);
    const total = streamers.reduce((sum, streamer) => sum + Number(streamer.score || 0), 0);
    container.innerHTML = '';
    const totalCard = document.createElement('div');
    totalCard.className = 'rank-item';
    totalCard.innerHTML = `<div><strong>Total général</strong></div><div class="score">${total}</div>`;
    container.appendChild(totalCard);
    sorted.forEach((streamer, index) => {
      const card = document.createElement('div');
      card.className = 'rank-item';
      card.innerHTML = `<div><strong>#${index + 1} ${streamer.name}</strong></div><div class="score">${streamer.score}</div>`;
      container.appendChild(card);
    });
  });
}

renderPublicRanking();
