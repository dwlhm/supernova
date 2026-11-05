# InputOTP

A one-time password input for entering short verification or authentication codes.

## When to Use

- Use in sign-in, account recovery, transaction approval, or identity-verification flows.
- Use only for temporary codes sent through a trusted channel.
- Use a standard text input for permanent passwords or recovery keys.

## Usage Guidelines

- State where the code was sent without exposing sensitive contact details.
- Allow paste and automatic code retrieval when supported.
- Move focus naturally between cells and support keyboard correction.
- Show expiration and resend guidance near the input.
- Use a clear error message for incomplete, expired, or incorrect codes.

## Live Preview & Usage

<ComponentPreview name="InputOTP" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `value` | `string` | `''` | - |
| `length` | `number` | `6` | - |
| `id` | `string` | `'input-otp'` | - |
| `name` | `string` | `'otp'` | - |
| `label` | `string` | `'Label'` | - |
| `hint` | `string` | `'Please enter the one-time password sent to your phone.'` | - |
| `errorMessage` | `string` | `''` | - |
| `disabled` | `boolean` | `false` | - |
| `required` | `boolean` | `false` | - |
| `showLabel` | `boolean` | `true` | - |
| `showHint` | `boolean` | `true` | - |
| `className` | `string` | `''` | - |
| `onChange` | `(value: string) => void` | `-` | - |
