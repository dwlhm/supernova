// UI Script running in Figma Plugin Iframe

let currentScope: 'selection' | 'page' | 'all' = 'selection';
let isConnected = false;

// DOM Elements
const serverUrlInput = document.getElementById('serverUrl') as HTMLInputElement;
const btnTestConn = document.getElementById('btnTestConn') as HTMLButtonElement;
const statusDot = document.getElementById('statusDot') as HTMLDivElement;
const statusText = document.getElementById('statusText') as HTMLSpanElement;
const scopeControl = document.getElementById('scopeControl') as HTMLDivElement;
const chkSaveRaw = document.getElementById('chkSaveRaw') as HTMLInputElement;
const chkAutoGenerate = document.getElementById('chkAutoGenerate') as HTMLInputElement;
const btnSyncAll = document.getElementById('btnSyncAll') as HTMLButtonElement;
const btnSyncTokens = document.getElementById('btnSyncTokens') as HTMLButtonElement;
const btnSyncComponents = document.getElementById('btnSyncComponents') as HTMLButtonElement;
const logTerminal = document.getElementById('logTerminal') as HTMLDivElement;
const btnClearLog = document.getElementById('btnClearLog') as HTMLButtonElement;

// ---------------------------------------------------------------------------
// Logging & Terminal Helper
// ---------------------------------------------------------------------------

function formatTime(): string {
  const d = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function log(msg: string, type: 'info' | 'success' | 'warn' | 'error' | 'highlight' = 'info') {
  if (!logTerminal) return;
  const line = document.createElement('div');
  line.className = `log-line ${type}`;
  line.textContent = `[${formatTime()}] ${msg}`;
  logTerminal.appendChild(line);
  logTerminal.scrollTop = logTerminal.scrollHeight;
}

function clearLog() {
  if (logTerminal) {
    logTerminal.innerHTML = '';
  }
}

function notifyPlugin(message: string, error: boolean = false) {
  parent.postMessage({ pluginMessage: { type: 'notify', message, error } }, '*');
}

function getServerUrl(): string {
  let url = (serverUrlInput?.value || 'http://localhost:8080').trim();
  return url.replace(/\/+$/, '');
}

// ---------------------------------------------------------------------------
// Health & Connection Check
// ---------------------------------------------------------------------------

async function checkHealth(silent = false): Promise<boolean> {
  const url = getServerUrl();
  statusDot.className = 'status-dot checking';
  statusText.textContent = 'Checking...';

  try {
    const res = await fetch(`${url}/api/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (res.ok) {
      const data = await res.json();
      isConnected = true;
      statusDot.className = 'status-dot connected';
      statusText.textContent = `Online (v${data.version || '1.0'})`;
      if (!silent) {
        log(`Backend server reached at ${url} (${data.targetDir || ''})`, 'success');
      }
      return true;
    } else {
      throw new Error(`HTTP ${res.status}`);
    }
  } catch (err: any) {
    isConnected = false;
    statusDot.className = 'status-dot disconnected';
    statusText.textContent = 'Offline';
    if (!silent) {
      log(`Connection failed: Cannot reach ${url}/api/health. Ensure "npm run server" is running.`, 'error');
    }
    return false;
  }
}

// ---------------------------------------------------------------------------
// Scope Selection Handling
// ---------------------------------------------------------------------------

scopeControl?.addEventListener('click', (e) => {
  const target = (e.target as HTMLElement).closest('.segment-label') as HTMLElement;
  if (!target) return;
  const scope = target.getAttribute('data-scope') as 'selection' | 'page' | 'all';
  if (scope) {
    currentScope = scope;
    scopeControl.querySelectorAll('.segment-label').forEach((el) => el.classList.remove('active'));
    target.classList.add('active');
    const labelMap: Record<string, string> = {
      selection: 'Selection',
      page: 'Current Page',
      all: 'Entire Document',
    };
    log(`Extraction scope set to: ${labelMap[scope] || scope}`);
  }
});

// ---------------------------------------------------------------------------
// Button Actions
// ---------------------------------------------------------------------------

btnTestConn?.addEventListener('click', () => {
  log(`Testing connection to ${getServerUrl()}...`);
  checkHealth(false);
});

btnClearLog?.addEventListener('click', () => {
  clearLog();
});

btnSyncAll?.addEventListener('click', async () => {
  log(`Starting full sync (Tokens + Components)...`, 'highlight');
  setBusy(true);
  parent.postMessage({ pluginMessage: { type: 'extract-all', scope: currentScope } }, '*');
});

btnSyncTokens?.addEventListener('click', async () => {
  log(`Starting token extraction...`, 'highlight');
  setBusy(true);
  parent.postMessage({ pluginMessage: { type: 'extract-tokens' } }, '*');
});

btnSyncComponents?.addEventListener('click', async () => {
  log(`Starting component extraction (scope: ${currentScope})...`, 'highlight');
  setBusy(true);
  parent.postMessage({ pluginMessage: { type: 'extract-components', scope: currentScope } }, '*');
});

function setBusy(busy: boolean) {
  if (btnSyncAll) btnSyncAll.disabled = busy;
  if (btnSyncTokens) btnSyncTokens.disabled = busy;
  if (btnSyncComponents) btnSyncComponents.disabled = busy;
}

// ---------------------------------------------------------------------------
// Network POST Handlers
// ---------------------------------------------------------------------------

async function postTokens(data: any) {
  const url = `${getServerUrl()}/api/tokens`;
  const saveRaw = chkSaveRaw?.checked;

  log(`Sending tokens to ${url}...`);

  const payload: any = {
    tokens: data.normalized,
  };
  if (saveRaw) {
    payload.raw = data.raw;
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(errData.message || `HTTP ${res.status}`);
    }

    const resJson = await res.json();
    log(`Tokens successfully updated in tokens/tokens.ts, tokens.css, theme.css`, 'success');
    if (saveRaw) {
      log(`Raw tokens saved to raw/figma/tokens-raw.json`, 'info');
    }
    notifyPlugin('Tokens synced successfully!');
  } catch (err: any) {
    log(`Token sync failed: ${err.message}`, 'error');
    notifyPlugin(`Token sync failed: ${err.message}`, true);
  } finally {
    setBusy(false);
  }
}

async function postComponents(data: any) {
  const url = `${getServerUrl()}/api/components`;
  const saveRaw = chkSaveRaw?.checked;

  log(`Sending ${data.components?.length || 0} component(s) to ${url}...`);

  const payload: any = {
    components: data.components,
  };
  if (saveRaw) {
    payload.raw = data.raw;
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(errData.message || `HTTP ${res.status}`);
    }

    const resJson = await res.json();
    const count = resJson.data?.processedCount || 0;
    const names = resJson.data?.components?.join(', ') || '';
    log(`Merged ${count} component(s) into components.catalog.json: ${names}`, 'success');
    log(`Generated AST fixtures in scripts/fixtures/`, 'info');
    if (saveRaw) {
      log(`Saved raw AST components in raw/figma/components/`, 'info');
    }
    notifyPlugin(`Synced ${count} component(s)!`);
  } catch (err: any) {
    log(`Component sync failed: ${err.message}`, 'error');
    notifyPlugin(`Component sync failed: ${err.message}`, true);
  } finally {
    setBusy(false);
  }
}

async function postSyncAll(data: any) {
  const url = `${getServerUrl()}/api/sync`;
  const saveRaw = chkSaveRaw?.checked;
  const autoGenerate = chkAutoGenerate?.checked;

  const tokenSummary = data.tokensSummary;
  const compCount = data.components?.length || 0;

  log(`Extracted ${compCount} components and design tokens. Preparing sync payload...`);

  const payload: any = {
    tokens: data.tokens,
    components: data.components,
    generate: autoGenerate,
  };

  if (saveRaw) {
    payload.rawTokens = data.rawTokens;
    payload.rawComponents = data.rawComponents;
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(errData.message || `HTTP ${res.status}`);
    }

    const resJson = await res.json();
    log(`All tokens & components synced to local workspace!`, 'success');
    if (saveRaw) {
      log(`Raw payloads written to raw/figma/`, 'info');
    }

    if (autoGenerate) {
      if (resJson.generateSuccess) {
        log(`Auto-generated Mitosis components successfully!`, 'success');
      } else {
        log(`Mitosis generation output:\n${resJson.generateOutput || 'No output'}`, 'warn');
      }
    }

    notifyPlugin('Full sync completed successfully!');
  } catch (err: any) {
    log(`Sync failed: ${err.message}`, 'error');
    notifyPlugin(`Sync failed: ${err.message}`, true);
  } finally {
    setBusy(false);
  }
}

// ---------------------------------------------------------------------------
// Listener for messages from Figma Plugin Code Sandbox
// ---------------------------------------------------------------------------

window.onmessage = async (event: MessageEvent) => {
  const msg = event.data?.pluginMessage;
  if (!msg) return;

  switch (msg.type) {
    case 'tokens-extracted':
      log(`Extracted tokens (${msg.data.summary?.variables || 0} variables, ${msg.data.summary?.styles || 0} styles).`);
      await postTokens(msg.data);
      break;

    case 'components-extracted':
      log(`Found ${msg.data.components?.length || 0} top-level component(s).`);
      if (!msg.data.components || msg.data.components.length === 0) {
        log(`No components found in current scope. Try selecting components or switch scope to 'Current Page' or 'Entire Document'.`, 'warn');
        setBusy(false);
        return;
      }
      await postComponents(msg.data);
      break;

    case 'all-extracted':
      await postSyncAll(msg.data);
      break;

    case 'error':
      log(`Plugin Sandbox Error: ${msg.message}`, 'error');
      setBusy(false);
      break;

    default:
      break;
  }
};

// Initial background health check
checkHealth(true);
