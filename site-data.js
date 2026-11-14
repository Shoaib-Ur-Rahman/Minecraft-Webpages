(function () {
  const DEFAULT_PASSWORD = 'vexor10';
  const STORAGE_KEY = 'minecraft_site_data_v1';
  const PASS_KEY = 'minecraft_site_pass_v1';

  function defaultData() {
    return {
      password: DEFAULT_PASSWORD,
      files: [
        {
          id: 'iron-farm',
          category: 'schematics',
          title: 'Iron Farm',
          description: 'Simple and efficient iron farm schematic for survival play.',
          version: '1.21.x',
          type: 'Litematic',
          downloadUrl: 'https://github.com/Shoaib-Ur-Rahman/Minecraft-Webpages/releases',
          previewUrl: ''
        },
        {
          id: 'villager-breeder',
          category: 'schematics',
          title: 'Villager Breeder',
          description: 'Villager breeding setup for automated farm progression.',
          version: '1.21.x',
          type: 'Litematic',
          downloadUrl: 'https://github.com/Shoaib-Ur-Rahman/Minecraft-Webpages/releases',
          previewUrl: ''
        }
      ]
    };
  }

  function loadData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const data = defaultData();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        localStorage.setItem(PASS_KEY, data.password);
        return data;
      }
      const parsed = JSON.parse(raw);
      if (!parsed.password) parsed.password = localStorage.getItem(PASS_KEY) || DEFAULT_PASSWORD;
      localStorage.setItem(PASS_KEY, parsed.password);
      return parsed;
    } catch (err) {
      const fallback = defaultData();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
      localStorage.setItem(PASS_KEY, fallback.password);
      return fallback;
    }
  }

  function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    if (data.password) localStorage.setItem(PASS_KEY, data.password);
  }

  function getPassword() {
    return localStorage.getItem(PASS_KEY) || DEFAULT_PASSWORD;
  }

  function setPassword(value) {
    localStorage.setItem(PASS_KEY, value || DEFAULT_PASSWORD);
  }

  window.MINECRAFT_SITE = {
    defaultData,
    loadData,
    saveData,
    getPassword,
    setPassword
  };
})();
