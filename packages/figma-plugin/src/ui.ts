import type { FigmaDocument, ExtractionRequest, ExtractionResponse, JobResponse, Framework, PublisherType } from '@supernova/contracts';

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
const statusPanel = document.getElementById('statusPanel') as HTMLDivElement;
const statusMessage = document.getElementById('statusMessage') as HTMLSpanElement;
const statusBadge = document.getElementById('statusBadge') as HTMLSpanElement;
const componentList = document.getElementById('componentList') as HTMLDivElement;
const actionArea = document.getElementById('actionArea') as HTMLDivElement;
const errorArea = document.getElementById('errorArea') as HTMLDivElement;

let scannedDocument: FigmaDocument | null = null;
const selectedComponentIds: Set<string> = new Set();
let isScanning = true;
let pollingTimer: number | null = null;

function notifyPlugin(message: string, error: boolean = false) {
  parent.postMessage({ pluginMessage: { type: 'notify', message, error } }, '*');
}

function getSelectedPublishers(): PublisherType[] {
  const checkboxes = document.querySelectorAll('input[name="publisher"]:checked') as NodeListOf<HTMLInputElement>;
  return Array.from(checkboxes).map((cb) => cb.value as PublisherType);
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
    notifyPlugin('Please select at least one component to export.', true);
    return;
  }

  const targets: Framework[] = ['mitosis' as Framework];

  const publishers = getSelectedPublishers();
  if (publishers.length === 0) {
    notifyPlugin('Please select at least one publish output.', true);
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
  statusPanel.style.display = 'block';
  statusMessage.textContent = 'Submitting extraction to backend...';
  statusBadge.textContent = 'submitting';
  statusBadge.className = 'status-badge badge-running';
  componentList.innerHTML = '';
  actionArea.style.display = 'none';
  errorArea.style.display = 'none';

  await submitToBackend({
    document: exportDocument,
    targets,
    publishers,
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
    statusBadge.textContent = 'failed';
    statusBadge.className = 'status-badge badge-failed';
    statusMessage.textContent = 'Extraction failed';
    errorArea.textContent = msg.error;
    errorArea.style.display = 'block';
    return;
  }

  if (msg.type === 'extraction-data') {
    await submitToBackend({
      ...msg,
      targets: msg.targets && msg.targets.length > 0 ? msg.targets : (['mitosis' as Framework]),
    });
  }
};

async function submitToBackend(data: {
  document: FigmaDocument;
  targets: Framework[];
  publishers: PublisherType[];
  backendUrl: string;
  apiToken?: string;
}) {
  const { document, targets, publishers, backendUrl, apiToken } = data;
  statusMessage.textContent = 'Submitting extraction to backend...';

  const payload: ExtractionRequest = {
    document,
    targets,
    publishers,
  };

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (apiToken) {
    headers['Authorization'] = `Bearer ${apiToken}`;
  }

  try {
    const res = await fetch(`${backendUrl}/v1/extractions`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.message || `HTTP ${res.status}: ${res.statusText}`);
    }

    const extractionResp: ExtractionResponse = await res.json();
    statusMessage.textContent = `Job enqueued (${extractionResp.jobId.slice(0, 8)}...)`;
    statusBadge.textContent = 'queued';
    statusBadge.className = 'status-badge badge-running';

    startPolling(backendUrl, extractionResp.jobId, apiToken);
  } catch (err: any) {
    startBtn.disabled = false;
    statusBadge.textContent = 'failed';
    statusBadge.className = 'status-badge badge-failed';
    statusMessage.textContent = 'Failed to submit extraction';
    errorArea.textContent = err.message;
    errorArea.style.display = 'block';
    notifyPlugin(`Backend error: ${err.message}`, true);
  }
}

function startPolling(backendUrl: string, jobId: string, apiToken?: string) {
  if (pollingTimer) {
    clearInterval(pollingTimer);
  }

  pollingTimer = window.setInterval(async () => {
    try {
      const headers: Record<string, string> = {};
      if (apiToken) {
        headers['Authorization'] = `Bearer ${apiToken}`;
      }

      const res = await fetch(`${backendUrl}/v1/jobs/${jobId}`, { headers });
      if (!res.ok) {
        throw new Error(`Polling failed: HTTP ${res.status}`);
      }

      const job: JobResponse = await res.json();
      updateJobProgress(backendUrl, job);

      if (job.status === 'succeeded' || job.status === 'failed') {
        if (pollingTimer) clearInterval(pollingTimer);
        startBtn.disabled = false;
      }
    } catch (err: any) {
      if (pollingTimer) clearInterval(pollingTimer);
      startBtn.disabled = false;
      statusBadge.textContent = 'error';
      statusBadge.className = 'status-badge badge-failed';
      errorArea.textContent = err.message;
      errorArea.style.display = 'block';
    }
  }, 1000);
}

function updateJobProgress(backendUrl: string, job: JobResponse) {
  statusBadge.textContent = job.status;
  if (job.status === 'succeeded') {
    statusBadge.className = 'status-badge badge-succeeded';
    statusMessage.textContent = 'Compilation complete!';
  } else if (job.status === 'failed') {
    statusBadge.className = 'status-badge badge-failed';
    statusMessage.textContent = 'Generation failed';
  } else {
    statusBadge.className = 'status-badge badge-running';
    statusMessage.textContent = `Processing: ${job.status}...`;
  }

  // Render components progress list
  componentList.innerHTML = '';
  for (const comp of job.components || []) {
    const row = document.createElement('div');
    row.className = 'component-row';

    const nameSpan = document.createElement('span');
    nameSpan.textContent = comp.name;

    const compBadge = document.createElement('span');
    compBadge.className = `status-badge ${comp.status === 'done' ? 'badge-succeeded' : comp.status === 'failed' ? 'badge-failed' : 'badge-running'}`;
    compBadge.textContent = comp.status;

    row.appendChild(nameSpan);
    row.appendChild(compBadge);
    componentList.appendChild(row);
  }

  // Handle completion actions
  if (job.status === 'succeeded') {
    actionArea.innerHTML = '';
    actionArea.style.display = 'flex';

    if (job.publishResults?.downloadUrl) {
      const downloadBtn = document.createElement('a');
      downloadBtn.className = 'link-btn';
      downloadBtn.href = `${backendUrl}${job.publishResults.downloadUrl}`;
      downloadBtn.target = '_blank';
      downloadBtn.textContent = 'Download Multi-Framework ZIP';
      actionArea.appendChild(downloadBtn);
    }

    if (job.publishResults?.pullRequestUrl) {
      const prLink = document.createElement('a');
      prLink.className = 'link-btn';
      prLink.href = job.publishResults.pullRequestUrl;
      prLink.target = '_blank';
      prLink.textContent = 'View Created Pull Request';
      actionArea.appendChild(prLink);
    }
  }

  if (job.status === 'failed' && job.error) {
    errorArea.textContent = `[${job.error.stage}] ${job.error.message}`;
    errorArea.style.display = 'block';
  }
}
