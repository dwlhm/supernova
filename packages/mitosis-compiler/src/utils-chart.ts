import * as a11y from './core-a11y.js';
import * as overlay from './core-overlay.js';
import * as date from './core-date.js';
import * as form from './core-form.js';
import * as file from './core-file.js';
import * as table from './core-table.js';
import * as chart from './core-chart.js';
import * as icons from './core-icons.js';
import * as views from './core-views.js';
import * as viewsNav from './core-views-nav.js';
import * as viewsData from './core-views-data.js';
import * as controller from './core-controller.js';

export * from './core-chart.js';

const merged = {
  ...a11y,
  ...overlay,
  ...date,
  ...form,
  ...file,
  ...table,
  ...chart,
  ...icons,
  ...views,
  ...viewsNav,
  ...viewsData,
  ...controller,
};

export const utilsModule = {
  ...merged,
  default: Object.assign(a11y.cn, merged),
  __esModule: true,
};
