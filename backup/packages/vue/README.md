# @dwlhm/ui-vue

Modern Vue 3 UI components for dwlhm Design System, written with Composition API (`<script setup>`) and TypeScript.

## Installation

```bash
npm install @dwlhm/ui-vue @dwlhm/design-tokens
```

## Usage

```vue
<template>
  <Button variant="primary" size="md" @click="handleClick">
    Simpan
  </Button>
</template>

<script setup lang="ts">
import { Button } from '@dwlhm/ui-vue';

const handleClick = (event: MouseEvent) => {
  console.log('Button clicked', event);
};
</script>
```
