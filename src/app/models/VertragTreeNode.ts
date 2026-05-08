import { ApiProduktPosition } from './ApiProduktPosition';

/**
 * UI tree node used by the Vertrag detail screen to render the
 * Vertragsposition → Verbraucher → Buchungspunkt hierarchy in a single tree.
 *
 * `level` and `typ` together act as a discriminator. Fields used at every
 * level (id, name, aktiv, anmerkung, stundenGeplant) are listed first;
 * level-specific fields are optional below.
 */
export type VertragTreeNodeTyp =
  | 'Vertragsposition'
  | 'Verbraucher'
  | 'Buchungspunkt'
  | 'Dokumentation';

export interface VertragTreeNode {
  id: string;
  name: string;
  typ: VertragTreeNodeTyp;
  level: 1 | 2 | 3;

  aktiv?: boolean;
  isExpanded?: boolean;
  parentId?: string;
  children?: VertragTreeNode[];

  isNew?: boolean;
  isPendingCreation?: boolean;

  anmerkung?: string;
  stundenGeplant?: number | string;
  volumenEuro?: number | string;
  volumenStunden?: number | string;

  // Vertragsposition (level 1)
  planungsjahr?: string;
  jahresuebertrag?: boolean;
  rollenbezRahmenvertrag?: string;
  // Extra fields set by addVertragsposition() — currently unread by the
  // detail-form bindings but kept on the node for forward compatibility.
  auftraggeber?: string;
  organisationseinheit?: string;
  durchfuehrungsverantwortlicher?: string;
  positionstyp?: string;
  buchungsfreigabe?: boolean;
  start?: Date | string;
  ende?: Date | string;
  status?: string;

  // Verbraucher (level 2)
  personId?: string;
  verbraucherTyp?: string;
  stundensatz?: string;
  stundenkontingent?: string | number;
  stundensatzAenderung?: string;

  // Buchungspunkt (level 3)
  produkt?: string;
  produktposition?: string;
  produktPosition?: ApiProduktPosition;
}
