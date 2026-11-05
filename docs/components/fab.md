# FAB

Floating Action Button (FAB)

A Floating Action Button represents the most important action on a screen, such as creating, adding, composing, or starting a new task.

## When to Use

- Use for one high-priority action that should remain easy to access.
- Use only when the action is relevant to most of the screen's content.
- Do not use for destructive, ambiguous, or low-frequency actions.
- Avoid showing more than one prominent FAB on the same screen.

## Usage Guidelines

- Use a clear, action-oriented icon. Add a short label when the icon alone may be unclear.
- Keep placement consistent and preserve safe spacing from screen edges and other controls.
- Ensure the FAB does not cover essential content, navigation, or system controls.
- Use the Primary variant for the highest emphasis, Secondary for reduced emphasis, and Outline on visually dense or contrasting surfaces.
- Provide an accessible name and maintain a logical focus order.
- Use interaction states as specified; do not use Disabled when the action can remain available with validation or guidance.

## Live Preview & Usage

<ComponentPreview name="FAB" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `label` | `text` | `Label` | - |
| `variant` | `'Primary' | 'Secondary' | 'Outline'` | `Primary` | Primary, Secondary, Outline |
| `size` | `'Small' | 'Regular' | 'Large' | 'Extended'` | `Small` | Small, Regular, Large, Extended |
