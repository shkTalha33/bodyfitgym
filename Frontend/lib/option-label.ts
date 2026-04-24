export function optionLabel(
  map: ReadonlyArray<{ value: string; label: string }>,
  v: string
): string {
  return map.find((x) => x.value === v)?.label ?? v.replace(/_/g, " ");
}
