<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(defineProps<{
  name: string
  defaultVariant?: string
  defaultSize?: string
}>(), {
  defaultVariant: 'primary',
  defaultSize: 'md'
})

// Button state
const buttonVariant = ref(props.defaultVariant || 'primary')
const buttonSize = ref(props.defaultSize || 'md')
const buttonDisabled = ref(false)
const buttonClicks = ref(0)

// Badge state
const badgeVariant = ref(props.defaultVariant || 'primary')
const badgeSize = ref(props.defaultSize || 'md')
const badgeRounded = ref(false)

// Card state
const cardTitle = ref('Card Title')
const cardSubtitle = ref('Card descriptive subtitle')
const cardPadding = ref('md')
const cardShadow = ref('md')
const cardBordered = ref(true)

// Input state
const inputLabel = ref('Email Address')
const inputPlaceholder = ref('user@example.com')
const inputValue = ref('')
const inputDisabled = ref(false)
const inputRequired = ref(true)
const inputError = ref('')
const inputHelperText = ref('We will never share your email.')

// Typography state
const typoVariant = ref('h3')
const typoWeight = ref('semibold')
const typoAlign = ref('left')
const typoText = ref('The quick brown fox jumps over the lazy dog')

// Compute active badges
const activeBadges = computed(() => {
  switch (props.name.toLowerCase()) {
    case 'button':
      return [
        `variant: "${buttonVariant.value}"`,
        `size: "${buttonSize.value}"`,
        buttonDisabled.value ? 'disabled: true' : null
      ].filter(Boolean)
    case 'badge':
      return [
        `variant: "${badgeVariant.value}"`,
        `size: "${badgeSize.value}"`,
        badgeRounded.value ? 'rounded: true' : null
      ].filter(Boolean)
    case 'card':
      return [
        `padding: "${cardPadding.value}"`,
        `shadow: "${cardShadow.value}"`,
        cardBordered.value ? 'bordered: true' : null
      ].filter(Boolean)
    case 'input':
      return [
        `label: "${inputLabel.value}"`,
        inputRequired.value ? 'required: true' : null,
        inputDisabled.value ? 'disabled: true' : null,
        inputError.value ? 'error: active' : null
      ].filter(Boolean)
    case 'typography':
      return [
        `variant: "${typoVariant.value}"`,
        `weight: "${typoWeight.value}"`,
        `align: "${typoAlign.value}"`
      ].filter(Boolean)
    default:
      return []
  }
})
</script>

<template>
  <div class="sandbox-container">
    <div class="sandbox-header">
      <div class="sandbox-title">{{ props.name }} Sandbox Preview</div>
      <div class="sandbox-badges">
        <span v-for="badge in activeBadges" :key="badge" class="sandbox-badge">
          {{ badge }}
        </span>
      </div>
    </div>

    <div class="sandbox-preview">
      <!-- BUTTON PREVIEW -->
      <div v-if="props.name.toLowerCase() === 'button'" style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
        <button
          type="button"
          :disabled="buttonDisabled"
          :class="[
            'sandbox-btn',
            `sandbox-btn-${buttonVariant}`,
            `sandbox-btn-${buttonSize}`,
            { 'sandbox-btn-disabled': buttonDisabled }
          ]"
          @click="buttonClicks++"
        >
          <span>Interactive Button</span>
          <span v-if="buttonClicks > 0" class="click-badge">({{ buttonClicks }})</span>
        </button>
      </div>

      <!-- BADGE PREVIEW -->
      <div v-else-if="props.name.toLowerCase() === 'badge'">
        <span
          :class="[
            'sandbox-badge-demo',
            `sandbox-badge-${badgeVariant}`,
            `sandbox-badge-size-${badgeSize}`,
            { 'is-rounded': badgeRounded }
          ]"
        >
          {{ badgeVariant.toUpperCase() }}
        </span>
      </div>

      <!-- CARD PREVIEW -->
      <div v-else-if="props.name.toLowerCase() === 'card'" style="width: 100%; max-width: 420px;">
        <div
          :class="[
            'sandbox-card-demo',
            `sandbox-card-pad-${cardPadding}`,
            `sandbox-card-shadow-${cardShadow}`,
            { 'has-border': cardBordered }
          ]"
        >
          <h3 v-if="cardTitle" class="card-demo-title">{{ cardTitle }}</h3>
          <p v-if="cardSubtitle" class="card-demo-subtitle">{{ cardSubtitle }}</p>
          <div class="card-demo-body">
            This card is constructed with design tokens from Supernova and compiled into native components.
          </div>
        </div>
      </div>

      <!-- INPUT PREVIEW -->
      <div v-else-if="props.name.toLowerCase() === 'input'" style="width: 100%; max-width: 360px;">
        <div class="sandbox-input-wrapper">
          <label v-if="inputLabel" class="input-demo-label">
            {{ inputLabel }}
            <span v-if="inputRequired" style="color: #ef4444; margin-left: 2px;">*</span>
          </label>
          <input
            type="text"
            v-model="inputValue"
            :placeholder="inputPlaceholder"
            :disabled="inputDisabled"
            :class="['input-demo-field', { 'is-error': !!inputError }]"
          />
          <span v-if="inputError" class="input-demo-error">{{ inputError }}</span>
          <span v-else-if="inputHelperText" class="input-demo-helper">{{ inputHelperText }}</span>
        </div>
      </div>

      <!-- TYPOGRAPHY PREVIEW -->
      <div v-else-if="props.name.toLowerCase() === 'typography'" style="width: 100%; max-width: 500px;">
        <div
          :class="[
            'sandbox-typo-demo',
            `sandbox-typo-${typoVariant}`,
            `sandbox-typo-align-${typoAlign}`,
            `sandbox-typo-weight-${typoWeight}`
          ]"
        >
          {{ typoText }}
        </div>
      </div>

      <!-- FALLBACK -->
      <div v-else>
        <slot />
      </div>
    </div>

    <!-- CONTROLS BAR -->
    <div class="sandbox-controls">
      <!-- BUTTON CONTROLS -->
      <template v-if="props.name.toLowerCase() === 'button'">
        <div class="control-group">
          <span class="control-label">Variant:</span>
          <select v-model="buttonVariant" class="control-select">
            <option value="primary">primary</option>
            <option value="secondary">secondary</option>
            <option value="outline">outline</option>
            <option value="ghost">ghost</option>
            <option value="danger">danger</option>
          </select>
        </div>
        <div class="control-group">
          <span class="control-label">Size:</span>
          <select v-model="buttonSize" class="control-select">
            <option value="sm">sm</option>
            <option value="md">md</option>
            <option value="lg">lg</option>
          </select>
        </div>
        <div class="control-group">
          <label class="control-label" style="cursor: pointer;">
            <input type="checkbox" v-model="buttonDisabled" class="control-checkbox" />
            Disabled
          </label>
        </div>
      </template>

      <!-- BADGE CONTROLS -->
      <template v-else-if="props.name.toLowerCase() === 'badge'">
        <div class="control-group">
          <span class="control-label">Variant:</span>
          <select v-model="badgeVariant" class="control-select">
            <option value="primary">primary</option>
            <option value="secondary">secondary</option>
            <option value="success">success</option>
            <option value="warning">warning</option>
            <option value="danger">danger</option>
            <option value="outline">outline</option>
          </select>
        </div>
        <div class="control-group">
          <span class="control-label">Size:</span>
          <select v-model="badgeSize" class="control-select">
            <option value="sm">sm</option>
            <option value="md">md</option>
          </select>
        </div>
        <div class="control-group">
          <label class="control-label" style="cursor: pointer;">
            <input type="checkbox" v-model="badgeRounded" class="control-checkbox" />
            Pill / Rounded
          </label>
        </div>
      </template>

      <!-- CARD CONTROLS -->
      <template v-else-if="props.name.toLowerCase() === 'card'">
        <div class="control-group">
          <span class="control-label">Padding:</span>
          <select v-model="cardPadding" class="control-select">
            <option value="none">none</option>
            <option value="sm">sm</option>
            <option value="md">md</option>
            <option value="lg">lg</option>
          </select>
        </div>
        <div class="control-group">
          <span class="control-label">Shadow:</span>
          <select v-model="cardShadow" class="control-select">
            <option value="none">none</option>
            <option value="sm">sm</option>
            <option value="md">md</option>
            <option value="lg">lg</option>
          </select>
        </div>
        <div class="control-group">
          <label class="control-label" style="cursor: pointer;">
            <input type="checkbox" v-model="cardBordered" class="control-checkbox" />
            Bordered
          </label>
        </div>
      </template>

      <!-- INPUT CONTROLS -->
      <template v-else-if="props.name.toLowerCase() === 'input'">
        <div class="control-group">
          <span class="control-label">Status:</span>
          <select :value="inputError ? 'error' : 'normal'" @change="inputError = ($event.target as HTMLSelectElement).value === 'error' ? 'Invalid entry' : ''" class="control-select">
            <option value="normal">Normal</option>
            <option value="error">Error</option>
          </select>
        </div>
        <div class="control-group">
          <label class="control-label" style="cursor: pointer;">
            <input type="checkbox" v-model="inputDisabled" class="control-checkbox" />
            Disabled
          </label>
        </div>
        <div class="control-group">
          <label class="control-label" style="cursor: pointer;">
            <input type="checkbox" v-model="inputRequired" class="control-checkbox" />
            Required
          </label>
        </div>
      </template>

      <!-- TYPOGRAPHY CONTROLS -->
      <template v-else-if="props.name.toLowerCase() === 'typography'">
        <div class="control-group">
          <span class="control-label">Variant:</span>
          <select v-model="typoVariant" class="control-select">
            <option value="h1">h1</option>
            <option value="h2">h2</option>
            <option value="h3">h3</option>
            <option value="h4">h4</option>
            <option value="h5">h5</option>
            <option value="h6">h6</option>
            <option value="body">body</option>
            <option value="body-sm">body-sm</option>
            <option value="caption">caption</option>
          </select>
        </div>
        <div class="control-group">
          <span class="control-label">Weight:</span>
          <select v-model="typoWeight" class="control-select">
            <option value="normal">normal</option>
            <option value="medium">medium</option>
            <option value="semibold">semibold</option>
            <option value="bold">bold</option>
          </select>
        </div>
        <div class="control-group">
          <span class="control-label">Align:</span>
          <select v-model="typoAlign" class="control-select">
            <option value="left">left</option>
            <option value="center">center</option>
            <option value="right">right</option>
          </select>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
/* Button preview styles */
.sandbox-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  border-radius: 6px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  outline: none;
  font-family: inherit;
}

.click-badge {
  margin-left: 6px;
  font-size: 11px;
  opacity: 0.8;
}

.sandbox-btn-sm {
  padding: 6px 12px;
  font-size: 12px;
  gap: 6px;
}

.sandbox-btn-md {
  padding: 8px 16px;
  font-size: 14px;
  gap: 8px;
}

.sandbox-btn-lg {
  padding: 12px 24px;
  font-size: 16px;
  gap: 10px;
}

.sandbox-btn-primary {
  background-color: #2563eb;
  color: #ffffff;
}
.sandbox-btn-primary:hover:not(:disabled) {
  background-color: #1d4ed8;
}

.sandbox-btn-secondary {
  background-color: #f1f5f9;
  color: #0f172a;
  border-color: #cbd5e1;
}
.sandbox-btn-secondary:hover:not(:disabled) {
  background-color: #e2e8f0;
}

.sandbox-btn-outline {
  background-color: transparent;
  border-color: #2563eb;
  color: #2563eb;
}
.sandbox-btn-outline:hover:not(:disabled) {
  background-color: rgba(37, 99, 235, 0.08);
}

.sandbox-btn-ghost {
  background-color: transparent;
  color: #2563eb;
}
.sandbox-btn-ghost:hover:not(:disabled) {
  background-color: rgba(37, 99, 235, 0.08);
}

.sandbox-btn-danger {
  background-color: #dc2626;
  color: #ffffff;
}
.sandbox-btn-danger:hover:not(:disabled) {
  background-color: #b91c1c;
}

.sandbox-btn:disabled, .sandbox-btn-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Badge preview styles */
.sandbox-badge-demo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  border-radius: 4px;
  border: 1px solid transparent;
  line-height: 1;
}
.sandbox-badge-demo.is-rounded {
  border-radius: 9999px;
}

.sandbox-badge-size-sm {
  padding: 2px 6px;
  font-size: 10px;
}
.sandbox-badge-size-md {
  padding: 4px 10px;
  font-size: 12px;
}

.sandbox-badge-primary { background: #dbeafe; color: #1d4ed8; }
.sandbox-badge-secondary { background: #f1f5f9; color: #334155; }
.sandbox-badge-success { background: #dcfce7; color: #15803d; }
.sandbox-badge-warning { background: #fef3c7; color: #b45309; }
.sandbox-badge-danger { background: #fee2e2; color: #b91c1c; }
.sandbox-badge-outline { background: transparent; color: #334155; border-color: #cbd5e1; }

/* Card preview styles */
.sandbox-card-demo {
  background-color: var(--vp-c-bg);
  border-radius: 8px;
  transition: box-shadow 0.2s;
}
.sandbox-card-demo.has-border {
  border: 1px solid var(--vp-c-divider);
}

.sandbox-card-pad-none { padding: 0; }
.sandbox-card-pad-sm { padding: 12px; }
.sandbox-card-pad-md { padding: 18px; }
.sandbox-card-pad-lg { padding: 26px; }

.sandbox-card-shadow-none { box-shadow: none; }
.sandbox-card-shadow-sm { box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
.sandbox-card-shadow-md { box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
.sandbox-card-shadow-lg { box-shadow: 0 10px 24px rgba(0,0,0,0.12); }

.card-demo-title {
  margin: 0 0 4px 0 !important;
  font-size: 17px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}
.card-demo-subtitle {
  margin: 0 0 12px 0 !important;
  font-size: 13px;
  color: var(--vp-c-text-2);
}
.card-demo-body {
  font-size: 13px;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

/* Input preview styles */
.sandbox-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.input-demo-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-text-1);
}
.input-demo-field {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 14px;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.input-demo-field:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
}
.input-demo-field.is-error {
  border-color: #ef4444;
}
.input-demo-field:disabled {
  background-color: var(--vp-c-bg-alt);
  cursor: not-allowed;
  opacity: 0.6;
}
.input-demo-error {
  font-size: 11px;
  color: #ef4444;
}
.input-demo-helper {
  font-size: 11px;
  color: var(--vp-c-text-3);
}

/* Typography preview styles */
.sandbox-typo-demo {
  color: var(--vp-c-text-1);
}
.sandbox-typo-h1 { font-size: 2.25rem; line-height: 2.5rem; }
.sandbox-typo-h2 { font-size: 1.875rem; line-height: 2.25rem; }
.sandbox-typo-h3 { font-size: 1.5rem; line-height: 2rem; }
.sandbox-typo-h4 { font-size: 1.25rem; line-height: 1.75rem; }
.sandbox-typo-h5 { font-size: 1.125rem; line-height: 1.75rem; }
.sandbox-typo-h6 { font-size: 1rem; line-height: 1.5rem; }
.sandbox-typo-body { font-size: 0.875rem; line-height: 1.5rem; }
.sandbox-typo-body-sm { font-size: 0.75rem; line-height: 1.25rem; }
.sandbox-typo-caption { font-size: 0.7rem; line-height: 1rem; color: var(--vp-c-text-3); }

.sandbox-typo-align-left { text-align: left; }
.sandbox-typo-align-center { text-align: center; }
.sandbox-typo-align-right { text-align: right; }

.sandbox-typo-weight-normal { font-weight: 400; }
.sandbox-typo-weight-medium { font-weight: 500; }
.sandbox-typo-weight-semibold { font-weight: 600; }
.sandbox-typo-weight-bold { font-weight: 700; }
</style>
