import{ApiProduktPositionTyp} from "../models/ApiProduktPositionTyp"
 export interface ProduktpositionNode {
  id?: string;
  name?: string;
  typ: 'Produktposition' | 'Buchungspunkt' | 'Dokumentation';
  level: number;
  aktiv?: boolean;
  status?: 'active' | 'inactive';
  isExpanded?: boolean;
  children?: ProduktpositionNode[];
  parentId?: string;
  start?: Date;
  ende?: Date;
  auftraggeber?: string;
  organisationseinheit?: string;
  durchfuehrungsverantwortlicher?: string;
  positionstyp?: ApiProduktPositionTyp | string;
  buchungsfreigabe?: boolean;
  anmerkung?: string;
  servicemanager?: string;
}
