import type { FigmaDocument, SyncRequest, SyncPlanResponse, ApplySyncRequest, ExtractionResponse, JobResponse, JobEvent, Framework } from '@supernova/contracts';

const startBtn = document.getElementById('startBtn') as HTMLButtonElement;
const rescanBtn = document.getElementById('rescanBtn') as HTMLButtonElement;
const scanStatusIndicator = document.getElementById('scanStatusIndicator') as HTMLDivElement;
const scanSpinner = document.getElementById('scanSpinner') as HTMLSpanElement;
const scanStatusText = document.getElementById('scanStatusText') as HTMLSpanElement;
const discoveryContent = document.getElementById('discoveryContent') as HTMLDivElement;
const pillVariables = document.getElementById('pillVariables') as HTMLSpanElement;
const pillColors = document.getElementById('pillColors') as HTMLSpanElement;
const pillTypography = document.getElementById('pillTypography') as HTMLSpanElement;
const pillEffects = document.getElementById('pillEffects') as HTMLSpanElement;
const selectedCountBadge = document.getElementById('selectedCountBadge') as HTMLSpanElement;
const detectedComponentsList = document.getElementById('detectedComponentsList') as HTMLDivElement;

const tabComponentsBtn = document.getElementById('tabComponentsBtn') as HTMLButtonElement;
const tabTokensBtn = document.getElementById('tabTokensBtn') as HTMLButtonElement;
const tabComponentsPanel = document.getElementById('tabComponentsPanel') as HTMLDivElement;
const tabTokensPanel = document.getElementById('tabTokensPanel') as HTMLDivElement;
const detectedTokensList = document.getElementById('detectedTokensList') as HTMLDivElement;

const backendUrlInput = document.getElementById('backendUrl') as HTMLInputElement;
const apiTokenInput = document.getElementById('apiToken') as HTMLInputElement;

const planPanel = document.getElementById('planPanel') as HTMLDivElement;
const planSummary = document.getElementById('planSummary') as HTMLDivElement;
const planComponentList = document.getElementById('planComponentList') as HTMLDivElement;
const applyPlanBtn = document.getElementById('applyPlanBtn') as HTMLButtonElement;

const statusPanel = document.getElementById('statusPanel') as HTMLDivElement;
const statusMessage = document.getElementById('statusMessage') as HTMLSpanElement;
const statusBadge = document.getElementById('statusBadge') as HTMLSpanElement;
const componentList = document.getElementById('componentList') as HTMLDivElement;
const actionArea = document.getElementById('actionArea') as HTMLDivElement;
const errorArea = document.getElementById('errorArea') as HTMLDivElement;

let scannedDocument: FigmaDocument | null = null;
const selectedComponentIds: Set<string> = new Set();
let isScanning = true;
let currentPlan: SyncPlanResponse | null = null;
let currentAbortController: AbortController | null = null;

function notifyPlugin(message: string, error: boolean = false) {
  parent.postMessage({ pluginMessage: { type: 'notify', message, error } }, '*');
}

function setScanningState(scanning: boolean, message?: string) {
  isScanning = scanning;
  rescanBtn.disabled = scanning;

  if (scanning) {
    scanStatusIndicator.className = 'scan-indicator scanning';
    scanSpinner.style.display = 'inline-block';
    scanStatusText.textContent = message || 'Scanning Figma document...';
    startBtn.disabled = true;
  } else {
    scanStatusIndicator.className = 'scan-indicator';
    scanSpinner.style.display = 'none';
    if (message) {
      scanStatusText.textContent = message;
    }
    updateStartButtonState();
  }
}

function updateStartButtonState() {
  if (isScanning) {
    startBtn.disabled = true;
    return;
  }
  startBtn.disabled = !scannedDocument || selectedComponentIds.size === 0;
}

function updateSelectedCountDisplay() {
  const total = scannedDocument?.components.length ?? 0;
  selectedCountBadge.textContent = `${selectedComponentIds.size} of ${total} selected`;
  updateStartButtonState();
}

function switchTab(activeTab: 'components' | 'tokens') {
  if (activeTab === 'components') {
    tabComponentsBtn.classList.add('active');
    tabTokensBtn.classList.remove('active');
    tabComponentsPanel.classList.add('active');
    tabComponentsPanel.style.display = 'block';
    tabTokensPanel.classList.remove('active');
    tabTokensPanel.style.display = 'none';
  } else {
    tabTokensBtn.classList.add('active');
    tabComponentsBtn.classList.remove('active');
    tabTokensPanel.classList.add('active');
    tabTokensPanel.style.display = 'block';
    tabComponentsPanel.classList.remove('active');
    tabComponentsPanel.style.display = 'none';
  }
}

tabComponentsBtn.addEventListener('click', () => switchTab('components'));
tabTokensBtn.addEventListener('click', () => switchTab('tokens'));

function renderDiscoveryPanel(doc: FigmaDocument) {
  scannedDocument = doc;
  selectedComponentIds.clear();

  // 1. Calculate tokens summary counts
  const tokens = doc.tokens || [];
  const components = doc.components || [];

  tabComponentsBtn.textContent = `Components (${components.length})`;
  tabTokensBtn.textContent = `Tokens (${tokens.length})`;

  const effectsCount = tokens.filter((t) => t.name.startsWith('effect/') || t.type === 'effect').length;
  const colorsCount = tokens.filter((t) => t.name.startsWith('color/') || t.type === 'color').length;
  const typographyCount = tokens.filter((t) => t.name.startsWith('typography/') || t.type === 'typography').length;
  const variablesCount = tokens.filter(
    (t) => !t.name.startsWith('color/') && t.type !== 'color' && !t.name.startsWith('typography/') && t.type !== 'typography' && !t.name.startsWith('effect/') && t.type !== 'effect'
  ).length;

  pillVariables.textContent = `${variablesCount} Variables`;
  pillColors.textContent = `${colorsCount} Colors`;
  pillTypography.textContent = `${typographyCount} Typography`;
  pillEffects.textContent = `${effectsCount} Effects`;

  // 2. Render detected components list
  detectedComponentsList.innerHTML = '';

  if (components.length === 0) {
    const emptyMsg = document.createElement('div');
    emptyMsg.className = 'empty-components-msg';
    emptyMsg.textContent = 'No components or component sets found.';
    detectedComponentsList.appendChild(emptyMsg);
  } else {
    for (const comp of components) {
      selectedComponentIds.add(comp.id);

      const row = document.createElement('div');
      row.className = 'component-check-row';

      const left = document.createElement('label');
      left.className = 'component-check-left';
      left.style.cursor = 'pointer';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = true;
      checkbox.dataset.compId = comp.id;

      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          selectedComponentIds.add(comp.id);
        } else {
          selectedComponentIds.delete(comp.id);
        }
        updateSelectedCountDisplay();
      });

      const nameSpan = document.createElement('span');
      nameSpan.className = 'component-name-text';
      nameSpan.textContent = comp.name;

      left.appendChild(checkbox);
      left.appendChild(nameSpan);
      row.appendChild(left);

      // Variant badge if component has variants
      const nodeData = comp.node as Record<string, any> | undefined;
      const variantCount =
        typeof nodeData?.variantCount === 'number'
          ? nodeData.variantCount
          : Array.isArray(nodeData?.variants)
            ? nodeData.variants.length
            : 0;

      if (variantCount > 0) {
        const badge = document.createElement('span');
        badge.className = 'variant-badge';
        badge.textContent = `${variantCount} variants`;
        row.appendChild(badge);
      }

      detectedComponentsList.appendChild(row);
    }
  }

  // 3. Render detected tokens list
  detectedTokensList.innerHTML = '';
  if (tokens.length === 0) {
    const emptyMsg = document.createElement('div');
    emptyMsg.className = 'empty-tokens-msg';
    emptyMsg.textContent = 'No tokens or variables found.';
    detectedTokensList.appendChild(emptyMsg);
  } else {
    for (const token of tokens) {
      const row = document.createElement('div');
      row.className = 'token-row';

      const left = document.createElement('div');
      left.className = 'token-left';

      const nameSpan = document.createElement('span');
      nameSpan.className = 'token-name-text';
      nameSpan.textContent = token.name;
      nameSpan.title = token.name;

      const badge = document.createElement('span');
      badge.className = 'token-badge';
      badge.textContent = token.type || 'token';

      left.appendChild(nameSpan);
      left.appendChild(badge);
      row.appendChild(left);

      const right = document.createElement('div');
      right.className = 'token-right';

      const val = token.value as any;
      const isColor =
        token.type === 'color' ||
        (typeof val === 'string' &&
          (val.startsWith('#') ||
            val.startsWith('rgb(') ||
            val.startsWith('rgba('))) ||
        (val &&
          typeof val === 'object' &&
          typeof val.r === 'number' &&
          typeof val.g === 'number' &&
          typeof val.b === 'number');

      let displayValue = '';

      if (isColor) {
        let colorStr = '';
        if (typeof val === 'string') {
          colorStr = val;
          displayValue = val;
        } else if (val && typeof val === 'object' && typeof val.r === 'number') {
          const r = Math.round(val.r * 255);
          const g = Math.round(val.g * 255);
          const b = Math.round(val.b * 255);
          const a = typeof val.a === 'number' ? Math.round(val.a * 100) / 100 : 1;
          colorStr = a === 1 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${a})`;
          displayValue = colorStr;
        }

        if (colorStr) {
          const swatch = document.createElement('span');
          swatch.className = 'color-swatch';
          swatch.style.backgroundColor = colorStr;
          right.appendChild(swatch);
        }
      } else if (val !== undefined && val !== null) {
        if (typeof val === 'object') {
          if (token.type === 'typography') {
            const font = val.fontFamily || '';
            const size = val.fontSize ? `${val.fontSize}px` : '';
            displayValue = [size, font].filter(Boolean).join(' ') || JSON.stringify(val);
          } else if (token.type === 'effect') {
            displayValue = Array.isArray(val) ? `${val.length} effects` : 'effect';
          } else {
            displayValue = JSON.stringify(val);
          }
        } else {
          displayValue = String(val);
        }
      }

      if (displayValue) {
        const valSpan = document.createElement('span');
        valSpan.className = 'token-value-text';
        valSpan.textContent = displayValue;
        valSpan.title = displayValue;
        right.appendChild(valSpan);
      }

      row.appendChild(right);
      detectedTokensList.appendChild(row);
    }
  }

  discoveryContent.style.display = 'block';
  updateSelectedCountDisplay();
  setScanningState(false, `Scanned ${components.length} component${components.length === 1 ? '' : 's'}, ${tokens.length} tokens`);
}

rescanBtn.addEventListener('click', () => {
  setScanningState(true, 'Rescanning Figma document...');
  parent.postMessage({ pluginMessage: { type: 'rescan' } }, '*');
});

startBtn.addEventListener('click', async () => {
  if (!scannedDocument) {
    notifyPlugin('No document has been scanned yet.', true);
    return;
  }

  if (selectedComponentIds.size === 0) {
    notifyPlugin('Please select at least one component to sync.', true);
    return;
  }

  const backendUrl = backendUrlInput.value.trim().replace(/\/+$/, '');
  const apiToken = apiTokenInput.value.trim();

  // Filter document to only include selected components
  const filteredComponents = scannedDocument.components.filter((c) => selectedComponentIds.has(c.id));
  const exportDocument: FigmaDocument = {
    ...scannedDocument,
    components: filteredComponents,
  };

  startBtn.disabled = true;
  startBtn.textContent = 'Computing Sync Plan...';
  errorArea.style.display = 'none';

  await computeSyncPlan({
    document: exportDocument,
    backendUrl,
    apiToken,
  });
});

applyPlanBtn.addEventListener('click', async () => {
  if (!currentPlan) {
    notifyPlugin('No sync plan computed yet.', true);
    return;
  }

  const backendUrl = backendUrlInput.value.trim().replace(/\/+$/, '');
  const apiToken = apiTokenInput.value.trim();

  applyPlanBtn.disabled = true;
  applyPlanBtn.textContent = 'Submitting PR...';
  statusPanel.style.display = 'block';
  statusMessage.textContent = 'Enqueuing execution job...';
  statusBadge.textContent = 'submitting';
  statusBadge.className = 'status-badge badge-running';
  componentList.innerHTML = '';
  actionArea.style.display = 'none';
  errorArea.style.display = 'none';

  await applySyncPlan({
    syncId: currentPlan.syncId,
    backendUrl,
    apiToken,
  });
});

window.onmessage = async (event) => {
  const msg = event.data.pluginMessage;
  if (!msg) return;

  if (msg.type === 'document-scanned') {
    renderDiscoveryPanel(msg.document);
    return;
  }

  if (msg.type === 'scan-error') {
    setScanningState(false, `Scan failed: ${msg.error}`);
    return;
  }

  if (msg.type === 'extraction-error') {
    startBtn.disabled = false;
    startBtn.textContent = 'Compute Sync Plan';
    statusBadge.textContent = 'failed';
    statusBadge.className = 'status-badge badge-failed';
    statusMessage.textContent = 'Extraction failed';
    errorArea.textContent = msg.error;
    errorArea.style.display = 'block';
    return;
  }

  if (msg.type === 'extraction-data') {
    await computeSyncPlan({
      document: msg.document,
      backendUrl: backendUrlInput.value.trim().replace(/\/+$/, ''),
      apiToken: apiTokenInput.value.trim(),
    });
  }
};

async function computeSyncPlan(data: {
  document: FigmaDocument;
  backendUrl: string;
  apiToken?: string;
}) {
  const { document, backendUrl, apiToken } = data;
  const payload: SyncRequest = {
    document,
    targets: ['mitosis' as Framework],
    publishers: ['pull_request'],
  };

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (apiToken) {
    headers['Authorization'] = `Bearer ${apiToken}`;
  }

  try {
    const res = await fetch(`${backendUrl}/v1/syncs`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.message || `HTTP ${res.status}: ${res.statusText}`);
    }

    const plan: SyncPlanResponse = await res.json();
    currentPlan = plan;
    renderPlanPanel(plan);
    startBtn.disabled = false;
    startBtn.textContent = 'Recompute Sync Plan';
    notifyPlugin(`Sync plan: ${plan.summary.new} new, ${plan.summary.changed} changed, ${plan.summary.unchanged} unchanged`);
  } catch (err: any) {
    startBtn.disabled = false;
    startBtn.textContent = 'Compute Sync Plan';
    errorArea.textContent = err.message;
    errorArea.style.display = 'block';
    notifyPlugin(`Backend error: ${err.message}`, true);
  }
}

function renderPlanPanel(plan: SyncPlanResponse) {
  planPanel.style.display = 'block';
  planSummary.innerHTML = `
    <span class="plan-pill badge-new">+ ${plan.summary.new} New</span>
    <span class="plan-pill badge-changed">~ ${plan.summary.changed} Changed</span>
    <span class="plan-pill badge-unchanged">= ${plan.summary.unchanged} Unchanged</span>
    ${plan.summary.removed > 0 ? `<span class="plan-pill badge-removed">- ${plan.summary.removed} Removed</span>` : ''}
    <span class="plan-pill" style="background: #f3f4f6; color: #374151;">${plan.summary.tokensChanged ? 'Tokens: Changed' : 'Tokens: Unchanged'}</span>
  `;

  planComponentList.innerHTML = '';
  for (const comp of plan.components) {
    const row = document.createElement('div');
    row.className = 'component-row';

    const nameSpan = document.createElement('span');
    nameSpan.textContent = comp.name;

    const badge = document.createElement('span');
    badge.className = `status-badge badge-${comp.status}`;
    badge.textContent = comp.status;

    row.appendChild(nameSpan);
    row.appendChild(badge);
    planComponentList.appendChild(row);
  }

  applyPlanBtn.disabled = false;
  applyPlanBtn.textContent = 'Create / Update PR ↗';
}

async function applySyncPlan(data: {
  syncId: string;
  backendUrl: string;
  apiToken?: string;
}) {
  const { syncId, backendUrl, apiToken } = data;
  const payload: ApplySyncRequest = {
    publishers: ['pull_request'],
    targets: ['mitosis' as Framework],
  };

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (apiToken) {
    headers['Authorization'] = `Bearer ${apiToken}`;
  }

  try {
    const res = await fetch(`${backendUrl}/v1/syncs/${syncId}/apply`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.message || `HTTP ${res.status}: ${res.statusText}`);
    }

    const extResp: ExtractionResponse = await res.json();
    statusMessage.textContent = `Job enqueued (${extResp.jobId.slice(0, 8)}...)`;
    statusBadge.textContent = 'queued';
    statusBadge.className = 'status-badge badge-running';

    startEventStreaming(backendUrl, extResp.jobId, apiToken);
  } catch (err: any) {
    applyPlanBtn.disabled = false;
    applyPlanBtn.textContent = 'Create / Update PR ↗';
    statusBadge.textContent = 'failed';
    statusBadge.className = 'status-badge badge-failed';
    statusMessage.textContent = 'Failed to apply plan';
    errorArea.textContent = err.message;
    errorArea.style.display = 'block';
    notifyPlugin(`Backend error: ${err.message}`, true);
  }
}

async function startEventStreaming(backendUrl: string, jobId: string, apiToken?: string) {
  if (currentAbortController) {
    currentAbortController.abort();
  }
  currentAbortController = new AbortController();

  const headers: Record<string, string> = {
    Accept: 'text/event-stream',
  };
  if (apiToken) {
    headers['Authorization'] = `Bearer ${apiToken}`;
  }

  const tasksMap: Record<string, string> = {};

  try {
    const response = await fetch(`${backendUrl}/v1/jobs/${jobId}/events`, {
      headers,
      signal: currentAbortController.signal,
    });

    if (!response.ok || !response.body) {
      throw new Error(`SSE stream failed: HTTP ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith(':')) continue;
        if (trimmed.startsWith('data: ')) {
          const jsonStr = trimmed.slice(6);
          try {
            const ev: JobEvent = JSON.parse(jsonStr);
            handleJobEvent(backendUrl, jobId, ev, tasksMap, apiToken);
          } catch {
            // ignore non-json SSE lines
          }
        }
      }
    }
  } catch (err: any) {
    if (err.name === 'AbortError') return;
    console.error('SSE connection closed or failed:', err);
    await fetchFinalJobStatus(backendUrl, jobId, apiToken);
  }
}

async function handleJobEvent(
  backendUrl: string,
  jobId: string,
  ev: JobEvent,
  tasksMap: Record<string, string>,
  apiToken?: string
) {
  if (ev.eventType === 'task_status' && ev.task) {
    tasksMap[ev.task.componentName] = ev.task.status;
    renderTasksList(tasksMap);
  } else if (ev.eventType === 'job_status' && ev.status) {
    statusBadge.textContent = ev.status;
    statusBadge.className = 'status-badge badge-running';
    statusMessage.textContent = `Job status: ${ev.status}`;
  } else if (ev.eventType === 'job_completed') {
    statusBadge.textContent = 'succeeded';
    statusBadge.className = 'status-badge badge-succeeded';
    statusMessage.textContent = 'PR Published Successfully!';
    applyPlanBtn.disabled = false;
    applyPlanBtn.textContent = 'Create / Update PR ↗';
    await fetchFinalJobStatus(backendUrl, jobId, apiToken);
  } else if (ev.eventType === 'job_failed') {
    statusBadge.textContent = 'failed';
    statusBadge.className = 'status-badge badge-failed';
    statusMessage.textContent = ev.error || 'Job execution failed';
    applyPlanBtn.disabled = false;
    applyPlanBtn.textContent = 'Create / Update PR ↗';
    if (ev.error) {
      errorArea.textContent = ev.error;
      errorArea.style.display = 'block';
    }
  }
}

function renderTasksList(tasksMap: Record<string, string>) {
  componentList.innerHTML = '';
  for (const [name, status] of Object.entries(tasksMap)) {
    const row = document.createElement('div');
    row.className = 'component-row';

    const nameSpan = document.createElement('span');
    nameSpan.textContent = name;

    const badge = document.createElement('span');
    const isDone = status === 'ready' || status === 'done';
    const isFailed = status === 'failed';
    badge.className = `status-badge ${isDone ? 'badge-succeeded' : isFailed ? 'badge-failed' : 'badge-running'}`;
    badge.textContent = status;

    row.appendChild(nameSpan);
    row.appendChild(badge);
    componentList.appendChild(row);
  }
}

async function fetchFinalJobStatus(backendUrl: string, jobId: string, apiToken?: string) {
  try {
    const headers: Record<string, string> = {};
    if (apiToken) {
      headers['Authorization'] = `Bearer ${apiToken}`;
    }
    const res = await fetch(`${backendUrl}/v1/jobs/${jobId}`, { headers });
    if (!res.ok) return;

    const job: JobResponse = await res.json();
    if (job.status === 'succeeded' && job.publishResults?.pullRequestUrl) {
      actionArea.innerHTML = '';
      actionArea.style.display = 'flex';

      const prLink = document.createElement('a');
      prLink.className = 'link-btn';
      prLink.href = job.publishResults.pullRequestUrl;
      prLink.target = '_blank';
      prLink.style.background = '#18a0fb';
      prLink.style.color = '#ffffff';
      prLink.style.padding = '9px 14px';
      prLink.style.fontWeight = '600';
      prLink.textContent = 'Open Pull Request on GitHub ↗';
      actionArea.appendChild(prLink);

      notifyPlugin(`PR ready: ${job.publishResults.pullRequestUrl}`);
    }
  } catch (e) {
    console.error('Failed to fetch final job status:', e);
  }
}
