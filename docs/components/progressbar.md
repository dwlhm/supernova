# Progressbar

A horizontal progress bar that communicates how much of an ongoing process has been completed.

## When to Use

- Use for tasks with measurable progress, such as uploads, downloads, installations, onboarding, or multi-step processing.
- Use when progress can be represented as a percentage or a known fraction of completion.
- Do not use for activity with an unknown duration; use an indeterminate loading indicator instead.

## Usage Guidelines

- Keep the track width consistent within the same flow.
- Update progress from left to right and avoid moving backward unless the underlying process genuinely regresses.
- Pair the bar with a percentage or short status label when users need precise progress information.
- Do not use color alone to communicate status; provide supporting text when status is important.
- Show completion clearly at 100%, then transition to the completed state or next step.

## Live Preview & Usage

<ComponentPreview name="Progressbar" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `value` | `number` | `0` | - |
| `label` | `string` | `'Progress'` | - |
| `showLabel` | `boolean` | `false` | - |
| `className` | `string` | `''` | - |
