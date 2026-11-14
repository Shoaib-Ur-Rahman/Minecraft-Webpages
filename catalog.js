(() => {
  const config = window.MINECRAFT_CATALOG;
  if (!config) return;
  const owner = 'Shoaib-Ur-Rahman';
  const repo = 'Minecraft-Webpages';
  const list = document.querySelector('#file-list');
  const status = document.querySelector('#catalog-status');
  const search = document.querySelector('#catalog-search');
  let entries = [];

  function matchesCategory(asset, release) {
    const file = asset.name.toLowerCase();
    const title = `${release.name || ''} ${release.tag_name || ''}`.toLowerCase();
    const combined = `${file} ${title}`;
    switch (config.category) {
      case 'schematics': return /\.(litematic|schem|schematic)$/.test(file) || /schematic/.test(title);
      case 'resource-packs': return /resource.?pack|texture.?pack/.test(combined) || /\.(mcpack|mcaddon)$/.test(file);
      case 'shaderpacks': return /shader/.test(combined) || /\.shaderpack$/.test(file);
      case 'xaero-maps': return /xaero|world.?map|map.?backup/.test(combined);
      case 'modpacks': return /mod.?pack/.test(combined) || /\.mrpack$/.test(file);
      default: return false;
    }
  }

  function sizeLabel(bytes) {
    if (!Number.isFinite(bytes)) return '';
    const units = ['B', 'KB', 'MB', 'GB'];
    let value = bytes, unit = 0;
    while (value >= 1024 && unit < units.length - 1) { value /= 1024; unit++; }
    return `${value.toFixed(unit ? 1 : 0)} ${units[unit]}`;
  }

  function render(items) {
    if (!items.length) {
      list.innerHTML = `<p class="empty-message">No ${config.title.toLowerCase()} have been published yet. Check back later, or <a href="https://github.com/${owner}/${repo}/releases">visit the release archive</a>.</p>`;
      return;
    }
    list.innerHTML = `<div class="file-grid">${items.map(({ asset, release }) => {
      const image = /\.(png|jpe?g|webp|gif)$/i.test(asset.name);
      const label = image ? 'Preview image' : (asset.name.split('.').pop() || 'file').toUpperCase();
      const preview = image ? `<a href="${asset.browser_download_url}" target="_blank" rel="noopener noreferrer"><img class="file-preview" src="${asset.browser_download_url}" alt="Preview: ${asset.name}" loading="lazy"></a>` : '';
      const size = sizeLabel(asset.size);
      const releaseName = release.name || release.tag_name;
      return `<article class="file-card">${preview}<span class="file-kind">${config.icon} ${label}</span><h3>${asset.name}</h3><p>${releaseName}${size ? ` · ${size}` : ''}</p><a class="button primary" href="${asset.browser_download_url}">Download ${image ? 'image' : 'file'}</a></article>`;
    }).join('')}</div>`;
  }

  function safeText(value) {
    const span = document.createElement('span');
    span.textContent = value;
    return span.innerHTML;
  }

  async function load() {
    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases?per_page=100`, { headers: { Accept: 'application/vnd.github+json' } });
      if (!response.ok) throw new Error(`GitHub API status ${response.status}`);
      const releases = await response.json();
      entries = releases.filter((release) => !release.draft).flatMap((release) =>
        (release.assets || []).filter((asset) => asset.state === 'uploaded' && matchesCategory(asset, release)).map((asset) => ({ asset, release }))
      );
      status.textContent = `${entries.length} file${entries.length === 1 ? '' : 's'} in this collection.`;
      render(entries);
      if (search) search.addEventListener('input', () => {
        const query = search.value.trim().toLowerCase();
        const filtered = entries.filter(({ asset, release }) => `${asset.name} ${release.name || ''} ${release.tag_name || ''}`.toLowerCase().includes(query));
        status.textContent = `${filtered.length} of ${entries.length} file${entries.length === 1 ? '' : 's'}.`;
        render(filtered);
      });
    } catch (error) {
      status.textContent = 'Could not load the catalog right now.';
      list.innerHTML = `<p class="empty-message">The download list could not be loaded. Please try again later or <a href="https://github.com/${owner}/${repo}/releases">open the release archive</a>.</p>`;
    }
  }
  load();
})();
