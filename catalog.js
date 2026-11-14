(() => {
  const config = window.MINECRAFT_CATALOG;
  if (!config) return;

  const owner = 'Shoaib-Ur-Rahman';
  const repo = 'Minecraft_Files';
  const branch = 'main';
  const folder = config.folder || config.category;
  const list = document.querySelector('#file-list');
  const status = document.querySelector('#catalog-status');
  const search = document.querySelector('#catalog-search');
  let entries = [];

  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);

  function sizeLabel(bytes) {
    if (!Number.isFinite(bytes)) return '';
    const units = ['B', 'KB', 'MB', 'GB'];
    let value = bytes;
    let unit = 0;
    while (value >= 1024 && unit < units.length - 1) { value /= 1024; unit++; }
    return `${value.toFixed(unit ? 1 : 0)} ${units[unit]}`;
  }

  function render(items) {
    if (!items.length) {
      list.innerHTML = `<p class="empty-message">No ${escapeHtml(config.title.toLowerCase())} are in the <code>${escapeHtml(folder)}/</code> folder yet.</p>`;
      return;
    }

    list.innerHTML = `<div class="file-grid">${items.map((file) => {
      const image = /\.(png|jpe?g|webp|gif)$/i.test(file.name);
      const extension = file.name.includes('.') ? file.name.split('.').pop().toUpperCase() : 'FILE';
      const downloadUrl = escapeHtml(file.download_url);
      const filename = escapeHtml(file.name);
      const preview = image
        ? `<a href="${downloadUrl}" target="_blank" rel="noopener noreferrer"><img class="file-preview" src="${downloadUrl}" alt="Preview: ${filename}" loading="lazy"></a>`
        : '';
      const size = sizeLabel(file.size);
      return `<article class="file-card">${preview}<span class="file-kind">${escapeHtml(config.icon)} ${extension}</span><h3>${filename}</h3><p>${size || 'Minecraft file'}</p><a class="button primary" href="${downloadUrl}" download>Download ${extension}</a></article>`;
    }).join('')}</div>`;
  }

  async function load() {
    try {
      const endpoint = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(folder)}?ref=${branch}`;
      const response = await fetch(endpoint, { headers: { Accept: 'application/vnd.github+json' } });
      if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);
      const contents = await response.json();
      entries = contents
        .filter((item) => item.type === 'file' && item.name.toLowerCase() !== 'readme.md' && item.download_url)
        .sort((a, b) => a.name.localeCompare(b.name));
      status.textContent = `${entries.length} file${entries.length === 1 ? '' : 's'} in this collection.`;
      render(entries);

      if (search) search.addEventListener('input', () => {
        const query = search.value.trim().toLowerCase();
        const filtered = entries.filter((file) => file.name.toLowerCase().includes(query));
        status.textContent = `${filtered.length} of ${entries.length} file${entries.length === 1 ? '' : 's'}.`;
        render(filtered);
      });
    } catch (error) {
      status.textContent = 'Could not load this folder.';
      list.innerHTML = `<p class="empty-message">Could not read the public <code>${escapeHtml(folder)}/</code> folder. Check that the files repository is public and try again later.</p>`;
    }
  }

  load();
})();
