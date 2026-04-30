/**
 * Shared Rechte validator. Mirrors the backend `@ValidRechte` Bean
 * Validation constraint: 'Online Stempeln Homeoffice' and 'Online
 * Stempeln Büro' may only be selected together with 'Stempeln'.
 * Returns the resulting German error messages (empty array when valid).
 */
export function validateRechte(rechte: string[] | null | undefined): string[] {
  if (!rechte) {
    return [];
  }

  const requiresStempeln =
    rechte.includes('ONLINE_STEMPELN_HOMEOFFICE') ||
    rechte.includes('ONLINE_STEMPELN_BUERO');

  if (requiresStempeln && !rechte.includes('STEMPELN')) {
    return [
      "'Online Stempeln Homeoffice' und 'Online Stempeln Büro' darf nur gemeinsam mit 'Stempeln' aktiviert werden",
    ];
  }

  return [];
}
