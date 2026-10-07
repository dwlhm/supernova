# @dwlhm/ui-vue2

Vue 2 UI components for dwlhm Design System, specifically pre-bundled for compatibility with **Vue 2 (2.6.x / 2.7.x)** and **Webpack 4**.

## Installation

```bash
npm install @dwlhm/ui-vue2 @dwlhm/design-tokens
```

## Webpack 4 Compatibility

Because this package ships pre-bundled JavaScript (`dist/index.cjs` and `dist/index.mjs`) targeting ES2018, you do **not** need special `vue-loader` or `babel-loader` configurations in your Webpack 4 host application.

```vue
<template>
  <div>
    <Button variant="primary" size="md" @click="handleClick">
      Simpan
    </Button>
  </div>
</template>

<script>
import { Button } from '@dwlhm/ui-vue2';

export default {
  components: {
    Button,
  },
  methods: {
    handleClick(event) {
      console.log('Button clicked', event);
    },
  },
};
</script>
```
