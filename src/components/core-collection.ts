export function groupByKey<T, K extends string>(
  items: ReadonlyArray<T>,
  getKey: (item: T) => K
): Partial<Record<K, T[]>> {
  const out: Partial<Record<K, T[]>> = {};
  for (const item of items || []) {
    const key = getKey(item);
    const list = out[key];
    if (list) list.push(item);
    else out[key] = [item];
  }
  return out;
}

export function toggleListItem<T>(items: ReadonlyArray<T>, value: T): T[] {
  const list = items || [];
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export function filterByCriteria<T extends Record<string, any>>(
  items: ReadonlyArray<T>,
  criteria?: Record<string, unknown>
): T[] {
  const list = items || [];
  if (!criteria) return [...list];
  const entries = Object.entries(criteria).filter(
    ([, val]) => val !== undefined && val !== null && val !== '' && val !== 'all'
  );
  if (entries.length === 0) return [...list];
  return list.filter((item) => entries.every(([k, val]) => String(item?.[k] ?? '') === String(val)));
}

export function retainValidIds(
  validIds: ReadonlyArray<string>,
  selectedIds: ReadonlyArray<string>
): string[] {
  const validSet = new Set(validIds || []);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const id of selectedIds || []) {
    if (validSet.has(id) && !seen.has(id)) {
      seen.add(id);
      out.push(id);
    }
  }
  return out;
}
