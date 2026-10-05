# Input

Form input component supporting text values, validation error states, helper text, labels, and required flags.

---

## Interactive Preview

<ComponentSandbox name="Input" />

---

## Code Examples

::: code-group

```tsx [React]
import { Input } from '@dwlhm/ui-react'
import { useState } from 'react'

export default function Demo() {
  const [val, setVal] = useState('')

  return (
    <Input
      label="Work Email"
      placeholder="colleague@company.com"
      required
      helperText="We will send your verification link here."
      value={val}
      onChange={(e) => setVal(e.target.value)}
    />
  )
}
```

```svelte [Svelte]
<script>
  import Input from '@dwlhm/ui-svelte/Input.svelte'
  let val = ''
</script>

<Input
  label="Work Email"
  placeholder="colleague@company.com"
  required={true}
  helperText="We will send your verification link here."
  value={val}
  on:change={(e) => val = e.target.value}
/>
```

```vue [Vue 3]
<template>
  <Input />
</template>

<script setup lang="ts">
import { Input } from '@dwlhm/ui-vue'
</script>
```

```vue [Vue 2]
<template>
  <Input />
</template>

<script>
import { Input } from '@dwlhm/ui-vue2'

export default {
  components: { Input }
}
</script>
```

:::

---

## Props Reference

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `name` | `string` | `-` | HTML input name attribute |
| `disabled` | `boolean` | `false` | Disables input interaction |
| `required` | `boolean` | `false` | Shows required asterisk and marks input required |
| `label` | `string` | `-` | Field label above the input |
| `error` | `string` | `-` | Error message text that triggers red border state |
| `helperText` | `string` | `-` | Subtle guidance text displayed below input |
| `onChange` | `(event: any) => void` | `-` | Callback fired on text input change |
| `onFocus` | `(event: any) => void` | `-` | Callback fired when input gains focus |
| `onBlur` | `(event: any) => void` | `-` | Callback fired when input loses focus |
| `value` | `string` | `-` | Controlled input string value |
| `placeholder` | `string` | `-` | Placeholder text when input is empty |
| `type` | `string` | `'text'` | HTML input type attribute |


---

## Framework Integration

### React

```tsx
import { Input } from '@dwlhm/ui-react'
```

### Svelte

```svelte
<script>
  import Input from '@dwlhm/ui-svelte/Input.svelte'
</script>
```

### Vue 3

```vue
<script setup lang="ts">
import { Input } from '@dwlhm/ui-vue'
</script>
```

### Vue 2 (Webpack 4 Compatible)

```vue
<script>
import { Input } from '@dwlhm/ui-vue2'

export default {
  components: {
    Input
  }
}
</script>
```
