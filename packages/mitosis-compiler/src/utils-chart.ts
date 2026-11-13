import * as a11y from './core-a11y.js';
import * as floating from './core-floating.js';
import * as collection from './core-collection.js';
import * as overlay from './core-overlay.js';
import * as date from './core-date.js';
import * as form from './core-form.js';
import * as file from './core-file.js';
import * as table from './core-table.js';
import * as chart from './core-chart.js';
import * as virtual from './core-virtual.js';
import * as chartSeries from './core-chart-series.js';
import * as icons from './core-icons.js';
import * as views from './core-views.js';
import * as viewsNav from './core-views-nav.js';
import * as viewsData from './core-views-data.js';
import * as controller from './core-controller.js';

export * from './core-chart.js';
export * from './core-chart-series.js';

const merged = {
  ...a11y,
  ...floating,
  ...collection,
  ...overlay,
  ...date,
  ...form,
  ...file,
  ...table,
  ...chart,
  ...virtual,
  ...chartSeries,
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
