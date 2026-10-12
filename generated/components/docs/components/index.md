# Component Catalog

Overview of all components extracted from the design system.

| Component | Description | Documentation |
| :--- | :--- | :--- |
| **AlertDialog** | Alert dialog asks users to explicitly confirm an important, risky, or difficult-to-reverse action before it is performed.


When to use
Before destructive actions such as deleting an account, data, or access.
When an action is permanent or may affect multiple people.
When users need to understand the consequences before proceeding.


Usage guidelines
Use a clear heading that states the decision the user must make.
Keep the description concise and explain the consequence and affected item.
Use specific action labels; avoid ambiguous labels such as “OK”.
Place the safe or cancel action first and the primary action on the right.
Hide the description only when the heading provides sufficient context. Keep it visible for high-risk actions.
Use a destructive button style when the confirmed action is destructive.


Properties
Show description — Shows or hides the supporting description.
Heading content — Sets the dialog heading.
Description content — Sets the supporting explanation or consequence.
Cancel button — Controls the content and configuration of the safe action.
Continue button — Controls the content and configuration of the primary action. | [View AlertDialog Docs](/components/alert-dialog) |
| **Avatar** | A circular identity component used to represent a person, account, or entity. It supports profile images, initials, and a generic icon fallback across five sizes, with an optional presence indicator.


When to use
Identify a user in navigation, lists, messages, cards, profiles, and collaborative experiences.
Use image when a recognizable profile photo is available.
Use initials when no image is available but a meaningful name is known.
Use icon as the final fallback when neither an image nor initials are available.


Usage guidelines
Use regular as the default size for most product interfaces.
Choose smaller sizes for dense or inline contexts, and larger sizes for profile-focused or high-emphasis layouts.
Keep the image crop centered and use a clear, recognizable subject.
Use no more than two initials. Prefer the first letters of the person’s first and last names.
Show the status indicator only when presence information is current and meaningful.
Pair the avatar with a visible name or accessible label when identity cannot be inferred from surrounding content.
Do not use decorative imagery, logos, or status colors that conflict with the avatar’s identity purpose.


Properties
| Property | Type | Values / default | Usage |
| --- | --- | --- | --- |
| size | Variant | mini, small, regular, large, x-large | Controls visual prominence and layout density. |
| type | Variant | image, initials, icon | Selects the identity source or fallback treatment. |
| showStatus | Boolean | true | Shows or hides the presence indicator. Enable only when live status is relevant. |
| initialsText | Text | AB | Sets the initials shown by the initials variant. Use one or two uppercase characters. | | [View Avatar Docs](/components/avatar) |
| **Badge** | A compact label used to communicate status, category, or supporting metadata without interrupting the main content.


When to useShow a concise status, classification, or attribute.
Help users scan and compare items quickly.
Use alongside primary content, not as a replacement for buttons or alerts.


Usage guidelinesKeep labels short, clear, and sentence case.
Choose the variant by meaning, not decoration.
Use one semantic meaning consistently across the product.
Avoid placing several high-emphasis badges next to each other.
Do not use a Badge for interactive actions.


PropertiesVariant: primary, secondary, destructive, success, warning, info, or outline.
Label: Editable text displayed inside the badge. | [View Badge Docs](/components/badge) |
| **Breadcrumb** | Description
A breadcrumb navigation component that communicates the user's current location within a hierarchical structure and provides a clear path back to higher levels.


When to use
Use on pages that are nested within a clear hierarchy.
Use when users may need to move quickly to a parent level.
Use in content-heavy products, settings, catalogs, or multi-level navigation.
Do not use as a replacement for primary navigation or for flat page structures.


Usage guidelines
Keep labels concise, recognizable, and consistent with page titles.
Arrange items from the highest level to the current page.
Treat the final item as the current location; it should not navigate to itself.
Use the shortest variant that accurately represents the hierarchy.
For long paths, use the deep variant with an ellipsis to collapse intermediate levels.
Keep separators visually consistent and ensure interactive items have clear hover and focus states.


Properties
Type — Controls the hierarchy depth: 1, 2, or deep.
Show Ellipsis — Shows or hides the collapsed-path indicator. Use primarily with Type=deep when intermediate levels are omitted. | [View Breadcrumb Docs](/components/breadcrumb) |
| **BubbleChat** | Bubble Chat displays a message inside a conversation thread. It supports incoming and outgoing messages with text, file, image, or video content, including delivery-error states.

WHEN TO USE
• Use in chat, support, inbox, messaging, and collaboration experiences.
• Use Incoming for messages received from another participant.
• Use Outgoing for messages created by the current user.
• Use attachment types only when the message contains the corresponding media.
• Use Error only when sending or uploading has failed.

USAGE GUIDELINES
• Keep message copy concise and conversational.
• Choose the Type that matches the primary content.
• Keep timestamps consistent within a conversation.
• Show delivery status only when it provides useful feedback.
• Use Custom text for optional supporting information, not the primary message.
• Error messages should explain the failure and, when possible, support a retry action nearby.

PROPERTIES
• Direction: Incoming | Outgoing
• Type: Text | File | Image | Video
• State: Default | Error
• Show time: Shows or hides the timestamp.
• Show status: Shows or hides delivery status in Default state.
• Show custom text: Shows or hides supplementary copy.
• Editable text properties: Custom text, Text message, File name, File metadata, Image name, Image metadata, Video name, Video metadata, Incoming status text, Outgoing status text, Error status text, Incoming time text, Outgoing time text. | [View BubbleChat Docs](/components/bubble-chat) |
| **Button** | A versatile interactive component for user actions and link-styled navigation. It supports multiple emphasis levels, sizes, corner treatments, interaction states, optional leading and trailing icons, and an editable label.

WHEN TO USE
• Use for actions such as submitting a form, confirming a decision, starting a workflow, or performing an operation.
• Use one clear Primary button for the preferred action at each decision point.
• Use Secondary, Outline, or Ghost for supporting actions.
• Use Destructive for dangerous or irreversible actions.
• Use Style=Link for navigation to another destination and implement it semantically as a hyperlink.

USAGE GUIDELINES
• Use a clear, concise, action-oriented label that ideally begins with a verb.
• Match visual emphasis to the importance of the action.
• Keep icon usage purposeful: leading icons can reinforce meaning, while trailing icons can indicate direction or continuation.
• Keep the label visible unless the icon is universally understood and has an accessible name.
• Use Disabled sparingly and explain why an action is unavailable when needed.
• Do not use Hover, Focus, or Pressed as resting states; they communicate interaction feedback or progress.
• Keep button hierarchy and sizing consistent within the same action group.

PROPERTIES
• Style — Primary, Secondary, Outline, Ghost, Destructive, or Link. Controls visual emphasis and semantic intent.
• Size — Large, Regular, Small, or Mini. Controls dimensions and density.
• Roundness — Default or Round. Controls corner treatment.
• State — Default, Hover, Focus, Pressed, or Disabled. Represents interaction and availability.
• Label — Changes the button text.
• Show Label — Shows or hides the text label.
• Show left icon / Show right icon — Toggles the leading or trailing icon.
• Left icon / Right icon — Swaps the icon shown in the corresponding position. | [View Button Docs](/components/button) |
| **Chart** | Chart is a flexible data-visualization component with 12 variants for comparing values, revealing trends, showing composition, and communicating progress.

WHEN TO USE
Use charts when a visual pattern, relationship, distribution, or change is easier to understand than a table of raw values. Choose the Type variant that best matches the analytical question and data structure.

USAGE GUIDELINES
• Use a clear, outcome-focused title and a short description that explains scope, timeframe, or unit.
• Choose the simplest chart type that communicates the insight accurately.
• Keep category count, series count, labels, and legends concise.
• Use consistent colors for the same metric across related views.
• Enable grid lines and data labels only when they improve interpretation.
• Do not use charts for a single value when a KPI or statistic component is clearer.
• Provide an accessible text summary or data table when the chart contains critical information.

PROPERTIES
• Type: Bar, Line, Area, Donut, Pie, Stacked Bar, Horizontal Bar, Scatter, Radar, Gauge, Funnel, or Waterfall.
• Show Title: Shows or hides the chart title.
• Show Description: Shows or hides supporting context beneath the title.
• Show Legend: Shows or hides the series or category legend.
• Show Grid Lines: Shows or hides chart reference lines.
• Show Data Labels: Shows or hides values attached to data marks.
• Title Text: Overrides the default chart title.
• Description Text: Overrides the default supporting description.
• Content: Accepts optional custom content for the selected chart variant. | [View Chart Docs](/components/chart) |
| **Checkbox** | A checkbox lets users select or clear one or more independent options. It supports selected and unselected states, three sizes, disabled states, and optional labels on either side.


When to use
Use for optional, independent choices where more than one option may be selected.
Use for confirmations, consent, preferences, and multi-select lists.
Use when the result is applied after a user action such as Save or Submit.
Do not use for mutually exclusive choices; use radio buttons instead.
Do not use for an action that takes effect immediately; use a switch instead.


Usage guidelines
Pair the checkbox with a short, clear label that describes the choice.
Prefer a right-side label for left-to-right interfaces; use a left-side label only when the layout requires it.
Use only one label position at a time.
Keep related checkboxes vertically aligned and group them under a clear heading when needed.
Avoid preselecting an option unless it is safe, expected, and easy to reverse.
Use the disabled state only when the option is unavailable, and explain why when the reason is not obvious.


Properties
State: off (unselected) or on (selected).
Size: Small, Medium, or Large. Match the surrounding control density and touch-target requirements.
Disabled: false for interactive use or true when the control is unavailable.
leftLabel: Shows or hides the label on the left side.
rightLabel: Shows or hides the label on the right side. | [View Checkbox Docs](/components/checkbox) |
| **DatePicker** | A date-selection component for choosing a single date, a date and time, a date range, a year, or a date expressed in natural language.


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
Hint Text: Shows or hides supporting guidance beneath the field. | [View DatePicker Docs](/components/date-picker) |
| **FAB** | Floating Action Button (FAB)

A Floating Action Button represents the most important action on a screen, such as creating, adding, composing, or starting a new task.


When to use
Use for one high-priority action that should remain easy to access.
Use only when the action is relevant to most of the screen's content.
Do not use for destructive, ambiguous, or low-frequency actions.
Avoid showing more than one prominent FAB on the same screen.


Usage guidelines
Use a clear, action-oriented icon. Add a short label when the icon alone may be unclear.
Keep placement consistent and preserve safe spacing from screen edges and other controls.
Ensure the FAB does not cover essential content, navigation, or system controls.
Use the Primary variant for the highest emphasis, Secondary for reduced emphasis, and Outline on visually dense or contrasting surfaces.
Provide an accessible name and maintain a logical focus order.
Use interaction states as specified; do not use Disabled when the action can remain available with validation or guidance.


Properties
Variant: Primary, Secondary, Outline
Size: Small (40×40), Regular (56×56), Large (96×96), Extended (120×56)
State: Default, Hover, Focus, Disabled
Label: Editable text shown only in the Extended size | [View FAB Docs](/components/fab) |
| **IconPlaceholder** | Placeholder icon used as the default content for an instance-swap icon property.

When to use
Use this component while configuring or previewing an icon slot before replacing it with the intended icon. It is not intended to appear in production UI.

Usage guidelines
• Replace it with an icon that matches the action or content.
• Keep the icon size and alignment defined by the parent component.
• Avoid using the placeholder as a meaningful visual indicator.

Properties
This component has no exposed properties. | [View IconPlaceholder Docs](/components/icon-placeholder) |
| **InputDropdown** | A selection input that lets users choose one option from a predefined list while keeping the form compact.

WHEN TO USE
• Use when available values are known in advance.
• Use when displaying all choices at once would take too much space.
• Use radio buttons for a small set of choices that should remain visible.

USAGE GUIDELINES
• Use a clear label and a meaningful placeholder such as “Choose department.”
• Order options logically and keep labels concise.
• Enable search for long or difficult-to-scan lists.
• Show the selected option in the Filled state.
• Provide specific error guidance and never rely on color alone.

PROPERTIES
• State — Default, Focus, Filled, Error, or Disabled.
• Label text — Field label.
• Placeholder text — Prompt shown before selection.
• Hint/Error text — Supporting guidance or validation message.
• Show required — Toggles the required indicator.
• Icon — Selects the icon used in the icon slot.
• Show hint — Toggles supporting or error text.
• Show left icon / Show right icon — Toggles leading and trailing icons.
• List Value — Slot for dropdown options.
• Show Search Input — Toggles search within the option list. | [View InputDropdown Docs](/components/input-dropdown) |
| **InputFileDropZone** | A large upload target for adding a file by drag and drop or by opening the device file picker.

WHEN TO USE
• Use when file upload is a primary task.
• Use when a large, discoverable target improves completion.
• Keep a browse action available because drag and drop may not be available on every device.

USAGE GUIDELINES
• State accepted formats, maximum size, and file-count limits before upload.
• Provide visible feedback during drag-over and keyboard focus.
• Show the selected file name and upload status.
• Allow replacement or removal before submission.
• Explain upload failures and how to resolve them.

PROPERTIES
• State — Default, Focus, Filled, Error, or Disabled.
• Label text — Field label.
• Hint/Error text — Supporting guidance or validation message.
• Show required — Toggles the required indicator.
• Show hint — Toggles supporting or error text.
• Primary text — Main upload instruction.
• Supporting text — File requirements.
• File name — Selected-file name.
• File metadata — File size, type, or upload status. | [View InputFileDropZone Docs](/components/input-file-drop-zone) |
| **InputFileInput** | A compact file input that lets users browse for and select a single file from their device.

WHEN TO USE
• Use when a form requires one document or attachment.
• Use when upload is secondary to the main task and a compact control is preferred.
• Use a drop zone when uploading is a primary task or benefits from a larger target.

USAGE GUIDELINES
• State accepted formats and maximum size before selection.
• Display the selected file name clearly.
• Allow users to replace or remove the selected file.
• Validate type and size with a specific error message.
• Keep the browse action keyboard accessible.

PROPERTIES
• State — Default, Focus, Filled, Error, or Disabled.
• Label text — Field label.
• Button text — Label for the file-selection action.
• File name — Empty-state or selected-file text.
• Hint/Error text — Format guidance or validation message.
• Show required — Toggles the required indicator.
• Show hint — Toggles supporting or error text. | [View InputFileInput Docs](/components/input-file-input) |
| **InputImageUploader** | An image-specific uploader for selecting or dropping an image and communicating its preview or upload status.

WHEN TO USE
• Use for profile photos, cover images, product media, or other visual assets.
• Use when image-specific constraints such as aspect ratio or dimensions matter.
• Use a general file input for non-image documents.

USAGE GUIDELINES
• State accepted formats, maximum size, and recommended dimensions or aspect ratio.
• Show a preview after a valid image is selected.
• Provide replace and remove actions.
• Use a specific error message for unsupported, oversized, or corrupted images.
• Include meaningful alternative-text handling elsewhere in the flow when the image conveys content.

PROPERTIES
• State — Default, Focus, Filled, Error, or Disabled.
• Label text — Field label.
• Hint/Error text — Supporting guidance or validation message.
• Show required — Toggles the required indicator.
• Show hint — Toggles supporting or error text.
• Primary text — Main upload instruction.
• Supporting text — Image requirements.
• File name — Selected-image name.
• File metadata — Dimensions, size, or upload status. | [View InputImageUploader Docs](/components/input-image-uploader) |
| **InputMultipleFileUpload** | A multi-file upload input for adding and managing several files in one interaction.

WHEN TO USE
• Use when users need to attach a collection of documents or assets.
• Use when each file must remain individually visible and manageable.
• Use a single-file input when only one attachment is accepted.

USAGE GUIDELINES
• State accepted formats, per-file size, total size, and file-count limits.
• Show each file with its name and upload status.
• Allow users to remove, retry, or replace individual files.
• Keep progress and errors associated with the relevant file.
• Preserve successfully uploaded files when another file fails.

PROPERTIES
• State — Default, Focus, Filled, Error, or Disabled.
• File list — Slot containing uploaded-file items.
• Label text — Field label.
• Hint/Error text — Supporting guidance or validation message.
• Show required — Toggles the required indicator.
• Show hint — Toggles supporting or error text.
• Instruction — Main file-selection instruction.
• File count — Current and maximum number of files.
• File 1 name / File 2 name — Example file names.
• File 1 status / File 2 status — Example upload statuses. | [View InputMultipleFileUpload Docs](/components/input-multiple-file-upload) |
| **InputOTP** | A one-time password input for entering short verification or authentication codes.

WHEN TO USE
• Use in sign-in, account recovery, transaction approval, or identity-verification flows.
• Use only for temporary codes sent through a trusted channel.
• Use a standard text input for permanent passwords or recovery keys.

USAGE GUIDELINES
• State where the code was sent without exposing sensitive contact details.
• Allow paste and automatic code retrieval when supported.
• Move focus naturally between cells and support keyboard correction.
• Show expiration and resend guidance near the input.
• Use a clear error message for incomplete, expired, or incorrect codes.

PROPERTIES
• State — Default, Focus, Filled, Error, or Disabled.
• Label text — Field label.
• Hint/Error text — Supporting guidance or validation message.
• Show required — Toggles the required indicator.
• Show hint — Toggles supporting or error text. | [View InputOTP Docs](/components/input-otp) |
| **InputText** | A single-line input for collecting short-form information such as names, titles, email addresses, search terms, or other concise values.

WHEN TO USE
• Use when the expected value fits on one line.
• Use for short, structured, or predictable information.
• Use a text area when users may need to enter multiple lines.

USAGE GUIDELINES
• Use a persistent, descriptive label.
• Match the input type and keyboard to the expected value in implementation.
• Use placeholder text as an example only.
• Provide actionable validation feedback and preserve the entered value.
• Use leading or trailing icons only when they clarify meaning or provide a relevant action.

PROPERTIES
• State — Default, Focus, Filled, Error, or Disabled.
• Label text — Field label.
• Placeholder text — Example shown while empty.
• Hint/Error text — Supporting guidance or validation message.
• Character Count — Current and maximum character count.
• Show required — Toggles the required indicator.
• Icon — Selects the icon used in the icon slot.
• Show Character Count — Toggles the character count.
• Show hint — Toggles supporting or error text.
• Show left icon / Show right icon — Toggles leading and trailing icons. | [View InputText Docs](/components/input-text) |
| **InputTextArea** | A multi-line text input for collecting longer free-form content such as messages, comments, notes, feedback, or descriptions.

WHEN TO USE
• Use when the expected response may span multiple lines.
• Use for open-ended input that benefits from a larger writing area.
• Use a single-line text input for short, predictable values.

USAGE GUIDELINES
• Keep the label visible and specific.
• Use placeholder text only as a short example, never as a replacement for the label.
• Show helper text for useful context and a specific corrective message for errors.
• Use a character count when a limit matters.
• Preserve entered content between states and use Disabled sparingly.

PROPERTIES
• State — Default, Focus, Filled, Error, or Disabled.
• Label text — Field label.
• Placeholder text — Example shown while empty.
• Hint/Error text — Supporting guidance or validation message.
• Character Count — Current and maximum character count.
• Show required — Toggles the required indicator.
• Icon — Selects the icon used in the icon slot.
• Show Character Count — Toggles the character count.
• Show hint — Toggles supporting or error text.
• Show left icon / Show right icon — Toggles leading and trailing icons. | [View InputTextArea Docs](/components/input-text-area) |
| **MainMenu** | A primary navigation item used for top-level destinations in the sidebar. It supports interaction and selection states, optional leading and trailing icons, and an optional status badge.


When to use
Use for primary sections or destinations in the application's main navigation.
Use Active for the current destination and interaction states only while the related interaction occurs.


Usage guidelines
Keep labels short, specific, and action-oriented where appropriate.
Use only one active item within the same navigation level.
Use badges sparingly for meaningful status or newly introduced content.
Show a trailing icon only when it communicates disclosure, navigation, or a relevant action.
Do not use hover as the only indication that an item is interactive.


Properties
State — Default, Hover, Pressed, Active, or Active-Hover.
Label — Sets the menu item text.
Show label — Shows or hides the text label.
Leading icon — Replaces the leading icon instance.
Show leading icon — Shows or hides the leading icon.
Show trailing icon — Shows or hides the trailing icon.
Show badge — Shows or hides the badge.
Badge label — Sets the badge text. | [View MainMenu Docs](/components/main-menu) |
| **MenuItem** | A secondary or expandable navigation item used within a menu hierarchy. It supports optional icons and badges, plus a submenu content slot for nested destinations.


When to use
Use for secondary destinations or parent items that reveal nested navigation.
Use Active when the item is selected or its submenu is expanded.


Usage guidelines
Keep labels concise and clearly related to their parent section.
Use the trailing icon to communicate expansion when submenu content is available.
Keep nesting shallow and preserve a clear visual relationship between parent and submenu items.
Use badges only for meaningful, concise status information.


Properties
State — Default, Hover, or Active.
Label — Sets the menu item text.
Show label — Shows or hides the text label.
Leading icon — Replaces the leading icon instance.
Show leading icon — Shows or hides the leading icon.
Show trailing icon — Shows or hides the trailing icon.
Show badge — Shows or hides the badge.
Badge label — Sets the badge text.
Submenu content — Slot for nested navigation content. | [View MenuItem Docs](/components/menu-item) |
| **MetricCard** | Overview
Metric Card presents a key performance indicator with optional context, status, actions, and compact data visualization. Use it in dashboards, reports, and overview surfaces where users need to scan important values quickly.

When to use
• Highlight one primary KPI or a tightly related group of metrics.
• Summarize performance, progress, comparisons, distributions, targets, or rankings.
• Use a chart component instead when detailed analysis, axes, interaction, or a longer time range is required.

Usage guidelines
• Choose the simplest Type that communicates the insight clearly.
• Keep the label concise and format values consistently across a dashboard.
• Use Trend only when a comparison period or baseline is explicit.
• Use Description for timeframe or context; do not repeat the label.
• Use Status sparingly for meaningful state, risk, or health information.
• Keep optional actions secondary to the metric and limit custom slot content to compact, scannable information.
• Keep cards in the same group visually and semantically consistent.

Properties
• Type: Default, Progress, Sparkline, Comparison, Radial, Mini Bar, Target, List, Multi-Metric, or Leaderboard.
• Label Text: Short metric name.
• Value Text: Primary formatted value.
• Show Value: Shows or hides the primary value.
• Show Icon / Icon: Toggles and swaps the supporting icon.
• Show Trend / Trend Text: Toggles and edits the change indicator.
• Show Description / Description Text: Toggles and edits supporting context.
• Show Status / Status Badge: Toggles and swaps a status badge.
• Show Actionable / Actionable: Toggles and customizes the action area.
• Primary Button / Secondary Button: Swaps optional actions where supported.
• Content Slot: Inserts compact custom content where supported.
• List: Supplies list content for the List variant.
• Leaderboard: Supplies ranked content for the Leaderboard variant. | [View MetricCard Docs](/components/metric-card) |
| **Pagination** | Description
Pagination lets users navigate through content or data that is divided across multiple pages. This component includes Previous and Next controls, individual page numbers, and an ellipsis for skipped page ranges.

Variant
Default — Use the standard pagination layout when users need sequential navigation and direct access to nearby pages.

When to use
• Use for long lists, tables, search results, or collections that are split into pages.
• Use when users need to understand their current position and move to a specific page.
• Avoid pagination when all content can be displayed clearly on one page or when continuous loading is more appropriate.

Usage guidelines
• Place pagination directly below the content it controls.
• Clearly distinguish the current page from available pages.
• Disable Previous on the first page and Next on the last page.
• Use an ellipsis to compress long page ranges while keeping the first, last, current, and nearby pages accessible.
• Preserve sorting, filters, and item order when users move between pages.
• Provide accessible labels for navigation controls and indicate the current page to assistive technologies.

Properties
• No configurable component properties are currently exposed.
• The current page numbers and Previous/Next labels are defined by the component’s internal layers. | [View Pagination Docs](/components/pagination) |
| **Progressbar** | A horizontal progress bar that communicates how much of an ongoing process has been completed.


When to use
Use for tasks with measurable progress, such as uploads, downloads, installations, onboarding, or multi-step processing.
Use when progress can be represented as a percentage or a known fraction of completion.
Do not use for activity with an unknown duration; use an indeterminate loading indicator instead.


Usage guidelines
Keep the track width consistent within the same flow.
Update progress from left to right and avoid moving backward unless the underlying process genuinely regresses.
Pair the bar with a percentage or short status label when users need precise progress information.
Do not use color alone to communicate status; provide supporting text when status is important.
Show completion clearly at 100%, then transition to the completed state or next step.


Properties
Progress: Represented by the width of the active indicator relative to the full track.
Track: The full width that represents the total process.
Indicator: The filled portion that represents completed progress.
Component properties: No exposed component properties are currently configured.


Variants
No predefined variants are currently configured for this component. | [View Progressbar Docs](/components/progressbar) |
| **RadioButton** | Description
A radio button lets users select exactly one option from a set of mutually exclusive choices. Radio buttons should always appear in a group of two or more options with clear labels.

When to use
Use when users must choose one option from a visible list.
Use when seeing all available options at once supports comparison.
Use for short, stable option sets.
Use a checkbox when users may select multiple options.
Use a select or dropdown when the list is long or space is limited.

Usage guidelines
Group related radio buttons under a clear question or group label.
Keep option labels concise, specific, and grammatically parallel.
Arrange options vertically when possible for easier scanning.
Use a sensible default only when it is safe and helpful.
Treat the control and its label as one interaction target in implementation.
Never use a single radio button for an independent on/off setting.
Explain why an option is disabled when the reason is not obvious.

Properties
State: off shows an unselected option; on shows the selected option.
Disabled: false allows interaction; true makes the option unavailable.
Size: Small, Medium, or Large. Use one size consistently within a group.
leftLabel: Shows or hides the optional label on the left.
rightLabel: Shows or hides the optional label on the right. Prefer one label position at a time. | [View RadioButton Docs](/components/radio-button) |
| **Sidebar** | A persistent vertical navigation shell that organizes brand, primary navigation, and account-related content. It supports expanded and collapsed layouts so the navigation can adapt to the available workspace.


When to use
Use as the primary navigation container for desktop application layouts.
Use the collapsed variant when horizontal space is limited or users need more room for page content.


Usage guidelines
Place product identity or a logo in Brand content.
Place the primary menu structure in Navigation content.
Place profile, workspace, or account controls in Account content.
Keep navigation order and icon meaning consistent between expanded and collapsed states.
Provide accessible labels or tooltips when labels are hidden.


Properties
Expanded — Controls the layout: True shows the full sidebar; False shows the compact sidebar.
Brand content — Slot for product or workspace identity.
Navigation content — Slot for the main navigation menu.
Account content — Slot for user and account controls. | [View Sidebar Docs](/components/sidebar) |
| **Slider** | A slider allows users to select a single value from a defined range by moving a thumb along a track. The filled bar communicates the current value relative to the available range.


When to use
Use for bounded numeric settings where users benefit from seeing the value in context, such as volume, brightness, price, or intensity.
Use when an approximate or quickly adjustable value is more important than exact text entry.
Avoid using a slider when users must enter a precise value; use a numeric input instead.
Avoid using a slider for very small option sets; use radio buttons or a segmented control instead.


Usage guidelines
Pair the slider with a clear label that describes the setting.
Show the current value when precision or confirmation is important.
Communicate the minimum and maximum values when the range is not obvious.
Use a meaningful step increment and keep it consistent with the displayed value format.
Ensure the control supports keyboard interaction and exposes an accessible name and value in implementation.
Provide visible hover, focus, active, and disabled states when those states are added.


Variant
Default — A single-thumb horizontal slider with a filled value bar. This is the current standalone component; it is not yet part of a component set and has no additional Figma variants.


Properties
Value — The current selected position represented by the filled bar and thumb.
Minimum / Maximum — The lower and upper bounds of the range; defined in implementation.
Step — The increment between selectable values; defined in implementation.
State — Default, hover, focus, active, or disabled; interaction states are not currently exposed as Figma variants.
Label / Value display — Optional supporting content that should be composed outside this component.


Current Figma component properties: None exposed. | [View Slider Docs](/components/slider) |
| **Spinner** | Spinner

An indeterminate loading indicator that communicates an ongoing process when progress cannot be measured. Available in four sizes for different interface densities.

When to use
• Use while content, data, or an action is processing and the completion percentage is unknown.
• Use inside buttons or controls to confirm that an action has started.
• Use in content regions to indicate that information is being fetched or refreshed.
• For measurable or long-running tasks, use a progress indicator with explicit progress instead.

Usage guidelines
• Choose the smallest size that remains clear in its context; Size 24 is the default recommendation.
• Keep the spinner centered within its container and preserve the container dimensions to avoid layout shifts.
• Maintain sufficient contrast against the background.
• When replacing button content, preserve the button width and accessible label.
• Add concise supporting text when the loading context is not obvious or the wait may be prolonged.
• Do not use multiple prominent spinners in the same region.

Properties
• Size: 12, 16, 24, or 32
• Color: inherits the Spinner icon stroke token
• State: indeterminate
• Content: icon only | [View Spinner Docs](/components/spinner) |
| **Stepper** | Description
A progress indicator that communicates a user’s position within a four-step process. It supports horizontal and vertical orientations. Completed steps use a check icon, the current step is highlighted, and upcoming steps remain neutral.

When to use
• Use for linear, multi-step flows where users should understand their current position and remaining steps.
• Use Horizontal when sufficient width is available and the flow is short.
• Use Vertical in narrow layouts, side panels, mobile screens, or when labels need more horizontal room.
• Suitable for onboarding, checkout, setup, application, and form workflows.
• Do not use for non-linear navigation, tabs, or processes with frequent branching.

Usage guidelines
• Keep step labels short, clear, and action-oriented.
• Present steps in the exact order users will complete them.
• Use the Current property to match the active screen or task.
• Mark a step as completed only after its required action succeeds.
• Keep the orientation and total number of steps stable during a flow.
• Pair the Stepper with explicit Back and Continue actions.

Properties
• Type: Selects Horizontal or Vertical orientation.
• Current: Selects the active step (1–4). Earlier steps appear completed and later steps appear upcoming.
• Step 1 label: Sets the first step label. Default: Cart.
• Step 2 label: Sets the second step label. Default: Shipping.
• Step 3 label: Sets the third step label. Default: Payment.
• Step 4 label: Sets the fourth step label. Default: Review. | [View Stepper Docs](/components/stepper) |
| **SwitchButton** | Description
A switch lets users turn one setting on or off. It communicates a binary state and should apply the change immediately.

When to use
Use for settings or preferences with two mutually exclusive states.
Use when turning a feature on or off takes effect immediately.
Use in forms, lists, and settings panels for independent binary controls.
Do not use for mutually exclusive choices in a group; use radio buttons instead.
Do not use when the change requires a separate Submit or Confirm action; use a checkbox instead.

Usage guidelines
Pair the switch with a clear label that describes the setting, not the action.
Keep labels positive and consistent so the on state is easy to understand.
Use Medium by default, Small in dense layouts, and Large for prominent or touch-focused contexts.
Preserve clear hover, focus, pressed, and state feedback in implementation.
Use the disabled state only when the setting is temporarily unavailable.
Explain why a switch is disabled when the reason is not obvious.

Properties
State: Off indicates an inactive setting; On indicates an active setting.
Disabled: False allows interaction; True makes the switch unavailable.
Size: Small, Medium, or Large.
leftLabel: Shows or hides the optional label on the left.
rightLabel: Shows or hides the optional label on the right. Prefer one label position at a time. | [View SwitchButton Docs](/components/switch-button) |
| **TabItem** | A single tab item used inside the Tabs component. It supports a text label, an optional leading icon, an optional numeric value, and Default or Active states.

When to use
Use Tab Item to represent one destination, content view, or category within a tab bar. Use it as part of Tabs rather than as a standalone control.

Usage guidelines
• Use short, distinct labels that clearly describe each destination.
• Keep only one tab active within a tab group.
• Show an icon only when it improves recognition; use icons consistently across sibling tabs.
• Use the numeric value for concise counts, such as unread or filtered items.

Properties
• Label — Sets the tab label.
• Show icon — Shows or hides the leading icon.
• Custom icon — Replaces the leading icon.
• Show num — Shows or hides the numeric value.
• Num — Sets the displayed numeric value.
• State — Selects Default or Active. | [View TabItem Docs](/components/tab-item) |
| **Table** | Description
A configurable data-table component with populated and empty states, up to ten columns and ten rows, optional row selection, and optional row numbering.


When to use
Use to present structured records that users need to scan and compare across consistent columns. Use the Empty state when no records are available.


Usage guidelines
Use clear column labels and keep cell content consistent by column.
Show only the columns required for the task.
Enable checkboxes only when bulk selection or row selection is supported.
Enable row numbers only when sequential references are useful.
Use the Empty state for true no-data outcomes and provide a relevant next action when possible.
For complex sorting, filtering, pagination, or responsive behavior, pair this component with the appropriate surrounding controls and patterns.


Properties
State — Switches between Default and Empty.
Show Column 1–10 — Shows or hides table columns.
Show Row 1–10 — Shows or hides data rows.
Show Checkbox — Shows or hides the selection column.
Show No — Shows or hides the row-number column.
Title — Sets the empty-state heading.
Body — Sets the empty-state supporting text.
CTA Label — Sets the empty-state action label.
Show Icon — Shows or hides the empty-state icon.
Show Title — Shows or hides the empty-state heading.
Show Description — Shows or hides the empty-state supporting text.
Show CTA — Shows or hides the empty-state action.
Icon — Swaps the empty-state icon. | [View Table Docs](/components/table) |
| **TableBodyCell** | Description
A reusable body cell container for table rows. It hosts a selectable Table Cell Value component so each column can display the appropriate content type while preserving consistent spacing and alignment.


When to use
Use inside Table Body Row when building data rows with text, badges, actions, status, product, or other supported cell content.


Usage guidelines
Keep one content type per cell.
Choose a cell-value variant that matches the data semantics.
Keep content concise; use truncation or a wider column for long values.
Maintain consistent alignment for cells in the same column.


Properties
Cell Value — Swaps the nested Table Cell Value component used by the cell. | [View TableBodyCell Docs](/components/table-body-cell) |
| **TableBodyRow** | Description
A reusable table body row with up to ten configurable data columns.


When to use
Use for each data record in the default table state.


Usage guidelines
Keep the visible columns synchronized with Table Header Row.
Use the same cell-value type and alignment throughout each column.
Preserve a consistent row height across a table.
Place row-level actions in the designated actions column.


Properties
Show Column 1–10 — Shows or hides each data column. Columns 1–5 are visible by default; columns 6–10 are optional. | [View TableBodyRow Docs](/components/table-body-row) |
| **TableCellValue** | Description
A flexible set of content patterns for table cells, including text, media, selection controls, status, links, badges, actions, products, and custom slot content.


When to use
Use within Table Body Cell to represent the semantic type of data or control required by a column.


Usage guidelines
Select the Type variant based on meaning, not visual preference.
Keep repeated cells in a column consistent.
Use interactive variants only when the table supports that action.
Keep labels brief and provide accessible names for icon-only actions.
Use Slot only when none of the standard variants fit.


Properties
Type — Selects the cell-value pattern.
Value — Sets the primary displayed text where supported.
Show Affiliate, Show Komlabs, Show Raja Ongkir, Show Komads, Show Komcards, Show Komchat, Show Komclass, Show Kompack, Show Komplace, Show Komship, Show Komtim, Show Komed, Show Komstore, Show Komerce — Controls product marks in the Product variant.
Show Edit, Show Delete, Show More — Controls visible actions in Action (Icon).
Slot — Replaces the custom content in the Slot variant. | [View TableCellValue Docs](/components/table-cell-value) |
| **TableCheckboxBodyCell** | Description
A compact body cell containing a row-selection checkbox.


When to use
Use when users can select individual rows for bulk actions or comparison.


Usage guidelines
Place it consistently at the leading edge of each selectable row.
Keep selection state synchronized with the header checkbox.
Do not use it for an editable boolean data field.


Properties
Checkbox state — Configure the nested checkbox instance. | [View TableCheckboxBodyCell Docs](/components/table-checkbox-body-cell) |
| **TableCheckboxHeaderCell** | Description
A compact header cell containing the table's selection checkbox.


When to use
Use when the table supports selecting all visible or eligible rows.


Usage guidelines
Pair with Table Checkbox Body Cell in selectable rows.
Use an indeterminate state when only some eligible rows are selected.
Disable or omit it when bulk selection is unavailable.


Properties
Checkbox state — Configure the nested checkbox instance. | [View TableCheckboxHeaderCell Docs](/components/table-checkbox-header-cell) |
| **TableHeaderRow** | Description
A reusable table header row with up to ten configurable columns.


When to use
Use at the top of a data table to label and align its columns. Omit it only when the surrounding context makes every column unambiguous.


Usage guidelines
Match visible header columns to the visible columns in every body row.
Use short, descriptive labels.
Keep column order and widths consistent with the body rows.
Avoid wrapping header labels when a shorter label is available.


Properties
Show Column 1–10 — Shows or hides each header column. Columns 1–5 are visible by default; columns 6–10 are optional. | [View TableHeaderRow Docs](/components/table-header-row) |
| **TableNoBodyCell** | Description
A compact body cell that displays a row number.


When to use
Use when rows need a visible sequential reference independent of the record's data.


Usage guidelines
Keep numbering sequential after sorting, filtering, or pagination according to product requirements.
Align values consistently in the number column.
Use with Table No Header Cell.


Properties
No — Sets the displayed row number. | [View TableNoBodyCell Docs](/components/table-no-body-cell) |
| **TableNoHeaderCell** | Description
A compact header cell for the row-number column.


When to use
Use above Table No Body Cell when the table displays numbered rows.


Usage guidelines
Keep the column narrow and aligned with row numbers.
Use consistently with the table's Show No option.


Properties
No exposed properties. | [View TableNoHeaderCell Docs](/components/table-no-header-cell) |
| **TablerTruckDelivery** | Tabler Icons — truck-delivery | [View TablerTruckDelivery Docs](/components/tabler-truck-delivery) |
| **Tabs** | A horizontal tab bar composed of Tab Item instances. It provides up to eight tabs for switching between related content views or categories.

When to use
Use Tabs when users need to move between peer views within the same context without leaving the page. Do not use it for sequential steps or primary site navigation.

Usage guidelines
• Use two to eight tabs with concise, parallel labels.
• Keep one tab active and ensure its content is visible.
• Order tabs by importance, frequency, or a natural sequence.
• Hide unused tabs instead of leaving empty labels.
• Avoid overcrowding; use another navigation pattern if labels no longer fit clearly.

Properties
• Tab 3–Tab 8 — Show or hide the corresponding optional tab.
• Tab 1 and Tab 2 are always visible.
• Configure each nested Tab Item instance to set its label, icon, numeric value, and state. | [View Tabs Docs](/components/tabs) |
| **Toast** | A brief, non-intrusive notification that communicates the status of an action or process without interrupting the user’s workflow.

WHEN TO USE
• Confirm that an action completed successfully.
• Report an error or warn about a condition that may require attention.
• Provide short, time-sensitive system information.
• Use for feedback that does not require an immediate decision. For blocking or complex messages, use an alert or dialog instead.

USAGE GUIDELINES
• Keep the title concise and action-oriented; add a description only when extra context is necessary.
• Choose the Type that matches the message intent, not its visual prominence.
• Use one optional action for a clear, reversible, or follow-up task.
• Show the close button when users may need to dismiss a persistent toast.
• Show the timestamp only when message recency is useful.
• Avoid stacking many toasts, duplicating inline validation, or using toasts for critical information that must remain visible.

PROPERTIES
• Type — Default, Success, Error, Warning, or Info.
• State — Default, Hover, or Pressed.
• Toast Text — Primary message.
• Description Text — Supporting details.
• Action Text — Label for the optional action.
• Show Description — Shows or hides supporting text.
• Show Action Button — Shows or hides the action.
• Show Close Button — Shows or hides dismiss control.
• clock — Shows or hides the timestamp. | [View Toast Docs](/components/toast) |
| **Toggle** | Toggle lets users switch a single setting between off and on, with the change taking effect immediately.

When to use
• Use for binary preferences or settings with an immediate result.
• Use when users can clearly understand the effect of turning the option on or off.
• Do not use for multiple-choice decisions, required acknowledgements, or actions that need confirmation.

Usage guidelines
• Pair the toggle with a clear, concise label that describes the enabled state.
• Keep the current state visually clear and avoid relying on color alone.
• Use one size consistently within the same interface area.
• Use supporting text when the outcome may not be obvious.
• Keep disabled controls visible only when their context is useful, and explain why they are unavailable when needed.

Properties
• State — Default: off; Active: on; Disabled: unavailable for interaction.
• Size — Small: compact layouts; Medium: standard interfaces; Large: prominent or touch-focused layouts.
• Show Text — Shows or hides the accompanying text label. | [View Toggle Docs](/components/toggle) |
| **ToggleGroup** | Description
A toggle group organizes several related switch controls into one scannable settings section. Each switch remains independent, while the shared layout and optional group label communicate their relationship.

When to use
Use when two to five related settings should be presented together.
Use when each option can be enabled or disabled independently.
Use in settings pages, preference panels, filters, or configuration forms.
Do not use when users must choose only one option; use a radio group or segmented control instead.

Usage guidelines
Give the group a concise label when the relationship between options is not self-evident.
Write each toggle label as a clear setting name with an unambiguous on state.
Show only the number of toggle rows needed; hide unused rows.
Keep the size consistent with surrounding controls and interface density.
Order options logically, placing the most common or important settings first.
Explain unavailable options near the affected toggle rather than at the group level.

Properties
Size: Small, Medium, or Large. Use Medium for most standard layouts.
Show Label: Shows or hides the group label.
Show Toggle 1: Shows or hides the first toggle row.
Show Toggle 2: Shows or hides the second toggle row.
Show Toggle 3: Shows or hides the third toggle row.
Show Toggle 4: Shows or hides the fourth toggle row.
Show Toggle 5: Shows or hides the fifth toggle row. | [View ToggleGroup Docs](/components/toggle-group) |
| **Tooltip** | Tooltip provides brief contextual information about a UI element without interrupting the user’s workflow.

WHEN TO USE
• Explain unfamiliar icons, controls, or abbreviated labels.
• Add helpful context that is useful but not essential to completing a task.
• Reveal supporting information on hover, keyboard focus, or a short press.
• Do not use for critical instructions, validation errors, or content users must remember.

USAGE GUIDELINES
• Keep the message concise—prefer a short phrase or one sentence.
• Place the tooltip close to its trigger without covering important content.
• Choose the position with the most available space; avoid clipping at viewport edges.
• Keep terminology direct and consistent with the trigger label.
• Avoid interactive controls, links, or long-form content inside a tooltip.
• Ensure the same information is available to keyboard and touch users.

PROPERTIES
• Position: Top, Bottom, Left, or Right. Controls where the tooltip appears relative to its trigger.
• Text content: Overrides the tooltip message for the instance. | [View Tooltip Docs](/components/tooltip) |
| **Topbar** | A horizontal application header that provides a consistent area for page-level or global controls through a flexible content slot.


When to use
Use at the top of authenticated application screens that require persistent global or contextual actions.
Use to host content such as page context, search, notifications, help, or account actions when those controls need consistent placement.


Usage guidelines
Place content in Topbar Content and prioritize the most important actions.
Keep the bar concise; move infrequent actions into menus when space is limited.
Maintain predictable control order across screens.
Avoid duplicating navigation or actions already provided by the sidebar or page header.


Properties
Topbar Content — Slot for contextual or global header content. | [View Topbar Docs](/components/topbar) |
