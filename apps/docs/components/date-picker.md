# DatePicker

A date-selection component for choosing a single date, a date and time, a date range, a year, or a date expressed in natural language.


When to use
Use Date Picker when users need a structured and validated way to enter date-related information. Choose the Type that matches the task and the State that reflects whether the picker surface is visible.


Usage guidelines
Provide a persistent, specific field label; do not rely on placeholder text alone.
Use Date of Birth Picker for birth dates, Picker with Input for typed or calendar-based dates, Date and Time Picker when both values are required, Natural Language Picker for relative expressions, Range Picker for start/end dates, and Year Picker when month and day are unnecessary.
Apply reasonable minimum and maximum dates and clearly communicate unavailable dates.
Preserve the user's locale for date order, month names, time format, and the first day of the week.
Keep the entered value when switching between Closed and Open states.
Ensure keyboard navigation, visible focus, and an accessible label are available in implementation.


Properties
Type: Date of Birth Picker, Picker with Input, Date and Time Picker, Natural Language Picker, Range Picker, or Year Picker.
State: Closed hides the selection surface; Open displays or activates it.
Hint Text: Shows or hides supporting guidance beneath the field.

## Live Preview & Usage

<FrameworkPreview name="DatePicker" />

## Props & Variants

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `Hint Text` | `boolean` | `false` | - |
| `State` | ``Closed` \| `Open`` | `Closed` | - |
| `Type` | ``Date of Birth Picker` \| `Picker with Input` \| `Date and Time Picker` \| `Natural Language Picker` \| `Range Picker` \| `Year Picker`` | `Date of Birth Picker` | - |

## Accessibility (a11y)

- **Keyboard Navigation**: Ensure interactive child elements are reachable and operable via standard keyboard sequences (<kbd>Tab</kbd>, <kbd>Enter</kbd>, <kbd>Space</kbd>).
- **WAI-ARIA Roles & States**: Appropriate ARIA roles and dynamic state attributes (e.g. `aria-expanded`, `aria-selected`, `aria-hidden`) reflect component status.
- **Color Contrast**: All typography and interactive UI boundaries satisfy WCAG 2.1 AA requirements (4.5:1 for normal text, 3:1 for large text and UI components).
