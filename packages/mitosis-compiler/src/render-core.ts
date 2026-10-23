import * as mitosisModule from '@builder.io/mitosis';
import ts from 'typescript';
import { createRequire } from 'node:module';
import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { checkClasses } from './classes.js';
import type { CompileError } from './types.js';

const mitosis = (mitosisModule as any).default ?? mitosisModule;
const parseJsx = mitosis.parseJsx ?? mitosisModule.parseJsx;
const componentToReact = mitosis.componentToReact ?? mitosisModule.componentToReact;

const require_ = createRequire(import.meta.url);
const React = require_('react');
const ReactJsxRuntime = require_('react/jsx-runtime');
const ReactDomServer = require_('react-dom/server');
const { renderToStaticMarkup } = ReactDomServer;

let ReactJsxDevRuntime: any;
try {
  ReactJsxDevRuntime = require_('react/jsx-dev-runtime');
} catch {
  ReactJsxDevRuntime = ReactJsxRuntime;
}

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ---------------------------------------------------------------------------
// 1. A11y & Headless UI Primitives (Radix / Zag / Headless UI patterns)
// ---------------------------------------------------------------------------

export interface DialogStateOptions {
  id?: string;
  open?: boolean;
  onClose?: () => void;
}

export function createDialogState(options: DialogStateOptions = {}) {
  const baseId = options.id || 'dialog';
  const titleId = `${baseId}-title`;
  const descriptionId = `${baseId}-description`;

  return {
    isOpen: options.open ?? false,
    titleId,
    descriptionId,
    getBackdropProps() {
      return {
        'aria-hidden': 'true' as const,
        onClick: () => {
          if (options.onClose) options.onClose();
        },
      };
    },
    getContentProps(role: 'dialog' | 'alertdialog' = 'alertdialog') {
      return {
        role,
        'aria-modal': 'true' as const,
        'aria-labelledby': titleId,
        'aria-describedby': descriptionId,
        tabIndex: -1,
        onKeyDown: (event: any) => {
          if (event && event.key === 'Escape') {
            if (options.onClose) options.onClose();
          }
        },
      };
    },
    getTitleProps() {
      return { id: titleId };
    },
    getDescriptionProps() {
      return { id: descriptionId };
    },
  };
}

export function handleRovingFocus(
  event: { key: string; preventDefault?: () => void },
  currentIndex: number,
  totalItems: number,
  onSelect: (index: number) => void
): void {
  if (totalItems <= 0) return;
  let nextIndex = currentIndex;

  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      nextIndex = (currentIndex + 1) % totalItems;
      break;
    case 'ArrowLeft':
    case 'ArrowUp':
      nextIndex = (currentIndex - 1 + totalItems) % totalItems;
      break;
    case 'Home':
      nextIndex = 0;
      break;
    case 'End':
      nextIndex = totalItems - 1;
      break;
    default:
      return;
  }

  if (event.preventDefault) event.preventDefault();
  onSelect(nextIndex);
}

export interface TabsStateOptions<T extends { id: string }> {
  tabs: T[];
  activeId?: string;
  onSelect?: (id: string) => void;
}

export function createTabsState<T extends { id: string }>(options: TabsStateOptions<T>) {
  const activeId = options.activeId || (options.tabs[0]?.id ?? '');

  return {
    activeId,
    getTabListProps() {
      return {
        role: 'tablist' as const,
        onKeyDown: (event: any) => {
          const currentIndex = options.tabs.findIndex((t) => t.id === activeId);
          handleRovingFocus(event, currentIndex >= 0 ? currentIndex : 0, options.tabs.length, (nextIdx) => {
            const nextTab = options.tabs[nextIdx];
            if (nextTab && options.onSelect) options.onSelect(nextTab.id);
          });
        },
      };
    },
    getTabTriggerProps(tabId: string, index?: number) {
      const isSelected = tabId === activeId;
      return {
        role: 'tab' as const,
        id: `tab-${tabId}`,
        'aria-selected': isSelected,
        'aria-controls': `panel-${tabId}`,
        tabIndex: isSelected ? 0 : -1,
        onClick: () => {
          if (options.onSelect) options.onSelect(tabId);
        },
      };
    },
    getTabPanelProps(tabId: string) {
      return {
        role: 'tabpanel' as const,
        id: `panel-${tabId}`,
        'aria-labelledby': `tab-${tabId}`,
        tabIndex: 0,
        hidden: tabId !== activeId,
      };
    },
  };
}

export function createTooltipState(options: { id?: string } = {}) {
  const tooltipId = options.id || 'tooltip';
  return {
    id: tooltipId,
    getTriggerProps() {
      return { 'aria-describedby': tooltipId };
    },
    getContentProps() {
      return { role: 'tooltip' as const, id: tooltipId };
    },
  };
}

// ---------------------------------------------------------------------------
// 2. Table Headless Model (TanStack Table patterns)
// ---------------------------------------------------------------------------

export function sortTableRows<T>(
  rows: T[],
  sortKey: keyof T | string,
  direction: 'asc' | 'desc' = 'asc'
): T[] {
  if (!sortKey || !Array.isArray(rows)) return rows ? [...rows] : [];
  const key = sortKey as keyof T;
  const modifier = direction === 'desc' ? -1 : 1;

  return [...rows].sort((a, b) => {
    const valA = a[key];
    const valB = b[key];
    if (valA === valB) return 0;
    if (valA == null) return 1;
    if (valB == null) return -1;
    if (typeof valA === 'number' && typeof valB === 'number') {
      return (valA - valB) * modifier;
    }
    return String(valA).localeCompare(String(valB), undefined, { numeric: true }) * modifier;
  });
}

export function paginateTableRows<T>(
  rows: T[],
  page: number = 1,
  pageSize: number = 10
): {
  data: T[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
  hasNext: boolean;
  hasPrev: boolean;
} {
  const totalItems = rows ? rows.length : 0;
  const safePageSize = pageSize > 0 ? pageSize : 10;
  const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * safePageSize;
  const data = rows ? rows.slice(start, start + safePageSize) : [];

  return {
    data,
    totalPages,
    totalItems,
    currentPage,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  };
}

export function filterTableRows<T>(
  rows: T[],
  query: string,
  searchKeys?: Array<keyof T>
): T[] {
  if (!query || !query.trim() || !Array.isArray(rows)) return rows ? [...rows] : [];
  const q = query.toLowerCase().trim();

  return rows.filter((row) => {
    const keys = searchKeys || (Object.keys(row as any) as Array<keyof T>);
    return keys.some((k) => {
      const val = row[k];
      return val != null && String(val).toLowerCase().includes(q);
    });
  });
}

// ---------------------------------------------------------------------------
// 3. Virtual Scroll Windowing (TanStack Virtual patterns)
// ---------------------------------------------------------------------------

export interface VirtualWindowOptions {
  totalItems: number;
  itemHeight: number;
  containerHeight: number;
  scrollTop: number;
  overscan?: number;
}

export function getVirtualWindow(options: VirtualWindowOptions) {
  const { totalItems, itemHeight, containerHeight, scrollTop, overscan = 3 } = options;
  if (totalItems <= 0 || itemHeight <= 0) {
    return {
      startIndex: 0,
      endIndex: 0,
      virtualItems: [] as Array<{ index: number; start: number; size: number }>,
      paddingTop: 0,
      paddingBottom: 0,
      totalHeight: 0,
    };
  }

  const totalHeight = totalItems * itemHeight;
  const rawStart = Math.floor(Math.max(0, scrollTop) / itemHeight);
  const visibleCount = Math.ceil(containerHeight / itemHeight);

  const startIndex = Math.max(0, rawStart - overscan);
  const endIndex = Math.min(totalItems, rawStart + visibleCount + overscan);

  const virtualItems: Array<{ index: number; start: number; size: number }> = [];
  for (let i = startIndex; i < endIndex; i++) {
    virtualItems.push({ index: i, start: i * itemHeight, size: itemHeight });
  }

  const paddingTop = startIndex * itemHeight;
  const paddingBottom = Math.max(0, (totalItems - endIndex) * itemHeight);

  return {
    startIndex,
    endIndex,
    virtualItems,
    paddingTop,
    paddingBottom,
    totalHeight,
  };
}

// ---------------------------------------------------------------------------
// 4. Chart Geometry & SVG Math (D3 Scale & Shape patterns)
// ---------------------------------------------------------------------------

export function scaleLinear(options: { domain: [number, number]; range: [number, number] }) {
  const [d0, d1] = options.domain;
  const [r0, r1] = options.range;
  const spanD = d1 - d0 === 0 ? 1 : d1 - d0;
  const spanR = r1 - r0;

  const fn = (value: number): number => {
    return r0 + ((value - d0) / spanD) * spanR;
  };

  fn.ticks = (count: number = 5): number[] => {
    const step = (d1 - d0) / Math.max(1, count - 1);
    const result: number[] = [];
    for (let i = 0; i < count; i++) {
      result.push(d0 + i * step);
    }
    return result;
  };

  return fn;
}

export function scaleBand(options: { domain: string[]; range: [number, number]; padding?: number }) {
  const { domain, range, padding = 0.1 } = options;
  const n = domain.length;
  const span = range[1] - range[0];
  const step = n > 0 ? span / (n - padding) : 0;
  const bandwidth = step * (1 - padding);

  const fn = (key: string): number => {
    const idx = domain.indexOf(key);
    return idx >= 0 ? range[0] + idx * step : range[0];
  };

  fn.bandwidth = bandwidth;
  fn.step = step;
  return fn;
}

export function getSmoothBezierPath(points: Array<{ x: number; y: number }>): string {
  if (!points || points.length === 0) return '';
  if (points.length === 1) return `M ${points[0]!.x} ${points[0]!.y}`;
  if (points.length === 2) {
    return `M ${points[0]!.x} ${points[0]!.y} L ${points[1]!.x} ${points[1]!.y}`;
  }

  let path = `M ${points[0]!.x} ${points[0]!.y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1]!;
    const p1 = points[i]!;
    const p2 = points[i + 1]!;
    const p3 = points[i + 2] || p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }

  return path;
}

export function getAreaPath(points: Array<{ x: number; y: number }>, baselineY: number = 100): string {
  if (!points || points.length === 0) return '';
  const curve = getSmoothBezierPath(points);
  const first = points[0]!;
  const last = points[points.length - 1]!;
  return `${curve} L ${last.x} ${baselineY} L ${first.x} ${baselineY} Z`;
}

export function getPieSlices(values: number[], radius: number = 50, innerRadius: number = 0) {
  const total = values.reduce((acc, v) => acc + (v > 0 ? v : 0), 0);
  if (total <= 0) return [];

  let currentAngle = 0;
  return values.map((val, index) => {
    const fraction = val > 0 ? val / total : 0;
    const startAngle = currentAngle;
    const endAngle = currentAngle + fraction * 2 * Math.PI;
    currentAngle = endAngle;

    const x1 = radius + radius * Math.sin(startAngle);
    const y1 = radius - radius * Math.cos(startAngle);
    const x2 = radius + radius * Math.sin(endAngle);
    const y2 = radius - radius * Math.cos(endAngle);
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

    let path = '';
    if (innerRadius > 0) {
      const ix1 = radius + innerRadius * Math.sin(endAngle);
      const iy1 = radius - innerRadius * Math.cos(endAngle);
      const ix2 = radius + innerRadius * Math.sin(startAngle);
      const iy2 = radius - innerRadius * Math.cos(startAngle);
      path = `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${radius} ${radius} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} L ${ix1.toFixed(2)} ${iy1.toFixed(2)} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix2.toFixed(2)} ${iy2.toFixed(2)} Z`;
    } else {
      path = `M ${radius} ${radius} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${radius} ${radius} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;
    }

    return {
      index,
      value: val,
      fraction,
      startAngle,
      endAngle,
      path,
      isDonut: innerRadius > 0,
    };
  });
}

export const utilsModule = {
  cn,
  createDialogState,
  handleRovingFocus,
  createTabsState,
  createTooltipState,
  sortTableRows,
  paginateTableRows,
  filterTableRows,
  getVirtualWindow,
  scaleLinear,
  scaleBand,
  getSmoothBezierPath,
  getAreaPath,
  getPieSlices,
  default: Object.assign(cn, {
    cn,
    createDialogState,
    handleRovingFocus,
    createTabsState,
    createTooltipState,
    sortTableRows,
    paginateTableRows,
    filterTableRows,
    getVirtualWindow,
    scaleLinear,
    scaleBand,
    getSmoothBezierPath,
    getAreaPath,
    getPieSlices,
  }),
  __esModule: true,
};

class KnownRenderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'KnownRenderError';
  }
}

export interface RenderCheckOptions {
  componentName: string;
  source: string;
  siblingSources?: Record<string, string>;
  allowedClasses?: string[];
}

interface ObjectField {
  name: string;
  type: 'string' | 'number' | 'boolean';
}

interface SynthesizableArrayProp {
  name: string;
  isPrimitive: boolean;
  primitiveType?: 'string' | 'number';
  fields?: ObjectField[];
  fixtureA: any[];
  fixtureB: any[];
}

interface UnionProp {
  name: string;
  values: string[];
}

const FIXTURE_A_COUNT = 3;
const FIXTURE_A_NUMBERS = [10, 20, 30];
const FIXTURE_A_BOOLEANS = [true, false, true];

const FIXTURE_B_COUNT = 5;
const FIXTURE_B_NUMBERS = [7, 55, 13, 90, 41];
const FIXTURE_B_BOOLEANS = [false, true, false, true, false];

function createFixtureA(
  propName: string,
  fields?: ObjectField[],
  primitiveType?: 'string' | 'number'
): any[] {
  if (primitiveType === 'string') {
    return Array.from({ length: FIXTURE_A_COUNT }, (_, i) => `A-${propName}-${i + 1}`);
  }
  if (primitiveType === 'number') {
    return FIXTURE_A_NUMBERS.slice(0, FIXTURE_A_COUNT);
  }
  if (fields && fields.length > 0) {
    return Array.from({ length: FIXTURE_A_COUNT }, (_, i) => {
      const item: Record<string, any> = {};
      for (const field of fields) {
        if (field.type === 'string') {
          item[field.name] = `A-${field.name}-${i + 1}`;
        } else if (field.type === 'number') {
          item[field.name] = FIXTURE_A_NUMBERS[i];
        } else if (field.type === 'boolean') {
          item[field.name] = FIXTURE_A_BOOLEANS[i];
        }
      }
      return item;
    });
  }
  return [];
}

function createFixtureB(
  propName: string,
  fields?: ObjectField[],
  primitiveType?: 'string' | 'number'
): any[] {
  if (primitiveType === 'string') {
    return Array.from({ length: FIXTURE_B_COUNT }, (_, i) => `B-${propName}-${i + 1}`);
  }
  if (primitiveType === 'number') {
    return FIXTURE_B_NUMBERS.slice(0, FIXTURE_B_COUNT);
  }
  if (fields && fields.length > 0) {
    return Array.from({ length: FIXTURE_B_COUNT }, (_, i) => {
      const item: Record<string, any> = {};
      for (const field of fields) {
        if (field.type === 'string') {
          item[field.name] = `B-${field.name}-${i + 1}`;
        } else if (field.type === 'number') {
          item[field.name] = FIXTURE_B_NUMBERS[i];
        } else if (field.type === 'boolean') {
          item[field.name] = FIXTURE_B_BOOLEANS[i];
        }
      }
      return item;
    });
  }
  return [];
}

function getUnionValues(
  typeNode: ts.TypeNode,
  sourceFile: ts.SourceFile,
  typeAliasMap: Map<string, ts.TypeAliasDeclaration>
): string[] | null {
  if (ts.isTypeReferenceNode(typeNode)) {
    const name = typeNode.typeName.getText(sourceFile);
    const alias = typeAliasMap.get(name);
    if (alias) {
      return getUnionValues(alias.type, sourceFile, typeAliasMap);
    }
  }

  if (ts.isUnionTypeNode(typeNode)) {
    const nonNull = typeNode.types.filter(
      (t) =>
        t.kind !== ts.SyntaxKind.UndefinedKeyword &&
        t.kind !== ts.SyntaxKind.NullKeyword &&
        t.kind !== ts.SyntaxKind.VoidKeyword
    );
    const literals: string[] = [];
    for (const t of nonNull) {
      if (ts.isLiteralTypeNode(t) && ts.isStringLiteral(t.literal)) {
        literals.push(t.literal.text);
      } else {
        return null;
      }
    }
    if (literals.length >= 2) {
      return literals;
    }
  }

  return null;
}

function getArrayElementType(
  typeNode: ts.TypeNode,
  sourceFile: ts.SourceFile
): ts.TypeNode | null {
  if (ts.isArrayTypeNode(typeNode)) {
    return typeNode.elementType;
  }
  if (
    ts.isTypeReferenceNode(typeNode) &&
    typeNode.typeName.getText(sourceFile) === 'Array' &&
    typeNode.typeArguments &&
    typeNode.typeArguments.length === 1
  ) {
    return typeNode.typeArguments[0]!;
  }
  return null;
}

function getFieldPrimitiveType(
  typeNode: ts.TypeNode,
  sourceFile: ts.SourceFile,
  typeAliasMap: Map<string, ts.TypeAliasDeclaration>
): 'string' | 'number' | 'boolean' | null {
  if (typeNode.kind === ts.SyntaxKind.StringKeyword) return 'string';
  if (typeNode.kind === ts.SyntaxKind.NumberKeyword) return 'number';
  if (typeNode.kind === ts.SyntaxKind.BooleanKeyword) return 'boolean';

  if (ts.isUnionTypeNode(typeNode)) {
    const nonNull = typeNode.types.filter(
      (t) =>
        t.kind !== ts.SyntaxKind.UndefinedKeyword &&
        t.kind !== ts.SyntaxKind.NullKeyword &&
        t.kind !== ts.SyntaxKind.VoidKeyword
    );
    if (nonNull.length === 1 && nonNull[0]) {
      return getFieldPrimitiveType(nonNull[0], sourceFile, typeAliasMap);
    }
  }

  if (ts.isTypeReferenceNode(typeNode)) {
    const name = typeNode.typeName.getText(sourceFile);
    const alias = typeAliasMap.get(name);
    if (alias) {
      return getFieldPrimitiveType(alias.type, sourceFile, typeAliasMap);
    }
  }

  return null;
}

function extractPropsInfo(
  source: string,
  componentName: string
): {
  unionProps: UnionProp[];
  synthesizableArrayProps: SynthesizableArrayProp[];
} {
  const sourceFile = ts.createSourceFile('temp.lite.tsx', source, ts.ScriptTarget.Latest, true);
  const interfaceMap = new Map<string, ts.InterfaceDeclaration>();
  const typeAliasMap = new Map<string, ts.TypeAliasDeclaration>();

  for (const stmt of sourceFile.statements) {
    if (ts.isInterfaceDeclaration(stmt)) {
      interfaceMap.set(stmt.name.text, stmt);
    } else if (ts.isTypeAliasDeclaration(stmt)) {
      typeAliasMap.set(stmt.name.text, stmt);
    }
  }

  function getPropertySignaturesFromTypeNode(typeNode: ts.TypeNode | undefined): ts.PropertySignature[] {
    if (!typeNode) return [];
    if (ts.isTypeLiteralNode(typeNode)) {
      return typeNode.members.filter(ts.isPropertySignature);
    }
    if (ts.isTypeReferenceNode(typeNode)) {
      const name = typeNode.typeName.getText(sourceFile);
      const iface = interfaceMap.get(name);
      if (iface) return getPropertySignaturesFromInterface(iface);
      const alias = typeAliasMap.get(name);
      if (alias) return getPropertySignaturesFromTypeNode(alias.type);
    }
    if (ts.isIntersectionTypeNode(typeNode)) {
      const res: ts.PropertySignature[] = [];
      for (const t of typeNode.types) {
        res.push(...getPropertySignaturesFromTypeNode(t));
      }
      return res;
    }
    return [];
  }

  function getPropertySignaturesFromInterface(iface: ts.InterfaceDeclaration): ts.PropertySignature[] {
    const res: ts.PropertySignature[] = [];
    if (iface.heritageClauses) {
      for (const clause of iface.heritageClauses) {
        for (const t of clause.types) {
          const parentName = t.expression.getText(sourceFile);
          const parentIface = interfaceMap.get(parentName);
          if (parentIface) {
            res.push(...getPropertySignaturesFromInterface(parentIface));
          }
          const parentAlias = typeAliasMap.get(parentName);
          if (parentAlias) {
            res.push(...getPropertySignaturesFromTypeNode(parentAlias.type));
          }
        }
      }
    }
    for (const member of iface.members) {
      if (ts.isPropertySignature(member)) {
        res.push(member);
      }
    }
    return res;
  }

  let propSignatures: ts.PropertySignature[] = [];

  for (const stmt of sourceFile.statements) {
    if (ts.isFunctionDeclaration(stmt)) {
      const isDefault = stmt.modifiers?.some((m) => m.kind === ts.SyntaxKind.DefaultKeyword);
      const matchesName = stmt.name?.text === componentName;
      if (isDefault || matchesName) {
        const firstParam = stmt.parameters[0];
        if (firstParam?.type) {
          propSignatures = getPropertySignaturesFromTypeNode(firstParam.type);
          if (propSignatures.length > 0) break;
        }
      }
    } else if (ts.isExportAssignment(stmt)) {
      let expr: ts.Expression = stmt.expression;
      if (ts.isIdentifier(expr)) {
        const fnName = expr.text;
        for (const s of sourceFile.statements) {
          if (ts.isFunctionDeclaration(s) && s.name?.text === fnName) {
            const firstParam = s.parameters[0];
            if (firstParam?.type) {
              propSignatures = getPropertySignaturesFromTypeNode(firstParam.type);
              break;
            }
          } else if (ts.isVariableStatement(s)) {
            for (const decl of s.declarationList.declarations) {
              if (ts.isIdentifier(decl.name) && decl.name.text === fnName && decl.initializer) {
                if (ts.isFunctionExpression(decl.initializer) || ts.isArrowFunction(decl.initializer)) {
                  const firstParam = decl.initializer.parameters[0];
                  if (firstParam?.type) {
                    propSignatures = getPropertySignaturesFromTypeNode(firstParam.type);
                    break;
                  }
                }
              }
            }
          }
        }
      } else if (ts.isFunctionExpression(expr) || ts.isArrowFunction(expr)) {
        const firstParam = expr.parameters[0];
        if (firstParam?.type) {
          propSignatures = getPropertySignaturesFromTypeNode(firstParam.type);
        }
      }
      if (propSignatures.length > 0) break;
    }
  }

  if (propSignatures.length === 0 && componentName) {
    const exactName = `${componentName}Props`;
    const iface = interfaceMap.get(exactName);
    if (iface) {
      propSignatures = getPropertySignaturesFromInterface(iface);
    } else {
      const alias = typeAliasMap.get(exactName);
      if (alias) {
        propSignatures = getPropertySignaturesFromTypeNode(alias.type);
      }
    }
  }

  if (propSignatures.length === 0) {
    for (const [name, iface] of interfaceMap) {
      if (name.endsWith('Props')) {
        propSignatures = getPropertySignaturesFromInterface(iface);
        break;
      }
    }
    if (propSignatures.length === 0) {
      for (const [name, alias] of typeAliasMap) {
        if (name.endsWith('Props')) {
          propSignatures = getPropertySignaturesFromTypeNode(alias.type);
          break;
        }
      }
    }
  }

  const unionProps: UnionProp[] = [];
  const synthesizableArrayProps: SynthesizableArrayProp[] = [];

  for (const sig of propSignatures) {
    if (!sig.type) continue;
    const propName = sig.name.getText(sourceFile).replace(/['"]/g, '');

    const unionVals = getUnionValues(sig.type, sourceFile, typeAliasMap);
    if (unionVals && unionVals.length >= 2) {
      unionProps.push({
        name: propName,
        values: Array.from(new Set(unionVals)),
      });
    }

    const elemType = getArrayElementType(sig.type, sourceFile);
    if (!elemType) continue;

    if (elemType.kind === ts.SyntaxKind.StringKeyword) {
      synthesizableArrayProps.push({
        name: propName,
        isPrimitive: true,
        primitiveType: 'string',
        fixtureA: createFixtureA(propName, undefined, 'string'),
        fixtureB: createFixtureB(propName, undefined, 'string'),
      });
      continue;
    }

    if (elemType.kind === ts.SyntaxKind.NumberKeyword) {
      synthesizableArrayProps.push({
        name: propName,
        isPrimitive: true,
        primitiveType: 'number',
        fixtureA: createFixtureA(propName, undefined, 'number'),
        fixtureB: createFixtureB(propName, undefined, 'number'),
      });
      continue;
    }

    let memberSignatures: ts.PropertySignature[] = [];
    if (ts.isTypeReferenceNode(elemType)) {
      const typeName = elemType.typeName.getText(sourceFile);
      const iface = interfaceMap.get(typeName);
      if (iface) {
        memberSignatures = getPropertySignaturesFromInterface(iface);
      } else {
        const alias = typeAliasMap.get(typeName);
        if (alias) {
          memberSignatures = getPropertySignaturesFromTypeNode(alias.type);
        }
      }
    } else if (ts.isTypeLiteralNode(elemType)) {
      memberSignatures = elemType.members.filter(ts.isPropertySignature);
    }

    if (memberSignatures.length > 0) {
      const fields: ObjectField[] = [];
      for (const m of memberSignatures) {
        if (!m.type) continue;
        const fieldName = m.name.getText(sourceFile).replace(/['"]/g, '');
        const fieldType = getFieldPrimitiveType(m.type, sourceFile, typeAliasMap);
        if (fieldType) {
          fields.push({ name: fieldName, type: fieldType });
        }
      }

      if (fields.length > 0) {
        synthesizableArrayProps.push({
          name: propName,
          isPrimitive: false,
          fields,
          fixtureA: createFixtureA(propName, fields),
          fixtureB: createFixtureB(propName, fields),
        });
      }
    }
  }

  return { unionProps, synthesizableArrayProps };
}

async function compileSourceToJs(source: string): Promise<string> {
  const parsed = parseJsx(source, { typescript: true });
  const generator = componentToReact({ typescript: true });
  const res = generator({ component: parsed });
  const reactSource = typeof res === 'string' ? res : await res;
  const stripped = reactSource.replace(/['"]use client['"];?/g, '');
  const transpiled = ts.transpileModule(stripped, {
    compilerOptions: {
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  });
  return transpiled.outputText;
}

function findSiblingEntry(
  id: string,
  siblingSources?: Record<string, string>
): { key: string; source: string } | null {
  if (!siblingSources) return null;

  if (Object.prototype.hasOwnProperty.call(siblingSources, id)) {
    return { key: id, source: siblingSources[id]! };
  }

  const normalizedId = id.replace(/^\.\//, '');
  if (Object.prototype.hasOwnProperty.call(siblingSources, normalizedId)) {
    return { key: normalizedId, source: siblingSources[normalizedId]! };
  }

  const baseName = normalizedId
    .replace(/\.lite(\.[jt]sx?)?$/, '')
    .replace(/\.[jt]sx?$/, '');

  const candidates = [
    baseName,
    `${baseName}.lite`,
    `./${baseName}`,
    `./${baseName}.lite`,
    `${baseName}.lite.tsx`,
    `${baseName}.lite.jsx`,
    `${baseName}.tsx`,
    `${baseName}.jsx`,
  ];

  for (const candidate of candidates) {
    if (Object.prototype.hasOwnProperty.call(siblingSources, candidate)) {
      return { key: candidate, source: siblingSources[candidate]! };
    }
  }

  return null;
}

export async function renderCheckCore(opts: RenderCheckOptions): Promise<CompileError[]> {
  const errors: CompileError[] = [];

  try {
    const transpiledMap = new Map<string, string>();
    const siblingCompileErrors = new Map<string, unknown>();

    const rootJs = await compileSourceToJs(opts.source);
    transpiledMap.set('__root__', rootJs);

    if (opts.siblingSources) {
      for (const [key, src] of Object.entries(opts.siblingSources)) {
        try {
          const js = await compileSourceToJs(src);
          transpiledMap.set(key, js);
        } catch (err: unknown) {
          siblingCompileErrors.set(key, err);
        }
      }
    }

    const moduleCache = new Map<string, any>();
    const loadingStack = new Set<string>();

    const rootName = opts.componentName;
    const rootAliases = [
      rootName,
      `./${rootName}`,
      `${rootName}.lite`,
      `./${rootName}.lite`,
    ];
    for (const a of rootAliases) {
      loadingStack.add(a);
    }

    function createCustomRequire(): (id: string) => any {
      return function customRequire(id: string): any {
        if (id === 'react') return React;
        if (id === 'react/jsx-runtime') return ReactJsxRuntime;
        if (id === 'react/jsx-dev-runtime') return ReactJsxDevRuntime;
        if (id === 'react-dom/server') return ReactDomServer;
        if (
          id === './utils' ||
          id === './utils.js' ||
          id === 'utils' ||
          id === '../utils' ||
          id === '../utils.js' ||
          id.endsWith('/utils') ||
          id.endsWith('/utils.js')
        ) {
          return utilsModule;
        }

        const normalizedId = id.replace(/^\.\//, '');
        const baseIdName = normalizedId
          .replace(/\.lite(\.[jt]sx?)?$/, '')
          .replace(/\.[jt]sx?$/, '');
        const idAliases = [
          id,
          normalizedId,
          baseIdName,
          `./${baseIdName}`,
          `${baseIdName}.lite`,
          `./${baseIdName}.lite`,
        ];

        if (idAliases.some((a) => loadingStack.has(a))) {
          errors.push({
            target: 'render',
            rule: 'cyclic-import',
            message: `Cyclic import detected: ${id}`,
          });
          throw new KnownRenderError(`Cyclic import detected: ${id}`);
        }

        const sibling = findSiblingEntry(id, opts.siblingSources);
        if (sibling) {
          const siblingKey = sibling.key;
          const baseName = siblingKey
            .replace(/^\.\//, '')
            .replace(/\.lite(\.[jt]sx?)?$/, '')
            .replace(/\.[jt]sx?$/, '');
          const aliases = [
            siblingKey,
            baseName,
            `./${baseName}`,
            `${baseName}.lite`,
            `./${baseName}.lite`,
          ];

          if (aliases.some((a) => loadingStack.has(a))) {
            errors.push({
              target: 'render',
              rule: 'cyclic-import',
              message: `Cyclic import detected: ${id}`,
            });
            throw new KnownRenderError(`Cyclic import detected: ${id}`);
          }

          if (moduleCache.has(siblingKey)) {
            return moduleCache.get(siblingKey);
          }

          if (siblingCompileErrors.has(siblingKey)) {
            const origErr = siblingCompileErrors.get(siblingKey);
            throw origErr;
          }

          const code = transpiledMap.get(siblingKey);
          if (!code) {
            errors.push({
              target: 'render',
              rule: 'unresolved-import',
              message: `Unresolved import: ${id}`,
            });
            throw new KnownRenderError(`Unresolved import: ${id}`);
          }

          for (const a of aliases) {
            loadingStack.add(a);
          }

          try {
            const mod = { exports: {} };
            const fn = new Function('require', 'module', 'exports', code);
            fn(createCustomRequire(), mod, mod.exports);
            moduleCache.set(siblingKey, mod.exports);
            return mod.exports;
          } finally {
            for (const a of aliases) {
              loadingStack.delete(a);
            }
          }
        }

        errors.push({
          target: 'render',
          rule: 'unresolved-import',
          message: `Unresolved import: ${id}`,
        });
        throw new KnownRenderError(`Unresolved import: ${id}`);
      };
    }

    const rootMod = { exports: {} };
    const rootFn = new Function('require', 'module', 'exports', rootJs);
    rootFn(createCustomRequire(), rootMod, rootMod.exports);

    for (const a of rootAliases) {
      loadingStack.delete(a);
    }

    const Component = (rootMod.exports as any).default || rootMod.exports;
    if (typeof Component !== 'function') {
      errors.push({
        target: 'render',
        rule: 'render-crash',
        message: 'Component default export is not a function or component.',
      });
      return errors;
    }

    const { unionProps, synthesizableArrayProps } = extractPropsInfo(opts.source, opts.componentName);

    const baseProps: Record<string, any> = {};
    for (const prop of synthesizableArrayProps) {
      baseProps[prop.name] = prop.fixtureA;
    }

    const generatedHtmls: string[] = [];

    // 1. render-crash: baseProps
    let baseHtml: string | null = null;
    try {
      const rendered = renderToStaticMarkup(React.createElement(Component, baseProps));
      baseHtml = rendered;
      generatedHtmls.push(rendered);
    } catch (err: unknown) {
      errors.push({
        target: 'render',
        rule: 'render-crash',
        message: String(err),
      });
    }

    // 1. render-crash: empty array for each synthesizable array prop
    for (const prop of synthesizableArrayProps) {
      try {
        const emptyHtml = renderToStaticMarkup(
          React.createElement(Component, { ...baseProps, [prop.name]: [] })
        );
        generatedHtmls.push(emptyHtml);
      } catch (err: any) {
        const message = err?.message || String(err);
        errors.push({
          target: 'render',
          rule: 'render-crash',
          message: `Component crashed when rendering with empty array for prop "${prop.name}": ${message}`,
        });
      }
    }

    // 2. variant-identical: union props
    for (const unionProp of unionProps) {
      if (unionProp.values.length < 2) continue;

      const htmlToOptions = new Map<string, string[]>();
      for (const option of unionProp.values) {
        try {
          const html = renderToStaticMarkup(
            React.createElement(Component, { ...baseProps, [unionProp.name]: option })
          );
          generatedHtmls.push(html);
          const group = htmlToOptions.get(html) || [];
          group.push(option);
          htmlToOptions.set(html, group);
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : String(err);
          errors.push({
            target: 'render',
            rule: 'render-crash',
            message: `Component crashed when rendering with prop "${unionProp.name}" = "${option}": ${message}`,
          });
        }
      }

      for (const [, identicalOptions] of htmlToOptions) {
        if (identicalOptions.length >= 2) {
          errors.push({
            target: 'render',
            rule: 'variant-identical',
            message: `Prop "${unionProp.name}": ${identicalOptions.map((o) => `'${o}'`).join(', ')} render identical markup — variant not implemented`,
          });
        }
      }
    }

    // 3. data-ignored: Fixture A vs Fixture B
    if (baseHtml !== null) {
      for (const prop of synthesizableArrayProps) {
        try {
          const htmlB = renderToStaticMarkup(
            React.createElement(Component, { ...baseProps, [prop.name]: prop.fixtureB })
          );
          generatedHtmls.push(htmlB);
          if (htmlB === baseHtml) {
            errors.push({
              target: 'render',
              rule: 'data-ignored',
              message: `Prop "${prop.name}" is ignored by renderer (different data produces identical markup)`,
            });
          }
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : String(err);
          errors.push({
            target: 'render',
            rule: 'render-crash',
            message: `Component crashed when rendering with Fixture B for prop "${prop.name}": ${message}`,
          });
        }
      }
    }

    // 4. unknown-class
    if (opts.allowedClasses && opts.allowedClasses.length > 0) {
      const classAttrRegex = /\b(?:class|className)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
      const allTokens: string[] = [];
      for (const html of generatedHtmls) {
        let match: RegExpExecArray | null;
        while ((match = classAttrRegex.exec(html)) !== null) {
          const classStr = match[1] ?? match[2] ?? '';
          const tokens = classStr.trim().split(/\s+/).filter(Boolean);
          allTokens.push(...tokens);
        }
      }
      const classErrors = checkClasses(allTokens, opts.allowedClasses);
      errors.push(...classErrors);
    }
  } catch (err: unknown) {
    if (err instanceof KnownRenderError) {
      return errors;
    }
    errors.push({
      target: 'render',
      rule: 'render-harness',
      message: String(err),
    });
  }

  return errors;
}
