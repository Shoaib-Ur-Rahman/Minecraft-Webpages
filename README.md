<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Admin panel for Minecraft download website.">
  <title>Admin Panel | vexor_10</title>
  <link rel="stylesheet" href="style.css">
  <style>
    .admin-shell { max-width: 1100px; margin: 40px auto 80px; }
    .panel { background: linear-gradient(145deg, var(--panel-2), var(--panel)); border:1px solid var(--line); border-radius:20px; padding:28px; box-shadow:var(--shadow); }
    .login-box, .settings-box { display:grid; gap:18px; }
    .field { display:grid; gap:8px; }
    label { font-size:.82rem; color:var(--muted); font-weight:700; }
    input, select, textarea, button { font: inherit; }
    input, select, textarea { width:100%; min-height:44px; padding:0 14px; border-radius:12px; border:1px solid var(--line); background:rgba(255,255,255,.02); color:var(--text); }
    textarea { min-height:90px; resize:vertical; padding:12px 14px; }
    .row { display:flex; flex-wrap:wrap; gap:14px; }
    .row > * { flex:1; min-width:200px; }
    .hidden { display:none !important; }
    .toast { padding:10px 12px; border-radius:10px; background:rgba(120,224,143,.12); border:1px solid rgba(120,224,143,.3); color:var(--text); }
    .file-list { display:grid; gap:12px; margin-top:20px; }
    .file-item { display:grid; grid-template-columns:1fr auto auto; gap:12px; align-items:center; padding:14px; border-radius:12px; background:rgba(255,255,255,.02); border:1px solid var(--line); }
    .file-item small { color:var(--muted); display:block; }
  </style>
</head>
<body>
  <header class="hero" style="min-height:220px;">
    <nav class="nav wrap" aria-label="Main navigation">
      <a class="brand" href="./">vexor<span>_10</span></a>
      <a class="button secondary" href="./">← Website</a>
    </nav>
    <div class="hero-content wrap">
      <p class="eyebrow">ADMIN</p>
      <h1>Settings</h1>
    </div>
  </header>

  <main class="wrap admin-shell">
    <div id="login-panel" class="panel login-box">
      <h2>Login</h2>
      <div class="field">
        <label for="admin-pass">Password</label>
        <input id="admin-pass" type="password" placeholder="Enter admin password" />
      </div>
      <button id="login-btn" class="button primary" type="button">Login</button>
      <p class="toast">Default password: <strong>vexor10</strong>. Change it in the admin panel after login.</p>
    </div>

    <div id="admin-panel" class="panel settings-box hidden">
      <h2>Content manager</h2>
      <div id="status-bar" class="toast">Ready.</div>

      <div class="row">
        <div class="field">
          <label for="new-password">Admin password</label>
          <input id="new-password" type="text" placeholder="Set new admin password" />
        </div>
        <div class="field" style="align-self:end;">
          <button id="save-pass-btn" class="button secondary" type="button">Save password</button>
        </div>
      </div>

      <div class="row">
        <div class="field">
          <label for="file-title">Title</label>
          <input id="file-title" type="text" placeholder="Iron Farm" />
        </div>
        <div class="field">
          <label for="file-category">Category</label>
          <select id="file-category">
            <option value="schematics">Schematics</option>
            <option value="resource-packs">Resource packs</option>
            <option value="shaderpacks">Shaderpacks</option>
            <option value="xaero-maps">Xaero map files</option>
            <option value="modpacks">Modpacks</option>
          </select>
        </div>
      </div>

      <div class="row">
        <div class="field">
          <label for="file-version">Version</label>
          <input id="file-version" type="text" placeholder="1.21.x" />
        </div>
        <div class="field">
          <label for="file-type">Type</label>
          <input id="file-type" type="text" placeholder="Litematic / ZIP / Shaderpack" />
        </div>
      </div>

      <div class="field">
        <label for="file-description">Description</label>
        <textarea id="file-description" placeholder="What this file is for and how to use it."></textarea>
      </div>

      <div class="row">
        <div class="field">
          <label for="file-download-url">Download URL</label>
          <input id="file-download-url" type="url" placeholder="https://example.com/download.zip" />
        </div>
        <div class="field">
          <label for="file-preview-url">Preview image URL (optional)</label>
          <input id="file-preview-url" type="url" placeholder="https://example.com/preview.png" />
        </div>
      </div>

      <div class="row">
        <button id="add-file-btn" class="button primary" type="button">Add file</button>
        <button id="logout-btn" class="button secondary" type="button">Log out</button>
      </div>

      <div>
        <h3>Current files</h3>
        <div id="file-list" class="file-list"></div>
      </div>
    </div>
  </main>

  <script src="site-data.js"></script>
  <script>
    const loginPanel = document.getElementById('login-panel');
    const adminPanel = document.getElementById('admin-panel');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const addFileBtn = document.getElementById('add-file-btn');
    const savePassBtn = document.getElementById('save-pass-btn');
    const statusBar = document.getElementById('status-bar');
    const fileList = document.getElementById('file-list');

    function showStatus(message) {
      statusBar.textContent = message;
    }

    function readData() {
      return window.MINECRAFT_SITE.loadData();
    }

    function writeData(data) {
      window.MINECRAFT_SITE.saveData(data);
    }

    function renderFiles() {
      const data = readData();
      if (!data.files || !data.files.length) {
        fileList.innerHTML = '<div class="empty-message">No files yet. Add your first download.</div>';
        return;
      }

      fileList.innerHTML = data.files.map((file) => `
        <div class="file-item">
          <div>
            <strong>${file.title}</strong>
            <small>${file.category} · ${file.type || 'file'} · ${file.version || 'No version'}</small>
            <small>${file.description || 'No description.'}</small>
          </div>
          <a class="button secondary" href="${file.downloadUrl}" target="_blank" rel="noopener noreferrer">Open</a>
          <button class="button primary" type="button" data-delete-id="${file.id}">Delete</button>
        </div>
      `).join('');

      fileList.querySelectorAll('[data-delete-id]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const data = readData();
          data.files = data.files.filter((item) => item.id !== btn.dataset.deleteId);
          writeData(data);
          renderFiles();
          showStatus('File removed.');
        });
      });
    }

    function login() {
      const entered = document.getElementById('admin-pass').value;
      const data = readData();
      if (entered === data.password) {
        loginPanel.classList.add('hidden');
        adminPanel.classList.remove('hidden');
        renderFiles();
      } else {
        showStatus('Wrong password.');
      }
    }

    function logout() {
      adminPanel.classList.add('hidden');
      loginPanel.classList.remove('hidden');
      document.getElementById('admin-pass').value = '';
      showStatus('Logged out.');
    }

    function savePassword() {
      const newPass = document.getElementById('new-password').value.trim();
      if (!newPass) {
        showStatus('Enter a new password first.');
        return;
      }
      const data = readData();
      data.password = newPass;
      writeData(data);
      showStatus('Password saved.');
      document.getElementById('new-password').value = '';
    }

    function addFile() {
      const data = readData();
      const file = {
        id: 'file-' + Date.now(),
        title: document.getElementById('file-title').value.trim(),
        category: document.getElementById('file-category').value,
        version: document.getElementById('file-version').value.trim(),
        type: document.getElementById('file-type').value.trim() || 'File',
        description: document.getElementById('file-description').value.trim(),
        downloadUrl: document.getElementById('file-download-url').value.trim(),
        previewUrl: document.getElementById('file-preview-url').value.trim()
      };

      if (!file.title || !file.downloadUrl) {
        showStatus('Title and download URL are required.');
        return;
      }

      data.files.push(file);
      writeData(data);
      renderFiles();
      showStatus('File added.');
      document.getElementById('file-title').value = '';
      document.getElementById('file-version').value = '';
      document.getElementById('file-type').value = '';
      document.getElementById('file-description').value = '';
      document.getElementById('file-download-url').value = '';
      document.getElementById('file-preview-url').value = '';
    }

    loginBtn.addEventListener('click', login);
    logoutBtn.addEventListener('click', logout);
    addFileBtn.addEventListener('click', addFile);
    savePassBtn.addEventListener('click', savePassword);
    document.getElementById('admin-pass').addEventListener('keydown', (event) => {
      if (event.key === 'Enter') login();
    });
  </script>
</body>
</html>
