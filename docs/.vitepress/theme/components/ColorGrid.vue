<script setup lang="ts">
import { ref } from 'vue'

interface ColorItem {
  name: string
  value: string
  description?: string
}

const props = withDefaults(defineProps<{
  colors?: ColorItem[]
}>(), {
  colors: () => [
    { name: 'primary', value: '#2563eb', description: 'Primary brand action' },
    { name: 'secondary', value: '#64748b', description: 'Secondary slate' },
    { name: 'positive', value: '#16a34a', description: 'Success & positive feedback' },
    { name: 'focus', value: '#3b82f6', description: 'Focus outline ring' },
    { name: 'neutral', value: '#0f172a', description: 'Primary text & neutral high' },
    { name: 'neutralFaded', value: '#64748b', description: 'Secondary text & subtle' },
    { name: 'disabled', value: '#94a3b8', description: 'Disabled element fill' },
    { name: 'page', value: '#ffffff', description: 'Page background light' },
    { name: 'gray-200', value: '#e2e8f0', description: 'Light border & divider' },
    { name: 'gray-500', value: '#64748b', description: 'Subtle slate icon/text' },
    { name: 'blue-600', value: '#2563eb', description: 'Brand blue default' },
    { name: 'green-600', value: '#16a34a', description: 'Success state indicator' }
  ]
})

const copied = ref<string | null>(null)

function copyColor(color: ColorItem) {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(color.value)
    copied.value = color.name
    setTimeout(() => {
      if (copied.value === color.name) {
        copied.value = null
      }
    }, 2000)
  }
}
</script>

<template>
  <div class="color-grid">
    <div
      v-for="c in props.colors"
      :key="c.name"
      class="color-card"
      @click="copyColor(c)"
      :title="'Click to copy ' + c.value"
    >
      <div
        class="color-swatch"
        :style="{ backgroundColor: c.value }"
      >
        <span v-if="copied === c.name" class="copy-badge">Copied!</span>
      </div>
      <div class="color-info">
        <div class="color-name">
          <span>{{ c.name }}</span>
          <span v-if="copied === c.name" style="font-size: 11px; color: var(--vp-c-brand-1);">✓</span>
        </div>
        <div class="color-value">{{ c.value }}</div>
        <div v-if="c.description" style="font-size: 11px; color: var(--vp-c-text-3); margin-top: 4px;">
          {{ c.description }}
        </div>
      </div>
    </div>
  </div>
</template>
