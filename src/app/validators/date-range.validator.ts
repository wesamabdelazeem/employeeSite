/**
 * Shared date-range validator. Mirrors the backend `@DateRangeNotEmpty`
 * Bean Validation constraint: both endpoints must be set, and `von` must
 * not be after `bis`. Returns the resulting German error messages
 * (empty array when valid).
 */
export function validateDateRange(
  von: unknown,
  bis: unknown,
  fieldVon: string,
  fieldBis: string
): string[] {
  const isEmpty = (v: unknown) =>
    v === null || v === undefined || v === '';

  const vonEmpty = isEmpty(von);
  const bisEmpty = isEmpty(bis);

  if (vonEmpty && bisEmpty) {
    return [`Die Felder '${fieldVon}' und '${fieldBis}' dürfen nicht leer sein`];
  }
  if (vonEmpty) {
    return [`Das Feld '${fieldVon}' darf nicht leer sein`];
  }
  if (bisEmpty) {
    return [`Das Feld '${fieldBis}' darf nicht leer sein`];
  }

  const vonDate = new Date(von as string | number | Date);
  const bisDate = new Date(bis as string | number | Date);
  if (vonDate.getTime() > bisDate.getTime()) {
    return [`Das Feld '${fieldVon}' muss kleiner sein als '${fieldBis}'`];
  }
  return [];
}
