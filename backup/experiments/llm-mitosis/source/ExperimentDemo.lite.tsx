import { Show, useStore } from '@builder.io/mitosis';
import Button from './Button.lite';
import Alert from './Alert.lite';
import Avatar from './Avatar.lite';
import Table from './Table.lite';
import Chart from './Chart.lite';
import Checkbox from './Checkbox.lite';
import TextField from './TextField.lite';

export default function ExperimentDemo() {
  const state = useStore({
    // Button controls
    buttonClicks: 0,
    buttonDisabled: false,
    incrementButton() {
      state.buttonClicks = state.buttonClicks + 1;
    },
    toggleButtonDisabled() {
      state.buttonDisabled = !state.buttonDisabled;
    },

    // Alert controls
    alertColor: 'primary',
    alertActionClicks: 0,
    alertDismissed: false,
    updateAlertColor(color) {
      state.alertColor = color;
    },
    triggerAlertAction() {
      state.alertActionClicks = state.alertActionClicks + 1;
    },
    resetAlert() {
      state.alertDismissed = false;
    },
    dismissAlert() {
      state.alertDismissed = true;
    },

    // Avatar controls
    avatarShape: 'round',
    avatarSize: 'medium',
    toggleAvatarShape() {
      state.avatarShape = state.avatarShape === 'round' ? 'square' : 'round';
    },
    toggleAvatarSize() {
      state.avatarSize = state.avatarSize === 'medium' ? 'small' : 'medium';
    },

    // Form controls (Checkbox & TextField)
    checked: false,
    checkboxEvents: 0,
    text: '',
    error: false,
    handleCheckboxChange(val) {
      state.checked = val;
      state.checkboxEvents = state.checkboxEvents + 1;
    },
    handleLockedClick() {
      state.checkboxEvents = state.checkboxEvents + 100;
    },
    handleTextChange(val) {
      state.text = val;
    },
    toggleValidationError() {
      state.error = !state.error;
    },

    // Table controls
    rowCount: 3,
    reversed: false,
    selected: [] as string[],
    emptyEvents: 0,
    columns: [
      { key: 'name', label: 'Customer' },
      { key: 'status', label: 'Status' },
      { key: 'amount', label: 'Amount' },
    ],
    get rows() {
      return Array.from({ length: state.rowCount }, (_, index) => ({
        id: 'customer-' + index,
        cells: {
          name: 'Customer ' + (index + 1),
          status: index % 2 ? 'Pending' : 'Active',
          amount: (index + 1) * 120,
        },
      })).sort((a, b) =>
        state.reversed ? b.id.localeCompare(a.id) : a.id.localeCompare(b.id)
      );
    },
    updateRowCount(count) {
      state.rowCount = count;
    },
    toggleReversed() {
      state.reversed = !state.reversed;
    },
    updateSelectedRows(ids) {
      state.selected = ids;
    },
    handleEmptyAction() {
      state.emptyEvents = state.emptyEvents + 1;
      state.rowCount = 1;
    },

    // Chart controls
    chartVariant: 'bar',
    chartCase: 'normal',
    updateChartVariant(variant) {
      state.chartVariant = variant;
    },
    updateChartCase(c) {
      state.chartCase = c;
    },
    get points() {
      return state.chartCase === 'empty'
        ? []
        : state.chartCase === 'invalid'
        ? [{ id: 'a', label: 'Invalid', value: NaN }]
        : state.chartCase === 'single'
        ? [{ id: 'a', label: 'One', value: 12 }]
        : state.chartCase === 'zero'
        ? [
            { id: 'a', label: 'One', value: 0 },
            { id: 'b', label: 'Two', value: 0 },
          ]
        : state.chartCase === 'negative'
        ? [
            { id: 'a', label: 'One', value: -20 },
            { id: 'b', label: 'Two', value: 10 },
          ]
        : state.chartCase === 'updated'
        ? [
            { id: 'a', label: 'Monday', value: 75 },
            { id: 'b', label: 'Tuesday', value: 15 },
            { id: 'c', label: 'Wednesday', value: 45 },
          ]
        : [
            { id: 'a', label: 'Monday', value: 20 },
            { id: 'b', label: 'Tuesday', value: 60 },
            { id: 'c', label: 'Wednesday', value: 35 },
          ];
    },
  });

  return (
    <main class="demo max-w-6xl mx-auto p-6 space-y-8 font-sans">
      <header class="hero text-center py-6 border-b border-gray-200">
        <span class="eyebrow inline-block text-xs font-semibold tracking-wider text-blue-600 uppercase mb-2">
          DESIGN SYSTEM / COMPONENT LAB
        </span>
        <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
          From design to interaction.
        </h1>
        <p class="mt-2 text-base text-gray-600 max-w-2xl mx-auto">
          A production-grade workspace showcasing Tailwind-styled Mitosis components across React, Vue 3, Vue 2, and Svelte.
        </p>
      </header>

      <section
        class="panel bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6"
        aria-label="Form controls"
      >
        <div class="section-title flex items-center gap-2 border-b border-gray-100 pb-3">
          <span class="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">01</span>
          <h2 class="text-lg font-bold text-gray-900">Every detail, interactive.</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="space-y-4">
            <h3 class="text-sm font-semibold text-gray-800 uppercase tracking-wider">Button Showcase</h3>
            <div class="flex flex-wrap items-center gap-3">
              <Button
                label={'Clicked ' + state.buttonClicks + ' times'}
                variant="primary"
                disabled={state.buttonDisabled}
                onClick={() => state.incrementButton()}
              />
              <Button
                label={state.buttonDisabled ? 'Enable button' : 'Disable button'}
                variant="secondary"
                styleType="outline"
                onClick={() => state.toggleButtonDisabled()}
              />
            </div>
            <div class="flex flex-wrap items-center gap-2 pt-2">
              <Button label="Primary" variant="primary" styleType="solid" size="small" />
              <Button label="Secondary" variant="secondary" styleType="outline" size="small" />
              <Button label="Positive" variant="positive" styleType="ghost" size="small" />
              <Button label="Gradient" variant="gradient" styleType="solid" size="small" />
            </div>
          </div>

          <div class="space-y-4">
            <h3 class="text-sm font-semibold text-gray-800 uppercase tracking-wider">Avatar Showcase</h3>
            <div class="flex items-center gap-3">
              <button
                type="button"
                class="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 cursor-pointer"
                onClick={() => state.toggleAvatarShape()}
              >
                Shape: {state.avatarShape}
              </button>
              <button
                type="button"
                class="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 cursor-pointer"
                onClick={() => state.toggleAvatarSize()}
              >
                Size: {state.avatarSize}
              </button>
            </div>
            <div class="flex items-center gap-3 pt-1">
              <Avatar
                name="Sarah Connor"
                color="primary"
                shape={state.avatarShape}
                size={state.avatarSize}
              />
              <Avatar
                name="Alex Murphy"
                color="secondary"
                shape={state.avatarShape}
                size={state.avatarSize}
              />
              <Avatar
                name="Ellen Ripley"
                color="positive"
                shape={state.avatarShape}
                size={state.avatarSize}
              />
              <Avatar
                name="Komerce User"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                shape={state.avatarShape}
                size={state.avatarSize}
              />
            </div>
          </div>
        </div>

        <div class="space-y-4 pt-4 border-t border-gray-100">
          <h3 class="text-sm font-semibold text-gray-800 uppercase tracking-wider">Alert Showcase</h3>
          <div class="flex flex-wrap items-center gap-3">
            <label class="text-xs font-medium text-gray-700 flex items-center gap-1.5">
              Color:
              <select
                aria-label="Alert color"
                class="text-xs border border-gray-300 rounded-md px-2 py-1 bg-white"
                value={state.alertColor}
                onChange={(e) => state.updateAlertColor(e.target.value)}
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="positive">Positive</option>
              </select>
            </label>
            <button
              type="button"
              class="px-3 py-1 text-xs font-medium rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 cursor-pointer"
              onClick={() => state.resetAlert()}
            >
              Reset alert
            </button>
            <span class="text-xs text-gray-500">
              Actions clicked: {state.alertActionClicks}
            </span>
          </div>
          <Show when={!state.alertDismissed}>
            <Alert
              color={state.alertColor}
              title="System Notification"
              text="Your changes have been processed and distributed across all node regions."
              showIcon={true}
              showAction={true}
              actionLabel="Review details"
              dismissible={true}
              onAction={() => state.triggerAlertAction()}
              onClose={() => state.dismissAlert()}
            />
          </Show>
        </div>

        <div class="control-grid grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
          <div class="space-y-2">
            <Checkbox
              id="updates"
              name="updates"
              label="Receive product updates"
              checked={state.checked}
              onCheckedChange={(value) => state.handleCheckboxChange(value)}
            />
            <Checkbox
              id="locked"
              label="Managed by your organization"
              checked={false}
              disabled={true}
              onCheckedChange={() => state.handleLockedClick()}
            />
            <output data-testid="checkbox-state" class="block text-xs text-gray-500 pt-1">
              <Show when={state.checked} else={<span>Not subscribed</span>}>
                <span>Subscribed</span>
              </Show>
              {' · ' + state.checkboxEvents + ' changes'}
            </output>
          </div>

          <div class="space-y-2">
            <TextField
              id="project"
              name="project"
              label="Project name"
              value={state.text}
              onValueChange={(value) => state.handleTextChange(value)}
              placeholder="Give your project a name"
              helperText="Visible to your teammates."
              error={state.error ? 'Please choose a different name.' : ''}
              maxLength={40}
              showCount={true}
            />
            <div class="flex items-center justify-between">
              <output data-testid="text-state" class="text-xs text-gray-500">
                {state.text || 'No project name yet'}
              </output>
              <button
                type="button"
                class="subtle text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                onClick={() => state.toggleValidationError()}
              >
                Toggle validation
              </button>
            </div>
          </div>
        </div>
      </section>

      <section
        class="panel bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4"
        aria-label="Table experiment"
      >
        <div class="section-title flex items-center gap-2 border-b border-gray-100 pb-3">
          <span class="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">02</span>
          <h2 class="text-lg font-bold text-gray-900">Your customers, at a glance.</h2>
        </div>

        <div class="toolbar flex flex-wrap items-center gap-4 text-sm text-gray-700">
          <label class="flex items-center gap-2 font-medium">
            Rows
            <select
              aria-label="Row count"
              class="border border-gray-300 rounded-md px-2 py-1 bg-white text-sm"
              value={state.rowCount}
              onChange={(event) => state.updateRowCount(Number(event.target.value))}
            >
              <option value="0">Empty</option>
              <option value="1">One</option>
              <option value="3">Three</option>
              <option value="12">Twelve</option>
            </select>
          </label>
          <button
            type="button"
            class="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 cursor-pointer"
            onClick={() => state.toggleReversed()}
          >
            Reverse rows
          </button>
          <output data-testid="selection-state" class="text-xs text-gray-600 font-mono">
            Selected: {state.selected.join(', ') || 'none'}
          </output>
        </div>

        <Table
          caption="Customer directory"
          columns={state.columns}
          rows={state.rows}
          selectedIds={state.selected}
          onSelectionChange={(ids) => state.updateSelectedRows(ids)}
          selectable={true}
          showRowNumbers={true}
          emptyTitle="No customers yet"
          emptyDescription="Start by adding your first customer."
          emptyActionLabel="Add customer"
          onEmptyAction={() => state.handleEmptyAction()}
        />

        <output data-testid="empty-state" class="block text-xs text-gray-500">
          Customers added: {state.emptyEvents}
        </output>
      </section>

      <section
        class="panel bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4"
        aria-label="Chart experiment"
      >
        <div class="section-title flex items-center gap-2 border-b border-gray-100 pb-3">
          <span class="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">03</span>
          <h2 class="text-lg font-bold text-gray-900">A clearer view of progress.</h2>
        </div>

        <div class="toolbar flex flex-wrap items-center gap-4 text-sm text-gray-700">
          <label class="flex items-center gap-2 font-medium">
            Display
            <select
              aria-label="Chart variant"
              class="border border-gray-300 rounded-md px-2 py-1 bg-white text-sm"
              value={state.chartVariant}
              onChange={(event) => state.updateChartVariant(event.target.value)}
            >
              <option value="bar">Bar</option>
              <option value="line">Line</option>
              <option value="unsupported">Unsupported</option>
            </select>
          </label>
          <label class="flex items-center gap-2 font-medium">
            Dataset
            <select
              aria-label="Chart dataset"
              class="border border-gray-300 rounded-md px-2 py-1 bg-white text-sm"
              value={state.chartCase}
              onChange={(event) => state.updateChartCase(event.target.value)}
            >
              <option value="normal">This week</option>
              <option value="updated">Last week</option>
              <option value="single">Single value</option>
              <option value="zero">Zero values</option>
              <option value="negative">Mixed signs</option>
              <option value="invalid">Invalid value</option>
              <option value="empty">Empty</option>
            </select>
          </label>
        </div>

        <Chart
          title="Weekly activity"
          description="Activity by day"
          seriesLabel="Activity"
          variant={state.chartVariant}
          data={state.points}
          showLegend={true}
          showGridLines={true}
          showDataLabels={true}
        />
      </section>

      <footer class="text-center text-xs text-gray-400 py-6">
        Component lab · Design tokens from Supernova · Component references from Figma
      </footer>
    </main>
  );
}
