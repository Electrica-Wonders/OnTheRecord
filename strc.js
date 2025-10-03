// display the h1 title
document.getElementById('h1').textContent = "Stop. Search. Play. Dance";

// Prevent reload here to allow function operation.
const formEl = document.querySelector('form');
if (formEl) {
  formEl.addEventListener('submit', e => {
    e.preventDefault();
    findSets();
  });
}

// find sets by using the "q" element, check puplic API (mixcloud) and return back in json format
async function findSets() {
  const qEl = document.getElementById('q');
  const out = document.getElementById('out');

  const q = (qEl?.value || '').trim() || 'techno';
  const url = `https://api.mixcloud.com/search/?q=${encodeURIComponent(q)}&type=cloudcast&limit=25`;

  if (out) out.textContent = `Searching “…${q}” …`;
  console.log('[set-finder] query =', q);
  console.log('[set-finder] url =', url);
// error handing and response
  try {
    const res = await fetch(url, { method: 'GET', mode: 'cors' });
    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      throw new Error(`HTTP ${res.status} – ${res.statusText}. Body: ${txt?.slice(0,200)}`);
    }
    const data = await res.json();
    console.log('[set-finder] raw data:', data);

    const top = (data?.data ?? [])
      .sort((a, b) => (b.play_count || 0) - (a.play_count || 0))
      .slice(0, 5);

    if (!top.length) {
      out.textContent = `No results for “${q}”. Try another term (e.g., “house”, “drum & bass”, “ambient”).`;
      return;
    }

    out.innerHTML = top.map(c => {
      const name = c.name || 'Untitled set';
      const user = c.user?.name || 'Unknown';
      const mins = Math.round((c.audio_length || 120) / 60);
      const plays = c.play_count?.toLocaleString?.() || c.play_count || 0;
      const link = c.url || '#';
      return `
        <div class="card">
          <div class="title"><a href="${link}" target="_blank" rel="noopener">${name}</a></div>
          <div class="meta">${user} • ${mins || '?'} min • ${plays} plays</div>
        </div>
      `;
    }).join('');

  } catch (e) {
    console.error('[set-finder] fetch error:', e);
    out.textContent = `Error fetching “${q}”. Tip: run via a local server (not file://) and ensure HTTPS.`;
  }
}

// Events
document.getElementById('go')?.addEventListener('click', findSets);
document.getElementById('q')?.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault(); // added to prevent results from preloading and blocking the above request
    findSets();
  }
});
