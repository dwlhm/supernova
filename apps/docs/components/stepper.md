# Stepper

A progress indicator that communicates a user’s position within a four-step process. It supports horizontal and vertical orientations. Completed steps use a check icon, the current step is highlighted, and upcoming steps remain neutral.

## When to Use

- Use for linear, multi-step flows where users should understand their current position and remaining steps.
- Use Horizontal when sufficient width is available and the flow is short.
- Use Vertical in narrow layouts, side panels, mobile screens, or when labels need more horizontal room.
- Suitable for onboarding, checkout, setup, application, and form workflows.
- Do not use for non-linear navigation, tabs, or processes with frequent branching.

## Usage Guidelines

- Keep step labels short, clear, and action-oriented.
- Present steps in the exact order users will complete them.
- Use the Current property to match the active screen or task.
- Mark a step as completed only after its required action succeeds.
- Keep the orientation and total number of steps stable during a flow.
- Pair the Stepper with explicit Back and Continue actions.

## Live Preview & Usage

<ComponentPreview name="Stepper" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | horizontal, vertical |
| `ariaLabel` | `string` | `'Progress'` | - |
| `className` | `string` | `''` | - |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |

### `StepperItem`

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `step` | `number` | `1` | - |
| `status` | `'completed' \| 'active' \| 'upcoming'` | `'upcoming'` | completed, active, upcoming |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | horizontal, vertical |
| `isLast` | `boolean` | `false` | - |
| `className` | `string` | `''` | - |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |
